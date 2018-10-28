// @ts-ignore
import * as asyncBusboy from 'async-busboy';
import * as Router from 'koa-router';
import { LargeObjectManager } from 'pg-large-object';
import { Readable } from 'stream';
import { pool } from '../../db/db';
import { Upload } from '../../db/models';
import { asUploadId, UploadId } from '../../db/models/upload';
import { UserId } from '../../db/models/user';

const router = new Router();

const createObject = async (
  input: Readable,
  fileName: string,
  mimeType: string,
  ownerUserId: UserId,
): Promise<UploadId> => {
  const pg = await pool.connect();
  let uploadId: UploadId;
  let size = 0;
  try {
    await pg.query('begin');
    const objectManager = new LargeObjectManager({
      pg,
    });
    const [
      objectId,
      output,
    ] = await objectManager.createAndWritableStreamAsync();

    uploadId = asUploadId(objectId);
    input.pipe(output);
    input.on('data', data => (size += data.length));

    await new Promise((resolve, reject) => {
      output.on('finish', resolve).on('error', reject);
    });
    await pg.query('commit');
  } catch (e) {
    await pg.query('rollback');
    throw e;
  } finally {
    pg.release();
  }
  await Upload.create({
    id: uploadId,
    fileName,
    mimeType,
    ownerUserId,
    size,
  });
  return uploadId;
};

router.post('/', async ctx => {
  const { userId: sessionUserId } = await ctx.requireSession();
  let promise = null;
  await asyncBusboy(ctx.req, {
    onFile(
      fieldname: string,
      file: Readable,
      fileName: string,
      encoding: string,
      mimeType: string,
    ) {
      promise = createObject(file, fileName, mimeType, sessionUserId);
    },
  });

  if (!promise) {
    return ctx.throw(400);
  }

  const uploadId = await promise;

  ctx.status = 200;
  ctx.body = {
    uploadId,
  };
});

router.get('/:uploadId', async ctx => {
  const uploadId = ctx.paramNumber('uploadId');

  const upload = await Upload.findOne({
    where: { id: uploadId },
  });

  if (!upload) {
    return ctx.throw(404);
  }

  const pg = await pool.connect();
  try {
    await pg.query('begin');
    const objectManager = new LargeObjectManager({
      pg,
    });

    const [size, stream] = await objectManager.openAndReadableStreamAsync(
      uploadId,
    );

    ctx.set('Content-Type', upload.mimeType);
    ctx.set('Content-Length', `${size}`);
    ctx.status = 200;
    ctx.respond = false;

    await new Promise((resolve, reject) => {
      stream
        .pipe(ctx.res)
        .on('end', resolve)
        .on('error', reject);
    });
    await pg.query('commit');
  } catch (e) {
    await pg.query('rollback');
    throw e;
  } finally {
    pg.release();
  }
});

export default router;

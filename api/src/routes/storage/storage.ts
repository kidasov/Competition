import asyncBusboy from 'async-busboy';
import Router from 'koa-router';
import { Upload } from '../../db/models';
import { asUploadId, UploadInstance } from '../../db/models/upload';
import { serveMedia, storeMedia } from '../../services/media';

const router = new Router();

router.post('/', async ctx => {
  const { userId: sessionUserId } = await ctx.requireSession();
  const promises = [] as Array<Promise<UploadInstance>>;
  await asyncBusboy(ctx.req, {
    onFile(fieldName, file, fileName, encoding, mimeType) {
      promises.push(storeMedia(sessionUserId, file, { fileName, mimeType }));
    },
  });

  const medias = await Promise.all(promises);

  ctx.status = 200;
  ctx.body = medias;
});

router.get('/:mediaId', async ctx => {
  const mediaId = asUploadId(ctx.paramNumber('mediaId'));

  const media = await Upload.findOne({
    where: { id: mediaId },
  });

  if (media == null) {
    return ctx.throw(404);
  }

  if (media.size === 0) {
    ctx.status = 204;
    return;
  }

  const fileSize = media.size;
  const mimeType = media.mimeType;

  function parseRange(): [boolean, number, number] {
    const range = ctx.get('range');
    if (range == null || range.length === 0) {
      return [false, 0, fileSize - 1];
    }
    const matches = range.match(/^\s*bytes\s*=\s*(\d+)\-(\d*)\s*$/);
    if (matches == null) {
      return ctx.throw(416);
    }
    const rangeStart = +matches[1];
    if (matches[2].length === 0) {
      return [true, rangeStart, fileSize - 1];
    }
    const rangeEnd = +matches[2];
    return [true, rangeStart, rangeEnd];
  }

  const [withRange, start, end] = parseRange();
  const length = end - start + 1;
  if (withRange && (start >= fileSize || end >= fileSize || length < 0)) {
    return ctx.throw(416);
  }

  ctx.set('Accept-Ranges', 'bytes');
  ctx.set('Content-Type', mimeType);
  ctx.set('Content-Length', `${length}`);
  if (withRange) {
    ctx.set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
  }
  ctx.status = withRange ? 206 : 200;
  ctx.respond = false;

  if (ctx.res.connection && !ctx.res.connection.destroyed) {
    await serveMedia(mediaId, ctx.res, { start, end, fileSize });
  }
});

export default router;

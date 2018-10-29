import { LargeObject, LargeObjectManager } from 'pg-large-object';
import { Readable, Transform, TransformCallback } from 'stream';
import { beginTransaction, runInTransaction } from '../db/db';
import { Upload } from '../db/models';
import { asUploadId, UploadId, UploadInstance } from '../db/models/upload';
import { UserId } from '../db/models/user';

export interface MediaMetaData {
  fileName: string;
  fileSize: number;
  mimeType: string;
  width: number;
  height: number;
  durationMs: number;
}

export async function storeMedia(
  ownerUserId: UserId,
  input: Readable,
  metadata: Partial<MediaMetaData>,
): Promise<UploadInstance> {
  const { uploadId, size } = await runInTransaction(async pg => {
    const objectManager = new LargeObjectManager({ pg });
    const [
      objectId,
      output,
    ] = await objectManager.createAndWritableStreamAsync();

    let bytesWritten = 0;
    input.on('data', (chunk: Buffer) => (bytesWritten += chunk.length));

    input.pipe(output);

    await new Promise((resolve, reject) => {
      output.on('finish', resolve).on('error', reject);
      input.on('error', err => {
        output.destroy(err);
        reject(err);
      });
    });

    return {
      uploadId: asUploadId(objectId),
      size: bytesWritten,
    };
  });
  return await Upload.create({
    id: uploadId,
    fileName: metadata.fileName,
    mimeType: metadata.mimeType,
    ownerUserId,
    size,
  });
}

interface MediaRange {
  start: number;
  end: number;
  fileSize: number;
}

export async function serveMedia(
  mediaId: UploadId,
  range: MediaRange,
): Promise<Readable> {
  const tx = await beginTransaction();
  try {
    const objectManager = new LargeObjectManager({ pg: tx.client });
    const obj = await objectManager.openAsync(
      +mediaId,
      LargeObjectManager.READ,
    );

    if (range.start !== 0) {
      const pos = +(await obj.seekAsync(range.start, LargeObject.SEEK_SET));
      if (range.start !== pos) {
        throw new Error(
          `wtf? rangeStart=${range.start} pos=${pos} mediaId=${mediaId}`,
        );
      }
    }

    const objSize = +(await obj.sizeAsync());
    if (range.fileSize !== objSize) {
      throw new Error(
        `wtf? fileSize=${range.fileSize} objSize=${objSize} mediaId=${mediaId}`,
      );
    }

    const length = range.end - range.start + 1;
    let byteCount = 0;
    const source = obj.getReadableStream();
    let finished = false;
    async function finish() {
      if (finished) {
        return;
      }
      finished = true;
      try {
        source.destroy();
        await obj.closeAsync();
      } finally {
        await tx.commit();
      }
    }

    const transformed = source.pipe(
      new Transform({
        transform(
          chunk: Buffer,
          encoding: string,
          callback: TransformCallback,
        ) {
          byteCount += chunk.length;
          if (byteCount <= length) {
            callback(undefined, chunk);
            if (byteCount === length) {
              finish();
            }
            return;
          }
          const overSize = byteCount - length;
          const slice = chunk.length - overSize;
          callback(undefined, slice > 0 ? chunk.slice(0, slice) : undefined);
          finish();
        },

        destroy() {
          finish();
        },
      }),
    );
    source.on('error', err => transformed.emit('error', err));
    return transformed;
  } catch (e) {
    tx.rollback();
    throw e;
  }
}

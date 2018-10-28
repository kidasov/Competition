import { LargeObject, LargeObjectManager } from 'pg-large-object';
import { Readable, Writable } from 'stream';
import { runInTransaction } from '../db/db';
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
  output: Writable,
  range: MediaRange,
): Promise<number> {
  const watcher = new OutputWatcher(output);
  return await runInTransaction(async pg => {
    if (watcher.shouldStop()) {
      return 0;
    }

    const objectManager = new LargeObjectManager({ pg });
    const obj = await objectManager.openAsync(
      +mediaId,
      LargeObjectManager.READ,
    );
    try {
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
          `wtf? fileSize=${
            range.fileSize
          } objSize=${objSize} mediaId=${mediaId}`,
        );
      }

      const length = range.end - range.start + 1;
      let bytesSent = 0;
      while (bytesSent < length) {
        if (watcher.shouldStop()) {
          break;
        }
        const chunk = await obj.readAsync(Math.min(length - bytesSent, 16384));
        bytesSent += chunk.length;
        if (!output.write(chunk)) {
          if (watcher.shouldStop()) {
            break;
          }
          await new Promise(resolve => watcher.wait(resolve));
        }
      }
      return bytesSent;
    } finally {
      await obj.closeAsync();
    }
  });
}

interface OutputOk {
  type: 'ok';
}
interface OutputError {
  type: 'error';
  error: Error;
}
interface OutputClosed {
  type: 'closed';
}
type OutputState = OutputOk | OutputError | OutputClosed;

// tslint:disable-next-line:no-empty
const emptyCallback = () => {};

class OutputWatcher {
  private callback = emptyCallback;
  private state: OutputState = { type: 'ok' };

  constructor(output: Writable) {
    output.on('error', error => {
      this.state = { type: 'error', error };
      this.onEvent();
    });
    output.on('close', () => {
      this.state = { type: 'closed' };
      this.onEvent();
    });
    output.on('drain', () => {
      this.onEvent();
    });
  }

  wait(callback: () => void) {
    this.callback = callback;
  }

  shouldStop(): boolean {
    switch (this.state.type) {
      case 'ok':
        return false;
      case 'closed':
        return true;
      case 'error':
        throw this.state.error;
    }
  }

  private onEvent() {
    this.callback();
    this.callback = emptyCallback;
  }
}

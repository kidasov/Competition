declare module 'async-busboy' {
  import { Readable } from 'stream';

  interface Options {
    onFile(
      fieldName: string,
      stream: Readable,
      fileName: string,
      encoding: string,
      mimeType: string,
    ): void;
  }

  function asyncBusboy(stream: Readable, opts: Options): Promise<void>;

  export = asyncBusboy;
}

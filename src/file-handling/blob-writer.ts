import { FileWriterInterface } from './file-writer-interface';
import { ErrorMessage } from '../error-message';
import { merge } from '../utils/uint8-array-utils';

export class BlobWriter implements FileWriterInterface {
  readonly fileName: string;
  readonly fileSize: number;

  private data?: Uint8Array;

  constructor(fileName: string, fileSize: number) {
    this.fileName = fileName;
    this.fileSize = fileSize;
  }

  static isSupported() {
    return true;
  }

  init() {
    return new Promise(async (resolve, reject) => {
      if (!await BlobWriter.isSupported()) {
        reject({ error: ErrorMessage.BLOB_NOT_SUPPORTED });
        return;
      }

      this.data = new Uint8Array([]);
      resolve();
    });
  }

  write(data: Uint8Array) {
    if (!this.data) {
      return;
    }

    this.data = merge(this.data, data);
  }

  getFileURL() {
    return window.URL.createObjectURL(new Blob([ this.data ]));
  }
}

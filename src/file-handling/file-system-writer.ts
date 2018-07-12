import { FileWriterInterface } from './file-writer-interface';
import { ErrorMessage } from '../error-message';

const STORAGE_TYPE = window && window.TEMPORARY;

export class FileSystemWriter implements FileWriterInterface {
  readonly fileName: string;
  readonly fileSize: number;

  private fileEntry?: FileEntry;
  private fileWriter?: FileWriter;

  constructor(fileName: string, fileSize: number) {
    this.fileSize = fileSize;
    this.fileName = fileName;
  }

  static requestFileSystem() {
    return window ? window.requestFileSystem || window.webkitRequestFileSystem : null;
  }

  static async isSupported() {
    const fileSystemRequest = FileSystemWriter.requestFileSystem();

    if (!fileSystemRequest) {
      return false;
    }

    return new Promise(resolve => {
      fileSystemRequest(STORAGE_TYPE, 1, () => resolve(true), () => resolve(false));
    });
  }

  init() {
    return new Promise(async (resolve, reject) => {
      if (!await FileSystemWriter.isSupported()) {
        reject({ error: ErrorMessage.FILE_SYSTEM_API_NOT_SUPPORTED });
        return;
      }

      const fileSystemRequest = FileSystemWriter.requestFileSystem();

      if (!fileSystemRequest) {
        return;
      }

      fileSystemRequest(STORAGE_TYPE, this.fileSize, fs => {
        fs.root.getFile(this.fileName, { create: true, exclusive: false }, fileEntry => {
          this.fileEntry = fileEntry;
          this.fileEntry.createWriter(fileWriter => {
            this.fileWriter = fileWriter;
            this.fileWriter.truncate(0);
            resolve();
          }, error => reject({ error }));
        }, error => reject({ error }));
      }, error => reject({ error }));
    });
  }

  write(data: Uint8Array) {
    return new Promise((resolve, reject) => {
      if (!this.fileWriter) {
        return reject();
      }

      this.fileWriter.onwriteend = () => {
        resolve();
      };
      this.fileWriter.write(new Blob([ data ]));
    });
  }

  getFileURL(): string | undefined {
    if (!this.fileEntry) {
      return;
    }

    return this.fileEntry.toURL();
  }
}

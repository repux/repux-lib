import { FileSystemWriter } from './file-system-writer';
import { BlobWriter } from './blob-writer';
import { ErrorMessage } from '../error-message';

export class FileWriterFactory {
  static async create(fileName: string, fileSize: number) {
    if (await FileSystemWriter.isSupported()) {
      return new FileSystemWriter(fileName, fileSize);
    }

    if (await BlobWriter.isSupported()) {
      return new BlobWriter(fileName, fileSize);
    }

    throw new Error(ErrorMessage.DOESNT_SUPPPORT_ANY_FILE_WRITER);
  }
}

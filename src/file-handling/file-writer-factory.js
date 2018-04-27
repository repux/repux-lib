import { FileSystemWriter } from './file-system-writer';
import { BlobWriter } from './blob-writer';

export class FileWriterFactory {
    static async create(fileName, fileSize) {
        if (await FileSystemWriter.isSupported()) {
            return new FileSystemWriter(fileName, fileSize);
        }

        if (await BlobWriter.isSupported()) {
            return new BlobWriter(fileName, fileSize);
        }
    }
}

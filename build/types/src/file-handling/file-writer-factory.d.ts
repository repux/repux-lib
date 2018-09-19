import { FileSystemWriter } from './file-system-writer';
import { BlobWriter } from './blob-writer';
export declare class FileWriterFactory {
    static create(fileName: string, fileSize: number): Promise<FileSystemWriter | BlobWriter>;
}

import { FileWriterInterface } from './file-writer-interface';
export declare class BlobWriter implements FileWriterInterface {
    readonly fileName: string;
    readonly fileSize: number;
    private data?;
    constructor(fileName: string, fileSize: number);
    static isSupported(): boolean;
    init(): Promise<{}>;
    write(data: Uint8Array): void;
    getFileURL(): string;
}

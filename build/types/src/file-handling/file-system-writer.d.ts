/// <reference types="filesystem" />
import { FileWriterInterface } from './file-writer-interface';
export declare class FileSystemWriter implements FileWriterInterface {
    readonly fileName: string;
    readonly fileSize: number;
    private fileEntry?;
    private fileWriter?;
    constructor(fileName: string, fileSize: number);
    static requestFileSystem(): ((type: number, size: number, successCallback: FileSystemCallback, errorCallback?: ErrorCallback | undefined) => void) | null;
    static isSupported(): Promise<{}>;
    init(): Promise<{}>;
    write(data: Uint8Array): Promise<{}>;
    getFileURL(): string | undefined;
}

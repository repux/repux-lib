import { FileWriterInterface } from './file-writer-interface';
import { ERRORS } from '../errors';

const STORAGE_TYPE = window && window.TEMPORARY;

export class FileSystemWriter extends FileWriterInterface {
    constructor(fileName, fileSize) {
        super();
        this.fileSize = fileSize;
        this.fileName = fileName;
    }

    init() {
        return new Promise(async (resolve, reject) => {
            if(!await FileSystemWriter.isSupported()) {
                reject({ error: ERRORS.FILE_SYSTEM_API_NOT_SUPPORTED });
                return;
            }

            FileSystemWriter.requestFileSystem()(STORAGE_TYPE, this.fileSize, fs => {
                fs.root.getFile(this.fileName, { create: true, exclusive: false }, fileEntry => {
                    this.fileEntry = fileEntry;
                    this.fileEntry.createWriter(fileWriter => {
                        this.fileWriter = fileWriter;
                        this.fileWriter.truncate(0);
                        resolve();
                    }, error => reject({ error }))
                }, error => reject({ error }));
            }, error => reject({ error }));
        });
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
        })
    }

    write(data) {
        return new Promise(resolve => {
            this.fileWriter.onwriteend = () => {
                resolve();
            };
            this.fileWriter.write(new Blob([data]));
        });
    }

    getFileURL() {
        return this.fileEntry.toURL();
    }
}

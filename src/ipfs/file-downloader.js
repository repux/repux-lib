import { ProgressCrypto } from '../crypto/progress-crypto';
import { ERRORS } from '../errors';
import { FileWriterFactory } from '../file-handling/file-writer-factory';
import { FileSize } from '../file-handling/file-size';
import { merge } from '../utils/uint8-array-utils';

export class FileDownloader extends ProgressCrypto {
    constructor(ipfs) {
        super();
        this.ipfs = ipfs;
    }

    /**
     * Downloads and decrypts file
     * @param {Object} symmetricKey - Symmetric key in JWK (JSON Web Key) format to decrypt first chunk of file with AES-CBC algorithm
     * @param {Object} privateKey - Private key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
     * @param fileHash - IPFS hash to meta file
     * @returns {FileDownloader}
     */
    download(symmetricKey, privateKey, fileHash) {
        this.privateKey = privateKey;
        this.symmetricKey = symmetricKey;

        this.ipfs.files.get(fileHash, (err, files) => {
            if (!files || files.length === 0) {
                this.onError(ERRORS.FILE_NOT_FOUND);
                return;
            }

            files.forEach(async (file) => {
                try {
                    const fileMeta = JSON.parse(file.content.toString('utf8'));
                    this.fileWriter = await FileWriterFactory.create(fileMeta.name, fileMeta.size);

                    if (fileMeta.size > FileSize.getMaxFileSize()) {
                        return this.onError(ERRORS.MAX_FILE_SIZE_EXCEEDED);
                    }
                    await this.fileWriter.init();
                    this.fileChunks = Object.values(fileMeta.chunks);
                    this.fileChunksNumber = this.fileChunks.length;
                    this.isFirstChunk = true;
                    this.vector = Uint8Array.from(Object.values(fileMeta.initializationVector));
                    this.downloadFileChunks();
                } catch (err) {
                    this.onError(err.error);
                }
            });
        });

        return this;
    }

    downloadFileChunks() {
        if (!this.fileChunks.length) {
            this.emit('finish', { fileURL: this.fileWriter.getFileURL(), fileName: this.fileWriter.fileName });

            return;
        }

        this.ipfs.files.get(this.fileChunks[0], (err, files) => {
            files.forEach((file) => {
                let content = file.content;

                if (this.firstChunkData) {
                    content = merge(this.firstChunkData, file.content);
                    this.firstChunkData = null;
                }

                this.crypt('decrypt', this.symmetricKey, this.vector, this.privateKey, content, {
                    isFirstChunk: this.isFirstChunk
                });
            });
        });
    }

    onProgress(progress) {
        this.emit('progress', (progress + this.fileChunksNumber - this.fileChunks.length - 1) / this.fileChunksNumber);
    }

    async onChunkCrypted(chunk) {
        this.vector = chunk.vector;

        if (!this.isFirstChunk) {
            await this.fileWriter.write(chunk.chunk);
        } else {
            this.isFirstChunk = false;
            this.firstChunkData = chunk.chunk;
        }

        this.fileChunks.shift();
        this.downloadFileChunks();
    }
}
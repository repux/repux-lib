/* global sinon */
/* eslint no-unused-expressions: 0 */

import { ERRORS } from '../../../src/errors';
import { FileSystemWriter } from '../../../src/file-handling/file-system-writer';
import { BlobWriter } from '../../../src/file-handling/blob-writer';
import { FileSize } from '../../../src/file-handling/file-size';
import { FileDownloader } from '../../../src/ipfs/file-downloader';
import IpfsApi, { FILE_HASHES, FILES } from '../../helpers/ipfs-api-mock';

describe('FileDownloader', () => {
    let ipfs = new IpfsApi();
    const SYMMERTIC_KEY = 'SYMMETRIC_KEY';
    const PRIVATE_KEY = 'PRIVATE_KEY';

    describe('constructor()', () => {
        it('should expose ipfs', () => {
            const downloader = new FileDownloader(ipfs);

            expect(downloader.ipfs).to.not.be.undefined;
        });
    });

    describe('download()', () => {
        it('it should fetch meta file when user provide correct meta file hash and it should init fileWriter', () => {
            FileSystemWriter.isSupported = () => false;
            BlobWriter.isSupported = () => true;
            const downloader = new FileDownloader(ipfs);

            return new Promise(resolve => {
                downloader.downloadFileChunks = () => {
                    expect(downloader.fileChunks.length).to.equal(2);
                    expect(downloader.fileChunksNumber).to.equal(2);
                    expect(downloader.isFirstChunk).to.be.true;
                    expect(downloader.vector).to.deep.equal(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
                    expect(downloader.fileWriter instanceof BlobWriter).to.be.true;
                    resolve();
                };

                downloader.download(SYMMERTIC_KEY, PRIVATE_KEY, FILE_HASHES.META_FILE_HASH);
            });
        });

        it('should emit an error when user provide incorrect meta file hash', () => {
            FileSystemWriter.isSupported = () => false;
            BlobWriter.isSupported = () => true;
            const downloader = new FileDownloader(ipfs);

            return new Promise(resolve => {
                downloader.download(SYMMERTIC_KEY, PRIVATE_KEY, 'INCORRECT_FILE_HASH');
                downloader.on('error', () => {
                    resolve();
                });
            });
        });

        it('should emit an error when maximum file size is exceeded', () => {
            FileSystemWriter.isSupported = () => false;
            BlobWriter.isSupported = () => true;
            FileSize.getMaxFileSize = () => 1;
            const downloader = new FileDownloader(ipfs);

            return new Promise(resolve => {
                downloader.download(SYMMERTIC_KEY, PRIVATE_KEY, FILE_HASHES.META_FILE_HASH);
                downloader.on('error', (eventType, error) => {
                    expect(error).to.equal(ERRORS.MAX_FILE_SIZE_EXCEEDED);
                    resolve();
                });
            });
        });

        it('should emit an error when there is no supported file writers', () => {
            FileSystemWriter.isSupported = () => false;
            BlobWriter.isSupported = () => false;
            const downloader = new FileDownloader(ipfs);

            return new Promise(resolve => {
                downloader.downloadFileChunks = () => {};
                downloader.download(SYMMERTIC_KEY, PRIVATE_KEY, FILE_HASHES.META_FILE_HASH);
                downloader.on('error', (eventType, error) => {
                    expect(error).to.equal(ERRORS.DOESNT_SUPPPORT_ANY_FILE_WRITER);
                    resolve();
                });
            });
        });

        it('should emit an error caught from downloadFileChunks method', () => {
            FileSystemWriter.isSupported = () => false;
            BlobWriter.isSupported = () => true;
            FileSize.getMaxFileSize = () => 10000000;
            const downloader = new FileDownloader(ipfs);
            const ERROR = 'ERROR';

            return new Promise(resolve => {
                downloader.downloadFileChunks = () => {
                    throw new Error(ERROR);
                };
                downloader.download(SYMMERTIC_KEY, PRIVATE_KEY, FILE_HASHES.META_FILE_HASH);
                downloader.on('error', (eventType, error) => {
                    expect(error).to.equal(ERROR);
                    resolve();
                });
            });
        });
    });

    describe('downloadFileChunks()', () => {
        it('should download first file chunk and decrypt it', () => {
            const downloader = new FileDownloader(ipfs);

            downloader.fileChunks = ['FILE_CHUNK_0', 'FILE_CHUNK_1'];
            downloader.fileChunksNumber = 2;
            downloader.symmetricKey = SYMMERTIC_KEY;
            downloader.privateKey = PRIVATE_KEY;
            downloader.isFirstChunk = true;

            downloader.crypt = (method, symmetricKey, vector, privateKey, content, options) => {
                expect(method).to.equal('decrypt');
                expect(symmetricKey).to.equal(SYMMERTIC_KEY);
                expect(privateKey).to.equal(PRIVATE_KEY);
                expect(content).to.equal(FILES[FILE_HASHES.FILE_CHUNK_0].content);
                expect(options).to.deep.equal({ isFirstChunk: true });
            };

            downloader.downloadFileChunks();
        });

        it('should emit an error when chunk hash is incorrect', () => {
            const downloader = new FileDownloader(ipfs);
            downloader.fileChunks = ['INCORRECT_FILE_HASH'];
            downloader.fileChunksNumber = 1;
            downloader.symmetricKey = SYMMERTIC_KEY;
            downloader.privateKey = PRIVATE_KEY;
            downloader.isFirstChunk = true;

            return new Promise(resolve => {
                downloader.downloadFileChunks();
                downloader.on('error', () => {
                    resolve();
                });
            });
        });

        it('should emit finish event when fileChunks array is empty', () => {
            const downloader = new FileDownloader(ipfs);
            const fileUrl = 'FILE_URL';
            const fileName = 'FILE_NAME';

            downloader.fileChunks = [];
            downloader.fileWriter = {
                getFileURL: () => {
                    return fileUrl;
                },
                fileName
            };

            downloader.downloadFileChunks();

            return new Promise(resolve => {
                downloader.on('finish', (eventType, data) => {
                    expect(data.fileURL).to.equal(fileUrl);
                    expect(data.fileName).to.equal(fileName);
                    resolve();
                });
            });
        });
    });

    describe('onProgress()', () => {
        it('should emit progress event', () => {
            const downloader = new FileDownloader(ipfs);
            downloader.fileChunks = [2];
            downloader.fileChunksNumber = 3;

            return new Promise(resolve => {
                downloader.on('progress', (eventType, progress) => {
                    expect(Math.round(progress * 100)).to.equal(40);
                    resolve();
                });

                downloader.onProgress(0.2);
            });
        });
    });

    describe('onChunkCrypted()', () => {
        it('should override vector value, write data, shift chunks array and call downloadFileChunks method', async () => {
            const vector = new Uint8Array([0, 0, 0]);
            const chunk = new Uint8Array([1, 2, 3]);
            const downloader = new FileDownloader(ipfs);
            downloader.fileChunks = ['FILE_CHUNK_0', 'FILE_CHUNK_1'];
            downloader.isFirstChunk = false;
            downloader.fileWriter = {
                write: sinon.fake()
            };

            await downloader.onChunkCrypted({ vector, chunk });
            expect(downloader.fileWriter.write.called).to.be.true;
        });

        it('should add chunk data to fistChunkData property instead of writing to file when isFirstChunk is true', async () => {
            const vector = new Uint8Array([0, 0, 0]);
            const chunk = new Uint8Array([1, 2, 3]);
            const downloader = new FileDownloader(ipfs);
            downloader.fileChunks = ['FILE_CHUNK_0', 'FILE_CHUNK_1'];
            downloader.isFirstChunk = true;
            downloader.fileWriter = {
                write: sinon.fake()
            };
            downloader.downloadFileChunks = () => {};

            await downloader.onChunkCrypted({ vector, chunk });
            expect(downloader.isFirstChunk).to.be.false;
            expect(downloader.firstChunkData).to.equal(chunk);
            expect(downloader.fileWriter.write.called).to.be.false;
        });
    });
});

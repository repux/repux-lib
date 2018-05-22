/* global File, Blob, sinon */
/* eslint no-unused-expressions: 0 */

import { ERRORS } from '../../../src/errors';
import { FileUploader } from '../../../src/ipfs/file-uploader';
import IpfsApi, { FILE_HASHES } from '../../helpers/ipfs-api-mock';
import mockCryptoGetRandomValues from '../../helpers/crypto-get-random-values-mock';
import { KeyEncryptor } from '../../../src/crypto/key-encryptor';
import { Buffer } from 'buffer';
import { PurchaseType } from '../../../src/types/purchase-type';

describe('FileUploader', () => {
    let ipfs = new IpfsApi();
    const PUBLIC_KEY = 'PUBLIC_KEY';
    const FILE = new File([new Blob(['test'])], 'test.txt');

    describe('constructor()', () => {
        it('should expose ipfs', () => {
            const uploader = new FileUploader(ipfs);

            expect(uploader.ipfs).to.not.be.undefined;
        });
    });

    describe('upload()', () => {
        it('it should emit error when user doesn\'t provide any file', () => {
            const uploader = new FileUploader(ipfs);

            return new Promise(resolve => {
                uploader.upload(PUBLIC_KEY, null);
                uploader.on('error', (eventType, error) => {
                    expect(error).to.equal(ERRORS.FILE_NOT_SPECIFIED);
                    resolve();
                });
            });
        });

        it('should generate unique initializationVector', () => {
            mockCryptoGetRandomValues();
            const uploader = new FileUploader(ipfs);
            uploader.upload(PUBLIC_KEY, FILE);
            const firstVector = uploader.initializationVector;
            uploader.upload(PUBLIC_KEY, FILE);
            const secondVector = uploader.initializationVector;

            expect(firstVector.length).to.equal(16);
            expect(secondVector.length).to.equal(16);
            expect(firstVector).not.to.equal(secondVector);
        });

        it('should call crypt method', () => {
            mockCryptoGetRandomValues();
            const uploader = new FileUploader(ipfs);
            uploader.crypt = (method, symmetricKey, initializationVector, publicKey, file) => {
                expect(method).to.equal('encrypt');
                expect(initializationVector).to.equal(uploader.initializationVector);
                expect(publicKey).to.equal(PUBLIC_KEY);
                expect(file).to.equal(FILE);
            };
            uploader.upload(PUBLIC_KEY, FILE);
        });

        it('should assign metaData argument to metaData property', () => {
            const shortDescription = 'SHORT_DESCRIPTION';
            const longDescription = 'LONG_DESCRIPTION';
            const metaData = {
                shortDescription,
                longDescription
            };

            const uploader = new FileUploader(ipfs);
            uploader.upload(PUBLIC_KEY, FILE, metaData);

            expect(uploader.metaData).to.deep.equal(metaData);
        });
    });

    describe('onChunkCrypted', () => {
        const vector = new Uint8Array([0, 0, 0]);
        const chunk = new Uint8Array([1, 2, 3]);

        it('should upload chunk to IPFS', () => {
            const uploader = new FileUploader(ipfs);
            const allChunksAreSentSinon = sinon.fake();
            const finishUploadSinon = sinon.fake();
            uploader.chunks = [];

            uploader.isAllChunksAreSent = () => {
                allChunksAreSentSinon();
            };

            uploader.finishUpload = () => {
                finishUploadSinon();
            };

            uploader.onChunkCrypted({ vector, chunk });

            expect(allChunksAreSentSinon.called).to.be.true;
            expect(finishUploadSinon.called).to.be.false;
        });

        it('should call finishUpload method when all chunks are sent', () => {
            const uploader = new FileUploader(ipfs);
            const allChunksAreSentSinon = sinon.fake();
            const finishUploadSinon = sinon.fake();
            uploader.chunks = [];

            uploader.isAllChunksAreSent = () => {
                allChunksAreSentSinon();
                return true;
            };

            uploader.finishUpload = () => {
                finishUploadSinon();
            };

            uploader.onChunkCrypted({ vector, chunk });

            expect(allChunksAreSentSinon.called).to.be.true;
            expect(finishUploadSinon.called).to.be.true;
        });
    });

    describe('isAllChunksAreSent()', () => {
        it('should return true when all chunks upload is finished', () => {
            const uploader = new FileUploader(ipfs);
            uploader.chunks = [FILE_HASHES.FILE_CHUNK_0];
            uploader.maxChunkNumber = 0;
            uploader.isFinished = false;
            expect(uploader.isAllChunksAreSent()).to.be.false;

            uploader.isFinished = true;
            expect(uploader.isAllChunksAreSent()).to.be.true;

            uploader.maxChunkNumber = 1;
            expect(uploader.isAllChunksAreSent()).to.be.false;

            uploader.chunks.push(FILE_HASHES.FILE_CHUNK_1);
            expect(uploader.isAllChunksAreSent()).to.be.true;
        });
    });

    describe('finishUpload()', () => {
        it('should upload meta file and emit finish event', () => {
            const initializationVector = 'INITIALIZATION_VECTOR';
            const fileName = 'FILE_NAME';
            const fileSize = 'FILE_SIZE';
            const fileChunks = [FILE_HASHES.FILE_CHUNK_0, FILE_HASHES.FILE_CHUNK_1];
            KeyEncryptor.encryptSymmetricKey = sinon.fake.returns('ENCRYPTED_KEY');

            const uploader = new FileUploader(ipfs);
            uploader.initializationVector = initializationVector;
            uploader.metaData = {};
            uploader.file = {
                name: fileName,
                size: fileSize
            };
            uploader.chunks = fileChunks;

            return new Promise(async resolve => {
                uploader.on('finish', (eventType, fileHash) => {
                    expect(fileHash).to.equal(FILE_HASHES.NEW_IPFS_FILE);
                    expect(KeyEncryptor.encryptSymmetricKey.called).to.be.true;
                    resolve();
                });

                expect(uploader.isUploadFinished).to.be.undefined;
                await uploader.finishUpload();
                expect(uploader.isUploadFinished).to.be.true;
            });
        });

        it('should add additional meta data to meta file from metaData property', async () => {
            const shortDescription = 'SHORT_DESCRIPTION';
            const longDescription = 'LONG_DESCRIPTION';
            const type = PurchaseType.ONE_TIME_PURCHASE;
            const initializationVector = 'INITIALIZATION_VECTOR';
            const fileName = 'FILE_NAME';
            const fileSize = 'FILE_SIZE';
            const fileChunks = [FILE_HASHES.FILE_CHUNK_0, FILE_HASHES.FILE_CHUNK_1];
            const addSinon = sinon.fake();
            KeyEncryptor.encryptSymmetricKey = sinon.fake.returns('ENCRYPTED_KEY');

            const uploader = new FileUploader({
                files: {
                    add: (contentJson) => {
                        const content = JSON.parse(contentJson);
                        expect(content.initializationVector).to.equal(initializationVector);
                        expect(content.name).to.equal(fileName);
                        expect(content.size).to.equal(fileSize);
                        expect(content.chunks).to.deep.equal(fileChunks);
                        expect(content.shortDescription).to.equal(shortDescription);
                        expect(content.longDescription).to.equal(longDescription);
                        expect(content.type).to.equal(type);
                        addSinon();
                    }
                }
            });

            Buffer.from = (string) => string;

            uploader.initializationVector = initializationVector;
            uploader.metaData = {
                shortDescription,
                longDescription,
                type
            };
            uploader.file = {
                name: fileName,
                size: fileSize
            };
            uploader.chunks = fileChunks;

            await uploader.finishUpload();
            expect(addSinon.called).to.be.true;
        });
    });
});

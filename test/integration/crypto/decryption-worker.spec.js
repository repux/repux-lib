/* global File, Blob, crypto, TextDecoder */
import assert from 'assert';
import { FILE_CONTENT, FILE_NAME, IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL } from '../config';
import {
    ASYMMETRIC_ENCRYPTION_ALGORITHM,
    ASYMMETRIC_ENCRYPTION_HASH, CHUNK_SIZE,
    FIRST_CHUNK_SIZE,
    SYMMETRIC_ENCRYPTION_ALGORITHM, VECTOR_SIZE
} from '../../../src/config';
import IpfsAPI from 'ipfs-api';
import RepuxLib from '../../../src/repux-lib';
import { decryptionWorker } from '../../../src/threads/decryption-worker';

describe('File chunks shouldn\'t be decrypted when user provides improper keys', function () {
    this.timeout(90000);
    let file, largeFileContent, repux, fileHash, asymmetricKeys, symmetricKey, ipfs, metaContent, initializationVector;

    before(function () {
        return new Promise(async (resolve, reject) => {
            largeFileContent = '';
            ipfs = new IpfsAPI({
                host: IPFS_HOST,
                port: IPFS_PORT,
                protocol: IPFS_PROTOCOL
            });

            for (let i = 0; i < 1000; i++) {
                largeFileContent += FILE_CONTENT;
            }

            file = new File([new Blob([largeFileContent])], FILE_NAME);

            repux = new RepuxLib(ipfs);

            asymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();
            symmetricKey = await RepuxLib.generateSymmetricKey();

            repux.createFileUploader().on('finish', function (eventType, metaFileHash) {
                fileHash = metaFileHash;

                ipfs.files.get(fileHash, (err, files) => {
                    if (err) {
                        reject(err);
                    }
                    metaContent = JSON.parse(files[0].content.toString('utf8'));
                    initializationVector = Uint8Array.from(Object.values(metaContent.initializationVector));
                    resolve();
                });
            }).upload(symmetricKey, asymmetricKeys.publicKey, file);
        });
    });

    describe('User shouldn\'t be able to decrypt second chunk with first chunk initialization vector', () => {
        it('should return error', (done) => {
            ipfs.files.get(metaContent.chunks[1], async (err, file) => {
                if (err) {
                    throw new Error(err);
                }
                const symmetric = await crypto.subtle.importKey('jwk', symmetricKey, {
                    name: SYMMETRIC_ENCRYPTION_ALGORITHM
                }, false, ['decrypt']);

                decryptionWorker([file.content, symmetric, initializationVector, null, {
                    isFirstChunk: false,
                    CHUNK_SIZE,
                    FIRST_CHUNK_SIZE,
                    VECTOR_SIZE,
                    SYMMETRIC_ENCRYPTION_ALGORITHM,
                    ASYMMETRIC_ENCRYPTION_ALGORITHM
                }], () => {
                }, data => {
                    if (data.error !== null) {
                        assert.ok(true);
                        done();
                    }
                });
            });
        });
    });

    describe('User shouldn\'t be able to decrypt first chunk without symmetric key', function () {
        it('decoded chunk shouldn\'t look like original file chunk', function (done) {
            ipfs.files.get(metaContent.chunks[0], async (err, files) => {
                if (err) {
                    throw new Error(err);
                }
                const asymmetric = await crypto.subtle.importKey('jwk', asymmetricKeys.privateKey, {
                    name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
                    hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
                }, false, ['decrypt']);

                decryptionWorker([files[0].content, null, null, asymmetric, {
                    isFirstChunk: true,
                    CHUNK_SIZE,
                    FIRST_CHUNK_SIZE,
                    VECTOR_SIZE,
                    SYMMETRIC_ENCRYPTION_ALGORITHM,
                    ASYMMETRIC_ENCRYPTION_ALGORITHM
                }], () => {
                }, data => {
                    if (data.chunk) {
                        assert.notEqual(largeFileContent.substring(0, FIRST_CHUNK_SIZE), new TextDecoder('utf8').decode(data.chunk));
                        done();
                    }
                });
            });
        });
    });

    describe('User shouldn\'t be able to decrypt first chunk without asymmetric key', function () {
        it('should return error', function (done) {
            ipfs.files.get(metaContent.chunks[0], async (err, files) => {
                if (err) {
                    throw new Error(err);
                }
                const symmetric = await crypto.subtle.importKey('jwk', symmetricKey, {
                    name: SYMMETRIC_ENCRYPTION_ALGORITHM
                }, false, ['decrypt']);

                decryptionWorker([files[0].content, symmetric, initializationVector, null, {
                    isFirstChunk: false,
                    CHUNK_SIZE,
                    FIRST_CHUNK_SIZE,
                    VECTOR_SIZE,
                    SYMMETRIC_ENCRYPTION_ALGORITHM,
                    ASYMMETRIC_ENCRYPTION_ALGORITHM
                }], () => {
                }, data => {
                    if (data.error !== null) {
                        assert.ok(true);
                        done();
                    }
                });
            });
        });
    });
});

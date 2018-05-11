/* global sinon */
/* eslint no-unused-expressions: 0 */

import { ProgressCrypto } from '../../../src/crypto/progress-crypto';
import { Observable } from '../../../src/utils/observable';
import { ERRORS } from '../../../src/errors';
import { KeyImporter } from '../../../src/crypto/key-importer';

describe('ProgressCrypto', () => {
    describe('constructor()', () => {
        it('should extend Observable', async () => {
            const progressCrypto = new ProgressCrypto();
            expect(progressCrypto instanceof ProgressCrypto).to.be.true;
            expect(progressCrypto instanceof Observable).to.be.true;
        });
    });

    describe('crypt()', () => {
        it('should call KeyImporter.importSymmetricKey when password is defined', () => {
            const password = 'PASSWORD';
            const progressCrypto = new ProgressCrypto();
            const importSymmetricKeySinon = sinon.fake();

            KeyImporter.importSymmetricKey = (key) => {
                expect(key).to.equal(password);
                importSymmetricKeySinon();
            };
            progressCrypto.crypt('encrypt', password);
            expect(importSymmetricKeySinon.called).to.be.true;
        });

        it('shouldn\'t call KeyImporter.importSymmetricKey when password isn\'t defined', () => {
            const progressCrypto = new ProgressCrypto();
            const importSymmetricKeySinon = sinon.fake();

            KeyImporter.importSymmetricKey = () => {
                importSymmetricKeySinon();
            };
            progressCrypto.crypt('encrypt');
            expect(importSymmetricKeySinon.called).to.be.false;
        });

        it('should call KeyImporter.importPublicKey when asymmetricKey is definied and type is encrypt', () => {
            const progressCrypto = new ProgressCrypto();
            const importPublicKeySinon = sinon.fake();
            const publicKey = 'PUBLIC_KEY';

            KeyImporter.importPublicKey = (key) => {
                expect(key).to.equal(publicKey);
                importPublicKeySinon();
            };
            progressCrypto.crypt('encrypt', null, null, publicKey);
            expect(importPublicKeySinon.called).to.be.true;
        });

        it('shouldn\'t call KeyImporter.importPublicKey when asymmetricKey isn\'t defined', () => {
            const progressCrypto = new ProgressCrypto();
            const importPublicKeySinon = sinon.fake();

            KeyImporter.importSymmetricKey = () => {
                importPublicKeySinon();
            };
            progressCrypto.crypt('encrypt');
            expect(importPublicKeySinon.called).to.be.false;
        });

        it('should call KeyImporter.importPrivateKey when asymmetricKey is definied and type is decrypt', () => {
            const progressCrypto = new ProgressCrypto();
            const importPrivateKeySinon = sinon.fake();
            const privateKey = 'PRIVATE_KEY';

            KeyImporter.importPrivateKey = (key) => {
                expect(key).to.equal(privateKey);
                importPrivateKeySinon();
            };
            progressCrypto.crypt('decrypt', null, null, privateKey);
            expect(importPrivateKeySinon.called).to.be.true;
        });

        it('shouldn\'t call KeyImporter.importPublicKey when asymmetricKey isn\'t defined', () => {
            const progressCrypto = new ProgressCrypto();
            const importPrivateKeySinon = sinon.fake();

            KeyImporter.importPrivateKey = () => {
                importPrivateKeySinon();
            };
            progressCrypto.crypt('decrypt');
            expect(importPrivateKeySinon.called).to.be.false;
        });

        it('should assign result of getWorkerByType function to thread property and call send method on it', async () => {
            const fileContent = ' FILE';
            const cryptType = 'encrypt';
            const password = 'PASSWORD';
            const publicKey = 'PUBLIC_KEY';
            const vector = new Uint8Array([0, 0, 0]);
            const progressCrypto = new ProgressCrypto();
            const threadSendSinon = sinon.fake();

            KeyImporter.importSymmetricKey = (key) => {
                return key + '_IMPORTED';
            };

            KeyImporter.importPublicKey = (key) => {
                return key + '_IMPORTED';
            };

            ProgressCrypto.getWorkerByType = (type) => {
                expect(type).to.equal(cryptType);

                return {
                    send: ([ file, passwordKey, initializationVector, asymmetricKeyObject, options ]) => {
                        expect(file).to.equal(fileContent);
                        expect(passwordKey).to.equal('PASSWORD_IMPORTED');
                        expect(initializationVector).to.equal(vector);
                        expect(asymmetricKeyObject).to.equal('PUBLIC_KEY_IMPORTED');
                        expect(options).to.deep.equal({
                            CHUNK_SIZE: 983040,
                            FIRST_CHUNK_SIZE: 190,
                            VECTOR_SIZE: 16,
                            SYMMETRIC_ENCRYPTION_ALGORITHM: 'AES-CBC',
                            ASYMMETRIC_ENCRYPTION_ALGORITHM: 'RSA-OAEP',
                            ASYMMETRIC_ENCRYPTION_HASH: 'SHA-256',
                            ENCRYPTION_ERROR: 'ENCRYPTION_ERROR',
                            DECRYPTION_ERROR: 'DECRYPTION_ERROR',
                            REENCRYPTION_ERROR: 'REENCRYPTION_ERROR',
                            option1: '1'
                        });
                        threadSendSinon();
                    },
                    on: () => {}
                };
            };

            await progressCrypto.crypt(cryptType, password, vector, publicKey, fileContent, { option1: '1' });
            expect(threadSendSinon.called).to.be.true;
        });

        it('should call onChunkCrypted when thread emits progress event with chunk', async () => {
            let progressCallback;
            const progressCrypto = new ProgressCrypto();
            const onChunkCryptedSinon = sinon.fake();

            KeyImporter.importSymmetricKey = (key) => {
                return key + '_IMPORTED';
            };

            KeyImporter.importPublicKey = (key) => {
                return key + '_IMPORTED';
            };

            ProgressCrypto.getWorkerByType = () => {
                return {
                    send: () => {},
                    on: (eventType, callback) => {
                        progressCallback = callback;
                    }
                };
            };

            progressCrypto.onChunkCrypted = (data) => {
                expect(data.chunk).to.equal('chunk');
                expect(data.number).to.equal(1);
                onChunkCryptedSinon();
            };

            await progressCrypto.crypt('encrypt', 'password', 'vector', 'publicKey', 'fileContent', { option1: '1' });
            progressCallback({
                chunk: 'chunk',
                number: 1
            });
            expect(onChunkCryptedSinon.called).to.be.true;
        });

        it('should call onProgress when thread emits progress event with progress', async () => {
            let progressCallback;
            const progressCrypto = new ProgressCrypto();
            const onProgressSinon = sinon.fake();

            KeyImporter.importSymmetricKey = (key) => {
                return key + '_IMPORTED';
            };

            KeyImporter.importPublicKey = (key) => {
                return key + '_IMPORTED';
            };

            ProgressCrypto.getWorkerByType = () => {
                return {
                    send: () => {},
                    on: (eventType, callback) => {
                        progressCallback = callback;
                    }
                };
            };

            progressCrypto.onProgress = (progress) => {
                expect(progress).to.equal(0.9);
                onProgressSinon();
            };

            await progressCrypto.crypt('encrypt', 'password', 'vector', 'publicKey', 'fileContent', { option1: '1' });
            progressCallback({
                progress: 0.9
            });
            expect(onProgressSinon.called).to.be.true;
        });

        it('should call thread.kill when thread emits progress event with progress equal to 1', async () => {
            let progressCallback;
            const progressCrypto = new ProgressCrypto();
            const killSinon = sinon.fake();

            KeyImporter.importSymmetricKey = (key) => {
                return key + '_IMPORTED';
            };

            KeyImporter.importPublicKey = (key) => {
                return key + '_IMPORTED';
            };

            ProgressCrypto.getWorkerByType = () => {
                return {
                    send: () => {},
                    on: (eventType, callback) => {
                        progressCallback = callback;
                    },
                    kill: () => {
                        killSinon();
                    }
                };
            };

            await progressCrypto.crypt('encrypt', 'password', 'vector', 'publicKey', 'fileContent', { option1: '1' });
            progressCallback({
                progress: 1
            });
            expect(killSinon.called).to.be.true;
        });

        it('should call onError when thread emits progress event with error', async () => {
            let progressCallback;
            const progressCrypto = new ProgressCrypto();
            const onErrorSinon = sinon.fake();

            KeyImporter.importSymmetricKey = (key) => {
                return key + '_IMPORTED';
            };

            KeyImporter.importPublicKey = (key) => {
                return key + '_IMPORTED';
            };

            ProgressCrypto.getWorkerByType = () => {
                return {
                    send: () => {},
                    on: (eventType, callback) => {
                        progressCallback = callback;
                    }
                };
            };

            progressCrypto.onError = (error) => {
                expect(error).to.equal('error');
                onErrorSinon();
            };

            await progressCrypto.crypt('encrypt', 'password', 'vector', 'publicKey', 'fileContent', { option1: '1' });
            progressCallback({
                error: 'error'
            });
            expect(onErrorSinon.called).to.be.true;
        });
    });

    describe('getErrorByType()', () => {
        it('should return general error by type', () => {
            expect(ProgressCrypto.getErrorByType('encrypt')).to.equal(ERRORS.ENCRYPTION_ERROR);
            expect(ProgressCrypto.getErrorByType('decrypt')).to.equal(ERRORS.DECRYPTION_ERROR);
            expect(ProgressCrypto.getErrorByType('reencrypt')).to.equal(ERRORS.REENCRYPTION_ERROR);
        });
    });

    describe('terminate()', () => {
        it('should call kill on thread property', () => {
            const progressCrypto = new ProgressCrypto();
            progressCrypto.thread = {
                kill: sinon.fake()
            };
            const thread = progressCrypto.thread;
            progressCrypto.terminate();
            expect(thread.kill.called).to.be.true;
        });
    });

    describe('onChunkCrypted', () => {
        it('should call emit with chunkCrypted eventType', () => {
            const progressCrypto = new ProgressCrypto();
            const emitSinon = sinon.fake();

            progressCrypto.emit = (eventType, data) => {
                expect(eventType).to.equal('chunkCrypted');
                expect(data).to.equal('chunk');
                emitSinon();
            };
            progressCrypto.onChunkCrypted('chunk');
            expect(emitSinon.called).to.be.true;
        });
    });

    describe('onProgress', () => {
        it('should call emit with progress eventType', () => {
            const progressCrypto = new ProgressCrypto();
            const emitSinon = sinon.fake();

            progressCrypto.emit = (eventType, data) => {
                expect(eventType).to.equal('progress');
                expect(data).to.equal(0.99);
                emitSinon();
            };
            progressCrypto.onProgress(0.99);
            expect(emitSinon.called).to.be.true;
        });
    });

    describe('onError', () => {
        it('should call emit with error eventType', () => {
            const progressCrypto = new ProgressCrypto();
            const emitSinon = sinon.fake();

            progressCrypto.thread = {
                kill: sinon.fake()
            };

            progressCrypto.emit = (eventType, data) => {
                expect(eventType).to.equal('error');
                expect(data).to.equal('message');
                emitSinon();
            };
            progressCrypto.onError('message');
            expect(emitSinon.called).to.be.true;
        });
    });
});

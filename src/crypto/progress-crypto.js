import { Observable } from '../utils/observable';
import { spawn } from 'threads';
import { encryptionWorker } from './encryption-worker';
import { decryptionWorker } from './decryption-worker';
import { reencryptionWorker } from './reecryption-worker';
import {
    CHUNK_SIZE,
    FIRST_CHUNK_SIZE,
    VECTOR_SIZE,
    SYMMETRIC_ENCRYPTION_ALGORITHM,
    ASYMMETRIC_ENCRYPTION_ALGORITHM,
    ASYMMETRIC_ENCRYPTION_HASH
} from '../config';
import { ERRORS } from '../errors';

export class ProgressCrypto extends Observable {
    async crypt(type, password, initializationVector, asymmetricKey, file, options = {}) {
        try {
            let passwordKey, asymmetricKeyObject;

            options = Object.assign({
                CHUNK_SIZE,
                FIRST_CHUNK_SIZE,
                VECTOR_SIZE,
                SYMMETRIC_ENCRYPTION_ALGORITHM,
                ASYMMETRIC_ENCRYPTION_ALGORITHM,
                ENCRYPTION_ERROR: ERRORS.ENCRYPTION_ERROR,
                DECRYPTION_ERROR: ERRORS.DECRYPTION_ERROR,
                REENCRYPTION_ERROR: ERRORS.REENCRYPTION_ERROR
            }, options);

            this.isFinished = false;
            this.chunks = {};

            if (password) {
                passwordKey = await crypto.subtle.importKey('jwk', password, {
                    name: SYMMETRIC_ENCRYPTION_ALGORITHM
                }, false, [ type ]);
            }

            if (asymmetricKey) {
                asymmetricKeyObject = await crypto.subtle.importKey('jwk', asymmetricKey, {
                    name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
                    hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
                }, false, [ type ]);
            }

            this.thread = ProgressCrypto.getWorkerByType(type);
            this.thread.send([
                file,
                passwordKey,
                initializationVector,
                asymmetricKeyObject,
                options
            ]);

            this.thread.on('progress', async data => {
                if (data.chunk) {
                    this.maxChunkNumber = data.number;
                    await this.onChunkCrypted(data);
                }

                if (data.progress) {
                    this.onProgress(data.progress);

                    if (data.progress === 1) {
                        this.thread.kill();
                        this.isFinished = true;
                    }
                }

                if (data.error) {
                    this.onError(data.error);
                }
            });

            return this.thread;
        } catch(error) {
            this.onError(ProgressCrypto.getErrorByType(type))
        }
    }

    static getWorkerByType(type) {
        if (type === 'encrypt') {
            return spawn(encryptionWorker);
        }

        if (type === 'decrypt') {
            return spawn(decryptionWorker);
        }

        if (type === 'reencrypt') {
            return spawn(reencryptionWorker);
        }
    }

    static getErrorByType(type) {
        if (type === 'encrypt') {
            return ERRORS.ENCRYPTION_ERROR;
        }

        if (type === 'decrypt') {
            return ERRORS.DECRYPTION_ERROR;
        }

        if (type === 'reencrypt') {
            return ERRORS.REENCRYPTION_ERROR;
        }
    }

    terminate() {
        if (this.thread) {
            this.thread.kill();
            this.thread = undefined;
        }
    }

    onChunkCrypted(chunk) {
        this.emit('chunkCrypted', chunk);
    }

    onProgress(progress) {
        this.emit('progress', progress);
    }

    onError(error) {
        this.emit('error', error);

        if (this.thread) {
            this.thread.kill();
        }
    }
}

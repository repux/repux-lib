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

export class ProgressCrypto extends Observable {
    async crypt(type, password, initializationVector, asymmetricKey, file, options) {
        let passwordKey, asymmetricKeyObject;

        if (!options) {
            options = {};
        }

        options = Object.assign({
            CHUNK_SIZE,
            FIRST_CHUNK_SIZE,
            VECTOR_SIZE,
            SYMMETRIC_ENCRYPTION_ALGORITHM,
            ASYMMETRIC_ENCRYPTION_ALGORITHM
        }, options);

        this.isFinished = false;
        this.chunks = {};

        if (password) {
            passwordKey = await crypto.subtle.importKey('jwk', password, {
                name: SYMMETRIC_ENCRYPTION_ALGORITHM
            }, false, [type]);
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

        this.thread.on('progress', data => {
            if (data.chunk) {
                this.maxChunkNumber = data.number;
                this.onChunkCrypted(data);
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
                this.thread.kill();
            }
        });

        return this.thread;
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
    }
}

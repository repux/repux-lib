import { ProgressCrypto } from '../crypto/progress-crypto';
import { ERRORS } from '../errors';
import { Buffer } from 'buffer';
import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH } from '../config';

export class FileReencryptor extends ProgressCrypto {
    constructor(ipfs) {
        super();
        this.ipfs = ipfs;
    }

    reencrypt(oldPrivateKey, newPublicKey, fileHash) {
        this.oldPrivateKey = oldPrivateKey;
        this.newPublicKey = newPublicKey;
        this.fileHash = fileHash;

        this.ipfs.files.get(this.fileHash, (err, files) => {
            if (!files || files.length === 0) {
                this.onError(ERRORS.FILE_NOT_FOUND);
            }

            files.forEach(async (file) => {
                this.fileMeta = JSON.parse(file.content.toString('utf8'));
                this.downloadChunk(this.fileMeta.chunks[0]);
            });
        })
    }

    downloadChunk(chunk) {
        this.ipfs.files.get(chunk, (err, files) => {
            files.forEach(async (file) => {
                let content = file.content;

                const oldPrivateKey = await crypto.subtle.importKey('jwk', this.oldPrivateKey, {
                    name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
                    hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
                }, false, ['decrypt']);

                const newPublicKey = await crypto.subtle.importKey('jwk', this.newPublicKey, {
                    name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
                    hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
                }, false, ['encrypt']);

                this.crypt('reencrypt', null, null, null, content, {
                    isFirstChunk: true,
                    oldPrivateKey,
                    newPublicKey
                });
            });
        });
    }

    onProgress(progress) {
        this.emit('progress', (progress + this.fileChunksNumber - this.fileChunks.length - 1) / this.fileChunksNumber);
    }

    onChunkCrypted(chunk) {
        const meta = Object.assign({}, this.fileMeta);

        this.ipfs.files.add(Buffer.from(chunk.chunk), (err, files) => {
            if (err) {
                this.onError(err);
                return this.terminate();
            }

            meta.chunks[0] = files[0].hash;

            this.ipfs.files.add(Buffer.from(JSON.stringify(meta)), (err, files) => {
                this.emit('finish', files[0].hash);
                this.emit('progress', 1);
            });
        });
    }
}

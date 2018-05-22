import { ProgressCrypto } from '../crypto/progress-crypto';
import { ERRORS } from '../errors';
import { Buffer } from 'buffer';
import { KeyImporter } from '../crypto/key-importer';
import { KeyEncryptor } from '../crypto/key-encryptor';

export class FileReencryptor extends ProgressCrypto {
    constructor(ipfs) {
        super();
        this.ipfs = ipfs;
    }

    /**
     * Reencrypts file
     * @param {Object} oldPrivateKey - Public key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
     * @param {Object} newPublicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
     * @param fileHash - IPFS hash to meta file
     * @returns {FileReencryptor}
     */
    reencrypt(oldPrivateKey, newPublicKey, fileHash) {
        this.oldPrivateKey = oldPrivateKey;
        this.newPublicKey = newPublicKey;
        this.fileHash = fileHash;

        /* eslint handle-callback-err: 0 */
        this.ipfs.files.get(this.fileHash, (err, files) => {
            if (!files || files.length === 0) {
                return this.onError(ERRORS.FILE_NOT_FOUND);
            }

            files.forEach(async (file) => {
                try {
                    this.fileMeta = JSON.parse(file.content.toString('utf8'));
                    this.downloadChunk(this.fileMeta.chunks[0]);
                } catch (err) {
                    this.onError(err.message);
                }
            });
        });

        return this;
    }

    downloadChunk(chunk) {
        /* eslint handle-callback-err: 0 */
        this.ipfs.files.get(chunk, (err, files) => {
            if (!files || files.length === 0) {
                this.onError(ERRORS.FILE_NOT_FOUND);
                return;
            }

            files.forEach(async (file) => {
                let content = file.content;

                try {
                    const oldPrivateKey = await KeyImporter.importPrivateKey(this.oldPrivateKey);
                    const newPublicKey = await KeyImporter.importPublicKey(this.newPublicKey);

                    this.crypt('reencrypt', null, null, null, content, {
                        isFirstChunk: true,
                        oldPrivateKey,
                        newPublicKey
                    });
                } catch (error) {
                    this.onError(ERRORS.REENCRYPTION_ERROR);
                }
            });
        });
    }

    onProgress(progress) {
        return false;
    }

    onChunkCrypted(chunk) {
        const meta = Object.assign({}, this.fileMeta);

        /* eslint handle-callback-err: 0 */
        this.ipfs.files.add(Buffer.from(chunk.chunk), async (err, files) => {
            meta.chunks[0] = files[0].hash;

            const decryptedSymmetricKey = await KeyEncryptor.decryptSymmetricKey(meta.symmetricKey, this.oldPrivateKey);
            meta.symmetricKey = await KeyEncryptor.encryptSymmetricKey(decryptedSymmetricKey, this.newPublicKey);

            this.ipfs.files.add(Buffer.from(JSON.stringify(meta)), (err, files) => {
                if (err) {
                    this.onError(err);
                    return this.terminate();
                }
                this.emit('finish', files[0].hash);
                this.emit('progress', 1);
            });
        });
    }
}

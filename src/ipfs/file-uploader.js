import { ProgressCrypto } from '../crypto/progress-crypto';
import { Buffer } from 'buffer';
import { ERRORS } from '../errors';
import { KeyGenerator } from '../crypto/key-generator';

export class FileUploader extends ProgressCrypto {
    constructor(ipfs) {
        super();
        this.ipfs = ipfs;
    }

    /**
     * Encrypts and uploads file using symmetric and public keys
     * @param {Object} symmetricKey - Symmetric key in JWK (JSON Web Key) format to encrypt first chunk of file with AES-CBC algorithm
     * @param {Object} publicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
     * @param {File} file - file to upload
     * @returns {FileUploader}
     */
    upload(symmetricKey, publicKey, file) {
        this.isUploadFinished = false;
        this.file = file;

        if (!file) {
            this.onError(ERRORS.FILE_NOT_SPECIFIED);
            return this;
        }

        this.initializationVector = KeyGenerator.generateInitializationVector();

        this.crypt('encrypt', symmetricKey, this.initializationVector, publicKey, file);

        return this;
    }

    onChunkCrypted(chunk) {
        super.onChunkCrypted(chunk);

        this.ipfs.files.add(Buffer.from(chunk.chunk), (err, files) => {
            if (err) {
                this.onError(err);
                return this.terminate();
            }

            this.chunks[chunk.number] = files[0].hash;

            if (this.isAllChunksAreSent()) {
                this.finishUpload();
            }
        });
    }

    isAllChunksAreSent() {
        if (!this.isFinished) {
            return false;
        }

        for (let i = 0; i <= this.maxChunkNumber; i++) {
            if (typeof this.chunks[i] === 'undefined') {
                return false;
            }
        }

        return true;
    }

    finishUpload() {
        if (this.isUploadFinished) {
            return;
        }

        const meta = {
            initializationVector: this.initializationVector,
            name: this.file.name,
            size: this.file.size,
            chunks: this.chunks
        };

        this.isUploadFinished = true;
        this.ipfs.files.add(Buffer.from(JSON.stringify(meta)), (err, files) => {
            if (!err) {
                this.emit('finish', files[0].hash);
            }
        });
    }
}

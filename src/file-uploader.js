import { ProgressCrypto } from './progress-crypto';
import { Buffer } from 'buffer';
import { ERRORS } from './errors';
import { KeyGenerator } from './key-generator';

export class FileUploader extends ProgressCrypto {
    constructor(ipfs) {
        super();
        this.ipfs = ipfs;
    }

    async upload(symmetricKey, publicKey, file) {
        this.isUploadFinished = false;
        this.file = file;

        if (!file) {
            return this.emit('error', ERRORS.FILE_NOT_SPECIFIED);
        }

        this.initializationVector = KeyGenerator.generateInitializationVector();

        this.crypt('encrypt', symmetricKey, this.initializationVector, publicKey, file);
    }

    onChunkCrypted(chunk) {
        super.onChunkCrypted(chunk);

        this.ipfs.files.add(Buffer.from(chunk.chunk), (err, files) => {
            if (err) {
                this.emit('error', err);
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
            if (typeof(this.chunks[i]) === 'undefined') {
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
            this.emit('finish', files[0].hash);
            this.emit('progress', 1);
        });
    }
}

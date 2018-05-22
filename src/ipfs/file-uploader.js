import { ProgressCrypto } from '../crypto/progress-crypto';
import { Buffer } from 'buffer';
import { ERRORS } from '../errors';
import { KeyGenerator } from '../crypto/key-generator';
import { KeyEncryptor } from '../crypto/key-encryptor';

export class FileUploader extends ProgressCrypto {
    constructor(ipfs) {
        super();
        this.ipfs = ipfs;
    }

    /**
     * Data collection location
     * @typedef {Object} DataLocation
     * @property {boolean} global - It specifies if data is global (if it is set to true, other fields should be omitted)
     * @property {Array<string>} countries - List of countries
     * @property {Array<string>} regions - List of regions
     * @property {Array<string>} cities - List of cities
     */

    /**
     * File Attachment
     * @typedef {Object} Attachment
     * @property {string} title - Title
     * @property {string} fileHash - File hash
     */

    /**
     * File meta data object
     * @typedef {Object} FileMetaData
     * @property {string} title - Title of the file
     * @property {string} shortDescription - Short description of the file - up to 256 characters
     * @property {string} fullDescription - Short description of the file - no length limit
     * @property {PurchaseType} type - Possible type of purchase
     * @property {DataLocation} location - Locations where data is collected
     * @property {Array<string>} category - File categories
     * @property {number} maxNumberOfDownloads - Maximum numbers of downloads (-1 means unlimited downloads number)
     * @property {Array<BuyerType>} buyerType - Possible buyer types
     * @property {number} price - Price for file in smallest token unit
     * @property {TermOfUse | string} termsOfUseType - Type of terms of use (could be defined by user)
     * @property {Attachment} apiDocumentation
     * @property {Attachment} otherDocumentation
     * @property {Attachment} sampleFile
     * @property {Attachment} useCaseDocumentation
     */

    /**
     * Encrypts and uploads file using symmetric and public keys
     * @param {Object} publicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
     * @param {File} file - file to upload
     * @param {FileMetaData} metaData - meta data object
     * @returns {FileUploader}
     */
    upload(publicKey, file, metaData = {}) {
        this.isUploadFinished = false;
        this.file = file;
        this.metaData = metaData;

        if (!file) {
            this.onError(ERRORS.FILE_NOT_SPECIFIED);
            return this;
        }

        this.initializationVector = KeyGenerator.generateInitializationVector();
        this.publicKey = publicKey;
        this.file = file;
        this.startEncryption();

        return this;
    }

    async startEncryption() {
        this.symmetricKey = await KeyGenerator.generateSymmetricKey();
        this.crypt('encrypt', this.symmetricKey, this.initializationVector, this.publicKey, this.file);
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

    async finishUpload() {
        if (this.isUploadFinished) {
            return;
        }

        const meta = Object.assign(this.metaData, {
            initializationVector: this.initializationVector,
            name: this.file.name,
            size: this.file.size,
            chunks: this.chunks,
            symmetricKey: await KeyEncryptor.encryptSymmetricKey(this.symmetricKey, this.publicKey)
        });

        this.isUploadFinished = true;
        this.ipfs.files.add(Buffer.from(JSON.stringify(meta)), (err, files) => {
            if (!err) {
                this.emit('progress', 1);
                this.emit('finish', files[0].hash);
            }
        });
    }
}

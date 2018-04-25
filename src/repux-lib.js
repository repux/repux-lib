import { FileUploader } from './file-uploader';
import { FileReencryptor } from './file-reencryptor';
import { FileDownloader } from './file-downloader';
import packageConfig from '../package';
import { KeyGenerator } from './key-generator';

/**
 * RepuxLib
 */
class RepuxLib {

    /**
     * @param {IpfsAPI} ipfs - IpfsAPI instance
     */
    constructor(ipfs) {
        this._ipfs = ipfs;
    }

    /**
     * Return API version
     * @returns {string} API version
     */
    static getVersion() {
        return packageConfig.version;
    }

    /**
     * Uploads and encrypts file
     * @param {Object} symmetricKey - Symmetric key in JWK (JSON Web Key) format to encrypt first chunk of file with AES-CBC algorithm
     * @param {Object} publicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
     * @param {File} file - file to upload
     * @returns {FileUploader}
     */
    uploadFile(symmetricKey, publicKey, file) {
        const fileUploader = new FileUploader(this._ipfs);
        fileUploader.upload(symmetricKey, publicKey, file);

        return fileUploader;
    }

    /**
     * Reencrypts file
     * @param {Object} oldPrivateKey - Public key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
     * @param {Object} newPublicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
     * @param ipfsHash - IPFS hash to meta file
     * @returns {FileReencryptor}
     */
    reencryptFile(oldPrivateKey, newPublicKey, ipfsHash) {
        const fileReencryptor = new FileReencryptor(this._ipfs);
        fileReencryptor.reencrypt(oldPrivateKey, newPublicKey, ipfsHash);

        return fileReencryptor;
    }

    /**
     * Downloads and decrypts file
     * @param {Object} symmetricKey - Symmetric key in JWK (JSON Web Key) format to decrypt first chunk of file with AES-CBC algorithm
     * @param {Object} privateKey - Public key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
     * @param ipfsHash - IPFS hash to meta file
     * @returns {FileDownloader}
     */
    downloadFile(symmetricKey, privateKey, ipfsHash) {
        const fileDownloader = new FileDownloader(this._ipfs);
        fileDownloader.download(symmetricKey, privateKey, ipfsHash);

        return fileDownloader;
    }

    /**
     * Generates key for symmetric encryption/decryption
     * @returns {Promise<Object>}
     */
    static generateSymmetricKey() {
        return KeyGenerator.generateSymmetricKey();
    }

    /**
     * Generates keys for asymmetric encryption/decryption
     * @returns {Promise<Object>}
     */
    static generateAsymmetricKeyPair() {
        return KeyGenerator.generateAsymmetricKeyPair();
    }
}

export {
    RepuxLib
}

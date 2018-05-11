import { FileUploader } from './ipfs/file-uploader';
import { FileReencryptor } from './ipfs/file-reencryptor';
import { FileDownloader } from './ipfs/file-downloader';
import { KeyGenerator } from './crypto/key-generator';
import { KeyEncryptor } from './crypto/key-encryptor';
import { FileSize } from './file-handling/file-size';
import packageConfig from '../package';

/**
 * RepuxLib
 */
export default class RepuxLib {
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
     * Returns maximum file size in bytes
     * @returns {number}
     */
    static getMaxFileSize() {
        return FileSize.getMaxFileSize();
    }

    /**
     * Creates FileUploader instance
     * @returns {FileUploader}
     */
    createFileUploader() {
        return new FileUploader(this._ipfs);
    }

    /**
     * Creates FileReencryptor instance
     * @returns {FileReencryptor}
     */
    createFileReencryptor() {
        return new FileReencryptor(this._ipfs);
    }

    /**
     * Creates FileDownloader instance
     * @returns {FileDownloader}
     */
    createFileDownloader() {
        return new FileDownloader(this._ipfs);
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

    /**
     * Encrypts symmetric key using public key
     * @param symmetricKey - Symmetric key in JWK (JSON Web Key) format to AES-CBC algorithm
     * @param publicKey - Public key in JWK (JSON Web Key) format to RSA-OAEP algorithm
     * @returns {Promise<*>}
     */
    static encryptSymmetricKey(symmetricKey, publicKey) {
        return KeyEncryptor.encryptSymmetricKey(symmetricKey, publicKey);
    }

    /**
     * Decrypts encrypted symmetric key using public key
     * @param encryptedSymmetricKey - Encrypted symmetric key in JWK (JSON Web Key) format to AES-CBC algorithm
     * @param privateKey - Private key in JWK (JSON Web Key) format to RSA-OAEP algorithm
     * @returns {Promise<*>}
     */
    static decryptSymmetricKey(encryptedSymmetricKey, privateKey) {
        return KeyEncryptor.decryptSymmetricKey(encryptedSymmetricKey, privateKey);
    }
}

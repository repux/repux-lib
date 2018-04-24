import { FileUploader } from './file-uploader';
import { FileDownloader } from './file-downloader';
import packageConfig from '../package';

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
     * @param {string} password - Password to encrypt file with AES-CBC algorithm
     * @param {Object} publicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
     * @param {File} file - file to upload
     * @returns {FileUploader}
     */
    uploadFile(password, publicKey, file) {
        const fileUploader = new FileUploader(this._ipfs);
        fileUploader.upload(password, publicKey, file);

        return fileUploader;
    }

    /**
     * Downloads and decrypts file
     * @param {string} password - Password to decrypt file with AES-CBC algorithm
     * @param {Object} privateKey - Public key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
     * @param ipfsHash - IPFS hash to meta file
     * @returns {FileDownloader}
     */
    downloadFile(password, privateKey, ipfsHash) {
        const fileDownloader = new FileDownloader(this._ipfs);
        fileDownloader.download(password, privateKey, ipfsHash);

        return fileDownloader;
    }
}

export {
    RepuxLib
}

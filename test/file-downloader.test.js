import assert from 'assert';
import RepuxLib from '../src/repux-lib';
import IpfsAPI from 'ipfs-api';
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL, FILE_CONTENT, FILE_NAME } from './config';
import { fetchBlobContents } from './helpers/fetch-blob-contents';
import { ERRORS } from '../src/errors';

describe('File downloader should download and decrypt data only with proper keys', function () {
    this.timeout(90000);
    let file, largeFileContent, repux, fileHash, asymmetricKeys, symmetricKey;

    before(function() {

        return new Promise(async resolve => {
            largeFileContent = '';

            for (let i = 0; i < 1000; i++) {
                largeFileContent += FILE_CONTENT;
            }

            file = new File([ new Blob([ largeFileContent ]) ], FILE_NAME);

            repux = new RepuxLib(new IpfsAPI({
                host: IPFS_HOST,
                port: IPFS_PORT,
                protocol: IPFS_PROTOCOL
            }));

            asymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();
            symmetricKey = await RepuxLib.generateSymmetricKey();

            const fileUploader = repux.uploadFile(symmetricKey, asymmetricKeys.publicKey, file);
            fileUploader.subscribe('finish', function (eventType, metaFileHash) {
                fileHash = metaFileHash;
                resolve();
            });
        });
    });

    describe('User should be able to download file using proper fileMetaHash, symmetricKey and privateKey', function () {
        it('should emit progress for each chunk and content should be equal to original content', function (done) {
            const fileDownloader = repux.downloadFile(symmetricKey, asymmetricKeys.privateKey, fileHash);

            let progressCallCounter = 0;
            fileDownloader.subscribe('progress', function (eventType, progress) {
                progressCallCounter++;

                if (progress === 1) {
                    assert.equal(progressCallCounter, 4);
                }
            });

            fileDownloader.subscribe('finish', async function (eventType, file) {
                const content = await fetchBlobContents(file.fileURL);
                console.log(content);
                console.log(largeFileContent);
                console.log(content.length, largeFileContent.length);
                assert.equal(content, largeFileContent);
                done();
            });
        });
    });

    describe('User shouldn\'t be able to download file while he provide improper asymmetricKey', function () {
        it('should emit error when asymmetric key is improper', async function (done) {
            const tempAsymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();
            const fileDownloader = repux.downloadFile(symmetricKey, tempAsymmetricKeys.privateKey, fileHash);

            fileDownloader.subscribe('error', async function (eventType, error) {
                assert.equal(error, ERRORS.DECRYPTION_ERROR);
                done();
            });
        });
    });

    describe('User shouldn\'t be able to download file while he provide broken asymmetricKey', function () {
        it('should emit error when asymmetric key is broken', async function (done) {
            const tempAsymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();
            tempAsymmetricKeys.privateKey.d += 'a';
            const fileDownloader = repux.downloadFile(symmetricKey, tempAsymmetricKeys.privateKey, fileHash);

            fileDownloader.subscribe('error', async function (eventType, error) {
                assert.equal(error, ERRORS.DECRYPTION_ERROR);
                done();
            });
        });
    });

    describe('User shouldn\'t be able to download file while he provide without asymmetricKey', function () {
        it('should emit error when asymmetric key isn\'t present', async function (done) {
            const fileDownloader = repux.downloadFile(symmetricKey, null, fileHash);

            fileDownloader.subscribe('error', async function (eventType, error) {
                assert.equal(error, ERRORS.DECRYPTION_ERROR);
                done();
            });
        });
    });

    describe('User shouldn\'t be able to download file while he provide improper symmetricKey', function () {
        it('should emit error when symmetric key is improper', async function (done) {
            const tempSymmetricKey = await RepuxLib.generateSymmetricKey();
            const fileDownloader = repux.downloadFile(tempSymmetricKey, asymmetricKeys.privateKey, fileHash);

            fileDownloader.subscribe('error', async function (eventType, error) {
                assert.equal(error, ERRORS.DECRYPTION_ERROR);
                done();
            });
        });
    });

    describe('User shouldn\'t be able to download file while he provide broken symmetricKey', function () {
        it('should emit error when symmetric key is broken', async function (done) {
            const tempSymmetricKey = await RepuxLib.generateSymmetricKey();
            tempSymmetricKey.n += 'a';
            const fileDownloader = repux.downloadFile(tempSymmetricKey, asymmetricKeys.privateKey, fileHash);

            fileDownloader.subscribe('error', async function (eventType, error) {
                assert.equal(error, ERRORS.DECRYPTION_ERROR);
                done();
            });
        });
    });

    describe('User shouldn\'t be able to download file while he provide without symmetricKey', function () {
        it('should emit error when symmetric key isn\'t present', async function (done) {
            const fileDownloader = repux.downloadFile(null, asymmetricKeys.privateKey, fileHash);

            fileDownloader.subscribe('error', async function (eventType, error) {
                assert.equal(error, ERRORS.DECRYPTION_ERROR);
                done();
            });
        });
    });

    describe('User shouldn\'t be able to download file while he provide improper fileHash', function () {
        it('should emit error when file hash is improper', async function (done) {
            const fileDownloader = repux.downloadFile(symmetricKey, asymmetricKeys.privateKey, 'INCORRECT_FILE_HASH');

            fileDownloader.subscribe('error', async function (eventType, error) {
                assert.equal(error, ERRORS.FILE_NOT_FOUND);
                done();
            });
        });
    });

    describe('User shouldn\'t be able to download file while he provide without fileHash', function () {
        it('should emit error when file hash isn\'t present', async function (done) {
            const fileDownloader = repux.downloadFile(symmetricKey, asymmetricKeys.privateKey, null);

            fileDownloader.subscribe('error', async function (eventType, error) {
                assert.equal(error, ERRORS.FILE_NOT_FOUND);
                done();
            });
        });
    });
});

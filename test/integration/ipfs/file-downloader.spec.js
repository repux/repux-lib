/* global File, Blob */
import assert from 'assert';
import RepuxLib from '../../../src/repux-lib';
import IpfsAPI from 'ipfs-api';
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL, FILE_CONTENT, FILE_NAME } from '../config';
import { fetchBlobContents } from '../../helpers/fetch-blob-contents';
import { ERRORS } from '../../../src/errors';

describe('File downloader should download and decrypt data only with proper keys', function () {
    this.timeout(20000);
    let file, largeFileContent, repux, fileHash, asymmetricKeys, symmetricKey;

    before(() => {
        return new Promise(async resolve => {
            largeFileContent = '';

            for (let i = 0; i < 1000; i++) {
                largeFileContent += FILE_CONTENT;
            }

            file = new File([new Blob([largeFileContent])], FILE_NAME);

            repux = new RepuxLib(new IpfsAPI({
                host: IPFS_HOST,
                port: IPFS_PORT,
                protocol: IPFS_PROTOCOL
            }));

            asymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();
            symmetricKey = await RepuxLib.generateSymmetricKey();

            repux.createFileUploader()
                .upload(symmetricKey, asymmetricKeys.publicKey, file)
                .on('finish', (eventType, metaFileHash) => {
                    fileHash = metaFileHash;
                    console.log('resolve!!!');
                    resolve();
                });
        });
    });

    describe('User should be able to download file using proper fileMetaHash, symmetricKey and privateKey', function () {
        it('should emit progress for each chunk and content should be equal to original content', function (done) {
            let progressCallCounter = 0;

            repux.createFileDownloader()
                .download(symmetricKey, asymmetricKeys.privateKey, fileHash)
                .on('progress', (eventType, progress) => {
                    progressCallCounter++;

                    if (progress === 1) {
                        assert.equal(progressCallCounter, 4);
                    }
                })
                .on('finish', async (eventType, file) => {
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

            repux.createFileDownloader()
                .download(symmetricKey, tempAsymmetricKeys.privateKey, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.DECRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to download file while he provide broken asymmetricKey', function () {
        it('should emit error when asymmetric key is broken', async function (done) {
            const tempAsymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();
            tempAsymmetricKeys.privateKey.d += 'a';

            repux.createFileDownloader()
                .download(symmetricKey, tempAsymmetricKeys.privateKey, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.DECRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to download file without asymmetricKey', function () {
        it('should emit error when asymmetric key isn\'t present', function (done) {
            repux.createFileDownloader()
                .download(symmetricKey, null, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.DECRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to download file while he provide improper symmetricKey', function () {
        it('should emit error when symmetric key is improper', async function (done) {
            const tempSymmetricKey = await RepuxLib.generateSymmetricKey();
            repux.createFileDownloader()
                .download(tempSymmetricKey, asymmetricKeys.privateKey, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.DECRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to download file while he provide broken symmetricKey', function () {
        it('should emit error when symmetric key is broken', async function (done) {
            const tempSymmetricKey = await RepuxLib.generateSymmetricKey();
            tempSymmetricKey.n += 'a';
            repux.createFileDownloader()
                .download(tempSymmetricKey, asymmetricKeys.privateKey, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.DECRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to download file without symmetricKey', function () {
        it('should emit error when symmetric key isn\'t present', function (done) {
            repux.createFileDownloader()
                .download(null, asymmetricKeys.privateKey, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.DECRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to download file while he provide improper fileHash', function () {
        it('should emit error when file hash is improper', function (done) {
            repux.createFileDownloader()
                .download(symmetricKey, asymmetricKeys.privateKey, 'INCORRECT_FILE_HASH')
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.FILE_NOT_FOUND);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to download file without fileHash', function () {
        it('should emit error when file hash isn\'t present', function (done) {
            repux.createFileDownloader()
                .download(symmetricKey, asymmetricKeys.privateKey, null)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.FILE_NOT_FOUND);
                    done();
                });
        });
    });
});

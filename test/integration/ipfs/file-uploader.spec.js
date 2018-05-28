/* global Blob, File */
import assert from 'assert';
import RepuxLib from '../../../src/repux-lib';
import IpfsAPI from 'ipfs-api';
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL, FILE_CONTENT, FILE_NAME, IPFS_HASH_LENGTH } from '../config';
import { ERRORS } from '../../../src/errors';

describe('File uploader should upload and encrypt data only with proper keys', function () {
    this.timeout(90000);
    let file, largeFileContent, repux, asymmetricKeys;

    before(function () {
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
            resolve();
        });
    });

    describe('User should be able to upload file using proper File instance, symmetricKey and privateKey', function () {
        it('should emit progress for each chunk and content should be equal to original content', function (done) {
            let progressCallCounter = 0;
            repux.createFileUploader()
                .upload(asymmetricKeys.publicKey, file)
                .on('progress', (eventType, progress) => {
                    progressCallCounter++;

                    if (progress === 1) {
                        assert(progressCallCounter >= 10 && progressCallCounter <= 11);
                    }
                })
                .on('finish', (eventType, fileHash) => {
                    assert.equal(fileHash.length, IPFS_HASH_LENGTH);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to upload file while he provide broken asymmetricKey', function () {
        it('should emit error when asymmetric key is broken', async function (done) {
            const tempAsymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();
            tempAsymmetricKeys.publicKey.n += 'a';

            repux.createFileUploader()
                .upload(tempAsymmetricKeys.publicKey, file)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.ENCRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to upload file without asymmetricKey', function () {
        it('should emit error when asymmetric key isn\'t present', function (done) {
            repux.createFileUploader()
                .upload(null, file)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.ENCRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to upload file without File instance', function () {
        it('should emit error when file hash isn\'t present', function (done) {
            repux.createFileUploader()
                .upload(asymmetricKeys.publicKey, null)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.FILE_NOT_SPECIFIED);
                    done();
                });
        });
    });
});

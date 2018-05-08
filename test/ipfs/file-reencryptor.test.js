import assert from 'assert';
import RepuxLib from '../../src/repux-lib';
import IpfsAPI from 'ipfs-api';
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL, FILE_CONTENT, FILE_NAME, IPFS_HASH_LENGTH } from '../config';
import { ERRORS } from '../../src/errors';

describe('File re-encryptor should download first chunk, decrypt data and re-encrypt it only with proper keys', function () {
    this.timeout(90000);
    let file, largeFileContent, repux, fileHash, asymmetricKeys, newAsymmetricKeys, symmetricKey;

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
            newAsymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();
            symmetricKey = await RepuxLib.generateSymmetricKey();

            repux.createFileUploader()
                .upload(symmetricKey, asymmetricKeys.publicKey, file)
                .on('finish', (eventType, metaFileHash) => {
                    fileHash = metaFileHash;
                    resolve();
                });
        });
    });

    describe('User should be able to re-encrypt file using proper fileMetaHash, seller privateKey and buyer publicKey', function () {
        it('should emit progress for each chunk and content should be equal to original content', function (done) {
            let progressCallCounter = 0;

            repux.createFileReencryptor()
                .reencrypt(asymmetricKeys.privateKey, newAsymmetricKeys.publicKey, fileHash)
                .on('progress', (eventType, progress) => {
                    progressCallCounter++;

                    if (progress === 1) {
                        assert.equal(progressCallCounter, 2);
                    }
                }).on('finish', (eventType, reencryptedFileHash) => {
                    assert.notEqual(reencryptedFileHash, fileHash);
                    assert.equal(reencryptedFileHash.length, IPFS_HASH_LENGTH);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to re-encrypt file while he provide improper seller privateKey', function () {
        it('should emit error when asymmetric key is improper', async function (done) {
            const tempAsymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();

            repux.createFileReencryptor()
                .reencrypt(tempAsymmetricKeys.privateKey, newAsymmetricKeys.publicKey, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.REENCRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to re-encrypt file while he provide broken seller privateKey', function () {
        it('should emit error when asymmetric key is broken', async function (done) {
            const tempAsymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();
            tempAsymmetricKeys.privateKey.d += 'a';

            repux.createFileReencryptor()
                .reencrypt(tempAsymmetricKeys.privateKey, newAsymmetricKeys.publicKey, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.REENCRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to re-encrypt file without seller privateKey', function () {
        it('should emit error when asymmetric key isn\'t present', function (done) {
            repux.createFileReencryptor()
                .reencrypt(null, newAsymmetricKeys.publicKey, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.REENCRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to re-encrypt file while he provide broken buyer publicKey', function () {
        it('should emit error when asymmetric key is broken', async function (done) {
            const tempAsymmetricKeys = await RepuxLib.generateAsymmetricKeyPair();
            tempAsymmetricKeys.publicKey.n += 'a';

            repux.createFileReencryptor()
                .reencrypt(asymmetricKeys.privateKey, tempAsymmetricKeys.publicKey, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.REENCRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to re-encrypt file without buyer publicKey', function () {
        it('should emit error when asymmetric key isn\'t present', function (done) {
            repux.createFileReencryptor()
                .reencrypt(asymmetricKeys.privateKey, null, fileHash)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.REENCRYPTION_ERROR);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to re-encrypt file while he provide improper fileHash', function () {
        it('should emit error when file hash is improper', function (done) {
            repux.createFileReencryptor()
                .reencrypt(asymmetricKeys.privateKey, newAsymmetricKeys.publicKey, 'INCORRECT_FILE_HASH')
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.FILE_NOT_FOUND);
                    done();
                });
        });
    });

    describe('User shouldn\'t be able to re-encrypt file without fileHash', function () {
        it('should emit error when file hash isn\'t present', function (done) {
            repux.createFileReencryptor()
                .reencrypt(asymmetricKeys.privateKey, newAsymmetricKeys.publicKey, null)
                .on('error', (eventType, error) => {
                    assert.equal(error, ERRORS.FILE_NOT_FOUND);
                    done();
                });
        });
    });
});

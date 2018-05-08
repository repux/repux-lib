import assert from 'assert';
import RepuxLib from '../src/repux-lib';
import IpfsAPI from 'ipfs-api';
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL, FILE_CONTENT, FILE_NAME } from './config';
import { downloadBlob } from './helpers/download-blob';

const FILE = new File([ new Blob([FILE_CONTENT]) ], FILE_NAME);

describe('File can be uploaded and downloaded using encryption/decryption', function () {
    let uploadedFileHash, symmetricKey, encryptedSymmetricKey, asymmetricKeys1, asymmetricKeys2;
    const repux = new RepuxLib(new IpfsAPI({
        host: IPFS_HOST,
        port: IPFS_PORT,
        protocol: IPFS_PROTOCOL
    }));

    describe('RepuxLib.getVersion()', function () {
        it('should return actual version', function () {
            const version = RepuxLib.getVersion();
            console.log('version', version);
            assert.ok(typeof version === 'string');
        });
    });

    describe('RepuxLib.getMaxFileSize()', function () {
        it('should return maximum file size', async function () {
            const maxFileSize = await RepuxLib.getMaxFileSize();
            console.log('maxFileSize', maxFileSize);
            assert.ok(maxFileSize > 0);
        });
    });

    describe('RepuxLib.generateSymmetricKey()', function () {
        this.timeout(30000);

        it('should generate symmetric key', async function() {
            symmetricKey = await RepuxLib.generateSymmetricKey();
            console.log('symmetric key', symmetricKey);
            assert.ok(symmetricKey);
        });
    });

    describe('RepuxLib.generateAsymmetricKeysPair()', function () {
        this.timeout(30000);

        it('should generate asymmetric key', async function() {
            asymmetricKeys1 = await RepuxLib.generateAsymmetricKeyPair();
            asymmetricKeys2 = await RepuxLib.generateAsymmetricKeyPair();
            console.log('asymmetric keys 1', asymmetricKeys1);
            console.log('asymmetric keys 2', asymmetricKeys2);
            assert.ok(asymmetricKeys1);
        });
    });

    describe('RepuxLib.uploadFile()', function () {
        this.timeout(30000);

        it('should emit progress event and emit finish event with meta file hash', function (done) {
            const fileUploader = repux.createFileUploader();
            fileUploader.on('progress', (eventType, progress) => {
                console.log('progress', progress);
                assert.ok(progress);
            });

            fileUploader.on('finish', (eventType, metaFileHash) => {
                assert.ok(metaFileHash);
                console.log('metaFileHash', metaFileHash);
                uploadedFileHash = metaFileHash;
                done();
            });
            fileUploader.upload(symmetricKey, asymmetricKeys1.publicKey, FILE);
        });
    });

    describe('RepuxLib.reencryptFile()', function () {
        this.timeout(30000);

        it('should emit progress event and emit finish event with new meta file hash', function (done) {
            repux.createFileReencryptor()
                .reencrypt(asymmetricKeys1.privateKey, asymmetricKeys2.publicKey, uploadedFileHash)
                .on('finish', (eventType, metaFileHash) => {
                    assert.ok(metaFileHash);
                    console.log('metaFileHash', metaFileHash);
                    uploadedFileHash = metaFileHash;
                    done();
                });
        });
    });

    describe('RepuxLib.encryptSymmetricKey()', function () {
        this.timeout(30000);

        it('should encrypt symmetric key using buyer public key', async function (done) {
            encryptedSymmetricKey = await RepuxLib.encryptSymmetricKey(symmetricKey, asymmetricKeys2.publicKey);

            assert.ok(encryptedSymmetricKey);
            console.log('encryptedSymmetricKey', encryptedSymmetricKey);
            done();
        });
    });

    describe('RepuxLib.decryptSymmetricKey()', function () {
        this.timeout(30000);

        it('should decrypt encrypted symmetric key using buyer public key', async function (done) {
            const decryptedSymmetricKey = await RepuxLib.decryptSymmetricKey(encryptedSymmetricKey, asymmetricKeys2.privateKey);

            assert.equal(decryptedSymmetricKey.k, symmetricKey.k);
            assert.equal(decryptedSymmetricKey.alg, symmetricKey.alg);
            assert.equal(decryptedSymmetricKey.ext, symmetricKey.ext);
            assert.equal(decryptedSymmetricKey.key_ops[0], symmetricKey.key_ops[0]);
            assert.equal(decryptedSymmetricKey.key_ops[1], symmetricKey.key_ops[1]);
            assert.equal(decryptedSymmetricKey.kty, symmetricKey.kty);
            console.log('encryptedSymmetricKey', decryptedSymmetricKey);
            done();
        });
    });

    describe('RepuxLib.downloadFile()', function () {
        this.timeout(30000);

        it('should emit progress event and emit finish event with url to file', function (done) {
            repux.createFileDownloader()
                .download(symmetricKey, asymmetricKeys2.privateKey, uploadedFileHash)
                .on('progress', (eventType, progress) => {
                    console.log('progress', progress);
                    assert.ok(progress);
                }).on('finish', (eventType, result) => {
                    console.log('result', result);
                    assert.ok(result.fileURL);
                    assert.equal(result.fileName, FILE_NAME);

                    if (window) {
                        downloadBlob(result.fileURL, result.fileName);
                    }

                    done();
                });
        });
    });
});

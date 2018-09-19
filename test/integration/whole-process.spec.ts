import assert from 'assert';
import { AsymmetricKeyPair, RepuxLib, SymmetricKey } from '../../src';
import IpfsAPI, { IpfsFileHash } from 'ipfs-api';
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL, FILE_CONTENT, FILE_NAME } from './config';
import { downloadBlob } from '../helpers/download-blob';
import { EventType } from '../../src/types/event-type';
import { DownloadedFile } from '../../src/types/downloaded-file';

const FILE = new File([ new Blob([ FILE_CONTENT ]) ], FILE_NAME);

describe('File can be uploaded and downloaded using encryption/decryption', function () {
  let uploadedFileHash: IpfsFileHash;
  let symmetricKey: SymmetricKey;
  let encryptedSymmetricKey: string;
  let asymmetricKeys1: AsymmetricKeyPair;
  let asymmetricKeys2: AsymmetricKeyPair;

  const repux = new RepuxLib(new IpfsAPI({
    host: IPFS_HOST,
    port: IPFS_PORT,
    protocol: IPFS_PROTOCOL
  }));

  describe('RepuxLib.getVersion()', function () {
    it('should return actual version', function () {
      const version = repux.getVersion();
      console.log('version', version);
      assert.ok(typeof version === 'string');
    });
  });

  describe('RepuxLib.getMaxFileSize()', function () {
    it('should return maximum file size', async function () {
      const maxFileSize = await repux.getMaxFileSize();
      console.log('maxFileSize', maxFileSize);
      assert.ok(maxFileSize > 0);
    });
  });

  describe('RepuxLib.generateSymmetricKey()', function () {
    this.timeout(30000);

    it('should generate symmetric key', async function () {
      symmetricKey = await repux.generateSymmetricKey();
      console.log('symmetric key', symmetricKey);
      assert.ok(symmetricKey);
    });
  });

  describe('RepuxLib.generateAsymmetricKeysPair()', function () {
    this.timeout(30000);

    it('should generate asymmetric key', async function () {
      asymmetricKeys1 = await repux.generateAsymmetricKeyPair();
      asymmetricKeys2 = await repux.generateAsymmetricKeyPair();
      console.log('asymmetric keys 1', asymmetricKeys1);
      console.log('asymmetric keys 2', asymmetricKeys2);
      assert.ok(asymmetricKeys1);
    });
  });

  describe('RepuxLib.uploadFile()', function () {
    this.timeout(30000);

    it('should emit progress event and emit finish event with meta file hash', function (done) {
      const fileUploader = repux.createFileUploader();
      fileUploader.on(EventType.PROGRESS, (_eventType: EventType, progress: number) => {
        console.log('progress', progress);
        assert.ok(progress !== null);
      });

      fileUploader.on(EventType.FINISH, (_eventType: EventType, metaFileHash: IpfsFileHash) => {
        assert.ok(metaFileHash);
        console.log('metaFileHash', metaFileHash);
        uploadedFileHash = metaFileHash;
        done();
      });
      fileUploader.upload(asymmetricKeys1.publicKey, FILE);
    });
  });

  describe('RepuxLib.reencryptFile()', function () {
    this.timeout(30000);

    it('should emit progress event and emit finish event with new meta file hash', function (done) {
      repux.createFileReencryptor()
        .reencrypt(asymmetricKeys1.privateKey, asymmetricKeys2.publicKey, uploadedFileHash)
        .on(EventType.FINISH, (_eventType: EventType, metaFileHash: IpfsFileHash) => {
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
      encryptedSymmetricKey = await repux.encryptSymmetricKey(symmetricKey, asymmetricKeys2.publicKey);

      assert.ok(encryptedSymmetricKey);
      console.log('encryptedSymmetricKey', encryptedSymmetricKey);
      done();
    });
  });

  describe('RepuxLib.decryptSymmetricKey()', function () {
    this.timeout(30000);

    it('should decrypt encrypted symmetric key using buyer public key', async function (done) {
      const decryptedSymmetricKey = await repux.decryptSymmetricKey(encryptedSymmetricKey, asymmetricKeys2.privateKey);

      assert.strictEqual(decryptedSymmetricKey.k, symmetricKey.k);
      assert.strictEqual(decryptedSymmetricKey.alg, symmetricKey.alg);
      assert.strictEqual(decryptedSymmetricKey.ext, symmetricKey.ext);
      assert.notStrictEqual(typeof decryptedSymmetricKey.key_ops, 'undefined');
      assert.notStrictEqual(typeof symmetricKey.key_ops, 'undefined');
      if (decryptedSymmetricKey.key_ops && symmetricKey.key_ops) {
        assert.strictEqual(decryptedSymmetricKey.key_ops[ 0 ], symmetricKey.key_ops[ 0 ]);
        assert.strictEqual(decryptedSymmetricKey.key_ops[ 1 ], symmetricKey.key_ops[ 1 ]);
      }
      assert.strictEqual(decryptedSymmetricKey.kty, symmetricKey.kty);
      console.log('encryptedSymmetricKey', decryptedSymmetricKey);
      done();
    });
  });

  describe('RepuxLib.downloadFile()', function () {
    this.timeout(30000);

    it('should emit progress event and emit finish event with url to file', function (done) {
      repux.createFileDownloader()
        .download(asymmetricKeys2.privateKey, uploadedFileHash)
        .on(EventType.PROGRESS, (_eventType: EventType, progress: number) => {
          console.log('progress', progress);
          assert.ok(progress);
        })
        .on(EventType.FINISH, (_eventType: EventType, result: DownloadedFile) => {
          console.log('result', result);
          assert.ok(result.fileURL);
          assert.strictEqual(result.fileName, FILE_NAME);

          if (window) {
            downloadBlob(result.fileURL, result.fileName);
          }

          done();
        });
    });
  });
});

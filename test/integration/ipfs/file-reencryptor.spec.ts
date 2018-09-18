import assert from 'assert';
import { AsymmetricKeyPair, RepuxLib } from '../../../src';
import IpfsAPI, { IpfsFileHash } from 'ipfs-api';
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL, FILE_CONTENT, FILE_NAME, IPFS_HASH_LENGTH } from '../config';
import { ErrorMessage } from '../../../src/error-message';
import { EventType } from '../../../src/types/event-type';

describe('File re-encryptor should download first chunk, decrypt data and re-encrypt it only with proper keys', function () {
  this.timeout(90000);
  let file: File;
  let largeFileContent: string;
  let repux: RepuxLib;
  let fileHash: IpfsFileHash;
  let asymmetricKeys: AsymmetricKeyPair;
  let newAsymmetricKeys: AsymmetricKeyPair;

  before(() => {
    return new Promise(async resolve => {
      largeFileContent = '';

      for (let i = 0; i < 1000000; i++) {
        largeFileContent += FILE_CONTENT;
      }

      file = new File([ new Blob([ largeFileContent ]) ], FILE_NAME);

      repux = new RepuxLib(new IpfsAPI({
        host: IPFS_HOST,
        port: IPFS_PORT,
        protocol: IPFS_PROTOCOL
      }));

      asymmetricKeys = await repux.generateAsymmetricKeyPair();
      newAsymmetricKeys = await repux.generateAsymmetricKeyPair();

      repux.createFileUploader()
        .upload(asymmetricKeys.publicKey, file)
        .on(EventType.FINISH, (_eventType: EventType, metaFileHash: IpfsFileHash) => {
          fileHash = metaFileHash;
          resolve();
        });
    });
  });

  describe('User should be able to re-encrypt file using proper fileMetaHash, seller privateKey and buyer publicKey', () => {
    it('should emit progress for each chunk and content should be equal to original content', (done) => {
      let progressCallCounter = 0;

      repux.createFileReencryptor()
        .reencrypt(asymmetricKeys.privateKey, newAsymmetricKeys.publicKey, fileHash)
        .on(EventType.PROGRESS, (_eventType: EventType, progress: number) => {
          progressCallCounter++;

          if (progress === 1) {
            assert.strictEqual(progressCallCounter, 2);
          }
        })
        .on(EventType.FINISH, (_eventType: EventType, reencryptedFileHash: IpfsFileHash) => {
          assert.notStrictEqual(reencryptedFileHash, fileHash);
          assert.strictEqual(reencryptedFileHash.length, IPFS_HASH_LENGTH);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to re-encrypt file while he provide improper seller privateKey', () => {
    it('should emit error when asymmetric key is improper', async (done) => {
      const tempAsymmetricKeys = await repux.generateAsymmetricKeyPair();

      repux.createFileReencryptor()
        .reencrypt(tempAsymmetricKeys.privateKey, newAsymmetricKeys.publicKey, fileHash)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.REENCRYPTION_ERROR);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to re-encrypt file while he provide broken seller privateKey', () => {
    it('should emit error when asymmetric key is broken', async (done) => {
      const tempAsymmetricKeys = await repux.generateAsymmetricKeyPair();
      tempAsymmetricKeys.privateKey.d += 'a';

      repux.createFileReencryptor()
        .reencrypt(tempAsymmetricKeys.privateKey, newAsymmetricKeys.publicKey, fileHash)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.REENCRYPTION_ERROR);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to re-encrypt file without seller privateKey', () => {
    it('should emit error when asymmetric key isn\'t present', (done) => {
      repux.createFileReencryptor()
        .reencrypt(<any> null, newAsymmetricKeys.publicKey, fileHash)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.REENCRYPTION_ERROR);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to re-encrypt file while he provide broken buyer publicKey', () => {
    it('should emit error when asymmetric key is broken', async (done) => {
      const tempAsymmetricKeys = await repux.generateAsymmetricKeyPair();
      tempAsymmetricKeys.publicKey.n += 'a';

      repux.createFileReencryptor()
        .reencrypt(asymmetricKeys.privateKey, tempAsymmetricKeys.publicKey, fileHash)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.REENCRYPTION_ERROR);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to re-encrypt file without buyer publicKey', () => {
    it('should emit error when asymmetric key isn\'t present', (done) => {
      repux.createFileReencryptor()
        .reencrypt(asymmetricKeys.privateKey, <any> null, fileHash)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.REENCRYPTION_ERROR);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to re-encrypt file while he provide improper fileHash', () => {
    it('should emit error when file hash is improper', (done) => {
      repux.createFileReencryptor()
        .reencrypt(asymmetricKeys.privateKey, newAsymmetricKeys.publicKey, 'INCORRECT_FILE_HASH')
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.FILE_NOT_FOUND);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to re-encrypt file without fileHash', () => {
    it('should emit error when file hash isn\'t present', (done) => {
      repux.createFileReencryptor()
        .reencrypt(asymmetricKeys.privateKey, newAsymmetricKeys.publicKey, <any> null)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.FILE_NOT_FOUND);
          done();
        });
    });
  });
});

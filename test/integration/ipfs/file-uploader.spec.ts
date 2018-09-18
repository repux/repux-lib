import assert from 'assert';
import { AsymmetricKeyPair, RepuxLib } from '../../../src';
import IpfsAPI from 'ipfs-api';
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL, FILE_CONTENT, FILE_NAME, IPFS_HASH_LENGTH } from '../config';
import { ErrorMessage } from '../../../src/error-message';
import { EventType } from '../../../src/types/event-type';

describe('File uploader should upload and encrypt data only with proper keys', function () {
  this.timeout(90000);
  let file: File;
  let largeFileContent: string;
  let repux: RepuxLib;
  let asymmetricKeys: AsymmetricKeyPair;

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
      resolve();
    });
  });

  describe('User should be able to upload file using proper File instance, symmetricKey and privateKey', () => {
    it('should emit progress for each chunk and content should be equal to original content', (done) => {
      let progressCallCounter = 0;
      repux.createFileUploader()
        .upload(asymmetricKeys.publicKey, file)
        .on(EventType.PROGRESS, (_eventType: EventType, progress: number) => {
          progressCallCounter++;

          if (progress === 1) {
            assert.strictEqual(progressCallCounter, 57);
          }
        })
        .on(EventType.FINISH, (_eventType: EventType, fileHash: string) => {
          assert.strictEqual(fileHash.length, IPFS_HASH_LENGTH);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to upload file while he provide broken asymmetricKey', () => {
    it('should emit error when asymmetric key is broken', async (done) => {
      const tempAsymmetricKeys = await repux.generateAsymmetricKeyPair();
      tempAsymmetricKeys.publicKey.n += 'a';

      repux.createFileUploader()
        .upload(tempAsymmetricKeys.publicKey, file)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.ENCRYPTION_ERROR);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to upload file without asymmetricKey', () => {
    it('should emit error when asymmetric key isn\'t present', (done) => {
      repux.createFileUploader()
        .upload(<any> null, file)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.ENCRYPTION_ERROR);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to upload file without File instance', () => {
    it('should emit error when file hash isn\'t present', (done) => {
      repux.createFileUploader()
        .upload(asymmetricKeys.publicKey, <any> null)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.FILE_NOT_SPECIFIED);
          done();
        });
    });
  });
});

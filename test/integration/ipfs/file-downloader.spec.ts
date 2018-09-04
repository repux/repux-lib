import assert from 'assert';
import { AsymmetricKeyPair, RepuxLib } from '../../../src/repux-lib';
import IpfsAPI, { IpfsFileHash } from 'ipfs-api';
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL, FILE_CONTENT, FILE_NAME } from '../config';
import { fetchBlobContents } from '../../helpers/fetch-blob-contents';
import { ErrorMessage } from '../../../src/error-message';
import { EventType } from '../../../src/types/event-type';
import { DownloadedFile } from '../../../src/types/downloaded-file';

describe('File downloader should download and decrypt data only with proper keys', function () {
  this.timeout(20000);
  let file: File;
  let largeFileContent: string;
  let repux: RepuxLib;
  let fileHash: IpfsFileHash;
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

      repux.createFileUploader()
        .upload(asymmetricKeys.publicKey, file)
        .on(EventType.FINISH, (_eventType: EventType, metaFileHash: IpfsFileHash) => {
          fileHash = metaFileHash;
          resolve();
        });
    });
  });

  describe('User should be able to download file using proper fileMetaHash, symmetricKey and privateKey', () => {
    it('should emit progress for each chunk and content should be equal to original content', (done) => {
      let progressCallCounter = 0;

      repux.createFileDownloader()
        .download(asymmetricKeys.privateKey, fileHash)
        .on(EventType.PROGRESS, (_eventType: EventType, progress: number) => {
          progressCallCounter++;

          if (progress === 1) {
            assert.strictEqual(progressCallCounter, 28);
          }
        })
        .on(EventType.FINISH, async (_eventType: EventType, file: DownloadedFile) => {
          const content = await fetchBlobContents(file.fileURL);
          console.log(content);
          console.log(largeFileContent);
          console.log(content.length, largeFileContent.length);
          assert.strictEqual(content, largeFileContent);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to download file while he provide improper asymmetricKey', () => {
    it('should emit error when asymmetric key is improper', async (done) => {
      const tempAsymmetricKeys = await repux.generateAsymmetricKeyPair();

      repux.createFileDownloader()
        .download(tempAsymmetricKeys.privateKey, fileHash)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.DECRYPTION_ERROR);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to download file while he provide broken asymmetricKey', () => {
    it('should emit error when asymmetric key is broken', async (done) => {
      const tempAsymmetricKeys = await repux.generateAsymmetricKeyPair();
      tempAsymmetricKeys.privateKey.d += 'a';

      repux.createFileDownloader()
        .download(tempAsymmetricKeys.privateKey, fileHash)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.DECRYPTION_ERROR);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to download file without asymmetricKey', () => {
    it('should emit error when asymmetric key isn\'t present', (done) => {
      repux.createFileDownloader()
        .download(<any> null, fileHash)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.DECRYPTION_ERROR);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to download file while he provide improper fileHash', () => {
    it('should emit error when file hash is improper', (done) => {
      repux.createFileDownloader()
        .download(asymmetricKeys.privateKey, 'INCORRECT_FILE_HASH')
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.FILE_NOT_FOUND);
          done();
        });
    });
  });

  describe('User shouldn\'t be able to download file without fileHash', () => {
    it('should emit error when file hash isn\'t present', (done) => {
      repux.createFileDownloader()
        .download(asymmetricKeys.privateKey, <any> null)
        .on(EventType.ERROR, (_eventType: EventType, error: ErrorMessage) => {
          assert.strictEqual(error, ErrorMessage.FILE_NOT_FOUND);
          done();
        });
    });
  });
});

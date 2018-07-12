import { expect } from 'chai';
import { fake } from 'sinon';
import { ErrorMessage } from '../../../src/error-message';
import { FileSystemWriter } from '../../../src/file-handling/file-system-writer';
import { BlobWriter } from '../../../src/file-handling/blob-writer';
import { FileSize } from '../../../src/file-handling/file-size';
import { FileDownloader } from '../../../src/ipfs/file-downloader';
import IpfsApi, { FILE_HASHES, FILES } from '../../helpers/ipfs-api-mock';
import { EventType } from '../../../src/types/event-type';
import { KeyDecryptor } from '../../../src/crypto/key-decryptor';
import { KeyImporter } from '../../../src/crypto/key-importer';
import { Base64Decoder } from '../../../src/utils/base64-decoder';
import { UserAgent } from '../../../src/utils/user-agent';

describe('FileDownloader', () => {
  const ipfs = new IpfsApi();
  const textDecoder = new TextDecoder();
  const keyImporter = new KeyImporter();
  const base64Decoder = new Base64Decoder();
  const userAgent = new UserAgent();
  const fileSize = new FileSize(userAgent);
  const keyDecryptor = new KeyDecryptor(textDecoder, keyImporter, base64Decoder);

  const SYMMERTIC_KEY = 'SYMMETRIC_KEY';
  const PRIVATE_KEY = 'PRIVATE_KEY';

  function createFileDownloader() {
    return new FileDownloader(ipfs, keyDecryptor, fileSize, keyImporter);
  }

  describe('constructor()', () => {
    it('should expose ipfs', () => {
      const downloader = createFileDownloader();

      expect(downloader[ 'ipfs' ]).to.not.equal(undefined);
    });
  });

  describe('download()', () => {
    it('it should fetch meta file when user provide correct meta file hash and it should init fileWriter', () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);
      BlobWriter.isSupported = () => true;
      const downloader = createFileDownloader();
      const decryptSymmetricKey = fake.returns('DECRYPTED_KEY');
      downloader[ 'keyDecryptor' ].decryptSymmetricKey = decryptSymmetricKey;

      return new Promise(resolve => {
        downloader[ 'downloadFileChunks' ] = () => {
          // @ts-ignore
          expect(downloader[ 'fileChunks' ].length).to.equal(2);
          expect(downloader[ 'fileChunksNumber' ]).to.equal(2);
          expect(downloader[ 'isFirstChunk' ]).to.equal(true);
          expect(downloader[ 'vector' ]).to.deep.equal(new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]));
          expect(downloader[ 'fileWriter' ] instanceof BlobWriter).to.equal(true);
          expect(decryptSymmetricKey.called).to.equal(true);
          resolve();
        };

        downloader.download(<any> PRIVATE_KEY, <any> FILE_HASHES.META_FILE_HASH);
      });
    });

    it('should emit an error when user provide incorrect meta file hash', () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);
      BlobWriter.isSupported = () => true;
      const downloader = createFileDownloader();

      return new Promise(resolve => {
        downloader.download(<any> PRIVATE_KEY, <any> 'INCORRECT_FILE_HASH');
        downloader.on(EventType.ERROR, () => {
          resolve();
        });
      });
    });

    it('should emit an error when maximum file size is exceeded', () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);
      BlobWriter.isSupported = () => true;
      const decryptSymmetricKey = fake.returns('DECRYPTED_KEY');
      const downloader = createFileDownloader();
      downloader[ 'keyDecryptor' ].decryptSymmetricKey = decryptSymmetricKey;
      downloader[ 'fileSize' ].getMaxFileSize = () => Promise.resolve(1);

      return new Promise(resolve => {
        downloader.download(<any> PRIVATE_KEY, <any> FILE_HASHES.META_FILE_HASH);
        downloader.on(EventType.ERROR, (eventType, error) => {
          expect(error).to.equal(ErrorMessage.MAX_FILE_SIZE_EXCEEDED);
          resolve();
        });
      });
    });

    it('should emit an error when there is no supported file writers', () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);
      BlobWriter.isSupported = () => false;
      const decryptSymmetricKey = fake.returns('DECRYPTED_KEY');
      const downloader = createFileDownloader();
      downloader[ 'keyDecryptor' ].decryptSymmetricKey = decryptSymmetricKey;

      return new Promise(resolve => {
        downloader[ 'downloadFileChunks' ] = () => {
        };
        downloader.download(<any> PRIVATE_KEY, <any> FILE_HASHES.META_FILE_HASH);
        downloader.on(EventType.ERROR, (eventType, error) => {
          expect(error).to.equal(ErrorMessage.DOESNT_SUPPPORT_ANY_FILE_WRITER);
          resolve();
        });
      });
    });

    it('should emit an error caught from downloadFileChunks method', () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);
      BlobWriter.isSupported = () => true;
      const decryptSymmetricKey = fake.returns('DECRYPTED_KEY');
      const downloader = createFileDownloader();
      downloader[ 'keyDecryptor' ].decryptSymmetricKey = decryptSymmetricKey;
      downloader[ 'fileSize' ].getMaxFileSize = () => Promise.resolve(10000000);
      const ERROR = 'ERROR';

      return new Promise(resolve => {
        downloader[ 'downloadFileChunks' ] = () => {
          throw new Error(ERROR);
        };
        downloader.download(<any> PRIVATE_KEY, <any> FILE_HASHES.META_FILE_HASH);
        downloader.on(EventType.ERROR, (eventType, error) => {
          expect(error).to.equal(ERROR);
          resolve();
        });
      });
    });
  });

  describe('downloadFileChunks()', () => {
    it('should download first file chunk and decrypt it', () => {
      const downloader = createFileDownloader();

      downloader[ 'fileChunks' ] = [ 'FILE_CHUNK_0', 'FILE_CHUNK_1' ];
      downloader[ 'fileChunksNumber' ] = 2;
      downloader[ 'symmetricKey' ] = <any> SYMMERTIC_KEY;
      downloader[ 'privateKey' ] = <any> PRIVATE_KEY;
      downloader[ 'isFirstChunk' ] = true;

      // @ts-ignore
      downloader[ 'fileWriter' ] = {};

      // @ts-ignore
      downloader[ 'crypt' ] = (method, symmetricKey, vector, privateKey, content, options) => {
        expect(method).to.equal('decrypt');
        expect(symmetricKey).to.equal(SYMMERTIC_KEY);
        expect(privateKey).to.equal(PRIVATE_KEY);
        expect(content).to.equal(FILES[ FILE_HASHES.FILE_CHUNK_0 ].content);
        expect(options).to.deep.equal({ isFirstChunk: true });
      };

      downloader[ 'downloadFileChunks' ]();
    });

    it('should emit an error when chunk hash is incorrect', () => {
      const downloader = createFileDownloader();
      downloader[ 'fileChunks' ] = [ 'INCORRECT_FILE_HASH' ];
      downloader[ 'fileChunksNumber' ] = 1;
      downloader[ 'symmetricKey' ] = <any> SYMMERTIC_KEY;
      downloader[ 'privateKey' ] = <any> PRIVATE_KEY;
      downloader[ 'isFirstChunk' ] = true;

      // @ts-ignore
      downloader[ 'fileWriter' ] = {};

      return new Promise(resolve => {
        downloader[ 'downloadFileChunks' ]();
        downloader.on(EventType.ERROR, () => {
          resolve();
        });
      });
    });

    it('should emit finish event when fileChunks array is empty', () => {
      const downloader = createFileDownloader();
      const fileUrl = 'FILE_URL';
      const fileName = 'FILE_NAME';

      downloader[ 'fileChunks' ] = [];

      // @ts-ignore
      downloader[ 'fileWriter' ] = {
        getFileURL: () => {
          return fileUrl;
        },
        fileName
      };

      downloader[ 'downloadFileChunks' ]();

      return new Promise(resolve => {
        downloader.on(EventType.FINISH, (eventType, data) => {
          expect(data.fileURL).to.equal(fileUrl);
          expect(data.fileName).to.equal(fileName);
          resolve();
        });
      });
    });
  });

  describe('onProgress()', () => {
    it('should emit progress event', () => {
      const downloader = createFileDownloader();
      downloader[ 'fileChunks' ] = [ '2' ];
      downloader[ 'fileChunksNumber' ] = 3;

      return new Promise(resolve => {
        downloader.on(EventType.PROGRESS, (eventType, progress) => {
          expect(Math.round(progress * 100)).to.equal(40);
          resolve();
        });

        downloader[ 'onProgress' ](0.2);
      });
    });
  });

  describe('onChunkCrypted()', () => {
    it('should override vector value, write data, shift chunks array and call downloadFileChunks method', async () => {
      const vector = new Uint8Array([ 0, 0, 0 ]);
      const chunk = new Uint8Array([ 1, 2, 3 ]);
      const downloader = createFileDownloader();
      downloader[ 'fileChunks' ] = [ 'FILE_CHUNK_0', 'FILE_CHUNK_1' ];
      downloader[ 'isFirstChunk' ] = false;

      const write = fake();

      // @ts-ignore
      downloader[ 'fileWriter' ] = {
        write
      };

      await downloader[ 'onChunkCrypted' ]({ number: 1, vector, chunk });
      expect(write.called).to.equal(true);
    });

    it('should add chunk data to fistChunkData property instead of writing to file when isFirstChunk is true', async () => {
      const vector = new Uint8Array([ 0, 0, 0 ]);
      const chunk = new Uint8Array([ 1, 2, 3 ]);
      const downloader = createFileDownloader();
      downloader[ 'fileChunks' ] = [ 'FILE_CHUNK_0', 'FILE_CHUNK_1' ];
      downloader[ 'isFirstChunk' ] = true;

      const write = fake();

      // @ts-ignore
      downloader[ 'fileWriter' ] = {
        write
      };
      downloader[ 'downloadFileChunks' ] = () => {
      };

      await downloader[ 'onChunkCrypted' ]({ number: 1, vector, chunk });
      expect(downloader[ 'isFirstChunk' ]).to.equal(false);
      expect(downloader[ 'firstChunkData' ]).to.equal(chunk);
      expect(write.called).to.equal(false);
    });
  });
});

import { expect } from 'chai';
import { fake } from 'sinon';
import { ErrorMessage } from '../../../src/error-message';
import { FileUploader } from '../../../src/ipfs/file-uploader';
import IpfsApi, { FILE_HASHES } from '../../helpers/ipfs-api-mock';
import { mockCryptoGetRandomValues } from '../../helpers/crypto-get-random-values-mock';
import { KeyEncryptor } from '../../../src/crypto/key-encryptor';
import { Buffer } from 'buffer';
import { PurchaseType } from '../../../src/types/purchase-type';
import { EventType } from '../../../src/types/event-type';
import { KeyGenerator } from '../../../src/crypto/key-generator';
import { KeyImporter } from '../../../src/crypto/key-importer';
import { Base64Encoder } from '../../../src/utils/base64-encoder';

describe('FileUploader', () => {
  const ipfs = new IpfsApi();
  const keyGenerator = new KeyGenerator();
  const textEncoder = new TextEncoder();
  const keyImporter = new KeyImporter();
  const base64Encoder = new Base64Encoder();
  const keyEncryptor = new KeyEncryptor(textEncoder, keyImporter, base64Encoder);

  const PUBLIC_KEY = 'PUBLIC_KEY';
  const FILE = new File([ new Blob([ 'test' ]) ], 'test.txt');

  function createFileUploader() {
    return new FileUploader(ipfs, keyGenerator, keyEncryptor, keyImporter);
  }

  describe('constructor()', () => {
    it('should expose ipfs', () => {
      const uploader = createFileUploader();

      expect(uploader[ 'ipfs' ]).to.not.equal(undefined);
    });
  });

  describe('upload()', () => {
    it('it should emit error when user doesn\'t provide any file', () => {
      const uploader = createFileUploader();

      return new Promise(resolve => {
        uploader.upload(<any> PUBLIC_KEY, <any> null);
        uploader.on(EventType.ERROR, (_eventType, error) => {
          expect(error).to.equal(ErrorMessage.FILE_NOT_SPECIFIED);
          resolve();
        });
      });
    });

    it('should generate unique initializationVector', () => {
      mockCryptoGetRandomValues();
      const uploader = createFileUploader();
      uploader.upload(<any> PUBLIC_KEY, <any> FILE);
      const firstVector = uploader[ 'initializationVector' ];
      uploader.upload(<any> PUBLIC_KEY, <any> FILE);
      const secondVector = uploader[ 'initializationVector' ];

      expect(firstVector).to.not.equal(undefined);
      expect(secondVector).to.not.equal(undefined);

      if (firstVector && secondVector) {
        expect(firstVector.byteLength).to.equal(16);
        expect(secondVector.byteLength).to.equal(16);
      }
      expect(firstVector).not.to.equal(secondVector);
    });

    it('should call crypt method', () => {
      mockCryptoGetRandomValues();
      const uploader = createFileUploader();

      // @ts-ignore
      uploader[ 'crypt' ] = (method, symmetricKey, initializationVector, publicKey, file) => {
        expect(method).to.equal('encrypt');
        expect(initializationVector).to.equal(uploader[ 'initializationVector' ]);
        expect(publicKey).to.equal(PUBLIC_KEY);
        expect(file).to.equal(FILE);
      };
      uploader.upload(<any> PUBLIC_KEY, <any> FILE);
    });

    it('should assign metaData argument to metaData property', () => {
      const shortDescription = 'SHORT_DESCRIPTION';
      const fullDescription = 'FULL_DESCRIPTION';
      const metaData = {
        shortDescription,
        fullDescription
      };

      const uploader = createFileUploader();
      uploader.upload(<any> PUBLIC_KEY, <any> FILE, <any> metaData);

      expect(uploader[ 'metaData' ]).to.deep.equal(metaData);
    });
  });

  describe('onChunkCrypted', () => {
    const vector = new Uint8Array([ 0, 0, 0 ]);
    const chunk = new Uint8Array([ 1, 2, 3 ]);

    it('should upload chunk to IPFS', () => {
      const uploader = createFileUploader();
      const allChunksAreSentSinon = fake();
      const finishUploadSinon = fake();
      uploader[ 'chunks' ] = [];

      // @ts-ignore
      uploader.isAllChunksAreSent = () => {
        allChunksAreSentSinon();
      };

      // @ts-ignore
      uploader.finishUpload = () => {
        finishUploadSinon();
      };

      // @ts-ignore
      uploader.onChunkCrypted({ vector, chunk });

      expect(allChunksAreSentSinon.called).to.equal(true);
      expect(finishUploadSinon.called).to.equal(false);
    });

    it('should call finishUpload method when all chunks are sent', () => {
      const uploader = createFileUploader();
      const allChunksAreSentSinon = fake();
      const finishUploadSinon = fake();
      uploader[ 'chunks' ] = [];

      // @ts-ignore
      uploader.isAllChunksAreSent = () => {
        allChunksAreSentSinon();
        return true;
      };

      // @ts-ignore
      uploader.finishUpload = () => {
        finishUploadSinon();
      };

      // @ts-ignore
      uploader.onChunkCrypted({ vector, chunk });

      expect(allChunksAreSentSinon.called).to.equal(true);
      expect(finishUploadSinon.called).to.equal(true);
    });
  });

  describe('isAllChunksAreSent()', () => {
    it('should return true when all chunks upload is finished', () => {
      const uploader = createFileUploader();
      uploader[ 'chunks' ] = [ FILE_HASHES.FILE_CHUNK_0 ];
      uploader[ 'maxChunkNumber' ] = 0;
      uploader[ 'isFinished' ] = false;
      expect(uploader[ 'isAllChunksAreSent' ]()).to.equal(false);

      uploader[ 'isFinished' ] = true;
      expect(uploader[ 'isAllChunksAreSent' ]()).to.equal(true);

      uploader[ 'maxChunkNumber' ] = 1;
      expect(uploader[ 'isAllChunksAreSent' ]()).to.equal(false);

      uploader[ 'chunks' ].push(FILE_HASHES.FILE_CHUNK_1);
      expect(uploader[ 'isAllChunksAreSent' ]()).to.equal(true);
    });
  });

  describe('finishUpload()', () => {
    it('should upload meta file and emit finish event', () => {
      const initializationVector = 'INITIALIZATION_VECTOR';
      const fileName = 'FILE_NAME';
      const fileSize = 'FILE_SIZE';
      const fileChunks = [ FILE_HASHES.FILE_CHUNK_0, FILE_HASHES.FILE_CHUNK_1 ];
      const uploader = createFileUploader();
      const encryptSymmetricKey = fake.returns('ENCRYPTED_KEY');
      uploader[ 'keyEncryptor' ].encryptSymmetricKey = encryptSymmetricKey;

      // @ts-ignore
      uploader[ 'initializationVector' ] = initializationVector;
      uploader[ 'metaData' ] = {};
      uploader[ 'symmetricKey' ] = <any> 'SYMMETRIC_KEY';
      uploader[ 'publicKey' ] = <any> 'PUBLIC_KEY';

      // @ts-ignore
      uploader[ 'file' ] = {
        name: fileName,
        size: fileSize
      };
      uploader[ 'chunks' ] = fileChunks;

      return new Promise(async resolve => {
        uploader.on(EventType.FINISH, (_eventType, fileHash) => {
          expect(fileHash).to.equal(FILE_HASHES.NEW_IPFS_FILE);
          expect(encryptSymmetricKey.called).to.equal(true);
          resolve();
        });

        await uploader[ 'finishUpload' ]();
        expect(uploader[ 'isUploadFinished' ]).to.equal(true);
      });
    });

    it('should add additional meta data to meta file from metaData property', async () => {
      const shortDescription = 'SHORT_DESCRIPTION';
      const fullDescription = 'FULL_DESCRIPTION';
      const type = PurchaseType.ONE_TIME_PURCHASE;
      const initializationVector = 'INITIALIZATION_VECTOR';
      const fileName = 'FILE_NAME';
      const fileSize = 'FILE_SIZE';
      const fileChunks = [ FILE_HASHES.FILE_CHUNK_0, FILE_HASHES.FILE_CHUNK_1 ];
      const addSinon = fake();

      const uploader = new FileUploader(<any> {
        files: {
          add: (contentJson: any) => {
            const content = JSON.parse(contentJson);
            expect(content.initializationVector).to.equal(initializationVector);
            expect(content.name).to.equal(fileName);
            expect(content.size).to.equal(fileSize);
            expect(content.chunks).to.deep.equal(fileChunks);
            expect(content.shortDescription).to.equal(shortDescription);
            expect(content.fullDescription).to.equal(fullDescription);
            expect(content.type).to.equal(type);
            addSinon();
          }
        }
      }, keyGenerator, keyEncryptor, keyImporter);

      uploader[ 'keyEncryptor' ].encryptSymmetricKey = fake.returns('ENCRYPTED_KEY');

      Buffer.from = (string: any) => string;

      // @ts-ignore
      uploader[ 'initializationVector' ] = initializationVector;
      uploader[ 'metaData' ] = {
        shortDescription,
        fullDescription,
        type
      };
      uploader[ 'symmetricKey' ] = <any> 'SYMMETRIC_KEY';
      uploader[ 'publicKey' ] = <any> 'PUBLIC_KEY';

      // @ts-ignore
      uploader[ 'file' ] = {
        name: fileName,
        size: fileSize
      };
      uploader[ 'chunks' ] = fileChunks;

      await uploader[ 'finishUpload' ]();
      expect(addSinon.called).to.equal(true);
    });
  });
});

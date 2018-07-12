import { expect } from 'chai';
import { fake } from 'sinon';
import { Chunk, ProgressCrypto } from '../../../src/crypto/progress-crypto';
import { Observable } from '../../../src/utils/observable';
import { ErrorMessage } from '../../../src/error-message';
import { CryptoType } from '../../../src/types/crypto-type';
import { EventType } from '../../../src/types/event-type';
import { KeyImporter } from '../../../src/crypto/key-importer';

describe('ProgressCrypto', () => {
  const keyImporter = new KeyImporter();

  function createProgressCrypto() {
    return new ProgressCrypto(keyImporter);
  }

  describe('constructor()', () => {
    it('should extend Observable', async () => {
      const progressCrypto = createProgressCrypto();
      expect(progressCrypto instanceof ProgressCrypto).to.equal(true);
      expect(progressCrypto instanceof Observable).to.equal(true);
    });
  });

  describe('crypt()', () => {
    it('should call KeyImporter.importSymmetricKey when password is defined', () => {
      const password = 'PASSWORD';
      const progressCrypto = createProgressCrypto();
      const importSymmetricKeySinon = fake();

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importSymmetricKey = (key) => {
        expect(key).to.equal(password);
        importSymmetricKeySinon();
      };
      progressCrypto[ 'crypt' ](CryptoType.ENCRYPT, <any> password);
      expect(importSymmetricKeySinon.called).to.equal(true);
    });

    it('shouldn\'t call KeyImporter.importSymmetricKey when password isn\'t defined', () => {
      const progressCrypto = createProgressCrypto();
      const importSymmetricKeySinon = fake();

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importSymmetricKey = () => {
        importSymmetricKeySinon();
      };
      progressCrypto[ 'crypt' ](CryptoType.ENCRYPT);
      expect(importSymmetricKeySinon.called).to.equal(false);
    });

    it('should call KeyImporter.importPublicKey when asymmetricKey is definied and type is encrypt', () => {
      const progressCrypto = createProgressCrypto();
      const importPublicKeySinon = fake();
      const publicKey = 'PUBLIC_KEY';

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importPublicKey = (key) => {
        expect(key).to.equal(publicKey);
        importPublicKeySinon();
      };
      progressCrypto[ 'crypt' ](CryptoType.ENCRYPT, <any> null, <any> null, <any> publicKey);
      expect(importPublicKeySinon.called).to.equal(true);
    });

    it('shouldn\'t call KeyImporter.importPublicKey when asymmetricKey isn\'t defined', () => {
      const progressCrypto = createProgressCrypto();
      const importPublicKeySinon = fake();

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importSymmetricKey = () => {
        importPublicKeySinon();
      };
      progressCrypto[ 'crypt' ](CryptoType.ENCRYPT);
      expect(importPublicKeySinon.called).to.equal(false);
    });

    it('should call KeyImporter.importPrivateKey when asymmetricKey is definied and type is decrypt', () => {
      const progressCrypto = createProgressCrypto();
      const importPrivateKeySinon = fake();
      const privateKey = 'PRIVATE_KEY';

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importPrivateKey = (key) => {
        expect(key).to.equal(privateKey);
        importPrivateKeySinon();
      };
      progressCrypto[ 'crypt' ](CryptoType.DECRYPT, <any> null, <any> null, <any> privateKey);
      expect(importPrivateKeySinon.called).to.equal(true);
    });

    it('shouldn\'t call KeyImporter.importPublicKey when asymmetricKey isn\'t defined', () => {
      const progressCrypto = createProgressCrypto();
      const importPrivateKeySinon = fake();

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importPrivateKey = () => {
        importPrivateKeySinon();
      };
      progressCrypto[ 'crypt' ](CryptoType.DECRYPT);
      expect(importPrivateKeySinon.called).to.equal(false);
    });

    it('should assign result of getWorkerByType function to thread property and call send method on it', async () => {
      const fileContent = new Uint8Array([]);
      const cryptType = CryptoType.ENCRYPT;
      const password = 'PASSWORD';
      const publicKey = 'PUBLIC_KEY';
      const vector = new Uint8Array([ 0, 0, 0 ]);
      const progressCrypto = createProgressCrypto();
      const threadSendSinon = fake();

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importSymmetricKey = (key) => {
        return key + '_IMPORTED';
      };

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importPublicKey = (key) => {
        return key + '_IMPORTED';
      };

      ProgressCrypto.getWorkerByType = (type) => {
        expect(type).to.equal(cryptType);

        return {
          send: ([ file, passwordKey, initializationVector, asymmetricKeyObject, options ]: any[]) => {
            expect(file).to.equal(fileContent);
            expect(passwordKey).to.equal('PASSWORD_IMPORTED');
            expect(initializationVector).to.equal(vector);
            expect(asymmetricKeyObject).to.equal('PUBLIC_KEY_IMPORTED');
            expect(options).to.deep.equal({
              CHUNK_SIZE: 983040,
              FIRST_CHUNK_SIZE: 190,
              VECTOR_SIZE: 16,
              SYMMETRIC_ENCRYPTION_ALGORITHM: 'AES-CBC',
              ASYMMETRIC_ENCRYPTION_ALGORITHM: 'RSA-OAEP',
              ASYMMETRIC_ENCRYPTION_HASH: 'SHA-256',
              ENCRYPTION_ERROR: 'ENCRYPTION_ERROR',
              DECRYPTION_ERROR: 'DECRYPTION_ERROR',
              REENCRYPTION_ERROR: 'REENCRYPTION_ERROR',
              option1: '1'
            });
            threadSendSinon();
          },
          on: () => {
          },
          kill: () => {
          }
        };
      };

      await progressCrypto[ 'crypt' ](cryptType, <any> password, <any> vector, <any> publicKey, <any> fileContent, { option1: '1' });
      expect(threadSendSinon.called).to.equal(true);
    });

    it('should call onChunkCrypted when thread emits progress event with chunk', async () => {
      let progressCallback: any;
      const progressCrypto = createProgressCrypto();
      const onChunkCryptedSinon = fake();

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importSymmetricKey = (key) => {
        return key + '_IMPORTED';
      };

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importPublicKey = (key) => {
        return key + '_IMPORTED';
      };

      ProgressCrypto.getWorkerByType = () => {
        return {
          send: () => {
          },
          on: (eventName: string, callback: (data: any) => any) => {
            progressCallback = callback;
          },
          kill: () => {
          }
        };
      };

      progressCrypto[ 'onChunkCrypted' ] = (data) => {
        expect(data.chunk).to.equal('chunk');
        expect(data.number).to.equal(1);
        onChunkCryptedSinon();
      };

      await progressCrypto[ 'crypt' ](
        CryptoType.ENCRYPT,
        <any> 'password',
        <any> 'vector',
        <any> 'publicKey',
        <any> 'fileContent',
        { option1: '1' }
      );

      if (progressCallback) {
        progressCallback({
          chunk: 'chunk',
          number: 1
        });
      }

      expect(onChunkCryptedSinon.called).to.equal(true);
    });

    it('should call onProgress when thread emits progress event with progress', async () => {
      let progressCallback: any;
      const progressCrypto = createProgressCrypto();
      const onProgressSinon = fake();

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importSymmetricKey = (key) => {
        return key + '_IMPORTED';
      };

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importPublicKey = (key) => {
        return key + '_IMPORTED';
      };

      ProgressCrypto.getWorkerByType = () => {
        return {
          send: () => {
          },
          on: (eventName: string, callback: (data: any) => any) => {
            progressCallback = callback;
          },
          kill: () => {
          }
        };
      };

      progressCrypto[ 'onProgress' ] = (progress) => {
        expect(progress).to.equal(0.9);
        onProgressSinon();
      };

      await progressCrypto[ 'crypt' ](
        CryptoType.ENCRYPT,
        <any> 'password',
        <any> 'vector',
        <any> 'publicKey',
        <any> 'fileContent',
        { option1: '1' }
      );
      if (progressCallback) {
        progressCallback({
          progress: 0.9
        });
      }
      expect(onProgressSinon.called).to.equal(true);
    });

    it('should call thread.kill when thread emits progress event with progress equal to 1', async () => {
      let progressCallback: any;
      const progressCrypto = createProgressCrypto();
      const killSinon = fake();

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importSymmetricKey = (key) => {
        return key + '_IMPORTED';
      };

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importPublicKey = (key) => {
        return key + '_IMPORTED';
      };

      ProgressCrypto.getWorkerByType = () => {
        return {
          send: () => {
          },
          on: (eventName: string, callback: (data: any) => any) => {
            progressCallback = callback;
          },
          kill: () => {
            killSinon();
          }
        };
      };

      await progressCrypto[ 'crypt' ](
        CryptoType.ENCRYPT,
        <any> 'password',
        <any> 'vector',
        <any> 'publicKey',
        <any> 'fileContent',
        { option1: '1' }
      );
      if (progressCallback) {
        progressCallback({
          progress: 1
        });
      }
      expect(killSinon.called).to.equal(true);
    });

    it('should call onError when thread emits progress event with error', async () => {
      let progressCallback: any;
      const progressCrypto = createProgressCrypto();
      const onErrorSinon = fake();

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importSymmetricKey = (key) => {
        return key + '_IMPORTED';
      };

      // @ts-ignore
      progressCrypto[ 'keyImporter' ].importPublicKey = (key) => {
        return key + '_IMPORTED';
      };

      ProgressCrypto.getWorkerByType = () => {
        return {
          send: () => {
          },
          on: (eventName: string, callback: (data: any) => any) => {
            progressCallback = callback;
          },
          kill: () => {
          }
        };
      };

      progressCrypto[ 'onError' ] = (error: ErrorMessage) => {
        expect(error).to.equal('error');
        onErrorSinon();
      };

      await progressCrypto[ 'crypt' ](
        CryptoType.ENCRYPT,
        <any> 'password',
        <any> 'vector',
        <any> 'publicKey',
        <any> 'fileContent',
        { option1: '1' }
      );
      if (progressCallback) {
        progressCallback({
          error: 'error'
        });
      }
      expect(onErrorSinon.called).to.equal(true);
    });
  });

  describe('getErrorByType()', () => {
    it('should return general error by type', () => {
      expect(ProgressCrypto.getErrorByType(CryptoType.ENCRYPT)).to.equal(ErrorMessage.ENCRYPTION_ERROR);
      expect(ProgressCrypto.getErrorByType(CryptoType.DECRYPT)).to.equal(ErrorMessage.DECRYPTION_ERROR);
      expect(ProgressCrypto.getErrorByType(CryptoType.REENCRYPT)).to.equal(ErrorMessage.REENCRYPTION_ERROR);
    });
  });

  describe('terminate()', () => {
    it('should call kill on thread property', () => {
      const progressCrypto = createProgressCrypto();
      const thread = {
        kill: fake()
      };
      // @ts-ignore
      progressCrypto[ 'thread' ] = thread;
      progressCrypto.terminate();
      expect(thread.kill.called).to.equal(true);
    });
  });

  describe('onChunkCrypted', () => {
    it('should call emit with chunkCrypted eventType', () => {
      const progressCrypto = createProgressCrypto();
      const emitSinon = fake();
      const chunk: Chunk = {
        number: 0,
        chunk: new Uint8Array([])
      };

      // @ts-ignore
      progressCrypto[ 'emit' ] = (eventType, data) => {
        expect(eventType).to.equal(EventType.CHUNK_CRYPTED);
        expect(data).to.equal(chunk);
        emitSinon();
      };
      progressCrypto[ 'onChunkCrypted' ](chunk);
      expect(emitSinon.called).to.equal(true);
    });
  });

  describe('onProgress', () => {
    it('should call emit with progress eventType', () => {
      const progressCrypto = createProgressCrypto();
      const emitSinon = fake();

      // @ts-ignore
      progressCrypto[ 'emit' ] = (eventType, data) => {
        expect(eventType).to.equal(EventType.PROGRESS);
        expect(data).to.equal(0.99);
        emitSinon();
      };
      progressCrypto[ 'onProgress' ](0.99);
      expect(emitSinon.called).to.equal(true);
    });
  });

  describe('onError', () => {
    it('should call emit with error eventType', () => {
      const progressCrypto = createProgressCrypto();
      const emitSinon = fake();

      // @ts-ignore
      progressCrypto[ 'thread' ] = {
        kill: fake()
      };

      // @ts-ignore
      progressCrypto[ 'emit' ] = (eventType, data) => {
        expect(eventType).to.equal(EventType.ERROR);
        expect(data).to.equal('message');
        emitSinon();
      };
      progressCrypto[ 'onError' ]('message');
      expect(emitSinon.called).to.equal(true);
    });
  });
});

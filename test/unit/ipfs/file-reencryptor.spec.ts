import { expect } from 'chai';
import { fake } from 'sinon';
import { FileReencryptor } from '../../../src/ipfs/file-reencryptor';
import IpfsApi, { FILE_HASHES, FILES } from '../../helpers/ipfs-api-mock';
import { EventType } from '../../../src/types/event-type';
import { CryptoType } from '../../../src/types/crypto-type';
import { KeyEncryptor } from '../../../src/crypto/key-encryptor';
import { Base64Encoder } from '../../../src/utils/base64-encoder';
import { KeyDecryptor } from '../../../src/crypto/key-decryptor';
import { Base64Decoder } from '../../../src/utils/base64-decoder';
import { KeyImporter } from '../../../src/crypto/key-importer';

describe('FileReencryptor', () => {
  const ipfs = new IpfsApi();
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();
  const keyImporter = new KeyImporter();
  const base64Encoder = new Base64Encoder();
  const base64Decoder = new Base64Decoder();
  const keyEncryptor = new KeyEncryptor(textEncoder, keyImporter, base64Encoder);
  const keyDecryptor = new KeyDecryptor(textDecoder, keyImporter, base64Decoder);

  const PUBLIC_KEY = 'PUBLIC_KEY';
  const PRIVATE_KEY = 'PRIVATE_KEY';

  function createFileReencryptor() {
    return new FileReencryptor(ipfs, keyEncryptor, keyDecryptor, keyImporter);
  }

  describe('constructor()', () => {
    it('should expose ipfs', () => {
      const reencryptor = createFileReencryptor();

      expect(reencryptor[ 'ipfs' ]).to.not.equal(undefined);
    });
  });

  describe('reencrypt()', () => {
    it('it should fetch meta file when user provide correct meta file hash and it should call downloadChunk with first chunk ' +
      'hash as an argument', () => {
      const reencryptor = createFileReencryptor();

      return new Promise(resolve => {
        reencryptor[ 'downloadChunk' ] = (chunkHash) => {
          expect(reencryptor[ 'fileMeta' ]).to.deep.equal(JSON.parse(FILES[ FILE_HASHES.META_FILE_HASH ].content));
          expect(chunkHash).to.equal(FILE_HASHES.FILE_CHUNK_0);
          resolve();
        };

        reencryptor.reencrypt(<any> PRIVATE_KEY, <any> PUBLIC_KEY, <any> FILE_HASHES.META_FILE_HASH);
      });
    });

    it('should emit an error when user provide incorrect meta file hash', () => {
      const reencryptor = createFileReencryptor();

      return new Promise(resolve => {
        reencryptor.reencrypt(<any> PRIVATE_KEY, <any> PUBLIC_KEY, <any> 'INCORRECT_FILE_HASH');
        reencryptor.on(EventType.ERROR, () => {
          resolve();
        });
      });
    });

    it('should emit an error caught from downloadChunk method', () => {
      const reencryptor = createFileReencryptor();
      const ERROR = 'ERROR';

      return new Promise(resolve => {
        reencryptor[ 'downloadChunk' ] = () => {
          throw new Error(ERROR);
        };
        reencryptor.reencrypt(<any> PRIVATE_KEY, <any> PUBLIC_KEY, <any> FILE_HASHES.META_FILE_HASH);
        reencryptor.on(EventType.ERROR, (_eventType, error) => {
          expect(error).to.equal(ERROR);
          resolve();
        });
      });
    });
  });

  describe('downloadChunk()', () => {
    it('should fetch chunk by hash from parameter, import keys from JWK format and call crypt method', function () {
      const reencryptor = createFileReencryptor();
      reencryptor[ 'oldPrivateKey' ] = <any> 'OLD_PRIVATE_KEY';
      reencryptor[ 'newPublicKey' ] = <any> 'NEW_PUBLIC_KEY';

      // @ts-ignore
      reencryptor[ 'keyImporter' ].importPrivateKey = (key) => key + '_IMPORTED';

      // @ts-ignore
      reencryptor[ 'keyImporter' ].importPublicKey = (key) => key + '_IMPORTED';

      return new Promise(resolve => {
        // @ts-ignore
        reencryptor[ 'crypt' ] = (method, symmetricKey, initializationVector, asymmetricKey, content,
                                  options: { isFirstChunk: boolean, oldPrivateKey: string, newPublicKey: string }) => {
          expect(method).to.equal(CryptoType.REENCRYPT);
          expect(symmetricKey).to.equal(undefined);
          expect(initializationVector).to.equal(undefined);
          expect(asymmetricKey).to.equal(undefined);
          expect(content).to.equal(FILES[ FILE_HASHES.FILE_CHUNK_0 ].content);
          expect(options.isFirstChunk).to.equal(true);
          expect(options.oldPrivateKey).to.equal('OLD_PRIVATE_KEY_IMPORTED');
          expect(options.newPublicKey).to.equal('NEW_PUBLIC_KEY_IMPORTED');
          resolve();
        };

        reencryptor[ 'downloadChunk' ](FILE_HASHES.FILE_CHUNK_0);
      });
    });

    it('should emit an error when chunk hash is incorrect', () => {
      const reencryptor = createFileReencryptor();

      return new Promise(resolve => {
        reencryptor[ 'downloadChunk' ]('INCORRECT_FILE_HASH');
        reencryptor.on(EventType.ERROR, () => {
          resolve();
        });
      });
    });
  });

  describe('onChunkCrypted()', () => {
    it('should emit finish event with new meta file hash', async () => {
      const vector = new Uint8Array([ 0, 0, 0 ]);
      const chunk = new Uint8Array([ 1, 2, 3 ]);
      const reencryptor = createFileReencryptor();
      const decryptSymmetricKey = fake.returns('DECRYPTED_KEY');
      const encryptSymmetricKey = fake.returns('ENCRYPTED_KEY');
      reencryptor[ 'keyDecryptor' ].decryptSymmetricKey = decryptSymmetricKey;
      reencryptor[ 'keyEncryptor' ].encryptSymmetricKey = encryptSymmetricKey;
      reencryptor[ 'oldPrivateKey' ] = <any> 'OLD_PRIVATE_KEY';
      reencryptor[ 'newPublicKey' ] = <any> 'NEW_PUBLIC_KEY';

      reencryptor[ 'fileMeta' ] = {
        chunks: [ FILE_HASHES.FILE_CHUNK_0, FILE_HASHES.FILE_CHUNK_1 ],
        symmetricKey: 'SYMMETRIC_KEY'
      };

      return new Promise(resolve => {
        reencryptor[ 'onChunkCrypted' ]({ number: 1, vector, chunk });
        reencryptor.on(EventType.FINISH, (_eventType, metaFileHash) => {
          expect(metaFileHash).to.equal(FILE_HASHES.NEW_IPFS_FILE);
          expect(decryptSymmetricKey.called).to.equal(true);
          expect(encryptSymmetricKey.called).to.equal(true);
          resolve();
        });
      });
    });
  });
});

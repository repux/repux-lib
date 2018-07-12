import { expect } from 'chai';
// @ts-ignore
import { reencryptionWorker } from '../../../src/threads/reecryption-worker';
import {
  ASYMMETRIC_ENCRYPTION_ALGORITHM,
  ASYMMETRIC_ENCRYPTION_EXPONENT,
  ASYMMETRIC_ENCRYPTION_HASH,
  ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH
} from '../../../src/config';
import { Chunk } from '../../../src/crypto/progress-crypto';
import { ErrorMessage } from '../../../src/error-message';

describe('reencryptionWorker', () => {
  it('should emit an error', (done) => {
    const bytes = new ArrayBuffer(10);
    crypto.subtle.generateKey(
      { name: 'AES-CBC', length: 128 },
      true,
      [ 'encrypt', 'decrypt' ]
    ).then(privateKey => {
      const publicKey = crypto.subtle.exportKey('raw', privateKey);
      const options = {
        ASYMMETRIC_ENCRYPTION_ALGORITHM: 'wrong algo type',
        oldPrivateKey: privateKey,
        newPublicKey: publicKey,
        REENCRYPTION_ERROR: 'EXPECTED__ERROR'
      };

      reencryptionWorker([ bytes, '', '', '', options ], () => {
      }, (result: { error: ErrorMessage }) => {
        expect(result.error).to.equal(options.REENCRYPTION_ERROR);
        done();
      });
    });
  });

  it('should emit re-encrypted chunk', async () => {
    const bytes = new Uint8Array([ 0x01, 0x00, 0x01 ]);
    const keysOld = await crypto.subtle.generateKey({
      name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
      modulusLength: ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH,
      publicExponent: ASYMMETRIC_ENCRYPTION_EXPONENT,
      hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
    }, true, [ 'encrypt', 'decrypt' ]);

    const keysNew = await crypto.subtle.generateKey({
      name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
      modulusLength: ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH,
      publicExponent: new Uint8Array([ 0x01, 0x00, 0x01 ]),
      hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
    }, true, [ 'encrypt', 'decrypt' ]);

    const options = {
      ASYMMETRIC_ENCRYPTION_ALGORITHM: ASYMMETRIC_ENCRYPTION_ALGORITHM,
      ASYMMETRIC_ENCRYPTION_HASH: ASYMMETRIC_ENCRYPTION_HASH,
      oldPrivateKey: keysOld.privateKey,
      newPublicKey: keysNew.publicKey,
      REENCRYPTION_ERROR: 'UNEXPECTED__ERROR'
    };

    const encryptedChunkWithOldKey = await crypto.subtle.encrypt(
      { name: options.ASYMMETRIC_ENCRYPTION_ALGORITHM },
      keysOld.publicKey,
      bytes
    );

    return new Promise(resolve => {
      reencryptionWorker([ encryptedChunkWithOldKey, '', '', '', options ], () => {
      }, async (result: Chunk) => {
        const decryptedChunk = await crypto.subtle.decrypt(
          { name: options.ASYMMETRIC_ENCRYPTION_ALGORITHM },
          keysNew.privateKey,
          result.chunk
        );
        expect(new Uint8Array(decryptedChunk)).to.deep.equal(bytes);

        resolve();
      });
    });
  }).timeout(5000);
});

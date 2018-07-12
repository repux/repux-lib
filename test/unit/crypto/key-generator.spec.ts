import { expect } from 'chai';
import { KeyGenerator } from '../../../src/crypto/key-generator';
import {
  SYMMETRIC_ENCRYPTION_ALGORITHM,
  SYMMETRIC_ENCRYPTION_KEY_LENGTH,
  ASYMMETRIC_ENCRYPTION_ALGORITHM,
  ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH,
  ASYMMETRIC_ENCRYPTION_EXPONENT, ASYMMETRIC_ENCRYPTION_HASH
} from '../../../src/config';

describe('KeyGenerator', () => {
  describe('generateInitializationVector()', () => {
    it('should call crypto.getRandomValues with 16 elements Uint8Array', async () => {
      const getRandomValues = crypto.getRandomValues;
      crypto.getRandomValues = (array) => {
        expect(array instanceof Uint8Array).to.equal(true);

        if (array !== null) {
          expect(array.byteLength).to.equal(16);
        }

        return array;
      };

      const result = await new KeyGenerator().generateInitializationVector();
      expect(result instanceof Uint8Array).to.equal(true);
      expect(result.length).to.equal(16);

      crypto.getRandomValues = getRandomValues;
    });
  });

  describe('generateSymmetricKey()', () => {
    it('should crypto.subtle.generateKey and then crypto.subtle.exportKey with proper arguments', async () => {
      const generateKey = crypto.subtle.generateKey;
      const exportKey = crypto.subtle.exportKey;

      // @ts-ignore
      crypto.subtle.generateKey = (algorithm, extractable, usages) => {
        expect(algorithm).to.deep.equal({
          name: SYMMETRIC_ENCRYPTION_ALGORITHM,
          length: SYMMETRIC_ENCRYPTION_KEY_LENGTH
        });
        expect(extractable).to.equal(true);
        expect(usages).to.deep.equal([ 'encrypt', 'decrypt' ]);

        return 'GENERATED_KEY';
      };

      // @ts-ignore
      crypto.subtle.exportKey = (type, key) => {
        expect(type).to.equal('jwk');
        expect(key).to.equal('GENERATED_KEY');

        return key + '_EXPORTED';
      };

      const result = await new KeyGenerator().generateSymmetricKey();
      expect(result).to.equal('GENERATED_KEY_EXPORTED');

      crypto.subtle.exportKey = exportKey;
      crypto.subtle.generateKey = generateKey;
    });
  });

  describe('generateAsymmetricKey()', () => {
    it('should crypto.subtle.generateKey and then crypto.subtle.exportKey with proper arguments', async () => {
      const generateKey = crypto.subtle.generateKey;
      const exportKey = crypto.subtle.exportKey;

      // @ts-ignore
      crypto.subtle.generateKey = (algorithm, extractable, usages) => {
        expect(algorithm).to.deep.equal({
          name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
          modulusLength: ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH,
          publicExponent: ASYMMETRIC_ENCRYPTION_EXPONENT,
          hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        });
        expect(extractable).to.equal(true);
        expect(usages).to.deep.equal([ 'encrypt', 'decrypt' ]);

        return {
          privateKey: 'PRIVATE_KEY',
          publicKey: 'PUBLIC_KEY'
        };
      };

      // @ts-ignore
      crypto.subtle.exportKey = (type, key) => {
        expect(type).to.equal('jwk');

        return key + '_EXPORTED';
      };

      const result = await new KeyGenerator().generateAsymmetricKeyPair();
      expect(result).to.deep.equal({
        publicKey: 'PUBLIC_KEY_EXPORTED',
        privateKey: 'PRIVATE_KEY_EXPORTED'
      });

      crypto.subtle.exportKey = exportKey;
      crypto.subtle.generateKey = generateKey;
    });
  });
});

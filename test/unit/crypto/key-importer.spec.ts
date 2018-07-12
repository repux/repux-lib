import { expect } from 'chai';
import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH, SYMMETRIC_ENCRYPTION_ALGORITHM } from '../../../src/config';
import { KeyImporter } from '../../../src/crypto/key-importer';

describe('KeyImporter', () => {
  describe('importPublicKey()', () => {
    it('should call crypto.subtle.importKey with proper arguments', async () => {
      const publicKey = 'PUBLIC_KEY';
      const result = 'IMPORTED_PUBLIC_KEY';

      // @ts-ignore
      crypto.subtle.importKey = (type, key, algorithm, extractable, keyUsages) => {
        expect(type).to.equal('jwk');
        expect(key).to.equal(publicKey);
        expect(algorithm).to.deep.equal({
          name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
          hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        });
        expect(extractable).to.equal(false);
        expect(keyUsages).to.deep.equal([ 'encrypt' ]);

        return result;
      };

      const importedPublicKey = await new KeyImporter().importPublicKey(<any> publicKey);
      expect(importedPublicKey).to.equal(result);
    });
  });

  describe('importPrivateKey()', () => {
    it('should call crypto.subtle.importKey with proper arguments', async () => {
      const privateKey = 'PRIVATE_KEY';
      const result = 'IMPORTED_PRIVATE_KEY';

      // @ts-ignore
      crypto.subtle.importKey = (type, key, algorithm, extractable, keyUsages) => {
        expect(type).to.equal('jwk');
        expect(key).to.equal(privateKey);
        expect(algorithm).to.deep.equal({
          name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
          hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        });
        expect(extractable).to.equal(false);
        expect(keyUsages).to.deep.equal([ 'decrypt' ]);

        return result;
      };

      const importedPrivateKey = await new KeyImporter().importPrivateKey(<any> privateKey);
      expect(importedPrivateKey).to.equal(result);
    });
  });

  describe('importSymmetricKey()', () => {
    it('should call crypto.subtle.importKey with proper arguments', async () => {
      const symmetricKey = 'SYMMETRIC_KEY';
      const result = 'IMPORTED_SYMMETRIC_KEY';

      // @ts-ignore
      crypto.subtle.importKey = (type, key, algorithm, extractable, keyUsages) => {
        expect(type).to.equal('jwk');
        expect(key).to.equal(symmetricKey);
        expect(algorithm).to.deep.equal({
          name: SYMMETRIC_ENCRYPTION_ALGORITHM
        });
        expect(extractable).to.equal(false);
        expect(keyUsages).to.deep.equal([ 'encrypt', 'decrypt' ]);

        return result;
      };

      const importedSymmetricKey = await new KeyImporter().importSymmetricKey(<any> symmetricKey);
      expect(importedSymmetricKey).to.equal(result);
    });
  });
});

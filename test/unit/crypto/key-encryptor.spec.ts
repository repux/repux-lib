import { expect } from 'chai';
import { KeyEncryptor } from '../../../src/crypto/key-encryptor';
import { PUBLIC_KEY, SYMMETRIC_KEY } from '../../integration/config';
import { KeyImporter } from '../../../src/crypto/key-importer';
import { Base64Encoder } from '../../../src/utils/base64-encoder';

describe('KeyEncryptor', () => {
  const textEncoder = new TextEncoder();
  const keyImporter = new KeyImporter();
  const base64Encoder = new Base64Encoder();

  function createKeyEncryptor() {
    return new KeyEncryptor(textEncoder, keyImporter, base64Encoder);
  }

  describe('encryptSymmetricKey()', () => {
    it('should return proper value', async () => {
      const result = await createKeyEncryptor().encryptSymmetricKey(SYMMETRIC_KEY, PUBLIC_KEY);
      expect(result.length).to.equal(344);
    });
  });
});

import { expect } from 'chai';
import { KeyDecryptor } from '../../../src/crypto/key-decryptor';
import { ENCRYPTED_SYMMETRIC_KEY, PPRIVATE_KEY, SYMMETRIC_KEY } from '../../integration/config';
import { KeyImporter } from '../../../src/crypto/key-importer';
import { Base64Decoder } from '../../../src/utils/base64-decoder';

describe('KeyDecryptor', () => {
  const textDecoder = new TextDecoder();
  const keyImporter = new KeyImporter();
  const base64Decoder = new Base64Decoder();

  function createKeyDecryptor() {
    return new KeyDecryptor(textDecoder, keyImporter, base64Decoder);
  }

  describe('decryptSymmetricKey()', () => {
    it('should return proper value', async () => {
      const result = await createKeyDecryptor().decryptSymmetricKey(ENCRYPTED_SYMMETRIC_KEY, PPRIVATE_KEY);
      expect(result).to.deep.equal(SYMMETRIC_KEY);
    });
  });
});

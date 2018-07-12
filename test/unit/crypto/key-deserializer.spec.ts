import { expect } from 'chai';
import { KeyDeserializer } from '../../../src/crypto/key-deserializer';

describe('KeyDeserializer', () => {
  const PUBLIC_KEY = {
    alg: 'RSA-OAEP-256',
    e: 'AQAB',
    ext: true,
    key_ops: [ 'encrypt' ],
    kty: 'RSA',
    n: 'PUBLIC_KEY_STRING'
  };

  describe('deserializePublicKey()', () => {
    it('should return JsonWebKey constructed from publicKeyString', () => {
      const keyDeserializer = new KeyDeserializer();
      expect(keyDeserializer.deserializePublicKey(PUBLIC_KEY.n)).to.deep.equal(PUBLIC_KEY);
    });
  });
});

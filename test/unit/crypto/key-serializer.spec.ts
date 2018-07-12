import { expect } from 'chai';
import { KeySerializer } from '../../../src/crypto/key-serializer';
import { ErrorMessage } from '../../../src/error-message';

describe('KeySerializer', () => {
  const PUBLIC_KEY = {
    alg: 'RSA-OAEP-256',
    e: 'AQAB',
    ext: true,
    key_ops: [ 'encrypt' ],
    kty: 'RSA',
    n: 'PUBLIC_KEY_STRING'
  };

  describe('serializePublicKey()', () => {
    const keySerializer = new KeySerializer();

    it('should return n property of JsonWebKey', () => {
      expect(keySerializer.serializePublicKey(PUBLIC_KEY)).to.equal(PUBLIC_KEY.n);
    });

    it('should return errors when publicKey is incorrect', () => {
      let publicKey: JsonWebKey = {};
      expect(() => keySerializer.serializePublicKey(publicKey)).to.throw(ErrorMessage.INCORRECT_PUBLIC_KEY);

      publicKey = Object.assign({}, PUBLIC_KEY);
      publicKey.alg = '';
      expect(() => keySerializer.serializePublicKey(publicKey)).to.throw(ErrorMessage.INCORRECT_PUBLIC_KEY);

      publicKey = Object.assign({}, PUBLIC_KEY);
      publicKey.e = '';
      expect(() => keySerializer.serializePublicKey(publicKey)).to.throw(ErrorMessage.INCORRECT_PUBLIC_KEY);

      publicKey = Object.assign({}, PUBLIC_KEY);
      publicKey.ext = false;
      expect(() => keySerializer.serializePublicKey(publicKey)).to.throw(ErrorMessage.INCORRECT_PUBLIC_KEY);

      publicKey = Object.assign({}, PUBLIC_KEY);
      publicKey.key_ops = [ 'decrypt' ];
      expect(() => keySerializer.serializePublicKey(publicKey)).to.throw(ErrorMessage.INCORRECT_PUBLIC_KEY);

      publicKey = Object.assign({}, PUBLIC_KEY);
      publicKey.kty = '';
      expect(() => keySerializer.serializePublicKey(publicKey)).to.throw(ErrorMessage.INCORRECT_PUBLIC_KEY);
    });
  });
});

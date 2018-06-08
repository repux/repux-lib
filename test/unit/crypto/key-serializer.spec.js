/* eslint no-unused-expressions: 0 */

import { KeySerializer } from '../../../src/crypto/key-serializer';

describe('KeySerializer', () => {
    const PUBLIC_KEY = {
        alg: 'RSA-OAEP-256',
        e: 'AQAB',
        ext: true,
        key_ops: ['encrypt'],
        kty: 'RSA',
        n: 'PUBLIC_KEY_STRING'
    };

    describe('serializePublicKey()', () => {
        it('should return n property of JsonWebKey', () => {
            expect(KeySerializer.serializePublicKey(PUBLIC_KEY)).to.equal(PUBLIC_KEY.n);
        });

        it('should return errors when publicKey is incorrect', () => {
            let publicKey = {};
            expect(() => KeySerializer.serializePublicKey(publicKey)).to.throw('Incorrect public key');

            publicKey = Object.assign({}, PUBLIC_KEY);
            publicKey.alg = '';
            expect(() => KeySerializer.serializePublicKey(publicKey)).to.throw('Incorrect public key');

            publicKey = Object.assign({}, PUBLIC_KEY);
            publicKey.e = '';
            expect(() => KeySerializer.serializePublicKey(publicKey)).to.throw('Incorrect public key');

            publicKey = Object.assign({}, PUBLIC_KEY);
            publicKey.ext = false;
            expect(() => KeySerializer.serializePublicKey(publicKey)).to.throw('Incorrect public key');

            publicKey = Object.assign({}, PUBLIC_KEY);
            publicKey.key_ops = [ 'decrypt' ];
            expect(() => KeySerializer.serializePublicKey(publicKey)).to.throw('Incorrect public key');

            publicKey = Object.assign({}, PUBLIC_KEY);
            publicKey.kty = '';
            expect(() => KeySerializer.serializePublicKey(publicKey)).to.throw('Incorrect public key');
        });
    });

    describe('deserializePublicKey()', () => {
        it('should return JsonWebKey constructed from publicKeyString', () => {
            expect(KeySerializer.deserializePublicKey(PUBLIC_KEY.n)).to.deep.equal(PUBLIC_KEY);
        });
    });
});

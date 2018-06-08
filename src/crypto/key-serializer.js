const alg = 'RSA-OAEP-256';
const kty = 'RSA';
const e = 'AQAB';
const ext = true;
const keyOps = ['encrypt'];

export class KeySerializer {
    static serializePublicKey(publicKeyJWK) {
        if (!publicKeyJWK.n ||
            publicKeyJWK.alg !== alg ||
            publicKeyJWK.kty !== kty ||
            publicKeyJWK.e !== e ||
            publicKeyJWK.ext !== ext ||
            JSON.stringify(publicKeyJWK.key_ops) !== JSON.stringify(keyOps)) {
            throw new Error('Incorrect public key');
        }

        return publicKeyJWK.n;
    }

    static deserializePublicKey(publicKeyString) {
        return {
            alg,
            e,
            ext,
            key_ops: keyOps,
            kty,
            n: publicKeyString
        };
    }
}

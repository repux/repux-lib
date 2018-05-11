/* global crypto */
import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH, SYMMETRIC_ENCRYPTION_ALGORITHM } from '../config';

export class KeyImporter {
    static importPublicKey(publicKeyJwk) {
        return crypto.subtle.importKey('jwk', publicKeyJwk, {
            name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
            hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        }, false, [ 'encrypt' ]);
    }

    static importPrivateKey(privateKeyJwk) {
        return crypto.subtle.importKey('jwk', privateKeyJwk, {
            name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
            hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        }, false, [ 'decrypt' ]);
    }

    static importSymmetricKey(symmetricKeyJwk) {
        return crypto.subtle.importKey('jwk', symmetricKeyJwk, {
            name: SYMMETRIC_ENCRYPTION_ALGORITHM
        }, false, [ 'encrypt', 'decrypt' ]);
    }
}

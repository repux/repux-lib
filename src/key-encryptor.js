import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH } from './config';

export class KeyEncryptor {
    static toBase64(u8) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(u8)));
    }

    static fromBase64(str) {
        return Uint8Array.from(atob(str).split('').map(function (c) { return c.charCodeAt(0); }));
    }

    static async encryptSymmetricKey(symmetricKey, publicKey) {
        const symmetricKeyUint = (new TextEncoder()).encode(JSON.stringify(symmetricKey));

        const asymmetricKeyObject = await crypto.subtle.importKey('jwk', publicKey, {
            name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
            hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        }, false, [ 'encrypt' ]);

        const result = await crypto.subtle.encrypt({ name: ASYMMETRIC_ENCRYPTION_ALGORITHM }, asymmetricKeyObject, symmetricKeyUint);

        return KeyEncryptor.toBase64(result);
    }

    static async decryptSymmetricKey(encryptedSymmetricKey, privateKey) {
        const encryptedSymmetricKeyUint = KeyEncryptor.fromBase64(encryptedSymmetricKey);

        const asymmetricKeyObject = await crypto.subtle.importKey('jwk', privateKey, {
            name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
            hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        }, false, [ 'decrypt' ]);

        const result = await crypto.subtle.decrypt({ name: ASYMMETRIC_ENCRYPTION_ALGORITHM }, asymmetricKeyObject, encryptedSymmetricKeyUint);

        return JSON.parse((new TextDecoder()).decode(result));
    }
}

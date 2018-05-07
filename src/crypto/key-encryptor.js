import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH } from '../config';
import Base64 from '../utils/base64';

export class KeyEncryptor {
    static async encryptSymmetricKey(symmetricKey, publicKey) {
        const symmetricKeyUint = (new TextEncoder()).encode(JSON.stringify(symmetricKey));

        const asymmetricKeyObject = await crypto.subtle.importKey('jwk', publicKey, {
            name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
            hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        }, false, [ 'encrypt' ]);

        const result = await crypto.subtle.encrypt({ name: ASYMMETRIC_ENCRYPTION_ALGORITHM }, asymmetricKeyObject, symmetricKeyUint);

        return Base64.encode(result);
    }

    static async decryptSymmetricKey(encryptedSymmetricKey, privateKey) {
        const encryptedSymmetricKeyUint = Base64.decode(encryptedSymmetricKey);

        const asymmetricKeyObject = await crypto.subtle.importKey('jwk', privateKey, {
            name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
            hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        }, false, [ 'decrypt' ]);

        const result = await crypto.subtle.decrypt({ name: ASYMMETRIC_ENCRYPTION_ALGORITHM }, asymmetricKeyObject, encryptedSymmetricKeyUint);

        return JSON.parse((new TextDecoder()).decode(result));
    }
}

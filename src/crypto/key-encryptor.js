/* global TextEncoder, TextDecoder, crypto */
import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH } from '../config';
import Base64 from '../utils/base64';
import { KeyImporter } from './key-importer';

export class KeyEncryptor {
    static async encryptSymmetricKey(symmetricKey, publicKey) {
        const symmetricKeyUint = (new TextEncoder()).encode(JSON.stringify(symmetricKey));
        const asymmetricKeyObject = await KeyImporter.importPublicKey(publicKey);
        const result = await crypto.subtle.encrypt({
            name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
            hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        }, asymmetricKeyObject, symmetricKeyUint);

        return Base64.encode(result);
    }

    static async decryptSymmetricKey(encryptedSymmetricKey, privateKey) {
        const encryptedSymmetricKeyUint = Base64.decode(encryptedSymmetricKey);
        const asymmetricKeyObject = await KeyImporter.importPrivateKey(privateKey);
        const result = await crypto.subtle.decrypt({
            name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
            hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        }, asymmetricKeyObject, encryptedSymmetricKeyUint);

        return JSON.parse((new TextDecoder()).decode(result));
    }
}

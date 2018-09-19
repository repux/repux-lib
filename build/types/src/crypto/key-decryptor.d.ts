import { Base64Decoder } from '../utils/base64-decoder';
import { KeyImporter } from './key-importer';
import { PrivateKey } from '../types/private-key';
import { SymmetricKey } from '../types/symmetric-key';
export declare class KeyDecryptor {
    private readonly textDecoder;
    private readonly keyImporter;
    private readonly base64Decoder;
    constructor(textDecoder: TextDecoder, keyImporter: KeyImporter, base64Decoder: Base64Decoder);
    decryptSymmetricKey(encryptedSymmetricKey: string, privateKey: PrivateKey): Promise<SymmetricKey>;
}

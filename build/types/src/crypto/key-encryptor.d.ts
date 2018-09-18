import { KeyImporter } from './key-importer';
import { Base64Encoder } from '../utils/base64-encoder';
import { SymmetricKey } from '../types/symmetric-key';
import { PublicKey } from '../types/public-key';
export declare class KeyEncryptor {
    private readonly textEncoder;
    private readonly keyImporter;
    private readonly base64Encoder;
    constructor(textEncoder: TextEncoder, keyImporter: KeyImporter, base64Encoder: Base64Encoder);
    encryptSymmetricKey(symmetricKey: SymmetricKey, publicKey: PublicKey): Promise<string>;
}

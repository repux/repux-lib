import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH } from '../config';
import { KeyImporter } from './key-importer';
import { Base64Encoder } from '../utils/base64-encoder';
import { SymmetricKey } from '../types/symmetric-key';
import { PublicKey } from '../types/public-key';

export class KeyEncryptor {
  constructor(
    private readonly textEncoder: TextEncoder,
    private readonly keyImporter: KeyImporter,
    private readonly base64Encoder: Base64Encoder) {
  }

  async encryptSymmetricKey(symmetricKey: SymmetricKey, publicKey: PublicKey): Promise<string> {
    const symmetricKeyUint = this.textEncoder.encode(JSON.stringify(symmetricKey));
    const asymmetricKeyObject = await this.keyImporter.importPublicKey(publicKey);

    const result = await crypto.subtle.encrypt(<any> {
      name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
      hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
    }, asymmetricKeyObject, symmetricKeyUint);

    return this.base64Encoder.encode(new Uint8Array(result));
  }
}

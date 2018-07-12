import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH } from '../config';
import { Base64Decoder } from '../utils/base64-decoder';
import { KeyImporter } from './key-importer';
import { PrivateKey } from '../types/private-key';
import { SymmetricKey } from '../types/symmetric-key';

export class KeyDecryptor {
  constructor(
    private readonly textDecoder: TextDecoder,
    private readonly keyImporter: KeyImporter,
    private readonly base64Decoder: Base64Decoder) {
  }

  async decryptSymmetricKey(encryptedSymmetricKey: string, privateKey: PrivateKey): Promise<SymmetricKey> {
    const encryptedSymmetricKeyUint = this.base64Decoder.decode(encryptedSymmetricKey);
    const asymmetricKeyObject = await this.keyImporter.importPrivateKey(privateKey);

    const result = await crypto.subtle.decrypt(<any> {
      name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
      hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
    }, asymmetricKeyObject, encryptedSymmetricKeyUint);

    return JSON.parse(this.textDecoder.decode(result));
  }
}

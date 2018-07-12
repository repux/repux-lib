import {
  SYMMETRIC_ENCRYPTION_ALGORITHM,
  SYMMETRIC_ENCRYPTION_KEY_LENGTH,
  ASYMMETRIC_ENCRYPTION_ALGORITHM,
  ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH,
  ASYMMETRIC_ENCRYPTION_EXPONENT,
  ASYMMETRIC_ENCRYPTION_HASH
} from '../config';
import { SymmetricKey } from '../types/symmetric-key';
import { AsymmetricKeyPair } from '../types/asymmetric-key-pair';

export class KeyGenerator {
  generateInitializationVector(): Uint8Array {
    return <Uint8Array> crypto.getRandomValues(new Uint8Array(16));
  }

  async generateSymmetricKey(): Promise<SymmetricKey> {
    const key = await crypto.subtle.generateKey({
      name: SYMMETRIC_ENCRYPTION_ALGORITHM,
      length: SYMMETRIC_ENCRYPTION_KEY_LENGTH
    }, true, [ 'encrypt', 'decrypt' ]);

    return crypto.subtle.exportKey('jwk', key);
  }

  async generateAsymmetricKeyPair(): Promise<AsymmetricKeyPair> {
    const keys = await crypto.subtle.generateKey({
      name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
      modulusLength: ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH,
      publicExponent: ASYMMETRIC_ENCRYPTION_EXPONENT,
      hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
    }, true, [ 'encrypt', 'decrypt' ]);

    const publicKey = await crypto.subtle.exportKey('jwk', keys.publicKey);
    const privateKey = await crypto.subtle.exportKey('jwk', keys.privateKey);

    return {
      publicKey,
      privateKey
    };
  }
}

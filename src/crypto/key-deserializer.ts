import { PublicKey } from '../types/public-key';

export const alg = 'RSA-OAEP-256';
export const kty = 'RSA';
export const e = 'AQAB';
export const ext = true;
export const keyOps = [ 'encrypt' ];

export class KeyDeserializer {
  deserializePublicKey(publicKeyString: string): PublicKey {
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

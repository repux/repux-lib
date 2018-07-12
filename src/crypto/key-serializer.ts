import { alg, e, keyOps, kty, ext } from './key-deserializer';
import { ErrorMessage } from '../error-message';
import { PublicKey } from '../types/public-key';

export class KeySerializer {
  serializePublicKey(publicKeyJWK: PublicKey) {
    if (!publicKeyJWK.n ||
      publicKeyJWK.alg !== alg ||
      publicKeyJWK.kty !== kty ||
      publicKeyJWK.e !== e ||
      publicKeyJWK.ext !== ext ||
      JSON.stringify(publicKeyJWK.key_ops) !== JSON.stringify(keyOps)) {
      throw new Error(ErrorMessage.INCORRECT_PUBLIC_KEY);
    }

    return publicKeyJWK.n;
  }
}

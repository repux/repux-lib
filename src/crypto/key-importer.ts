import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH, SYMMETRIC_ENCRYPTION_ALGORITHM } from '../config';
import { PublicKey } from '../types/public-key';
import { PrivateKey } from '../types/private-key';
import { SymmetricKey } from '../types/symmetric-key';

export class KeyImporter {
  importPublicKey(publicKeyJwk: PublicKey): PromiseLike<CryptoKey> {
    return crypto.subtle.importKey('jwk', publicKeyJwk, {
      name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
      hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
    }, false, [ 'encrypt' ]);
  }

  importPrivateKey(privateKeyJwk: PrivateKey): PromiseLike<CryptoKey> {
    return crypto.subtle.importKey('jwk', privateKeyJwk, {
      name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
      hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
    }, false, [ 'decrypt' ]);
  }

  importSymmetricKey(symmetricKeyJwk: SymmetricKey): PromiseLike<CryptoKey> {
    return crypto.subtle.importKey('jwk', symmetricKeyJwk, <any> {
      name: SYMMETRIC_ENCRYPTION_ALGORITHM
    }, false, [ 'encrypt', 'decrypt' ]);
  }
}

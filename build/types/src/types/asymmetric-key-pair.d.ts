import { PrivateKey } from './private-key';
import { PublicKey } from './public-key';

export interface AsymmetricKeyPair {
  privateKey: PrivateKey,
  publicKey: PublicKey
}

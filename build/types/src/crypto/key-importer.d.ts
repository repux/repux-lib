import { PublicKey } from '../types/public-key';
import { PrivateKey } from '../types/private-key';
import { SymmetricKey } from '../types/symmetric-key';
export declare class KeyImporter {
    importPublicKey(publicKeyJwk: PublicKey): PromiseLike<CryptoKey>;
    importPrivateKey(privateKeyJwk: PrivateKey): PromiseLike<CryptoKey>;
    importSymmetricKey(symmetricKeyJwk: SymmetricKey): PromiseLike<CryptoKey>;
}

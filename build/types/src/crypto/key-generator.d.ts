import { SymmetricKey } from '../types/symmetric-key';
import { AsymmetricKeyPair } from '../types/asymmetric-key-pair';
export declare class KeyGenerator {
    generateInitializationVector(): Uint8Array;
    generateSymmetricKey(): Promise<SymmetricKey>;
    generateAsymmetricKeyPair(): Promise<AsymmetricKeyPair>;
}

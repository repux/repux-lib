import { PublicKey } from '../types/public-key';
export declare const alg = "RSA-OAEP-256";
export declare const kty = "RSA";
export declare const e = "AQAB";
export declare const ext: boolean;
export declare const keyOps: string[];
export declare class KeyDeserializer {
    deserializePublicKey(publicKeyString: string): PublicKey;
}

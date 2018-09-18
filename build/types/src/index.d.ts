import { FileUploader } from './ipfs/file-uploader';
import { FileReencryptor } from './ipfs/file-reencryptor';
import { FileDownloader } from './ipfs/file-downloader';
import IpfsAPI, { IpfsFileHash } from 'ipfs-api';
import { EventType } from './types/event-type';
import { PrivateKey } from './types/private-key';
import { PublicKey } from './types/public-key';
import { AsymmetricKeyPair } from './types/asymmetric-key-pair';
import { SymmetricKey } from './types/symmetric-key';
import { FileMetaData } from './types/file-meta-data';
import { PurchaseType } from './types/purchase-type';
import { BuyerType } from './types/buyer-type';
import { Attachment } from './types/attachment';
import { DataLocation } from './types/data-location';
import { Eula } from './types/eula';
import { EulaType } from './types/eula-type';
export { EventType, FileDownloader, FileReencryptor, FileUploader, PrivateKey, PublicKey, AsymmetricKeyPair, SymmetricKey, IpfsFileHash, FileMetaData, PurchaseType, BuyerType, Attachment, DataLocation, Eula, EulaType };
/**
 * Repux Lib
 */
export declare class RepuxLib {
    private readonly ipfs;
    private readonly fileSize;
    private readonly keyGenerator;
    private readonly keyEncryptor;
    private readonly keyDecryptor;
    private readonly keySerializer;
    private readonly keyDeserializer;
    private readonly keyImporter;
    /**
     * @param ipfs - IPFS Api object (see: https://github.com/ipfs/js-ipfs-api)
     */
    constructor(ipfs: IpfsAPI);
    /**
     * Returns API version
     * @return API version
     */
    getVersion(): string;
    /**
     * Returns maximum file size in bytes
     * @return maximum file size
     */
    getMaxFileSize(): Promise<number>;
    /**
     * Generates key for symmetric encryption/decryption
     * @return symmetric key in JsonWebKey format
     */
    generateSymmetricKey(): Promise<SymmetricKey>;
    /**
     * Generates keys for asymmetric encryption/decryption
     * @return asymmetric key pair in JsonWebKey format
     */
    generateAsymmetricKeyPair(): Promise<AsymmetricKeyPair>;
    /**
     * Encrypts symmetric key using public key
     * @param symmetricKey - symmetric key in JsonWebKey format
     * @param publicKey - public key in JsonWebKey format
     * @return encrypted symmetric key as a string
     */
    encryptSymmetricKey(symmetricKey: SymmetricKey, publicKey: PublicKey): Promise<string>;
    /**
     * Decrypts encrypted symmetric key using public key
     * @param encryptedSymmetricKey - encrypted symmetric key
     * @param privateKey - private key in JsonWebKey format
     * @return decrypted symmetric key in JsonWebKey format
     */
    decryptSymmetricKey(encryptedSymmetricKey: string, privateKey: PrivateKey): Promise<SymmetricKey>;
    /**
     * Serializes public key as a string.
     * @param publicKeyJWK - public key in JsonWebKey format
     * @return serialized public key
     */
    serializePublicKey(publicKeyJWK: PublicKey): string;
    /**
     * Deserializes string public key and returns PublicKey
     * @param publicKeyString - serialized public key
     * @return public key in JsonWebKey format
     */
    deserializePublicKey(publicKeyString: string): PublicKey;
    /**
     * Creates FileUploader instance
     * @return FileUploader instance
     */
    createFileUploader(): FileUploader;
    /**
     * Creates FileReencryptor instance
     * @return FileReencryptor instance
     */
    createFileReencryptor(): FileReencryptor;
    /**
     * Creates FileDownloader instance
     * @return FileDownloader instance
     */
    createFileDownloader(): FileDownloader;
}

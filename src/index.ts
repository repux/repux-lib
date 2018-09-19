import { FileUploader } from './ipfs/file-uploader';
import { FileReencryptor } from './ipfs/file-reencryptor';
import { FileDownloader } from './ipfs/file-downloader';
import { KeyGenerator } from './crypto/key-generator';
import { KeyEncryptor } from './crypto/key-encryptor';
import { KeySerializer } from './crypto/key-serializer';
import { FileSize } from './file-handling/file-size';
import packageConfig from '../package.json';
import IpfsAPI, { IpfsFileHash } from 'ipfs-api';
import { KeyDecryptor } from './crypto/key-decryptor';
import { KeyDeserializer } from './crypto/key-deserializer';
import { EventType } from './types/event-type';
import { Base64Decoder } from './utils/base64-decoder';
import { KeyImporter } from './crypto/key-importer';
import { Base64Encoder } from './utils/base64-encoder';
import { UserAgent } from './utils/user-agent';
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

export {
  EventType,
  FileDownloader,
  FileReencryptor,
  FileUploader,
  PrivateKey,
  PublicKey,
  AsymmetricKeyPair,
  SymmetricKey,
  IpfsFileHash,
  FileMetaData,
  PurchaseType,
  BuyerType,
  Attachment,
  DataLocation,
  Eula,
  EulaType
};

/**
 * Repux Lib
 */
export class RepuxLib {
  private readonly fileSize: FileSize;
  private readonly keyGenerator: KeyGenerator;
  private readonly keyEncryptor: KeyEncryptor;
  private readonly keyDecryptor: KeyDecryptor;
  private readonly keySerializer: KeySerializer;
  private readonly keyDeserializer: KeyDeserializer;
  private readonly keyImporter: KeyImporter;

  /**
   * @param ipfs - IPFS Api object (see: https://github.com/ipfs/js-ipfs-api)
   */
  constructor(
    private readonly ipfs: IpfsAPI
  ) {
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    const base64Decoder = new Base64Decoder();
    const base64Encoder = new Base64Encoder();
    const userAgent = new UserAgent();

    this.keyImporter = new KeyImporter();
    this.keyGenerator = new KeyGenerator();
    this.keySerializer = new KeySerializer();
    this.keyDeserializer = new KeyDeserializer();
    this.fileSize = new FileSize(userAgent);
    this.keyEncryptor = new KeyEncryptor(textEncoder, this.keyImporter, base64Encoder);
    this.keyDecryptor = new KeyDecryptor(textDecoder, this.keyImporter, base64Decoder);
  }

  /**
   * Returns API version
   * @return API version
   */
  getVersion(): string {
    return packageConfig.version;
  }

  /**
   * Returns maximum file size in bytes
   * @return maximum file size
   */
  getMaxFileSize(): Promise<number> {
    return this.fileSize.getMaxFileSize();
  }

  /**
   * Generates key for symmetric encryption/decryption
   * @return symmetric key in JsonWebKey format
   */
  generateSymmetricKey(): Promise<SymmetricKey> {
    return this.keyGenerator.generateSymmetricKey();
  }

  /**
   * Generates keys for asymmetric encryption/decryption
   * @return asymmetric key pair in JsonWebKey format
   */
  generateAsymmetricKeyPair(): Promise<AsymmetricKeyPair> {
    return this.keyGenerator.generateAsymmetricKeyPair();
  }

  /**
   * Encrypts symmetric key using public key
   * @param symmetricKey - symmetric key in JsonWebKey format
   * @param publicKey - public key in JsonWebKey format
   * @return encrypted symmetric key as a string
   */
  encryptSymmetricKey(symmetricKey: SymmetricKey, publicKey: PublicKey): Promise<string> {
    return this.keyEncryptor.encryptSymmetricKey(symmetricKey, publicKey);
  }

  /**
   * Decrypts encrypted symmetric key using public key
   * @param encryptedSymmetricKey - encrypted symmetric key
   * @param privateKey - private key in JsonWebKey format
   * @return decrypted symmetric key in JsonWebKey format
   */
  decryptSymmetricKey(encryptedSymmetricKey: string, privateKey: PrivateKey): Promise<SymmetricKey> {
    return this.keyDecryptor.decryptSymmetricKey(encryptedSymmetricKey, privateKey);
  }

  /**
   * Serializes public key as a string.
   * @param publicKeyJWK - public key in JsonWebKey format
   * @return serialized public key
   */
  serializePublicKey(publicKeyJWK: PublicKey): string {
    return this.keySerializer.serializePublicKey(publicKeyJWK);
  }

  /**
   * Deserializes string public key and returns PublicKey
   * @param publicKeyString - serialized public key
   * @return public key in JsonWebKey format
   */
  deserializePublicKey(publicKeyString: string): PublicKey {
    return this.keyDeserializer.deserializePublicKey(publicKeyString);
  }

  /**
   * Creates FileUploader instance
   * @return FileUploader instance
   */
  createFileUploader(): FileUploader {
    return new FileUploader(this.ipfs, this.keyGenerator, this.keyEncryptor, this.keyImporter);
  }

  /**
   * Creates FileReencryptor instance
   * @return FileReencryptor instance
   */
  createFileReencryptor(): FileReencryptor {
    return new FileReencryptor(this.ipfs, this.keyEncryptor, this.keyDecryptor, this.keyImporter);
  }

  /**
   * Creates FileDownloader instance
   * @return FileDownloader instance
   */
  createFileDownloader(): FileDownloader {
    return new FileDownloader(this.ipfs, this.keyDecryptor, this.fileSize, this.keyImporter);
  }
}

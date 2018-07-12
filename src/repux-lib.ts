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
import { TermOfUse } from './types/term-of-use';
import { Attachment } from './types/attachment';
import { DataLocation } from './types/data-location';

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
  TermOfUse,
  Attachment,
  DataLocation,
};

export class RepuxLib {
  private readonly fileSize: FileSize;
  private readonly keyGenerator: KeyGenerator;
  private readonly keyEncryptor: KeyEncryptor;
  private readonly keyDecryptor: KeyDecryptor;
  private readonly keySerializer: KeySerializer;
  private readonly keyDeserializer: KeyDeserializer;
  private readonly keyImporter: KeyImporter;

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
   * Return API version
   */
  getVersion(): string {
    return packageConfig.version;
  }

  /**
   * Returns maximum file size in bytes
   */
  getMaxFileSize(): Promise<number> {
    return this.fileSize.getMaxFileSize();
  }

  /**
   * Generates key for symmetric encryption/decryption
   */
  generateSymmetricKey(): Promise<SymmetricKey> {
    return this.keyGenerator.generateSymmetricKey();
  }

  /**
   * Generates keys for asymmetric encryption/decryption
   */
  generateAsymmetricKeyPair(): Promise<AsymmetricKeyPair> {
    return this.keyGenerator.generateAsymmetricKeyPair();
  }

  /**
   * Encrypts symmetric key using public key
   */
  encryptSymmetricKey(symmetricKey: SymmetricKey, publicKey: PublicKey): Promise<string> {
    return this.keyEncryptor.encryptSymmetricKey(symmetricKey, publicKey);
  }

  /**
   * Decrypts encrypted symmetric key using public key
   */
  decryptSymmetricKey(encryptedSymmetricKey: string, privateKey: PrivateKey): Promise<SymmetricKey> {
    return this.keyDecryptor.decryptSymmetricKey(encryptedSymmetricKey, privateKey);
  }

  /**
   * Serializes public key as a string.
   */
  serializePublicKey(publicKeyJWK: PublicKey): string {
    return this.keySerializer.serializePublicKey(publicKeyJWK);
  }

  /**
   * Deserializes string public key and returns PublicKey
   */
  deserializePublicKey(publicKeyString: string): PublicKey {
    return this.keyDeserializer.deserializePublicKey(publicKeyString);
  }

  /**
   * Creates FileUploader instance
   */
  createFileUploader(): FileUploader {
    return new FileUploader(this.ipfs, this.keyGenerator, this.keyEncryptor, this.keyImporter);
  }

  /**
   * Creates FileReencryptor instance
   */
  createFileReencryptor(): FileReencryptor {
    return new FileReencryptor(this.ipfs, this.keyEncryptor, this.keyDecryptor, this.keyImporter);
  }

  /**
   * Creates FileDownloader instance
   */
  createFileDownloader(): FileDownloader {
    return new FileDownloader(this.ipfs, this.keyDecryptor, this.fileSize, this.keyImporter);
  }
}

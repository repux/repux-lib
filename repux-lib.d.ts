interface IpfsConstructor {
  host: string;
  port: string;
  protocol: string;
}

interface IpfsFile {
  path: string;
  content: Uint8Array
}

interface IpfsAPIFiles {
  add(buffer: any, callback: (err: Error, files: string[]) => void);

  get(hash: string, callback: (err: Error, files: IpfsFile[]) => void);
}

interface IpfsAPI {
  files: IpfsAPIFiles;

  constructor(constructor: IpfsConstructor);
}

interface DataLocation {
  global: boolean;
  countries: string[];
  regions: string[];
  cities: string[];
}

interface Attachment {
  title: string;
  fileHash: string;
}

interface PurchaseType {
}

interface BuyerType {
}

interface TermOfUse {
}

interface FileMetaData {
  title: string;
  shortDescription: string;
  fullDescription?: string;
  type: PurchaseType;
  location?: DataLocation;
  category: string[];
  maxNumberOfDownloads: number;
  buyerType: BuyerType;
  price: string;
  termsOfUse: TermOfUse | string;
  apiDocumentation?: Attachment[];
  otherDocumentation?: Attachment[];
  sampleFile?: Attachment[];
  useCaseDocumentation?: Attachment[];
}

interface Observable {
  /**
   * Switch on event handling
   * @param {string} eventTypes - event types comma separated
   * @param {(eventType: string, data: any) => Observable} handler
   */
  on(eventTypes: string, handler: (eventType: string, data: any) => Observable);

  /**
   * Switch off event handling
   * @param {string} eventTypes - event types comma separated
   * @param {(eventType: string, data: any) => Observable} handler
   */
  off(eventTypes: string, handler: (eventType: string, data: any) => Observable);
}

interface ProgressCrypto extends Observable {
  /**
   * Terminates current job
   */
  terminate(): void;
}

interface FileUploader extends ProgressCrypto {
  constructor(ipfs: IpfsAPI);

  /**
   * Encrypts and uploads file using symmetric and public keys
   * @param {JsonWebKey} publicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
   * @param {File} file - file to upload
   * @param {FileMetaData} metaData - meta data object
   * @returns {FileUploader}
   */
  upload(publicKey: JsonWebKey, file: File, metaData: FileMetaData);
}

interface FileDownloader extends ProgressCrypto {
  constructor(ipfs: IpfsAPI);

  /**
   * Downloads and decrypts file
   * @param {JsonWebKey} privateKey - Private key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
   * @param {string} fileHash - IPFS hash to meta file
   * @returns {FileDownloader}
   */
  download(privateKey: JsonWebKey, fileHash: string);
}

interface FileReencryptor extends ProgressCrypto {
  constructor(ipfs: IpfsAPI);

  /**
   * Reencrypts file
   * @param {JsonWebKey} oldPrivateKey - Public key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
   * @param {JsonWebKey} newPublicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
   * @param {string} fileHash - IPFS hash to meta file
   * @returns {FileReencryptor}
   */
  reencrypt(oldPrivateKey: JsonWebKey, newPublicKey: JsonWebKey, fileHash: string);
}

export default class RepuxLib {

  /**
   * @param {IpfsAPI} ipfs - IpfsAPI instance
   */
  constructor(ipfs: IpfsAPI);

  /**
   * Returns API version
   * @returns {string} API version
   */
  static getVersion(): string;

  /**
   * Returns maximum file size in bytes
   * @returns {number}
   */
  static getMaxFileSize(): number;

  /**
   * Creates FileUploader instance
   * @returns {FileUploader}
   */
  createFileUploader(): FileUploader;

  /**
   * Creates FileReencryptor instance
   * @returns {FileReencryptor}
   */
  createFileReencryptor(): FileReencryptor

  /**
   * Creates FileDownloader instance
   * @returns {FileDownloader}
   */
  createFileDownloader(): FileDownloader;

  /**
   * Generates key for symmetric encryption/decryption
   * @returns {Promise<JsonWebKey>}
   */
  static generateSymmetricKey(): Promise<JsonWebKey>;

  /**
   * Generates keys for asymmetric encryption/decryption
   * @returns {Promise<{ publicKey: JsonWebKey, privateKey: JsonWebKey }>}
   */
  static generateAsymmetricKeyPair(): Promise<{ publicKey: JsonWebKey, privateKey: JsonWebKey }>;

  /**
   * Encrypts symmetric key using public key
   * @param {JsonWebKey} symmetricKey - Symmetric key in JWK (JSON Web Key) format to AES-CBC algorithm
   * @param {JsonWebKey} publicKey - Public key in JWK (JSON Web Key) format to RSA-OAEP algorithm
   * @returns {Promise<String>}
   */
  static encryptSymmetricKey(symmetricKey: JsonWebKey, publicKey: JsonWebKey): Promise<string>;

  /**
   * Decrypts encrypted symmetric key using public key
   * @param {string} encryptedSymmetricKey - Encrypted symmetric key in JWK (JSON Web Key) format to AES-CBC algorithm
   * @param {JsonWebKey} privateKey - Private key in JWK (JSON Web Key) format to RSA-OAEP algorithm
   * @returns {Promise<JsonWebKey>}
   */
  static decryptSymmetricKey(encryptedSymmetricKey: string, privateKey: JsonWebKey): Promise<JsonWebKey>;

  /**
   * Serializes public key as a string.
   * @param {JsonWebKey} publicKeyJWK
   * @returns {string}
   */
  static serializePublicKey(publicKeyJWK: JsonWebKey): string;

  /**
   * Deserializes string public key and returns JsonWebKey
   * @param {string} publicKeyString
   * @returns {JsonWebKey}
   */
  static deserializePublicKey(publicKeyString: string): JsonWebKey;
}

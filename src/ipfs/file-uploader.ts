import { Chunk, ProgressCrypto } from '../crypto/progress-crypto';
import { Buffer } from 'buffer';
import { ErrorMessage } from '../error-message';
import { KeyGenerator } from '../crypto/key-generator';
import { KeyEncryptor } from '../crypto/key-encryptor';
import { CHUNK_SIZE, FIRST_CHUNK_SIZE } from '../config';
import IpfsAPI from 'ipfs-api';
import { FileMetaData } from '../types/file-meta-data';
import { InternalFileMetaData } from '../types/internal-file-meta-data';
import { EventType } from '../types/event-type';
import { CryptoType } from '../types/crypto-type';
import { KeyImporter } from '../crypto/key-importer';
import { PublicKey } from '../types/public-key';
import { SymmetricKey } from '../types/symmetric-key';

export class FileUploader extends ProgressCrypto {
  private fileSize: number = 0;
  private uploadedSize: number = 0;
  private isUploadFinished: boolean = false;
  private file?: File;
  private metaData?: FileMetaData;
  private initializationVector?: Uint8Array;
  private publicKey?: PublicKey;
  private symmetricKey?: SymmetricKey;

  constructor(
    private readonly ipfs: IpfsAPI,
    private readonly keyGenerator: KeyGenerator,
    private readonly keyEncryptor: KeyEncryptor,
    protected readonly keyImporter: KeyImporter) {
    super(keyImporter);
  }

  /**
   * Encrypts and uploads file using symmetric and public keys
   * @param publicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
   * @param file - file to upload
   * @param metaData - meta data object
   */
  upload(publicKey: PublicKey, file: File, metaData: FileMetaData = {}): FileUploader {
    this.isUploadFinished = false;
    this.file = file;
    this.metaData = metaData;

    if (!publicKey) {
      this.onError(ErrorMessage.ENCRYPTION_ERROR);
      return this;
    }

    if (!file) {
      this.onError(ErrorMessage.FILE_NOT_SPECIFIED);
      return this;
    }

    this.initializationVector = this.keyGenerator.generateInitializationVector();
    this.publicKey = publicKey;
    this.file = file;
    this.fileSize = file.size;
    this.uploadedSize = 0;
    this.startEncryption();

    return this;
  }

  protected onChunkCrypted(chunk: Chunk): void {
    super.onChunkCrypted(chunk);

    if (this.maxChunkNumber === 1 && this.thread) {
      this.thread.send('seek');
    }

    this.ipfs.files.add(Buffer.from(chunk.chunk), (err, files) => {
      if (err) {
        this.onError(err);
        return this.terminate();
      }

      if (this.thread) {
        this.thread.send('seek');
      }
      this.chunks[ chunk.number ] = files[ 0 ].hash;

      if (chunk.number === 0) {
        this.uploadedSize += FIRST_CHUNK_SIZE;
      } else {
        this.uploadedSize += CHUNK_SIZE;
      }
      this.uploadedSize = Math.min(this.uploadedSize, this.fileSize);
      this.onProgress();

      if (this.isAllChunksAreSent()) {
        this.finishUpload();
      }
    });
  }

  protected onProgress(): void {
    this.emit(EventType.PROGRESS, Math.min(this.uploadedSize / this.fileSize, 0.9999));
  }

  private async startEncryption(): Promise<any> {
    if (!this.initializationVector || !this.publicKey || !this.file) {
      return;
    }

    this.symmetricKey = await this.keyGenerator.generateSymmetricKey();
    return this.crypt(CryptoType.ENCRYPT, this.symmetricKey, this.initializationVector, this.publicKey, this.file);
  }

  private isAllChunksAreSent(): boolean {
    if (!this.isFinished) {
      return false;
    }

    const chunkNumbers = Array.from(Array(this.maxChunkNumber + 1).keys());

    return chunkNumbers.every(index => this.chunks[ index ]);
  }

  private async finishUpload(): Promise<any> {
    if (this.isUploadFinished || !this.file || !this.symmetricKey || !this.publicKey) {
      return;
    }
    const meta: InternalFileMetaData = Object.assign(this.metaData, {
      initializationVector: this.initializationVector,
      name: this.file.name,
      size: this.file.size,
      chunks: this.chunks,
      symmetricKey: await this.keyEncryptor.encryptSymmetricKey(this.symmetricKey, this.publicKey)
    });

    this.isUploadFinished = true;
    this.ipfs.files.add(Buffer.from(JSON.stringify(meta)), (err, files) => {
      if (!err) {
        this.emit(EventType.PROGRESS, 1);
        this.emit(EventType.FINISH, files[ 0 ].hash);
      }
    });
  }
}

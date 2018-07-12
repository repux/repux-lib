import { Chunk, ProgressCrypto } from '../crypto/progress-crypto';
import { ErrorMessage } from '../error-message';
import { FileWriterFactory } from '../file-handling/file-writer-factory';
import { FileSize } from '../file-handling/file-size';
import { merge } from '../utils/uint8-array-utils';
import IpfsAPI, { IpfsFileHash } from 'ipfs-api';
import { InternalFileMetaData } from '../types/internal-file-meta-data';
import { KeyDecryptor } from '../crypto/key-decryptor';
import { FileWriterInterface } from '../file-handling/file-writer-interface';
import { EventType } from '../types/event-type';
import { CryptoType } from '../types/crypto-type';
import { KeyImporter } from '../crypto/key-importer';
import { PrivateKey } from '../types/private-key';
import { SymmetricKey } from '../types/symmetric-key';

export class FileDownloader extends ProgressCrypto {
  private privateKey?: PrivateKey;
  private symmetricKey?: SymmetricKey;
  private fileWriter?: FileWriterInterface;
  private fileChunks?: string[];
  private fileChunksNumber?: number;
  private isFirstChunk: boolean = true;
  private vector?: Uint8Array;
  private firstChunkData?: Uint8Array;

  constructor(
    private readonly ipfs: IpfsAPI,
    private readonly keyDecryptor: KeyDecryptor,
    private readonly fileSize: FileSize,
    protected readonly keyImporter: KeyImporter) {
    super(keyImporter);
  }

  /**
   * Downloads and decrypts file
   * @param privateKey - Private key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
   * @param fileHash - IPFS hash to meta file
   */
  download(privateKey: PrivateKey, fileHash: IpfsFileHash): FileDownloader {
    this.privateKey = privateKey;

    this.ipfs.files.get(fileHash, (err, files) => {
      if (err || !files || files.length === 0) {
        this.onError(ErrorMessage.FILE_NOT_FOUND);
        return;
      }

      files.forEach(async (file) => {
        try {
          const fileMeta: InternalFileMetaData = JSON.parse(file.content.toString());

          if (!fileMeta.symmetricKey || !fileMeta.name || !fileMeta.size || !fileMeta.chunks || !fileMeta.initializationVector) {
            return this.onError(ErrorMessage.INCORRECT_META_FILE);
          }

          try {
            this.symmetricKey = await this.keyDecryptor.decryptSymmetricKey(fileMeta.symmetricKey, privateKey);
          } catch (err) {
            return this.onError(ErrorMessage.DECRYPTION_ERROR);
          }
          this.fileWriter = await FileWriterFactory.create(fileMeta.name, fileMeta.size);

          if (fileMeta.size > await this.fileSize.getMaxFileSize()) {
            return this.onError(ErrorMessage.MAX_FILE_SIZE_EXCEEDED);
          }
          await this.fileWriter.init();
          this.fileChunks = Object.values(fileMeta.chunks);
          this.fileChunksNumber = this.fileChunks.length;
          this.isFirstChunk = true;
          this.vector = Uint8Array.from(Object.values(fileMeta.initializationVector));
          this.downloadFileChunks();
        } catch (err) {
          this.onError(err.message);
        }
      });
    });

    return this;
  }

  protected onProgress(progress: number) {
    if (!this.fileChunksNumber || !this.fileChunks) {
      return;
    }

    this.emit(EventType.PROGRESS, (progress + this.fileChunksNumber - this.fileChunks.length - 1) / this.fileChunksNumber);
  }

  protected async onChunkCrypted(chunk: Chunk) {
    if (!this.fileWriter || !this.fileChunks) {
      return;
    }

    this.vector = chunk.vector;

    if (!this.isFirstChunk) {
      delete this.firstChunkData;
      await this.fileWriter.write(chunk.chunk);
    } else {
      this.isFirstChunk = false;
      this.firstChunkData = chunk.chunk;

      if (this.fileChunksNumber === 1) {
        this.crypt(CryptoType.DECRYPT, this.symmetricKey, this.vector, this.privateKey, this.firstChunkData, {
          isFirstChunk: false
        });
      }
    }

    this.fileChunks.shift();
    this.downloadFileChunks();
  }

  private downloadFileChunks() {
    if (!this.fileChunks || !this.fileWriter) {
      return;
    }

    if (!this.fileChunks.length) {
      if (!this.firstChunkData) {
        this.emit(EventType.PROGRESS, 1);
        this.emit(EventType.FINISH, { fileURL: this.fileWriter.getFileURL(), fileName: this.fileWriter.fileName });
      }

      return;
    }

    this.ipfs.files.get(this.fileChunks[ 0 ], (err, files) => {
      if (err) {
        this.onError(err);
        return;
      }
      if (!files || files.length === 0) {
        this.onError(ErrorMessage.FILE_NOT_FOUND);
        return;
      }

      files.forEach((file) => {
        let content = file.content;

        if (this.firstChunkData) {
          content = merge(this.firstChunkData, file.content);
          delete this.firstChunkData;
        }

        this.crypt(CryptoType.DECRYPT, this.symmetricKey, this.vector, this.privateKey, content, {
          isFirstChunk: this.isFirstChunk
        });
      });
    });
  }
}

import { Observable } from '../utils/observable';
import { spawn, Thread } from 'threads';
//@ts-ignore
import { encryptionWorker } from '../threads/encryption-worker';
//@ts-ignore
import { decryptionWorker } from '../threads/decryption-worker';
//@ts-ignore
import { reencryptionWorker } from '../threads/reecryption-worker';
import {
  CHUNK_SIZE,
  FIRST_CHUNK_SIZE,
  VECTOR_SIZE,
  SYMMETRIC_ENCRYPTION_ALGORITHM,
  ASYMMETRIC_ENCRYPTION_ALGORITHM,
  ASYMMETRIC_ENCRYPTION_HASH
} from '../config';
import { ErrorMessage } from '../error-message';
import { KeyImporter } from './key-importer';
import { EventType } from '../types/event-type';
import { CryptoType } from '../types/crypto-type';
import { SymmetricKey } from '../types/symmetric-key';
import { PrivateKey } from '../types/private-key';
import { PublicKey } from '../types/public-key';

export interface Chunk {
  number: number;
  chunk: Uint8Array;
  vector?: Uint8Array;
}

export class ProgressCrypto extends Observable {
  protected isFinished = false;
  protected chunks: any = {};
  protected maxChunkNumber: number = 0;
  protected thread?: Thread;

  /**
   * @param keyImporter - KeyImporter instance
   */
  constructor(protected readonly keyImporter: KeyImporter) {
    super();
  }

  /**
   * Returns worker thread by worker type
   * @param type - worker type
   * @return worker thread
   */
  static getWorkerByType(type: string): Thread | undefined {
    if (type === CryptoType.ENCRYPT) {
      return spawn(encryptionWorker);
    }

    if (type === CryptoType.DECRYPT) {
      return spawn(decryptionWorker);
    }

    if (type === CryptoType.REENCRYPT) {
      return spawn(reencryptionWorker);
    }
  }

  /**
   * Returns error by worker type
   * @param type - worker type
   * @return error message
   */
  static getErrorByType(type: CryptoType): ErrorMessage | undefined {
    if (type === CryptoType.ENCRYPT) {
      return ErrorMessage.ENCRYPTION_ERROR;
    }

    if (type === CryptoType.DECRYPT) {
      return ErrorMessage.DECRYPTION_ERROR;
    }

    if (type === CryptoType.REENCRYPT) {
      return ErrorMessage.REENCRYPTION_ERROR;
    }
  }

  /**
   * Terminates worker thread
   */
  terminate() {
    if (this.thread) {
      this.thread.kill();
      this.thread = undefined;
    }
  }

  protected async crypt(type: CryptoType, password?: SymmetricKey, initializationVector?: Uint8Array, asymmetricKey?: PrivateKey | PublicKey, file?: File | Uint8Array, options = {}) {
    try {
      let passwordKey, asymmetricKeyObject;

      options = Object.assign({
        CHUNK_SIZE,
        FIRST_CHUNK_SIZE,
        VECTOR_SIZE,
        SYMMETRIC_ENCRYPTION_ALGORITHM,
        ASYMMETRIC_ENCRYPTION_ALGORITHM,
        ASYMMETRIC_ENCRYPTION_HASH,
        ENCRYPTION_ERROR: ErrorMessage.ENCRYPTION_ERROR,
        DECRYPTION_ERROR: ErrorMessage.DECRYPTION_ERROR,
        REENCRYPTION_ERROR: ErrorMessage.REENCRYPTION_ERROR
      }, options);

      this.isFinished = false;
      this.chunks = {};

      if (password) {
        passwordKey = await this.keyImporter.importSymmetricKey(password);
      }

      if (asymmetricKey) {
        if (type === CryptoType.ENCRYPT) {
          asymmetricKeyObject = await this.keyImporter.importPublicKey(asymmetricKey);
        } else {
          asymmetricKeyObject = await this.keyImporter.importPrivateKey(asymmetricKey);
        }
      }

      this.thread = ProgressCrypto.getWorkerByType(type);
      if (!this.thread) {
        return;
      }

      this.thread.send([
        file,
        passwordKey,
        initializationVector,
        asymmetricKeyObject,
        options
      ]);

      this.thread.on('progress', async data => {
        if (data.chunk) {
          this.maxChunkNumber = data.number;
          await this.onChunkCrypted(data);
        }

        if (data.progress) {
          this.onProgress(data.progress);

          if (data.progress === 1 && this.thread) {
            this.thread.kill();
            this.isFinished = true;
          }
        }

        if (data.error) {
          this.onError(data.error);
        }
      });

      return this.thread;
    } catch (error) {
      const errorMessage = ProgressCrypto.getErrorByType(type);

      if (errorMessage) {
        this.onError(errorMessage);
      }
    }
  }

  protected onChunkCrypted(chunk: Chunk) {
    this.emit(EventType.CHUNK_CRYPTED, chunk);
  }

  protected onProgress(progress: number) {
    this.emit(EventType.PROGRESS, progress);
  }

  protected onError(error: ErrorMessage | string) {
    this.emit(EventType.ERROR, error);

    if (this.thread) {
      this.thread.kill();
    }
  }
}

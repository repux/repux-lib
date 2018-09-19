import { Chunk, ProgressCrypto } from '../crypto/progress-crypto';
import { ErrorMessage } from '../error-message';
import 'buffer';
import IpfsAPI, { IpfsFileHash } from 'ipfs-api';
import { InternalFileMetaData } from '../types/internal-file-meta-data';
import { KeyDecryptor } from '../crypto/key-decryptor';
import { KeyEncryptor } from '../crypto/key-encryptor';
import { EventType } from '../types/event-type';
import { CryptoType } from '../types/crypto-type';
import { KeyImporter } from '../crypto/key-importer';
import { PrivateKey } from '../types/private-key';
import { PublicKey } from '../types/public-key';

export class FileReencryptor extends ProgressCrypto {
  private oldPrivateKey?: PrivateKey;
  private newPublicKey?: PublicKey;
  private fileHash?: string;
  private fileMeta?: InternalFileMetaData;

  /**
   * @param ipfs - IPFS Api object (see: https://github.com/ipfs/js-ipfs-api)
   * @param keyEncryptor - KeyEncryptor instance
   * @param keyDecryptor - KeyDecryptor instance
   * @param keyImporter - KeyImporter instance
   */
  constructor(
    private readonly ipfs: IpfsAPI,
    protected readonly keyEncryptor: KeyEncryptor,
    protected readonly keyDecryptor: KeyDecryptor,
    protected readonly keyImporter: KeyImporter) {
    super(keyImporter);
  }

  /**
   * Reencrypts file
   * @param oldPrivateKey - Public key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
   * @param newPublicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
   * @param fileHash - IPFS hash to meta file
   * @return FileReencryptor instance
   */
  reencrypt(oldPrivateKey: PrivateKey, newPublicKey: PublicKey, fileHash: IpfsFileHash): FileReencryptor {
    if (!oldPrivateKey || !newPublicKey) {
      this.onError(ErrorMessage.REENCRYPTION_ERROR);
      return this;
    }

    this.oldPrivateKey = oldPrivateKey;
    this.newPublicKey = newPublicKey;
    this.fileHash = fileHash;

    this.ipfs.files.get(this.fileHash, (err, files) => {
      if (!files || files.length === 0) {
        return this.onError(ErrorMessage.FILE_NOT_FOUND);
      }

      if (err) {
        return this.onError(err);
      }

      files.forEach(async (file) => {
        try {
          this.fileMeta = JSON.parse(file.content.toString());

          if (!this.fileMeta || !this.fileMeta.chunks) {
            return this.onError(ErrorMessage.INCORRECT_META_FILE);
          }

          this.downloadChunk(this.fileMeta.chunks[ 0 ]);
        } catch (err) {
          this.onError(err.message);
        }
      });
    });

    return this;
  }

  protected onProgress() {
    return false;
  }

  protected onChunkCrypted(chunk: Chunk) {
    const meta: InternalFileMetaData = Object.assign({}, this.fileMeta);

    this.ipfs.files.add(Buffer.from(chunk.chunk), async (err, files) => {
      if (err || !meta.chunks || !meta.symmetricKey || !this.oldPrivateKey || !this.newPublicKey) {
        return;
      }

      meta.chunks[ 0 ] = files[ 0 ].hash;

      const decryptedSymmetricKey = await this.keyDecryptor.decryptSymmetricKey(meta.symmetricKey, this.oldPrivateKey);
      meta.symmetricKey = await this.keyEncryptor.encryptSymmetricKey(decryptedSymmetricKey, this.newPublicKey);

      this.ipfs.files.add(Buffer.from(JSON.stringify(meta)), (_err, _files) => {
        if (_err) {
          this.onError(_err);
          return this.terminate();
        }
        this.emit(EventType.FINISH, _files[ 0 ].hash);
        this.emit(EventType.PROGRESS, 1);
      });
    });
  }

  private downloadChunk(chunk: string) {
    this.ipfs.files.get(chunk, (err, files) => {
      if (!files || files.length === 0) {
        this.onError(ErrorMessage.FILE_NOT_FOUND);
        return;
      }

      if (err) {
        return this.onError(err);
      }

      files.forEach(async (file) => {
        const content = file.content;

        if (!this.oldPrivateKey || !this.newPublicKey) {
          return;
        }

        try {
          const oldPrivateKey = await this.keyImporter.importPrivateKey(this.oldPrivateKey);
          const newPublicKey = await this.keyImporter.importPublicKey(this.newPublicKey);

          this.crypt(CryptoType.REENCRYPT, undefined, undefined, undefined, content, {
            isFirstChunk: true,
            oldPrivateKey,
            newPublicKey
          });
        } catch (error) {
          this.onError(ErrorMessage.REENCRYPTION_ERROR);
        }
      });
    });
  }
}

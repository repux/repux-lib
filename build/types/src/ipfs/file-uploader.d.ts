import { Chunk, ProgressCrypto } from '../crypto/progress-crypto';
import 'buffer';
import { KeyGenerator } from '../crypto/key-generator';
import { KeyEncryptor } from '../crypto/key-encryptor';
import IpfsAPI from 'ipfs-api';
import { FileMetaData } from '../types/file-meta-data';
import { KeyImporter } from '../crypto/key-importer';
import { PublicKey } from '../types/public-key';
export declare class FileUploader extends ProgressCrypto {
    private readonly ipfs;
    private readonly keyGenerator;
    private readonly keyEncryptor;
    protected readonly keyImporter: KeyImporter;
    private fileSize;
    private uploadedSize;
    private isUploadFinished;
    private file?;
    private metaData?;
    private initializationVector?;
    private publicKey?;
    private symmetricKey?;
    /**
     * @param ipfs - IPFS Api object (see: https://github.com/ipfs/js-ipfs-api)
     * @param keyGenerator - KeyGenerator instance
     * @param keyEncryptor - KeyEncryptor instance
     * @param keyImporter - KeyImporter instance
     */
    constructor(ipfs: IpfsAPI, keyGenerator: KeyGenerator, keyEncryptor: KeyEncryptor, keyImporter: KeyImporter);
    /**
     * Encrypts and uploads file using symmetric and public keys
     * @param publicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
     * @param file - file to upload
     * @param metaData - meta data object
     * @return FileUploader instance
     */
    upload(publicKey: PublicKey, file: File, metaData?: FileMetaData): FileUploader;
    protected onChunkCrypted(chunk: Chunk): void;
    protected onProgress(): void;
    private startEncryption;
    private isAllChunksAreSent;
    private finishUpload;
}

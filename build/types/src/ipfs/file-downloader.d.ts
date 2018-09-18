import { Chunk, ProgressCrypto } from '../crypto/progress-crypto';
import { FileSize } from '../file-handling/file-size';
import IpfsAPI, { IpfsFileHash } from 'ipfs-api';
import { KeyDecryptor } from '../crypto/key-decryptor';
import { KeyImporter } from '../crypto/key-importer';
import { PrivateKey } from '../types/private-key';
export declare class FileDownloader extends ProgressCrypto {
    private readonly ipfs;
    private readonly keyDecryptor;
    private readonly fileSize;
    protected readonly keyImporter: KeyImporter;
    private privateKey?;
    private symmetricKey?;
    private fileWriter?;
    private fileChunks?;
    private fileChunksNumber?;
    private isFirstChunk;
    private vector?;
    private firstChunkData?;
    /**
     * @param ipfs - IPFS Api object (see: https://github.com/ipfs/js-ipfs-api)
     * @param keyDecryptor - KeyDecryptor instance
     * @param fileSize - FileSize instance
     * @param keyImporter - KeyImporter instance
     */
    constructor(ipfs: IpfsAPI, keyDecryptor: KeyDecryptor, fileSize: FileSize, keyImporter: KeyImporter);
    /**
     * Downloads and decrypts file
     * @param privateKey - Private key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
     * @param fileHash - IPFS hash to meta file
     */
    download(privateKey: PrivateKey, fileHash: IpfsFileHash): FileDownloader;
    protected onProgress(progress: number): void;
    protected onChunkCrypted(chunk: Chunk): Promise<void>;
    private downloadFileChunks;
}

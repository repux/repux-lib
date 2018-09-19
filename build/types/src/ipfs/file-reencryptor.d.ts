import { Chunk, ProgressCrypto } from '../crypto/progress-crypto';
import 'buffer';
import IpfsAPI, { IpfsFileHash } from 'ipfs-api';
import { KeyDecryptor } from '../crypto/key-decryptor';
import { KeyEncryptor } from '../crypto/key-encryptor';
import { KeyImporter } from '../crypto/key-importer';
import { PrivateKey } from '../types/private-key';
import { PublicKey } from '../types/public-key';
export declare class FileReencryptor extends ProgressCrypto {
    private readonly ipfs;
    protected readonly keyEncryptor: KeyEncryptor;
    protected readonly keyDecryptor: KeyDecryptor;
    protected readonly keyImporter: KeyImporter;
    private oldPrivateKey?;
    private newPublicKey?;
    private fileHash?;
    private fileMeta?;
    /**
     * @param ipfs - IPFS Api object (see: https://github.com/ipfs/js-ipfs-api)
     * @param keyEncryptor - KeyEncryptor instance
     * @param keyDecryptor - KeyDecryptor instance
     * @param keyImporter - KeyImporter instance
     */
    constructor(ipfs: IpfsAPI, keyEncryptor: KeyEncryptor, keyDecryptor: KeyDecryptor, keyImporter: KeyImporter);
    /**
     * Reencrypts file
     * @param oldPrivateKey - Public key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm
     * @param newPublicKey - Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm
     * @param fileHash - IPFS hash to meta file
     * @return FileReencryptor instance
     */
    reencrypt(oldPrivateKey: PrivateKey, newPublicKey: PublicKey, fileHash: IpfsFileHash): FileReencryptor;
    protected onProgress(): boolean;
    protected onChunkCrypted(chunk: Chunk): void;
    private downloadChunk;
}

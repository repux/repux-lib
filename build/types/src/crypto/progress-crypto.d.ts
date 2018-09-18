import { Observable } from '../utils/observable';
import { Thread } from 'threads';
import { ErrorMessage } from '../error-message';
import { KeyImporter } from './key-importer';
import { CryptoType } from '../types/crypto-type';
import { SymmetricKey } from '../types/symmetric-key';
import { PrivateKey } from '../types/private-key';
import { PublicKey } from '../types/public-key';
export interface Chunk {
    number: number;
    chunk: Uint8Array;
    vector?: Uint8Array;
}
export declare class ProgressCrypto extends Observable {
    protected readonly keyImporter: KeyImporter;
    protected isFinished: boolean;
    protected chunks: any;
    protected maxChunkNumber: number;
    protected thread?: Thread;
    /**
     * @param keyImporter - KeyImporter instance
     */
    constructor(keyImporter: KeyImporter);
    /**
     * Returns worker thread by worker type
     * @param type - worker type
     * @return worker thread
     */
    static getWorkerByType(type: string): Thread | undefined;
    /**
     * Returns error by worker type
     * @param type - worker type
     * @return error message
     */
    static getErrorByType(type: CryptoType): ErrorMessage | undefined;
    /**
     * Terminates worker thread
     */
    terminate(): void;
    protected crypt(type: CryptoType, password?: SymmetricKey, initializationVector?: Uint8Array, asymmetricKey?: PrivateKey | PublicKey, file?: File | Uint8Array, options?: {}): Promise<Thread | undefined>;
    protected onChunkCrypted(chunk: Chunk): void;
    protected onProgress(progress: number): void;
    protected onError(error: ErrorMessage | string): void;
}

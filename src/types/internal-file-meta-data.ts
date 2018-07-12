import { FileMetaData } from './file-meta-data';

export interface InternalFileMetaData extends FileMetaData {
  /**
   * File chunks array
   */
  chunks?: string[]

  /**
   * Initialization vector
   */
  initializationVector?: Uint8Array;

  /**
   * Encrypted symmetric key
   */
  symmetricKey?: string;

  /**
   * File name
   */
  name?: string;

  /**
   * File size
   */
  size?: number;
}

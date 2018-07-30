import { EulaType } from './eula-type';
import { IpfsFileHash } from 'ipfs-api';

export interface Eula {
  /**
   * Type of EULA
   */
  type: EulaType,

  /**
   * File hash
   */
  fileHash: IpfsFileHash,

  /**
   * File name
   */
  fileName: string
}

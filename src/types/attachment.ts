import { IpfsFileHash } from 'ipfs-api';

export interface Attachment {
  /**
   * Title
   */
  title: string;

  /**
   * File hash
   */
  fileHash: IpfsFileHash;
}

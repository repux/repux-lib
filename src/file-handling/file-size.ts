import { FileSystemWriter } from './file-system-writer';
import { UserAgent } from '../utils/user-agent';
import { StorageSize } from '../types/storage-size';

export class FileSize {
  constructor(private userAgent: UserAgent) {
  }

  async getMaxFileSize() {
    if (await FileSystemWriter.isSupported()) {
      return 100 * StorageSize.GIGABYTE;
    }

    if (this.userAgent.isChromeOS() || this.userAgent.isFirefoxOS()) {
      return 1.3 * StorageSize.MEGABYTE;
    }

    if (this.userAgent.isMobile()) {
      return 100 * StorageSize.MEGABYTE;
    }

    if (this.userAgent.isTrident() || this.userAgent.isEdge()) {
      return 600 * StorageSize.MEGABYTE;
    }

    const architecture = this.userAgent.is64bit() ? 1 : 0;

    return StorageSize.GIGABYTE * (1 + architecture);
  }
}

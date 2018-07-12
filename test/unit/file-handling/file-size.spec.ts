import { expect } from 'chai';
import { FileSize } from '../../../src/file-handling/file-size';
import { FileSystemWriter } from '../../../src/file-handling/file-system-writer';
import { UserAgent } from '../../../src/utils/user-agent';

describe('FileSize', () => {
  const userAgent = new UserAgent();
  const fileSize = new FileSize(userAgent);

  describe('getMaxFileSize()', () => {
    it('should return 100GB when File System API is supported', async () => {
      FileSystemWriter.isSupported = () => Promise.resolve(true);

      const result = await fileSize.getMaxFileSize();
      expect(result).to.equal(100 * 1024 * 1024 * 1024);
    });

    it('should return 1.3MB for Firefox/Chrome for iOS', async () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);
      userAgent.isChromeOS = () => true;

      let result = await fileSize.getMaxFileSize();
      expect(result).to.equal(1.3 * 1024 * 1024);

      userAgent.isChromeOS = () => false;
      userAgent.isFirefoxOS = () => true;

      result = await fileSize.getMaxFileSize();
      expect(result).to.equal(1.3 * 1024 * 1024);
    });

    it('should return 100GB for mobile devices', async () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);
      userAgent.isChromeOS = () => false;
      userAgent.isFirefoxOS = () => false;
      userAgent.isMobile = () => true;

      const result = await fileSize.getMaxFileSize();
      expect(result).to.equal(100 * 1024 * 1024);
    });

    it('should return 600MB when browser engine is trident or browser name is edge', async () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);
      userAgent.isChromeOS = () => false;
      userAgent.isFirefoxOS = () => false;
      userAgent.isMobile = () => false;
      userAgent.isTrident = () => true;

      let result = await fileSize.getMaxFileSize();
      expect(result).to.equal(600 * 1024 * 1024);

      userAgent.isTrident = () => false;
      userAgent.isEdge = () => true;

      result = await fileSize.getMaxFileSize();
      expect(result).to.equal(600 * 1024 * 1024);
    });

    it('should return 1GB for all other cases when processor architecture is 32bit', async () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);
      userAgent.isChromeOS = () => false;
      userAgent.isFirefoxOS = () => false;
      userAgent.isMobile = () => false;
      userAgent.isTrident = () => false;
      userAgent.isEdge = () => false;
      userAgent.is64bit = () => false;

      const result = await fileSize.getMaxFileSize();
      expect(result).to.equal(1024 * 1024 * 1024);
    });

    it('should return 2GB for all other cases when processor architecture is 64bit', async () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);
      userAgent.isChromeOS = () => false;
      userAgent.isFirefoxOS = () => false;
      userAgent.isMobile = () => false;
      userAgent.isTrident = () => false;
      userAgent.isEdge = () => false;
      userAgent.is64bit = () => true;

      const result = await fileSize.getMaxFileSize();
      expect(result).to.equal(2 * 1024 * 1024 * 1024);
    });
  });
});

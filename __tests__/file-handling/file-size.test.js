jest.mock('../../src/file-handling/file-system-writer');
jest.mock('../../src/utils/user-agent');

import { FileSize } from '../../src/file-handling/file-size';
import { FileSystemWriter } from '../../src/file-handling/file-system-writer';
import { UserAgent } from '../../src/utils/user-agent';

describe('FileSize', () => {
    describe('getMaxFileSize()', () => {
        it('should return 100GB when File System API is supported', async () => {
            FileSystemWriter.isSupported = () => true;

            const result = await FileSize.getMaxFileSize();
            expect(result).toBe(100 * 1024 * 1024 * 1024);
        });

        it('should return 1.3MB for Firefox/Chrome for iOS', async () => {
            FileSystemWriter.isSupported = () => false;
            UserAgent.isChromeOS = () => true;

            let result = await FileSize.getMaxFileSize();
            expect(result).toBe(1.3 * 1024 * 1024);

            UserAgent.isChromeOS = () => false;
            UserAgent.isFirefoxOS = () => true;

            result = await FileSize.getMaxFileSize();
            expect(result).toBe(1.3 * 1024 * 1024);
        });

        it('should return 100GB for mobile devices', async () => {
            FileSystemWriter.isSupported = () => false;
            UserAgent.isChromeOS = () => false;
            UserAgent.isFirefoxOS = () => false;
            UserAgent.isMobile = () => true;

            const result = await FileSize.getMaxFileSize();
            expect(result).toBe(100 * 1024 * 1024);
        });

        it('should return 600MB when browser engine is trident or browser name is edge', async () => {
            FileSystemWriter.isSupported = () => false;
            UserAgent.isChromeOS = () => false;
            UserAgent.isFirefoxOS = () => false;
            UserAgent.isMobile = () => false;
            UserAgent.isTrident = () => true;

            let result = await FileSize.getMaxFileSize();
            expect(result).toBe(600 * 1024 * 1024);

            UserAgent.isTrident = () => false;
            UserAgent.isEdge = () => true;

            result = await FileSize.getMaxFileSize();
            expect(result).toBe(600 * 1024 * 1024);
        });

        it('should return 1GB for all other cases when processor architecture is 32bit', async () => {
            FileSystemWriter.isSupported = () => false;
            UserAgent.isChromeOS = () => false;
            UserAgent.isFirefoxOS = () => false;
            UserAgent.isMobile = () => false;
            UserAgent.isTrident = () => false;
            UserAgent.isEdge = () => false;
            UserAgent.is64bit = () => false;

            const result = await FileSize.getMaxFileSize();
            expect(result).toBe(1024 * 1024 * 1024);
        });

        it('should return 2GB for all other cases when processor architecture is 64bit', async () => {
            FileSystemWriter.isSupported = () => false;
            UserAgent.isChromeOS = () => false;
            UserAgent.isFirefoxOS = () => false;
            UserAgent.isMobile = () => false;
            UserAgent.isTrident = () => false;
            UserAgent.isEdge = () => false;
            UserAgent.is64bit = () => true;

            const result = await FileSize.getMaxFileSize();
            expect(result).toBe(2 * 1024 * 1024 * 1024);
        });
    });
});

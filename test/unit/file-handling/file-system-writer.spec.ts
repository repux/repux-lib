import { expect } from 'chai';
import { FileSystemWriter } from '../../../src/file-handling/file-system-writer';
import { ErrorMessage } from '../../../src/error-message';
import { FILE_URL, WriteStatus, mockRequestFileSystem } from '../../helpers/request-file-system-mock';

const FILE_NAME = 'testFileName';
const FILE_SIZE = 1024;

describe('FileSystemWriter', () => {
  describe('constructor()', () => {
    it('should expose fileName and fileSize', () => {
      const writer = new FileSystemWriter(FILE_NAME, FILE_SIZE);

      expect(writer.fileName).to.equal(FILE_NAME);
      expect(writer.fileSize).to.equal(FILE_SIZE);
    });
  });

  describe('isSupported()', () => {
    it('should return true when File System API works', async () => {
      window.requestFileSystem = (storageType, size, onSuccess, onError) => {
        expect(storageType).to.equal(window.TEMPORARY);
        expect(size).to.equal(1);
        expect(typeof onSuccess).to.equal('function');
        expect(typeof onError).to.equal('function');

        onSuccess(<any> null);
      };

      const result = await FileSystemWriter.isSupported();
      expect(result).to.equal(true);
    });

    it('should return false when File System API doesn\'t work', async () => {
      window.requestFileSystem = (storageType, size, onSuccess, onError) => {
        expect(storageType).to.equal(window.TEMPORARY);
        expect(size).to.equal(1);
        expect(typeof onSuccess).to.equal('function');
        expect(typeof onError).to.equal('function');

        if (onError) {
          onError(<any> null);
        }
      };

      const result = await FileSystemWriter.isSupported();
      expect(result).to.equal(false);
    });

    it('should return false when File System API is not supported', async () => {
      window.requestFileSystem = <any> null;
      window.webkitRequestFileSystem = <any> null;

      const result = await FileSystemWriter.isSupported();
      expect(result).to.equal(false);
    });
  });

  describe('init()', () => {
    it('should initialize writer and prepare file to write', async () => {
      FileSystemWriter.isSupported = () => Promise.resolve(true);
      mockRequestFileSystem();

      const writer = new FileSystemWriter(FILE_NAME, FILE_SIZE);
      await writer.init();

      expect(writer['fileEntry']).to.not.equal(undefined);
      expect(writer['fileWriter']).to.not.equal(undefined);
    });

    it('shouldn\'t initialize writer when File System API is not supported', async () => {
      FileSystemWriter.isSupported = () => Promise.resolve(false);

      const writer = new FileSystemWriter(FILE_NAME, FILE_SIZE);

      try {
        await writer.init();
      } catch (error) {
        expect(error).to.deep.equal({ error: ErrorMessage.FILE_SYSTEM_API_NOT_SUPPORTED });
      }
    });
  });

  describe('requestFileSystem()', () => {
    it('should return global requestFileSystem method or webkitRequestFileSystem method', () => {
      // @ts-ignore
      window.requestFileSystem = 'requestFileSystem';
      // @ts-ignore
      window.webkitRequestFileSystem = 'webkitRequestFileSystem';
      expect(FileSystemWriter.requestFileSystem()).to.equal('requestFileSystem');
      // @ts-ignore
      window.requestFileSystem = null;
      expect(FileSystemWriter.requestFileSystem()).to.equal('webkitRequestFileSystem');
      // @ts-ignore
      window.webkitRequestFileSystem = null;
      expect(FileSystemWriter.requestFileSystem()).to.equal(null);
    });
  });

  describe('write()', () => {
    it('should call write method on fileWriter object and wait for onwriteend event', async () => {
      FileSystemWriter.isSupported = () => Promise.resolve(true);
      mockRequestFileSystem();

      const writer = new FileSystemWriter(FILE_NAME, FILE_SIZE);
      await writer.init();
      await writer.write(new Uint8Array([]));

      // @ts-ignore
      expect(writer['fileWriter']['status']).to.equal(WriteStatus.FINISHED);
    });
  });

  describe('getFileURL()', () => {
    it('should return URL to file generated by fileWriter', async () => {
      FileSystemWriter.isSupported = () => Promise.resolve(true);
      mockRequestFileSystem();

      const writer = new FileSystemWriter(FILE_NAME, FILE_SIZE);
      await writer.init();

      expect(writer.getFileURL()).to.equal(FILE_URL);
    });
  });
});

import { expect } from 'chai';
import { BlobWriter } from '../../../src/file-handling/blob-writer';
import { ErrorMessage } from '../../../src/error-message';

const FILE_NAME = 'testFileName';
const FILE_SIZE = 1024;

describe('BlobWriter', () => {
  describe('constructor()', () => {
    it('should expose fileName and fileSize', () => {
      const writer = new BlobWriter(FILE_NAME, FILE_SIZE);

      expect(writer.fileName).to.equal(FILE_NAME);
      expect(writer.fileSize).to.equal(FILE_SIZE);
    });
  });

  describe('isSupported', () => {
    it('should always return true', () => {
      expect(BlobWriter.isSupported()).to.equal(true);
    });
  });

  describe('init()', () => {
    it('should initialize by setting data to emty Uint8Array', async () => {
      const writer = new BlobWriter(FILE_NAME, FILE_SIZE);
      await writer.init();

      expect(writer[ 'data' ]).to.deep.equal(new Uint8Array());
    });

    it('should return an error when writer is not supported', async () => {
      const writer = new BlobWriter(FILE_NAME, FILE_SIZE);
      BlobWriter.isSupported = () => false;

      try {
        await writer.init();
      } catch (error) {
        expect(error).to.deep.equal({ error: ErrorMessage.BLOB_NOT_SUPPORTED });
      }

      BlobWriter.isSupported = () => true;
    });
  });

  describe('write()', () => {
    it('should append new data to existing', () => {
      const writer = new BlobWriter(FILE_NAME, FILE_SIZE);
      writer[ 'data' ] = new Uint8Array([ 0, 1, 2, 3 ]);
      writer.write(new Uint8Array([ 4, 5, 6, 7 ]));
      expect(writer[ 'data' ]).to.deep.equal(new Uint8Array([ 0, 1, 2, 3, 4, 5, 6, 7 ]));
    });
  });

  describe('getFileURL()', () => {
    it('should return an URL to file', () => {
      const writer = new BlobWriter(FILE_NAME, FILE_SIZE);
      const blobUrl = 'blob:0000-0000-0000-0000';
      writer[ 'data' ] = new Uint8Array([ 0, 1, 2, 3 ]);

      window.URL.createObjectURL = (blob) => {
        expect(blob).to.deep.equal(new Blob(<BlobPart[]> [ writer[ 'data' ] ]));
        return blobUrl;
      };

      expect(writer.getFileURL()).to.equal(blobUrl);
    });
  });
});

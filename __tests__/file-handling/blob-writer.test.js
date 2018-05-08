import { BlobWriter } from '../../src/file-handling/blob-writer';
import { ERRORS } from '../../src/errors';
const FILE_NAME = 'testFileName';
const FILE_SIZE = 1024;

describe('BlobWriter', () => {
    describe('constructor()', () => {
        it('should expose fileName and fileSize', () => {
            const writer = new BlobWriter(FILE_NAME, FILE_SIZE);

            expect(writer.fileName).toEqual(FILE_NAME);
            expect(writer.fileSize).toEqual(FILE_SIZE);
        });
    });

    describe('isSupported', () => {
        it('should always return true', () => {
            expect(BlobWriter.isSupported()).toBeTruthy();
        });
    });

    describe('init()', () => {
        it('should initialize by setting data to emty Uint8Array', async () => {
            const writer = new BlobWriter(FILE_NAME, FILE_SIZE);
            await writer.init();

            expect(writer.data).toEqual(new Uint8Array());
        });

        it('should return an error when writer is not supported', async () => {
            const writer = new BlobWriter(FILE_NAME, FILE_SIZE);
            BlobWriter.isSupported = jest.fn(() => false);

            try {
                await writer.init();
            } catch (error) {
                expect(error).toEqual({ error: ERRORS.BLOB_NOT_SUPPORTED });
            }

            BlobWriter.isSupported = jest.fn(() => true);
        });
    });

    describe('write()', () => {
        it('should append new data to existing', () => {
            const writer = new BlobWriter(FILE_NAME, FILE_SIZE);
            writer.data = new Uint8Array([0, 1, 2, 3]);
            writer.write(new Uint8Array([4, 5, 6, 7]));
            expect(writer.data).toEqual(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]));
        });
    });

    describe('getFileURL()', () => {
        it('should return an URL to file', () => {
            const writer = new BlobWriter(FILE_NAME, FILE_SIZE);
            const blobUrl = 'blob:0000-0000-0000-0000';
            writer.data = new Uint8Array([0, 1, 2, 3]);

            window.URL.createObjectURL = jest.fn((blob) => {
                expect(blob).toEqual(new Blob([writer.data]));
                return blobUrl;
            });

            expect(writer.getFileURL()).toBe(blobUrl);
            window.URL.createObjectURL = null;
        });
    });
});

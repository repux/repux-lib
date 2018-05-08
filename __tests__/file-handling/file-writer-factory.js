jest.mock('../../src/file-handling/file-system-writer');
jest.mock('../../src/file-handling/blob-writer');

import { FileSystemWriter } from '../../src/file-handling/file-system-writer';
import { FileWriterFactory } from '../../src/file-handling/file-writer-factory';
import { BlobWriter } from '../../src/file-handling/blob-writer';
const FILE_NAME = 'testFileName';
const FILE_SIZE = 1024;

describe('FileWriterFactory', () => {
    describe('create()', () => {
        it('should return FileSystemWriter instance when it is supported', async () => {
            FileSystemWriter.isSupported = () => true;
            const writer = await FileWriterFactory.create(FILE_NAME, FILE_SIZE);
            expect(writer.constructor.name).toBe('FileSystemWriter');
        });

        it('should return BlobWriter instance when FileSystemWriter isn\'t supported and BlobWriter is supported', async () => {
            FileSystemWriter.isSupported = () => false;
            BlobWriter.isSupported = () => true;

            const writer = await FileWriterFactory.create(FILE_NAME, FILE_SIZE);
            expect(writer.constructor.name).toBe('BlobWriter');
        });

        it('shouldn\'t return any object when both FileSystemWriter and BlobWriter aren\'t supported', async () => {
            FileSystemWriter.isSupported = () => false;
            BlobWriter.isSupported = () => false;

            const writer = await FileWriterFactory.create(FILE_NAME, FILE_SIZE);
            expect(writer).toBeFalsy();
        });
    });
});

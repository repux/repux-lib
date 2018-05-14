/* eslint no-unused-expressions: 0 */

import { ERRORS } from '../../../src/errors';
import { FileSystemWriter } from '../../../src/file-handling/file-system-writer';
import { FileWriterFactory } from '../../../src/file-handling/file-writer-factory';
import { BlobWriter } from '../../../src/file-handling/blob-writer';
const FILE_NAME = 'testFileName';
const FILE_SIZE = 1024;

describe('FileWriterFactory', () => {
    describe('create()', () => {
        it('should return FileSystemWriter instance when it is supported', async () => {
            FileSystemWriter.isSupported = () => true;
            const writer = await FileWriterFactory.create(FILE_NAME, FILE_SIZE);
            expect(writer instanceof FileSystemWriter).to.be.true;
        });

        it('should return BlobWriter instance when FileSystemWriter isn\'t supported and BlobWriter is supported', async () => {
            FileSystemWriter.isSupported = () => false;
            BlobWriter.isSupported = () => true;

            const writer = await FileWriterFactory.create(FILE_NAME, FILE_SIZE);
            expect(writer instanceof BlobWriter).to.be.true;
        });

        it('should throw an error when FileSystemWriter and BlobWriter aren\'t supported', async () => {
            FileSystemWriter.isSupported = () => false;
            BlobWriter.isSupported = () => false;

            try {
                await FileWriterFactory.create(FILE_NAME, FILE_SIZE);
            } catch (err) {
                expect(err.message).to.equal(ERRORS.DOESNT_SUPPPORT_ANY_FILE_WRITER);
            }
        });
    });
});

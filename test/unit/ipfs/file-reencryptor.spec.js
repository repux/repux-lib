/* eslint no-unused-expressions: 0 */
/* global sinon */
import { KeyImporter } from '../../../src/crypto/key-importer';
import { FileReencryptor } from '../../../src/ipfs/file-reencryptor';
import IpfsApi, { FILE_HASHES, FILES } from '../../helpers/ipfs-api-mock';
import { KeyEncryptor } from '../../../src/crypto/key-encryptor';

describe('FileReencryptor', () => {
    let ipfs = new IpfsApi();
    const PUBLIC_KEY = 'PUBLIC_KEY';
    const PRIVATE_KEY = 'PRIVATE_KEY';

    describe('constructor()', () => {
        it('should expose ipfs', () => {
            const reencryptor = new FileReencryptor(ipfs);

            expect(reencryptor.ipfs).to.not.be.undefined;
        });
    });

    describe('reencrypt()', () => {
        it('it should fetch meta file when user provide correct meta file hash and it should call downloadChunk with first chunk hash as an argument', () => {
            const reencryptor = new FileReencryptor(ipfs);

            return new Promise(resolve => {
                reencryptor.downloadChunk = (chunkHash) => {
                    expect(reencryptor.fileMeta).to.deep.equal(JSON.parse(FILES[FILE_HASHES.META_FILE_HASH].content));
                    expect(chunkHash).to.equal(FILE_HASHES.FILE_CHUNK_0);
                    resolve();
                };

                reencryptor.reencrypt(PRIVATE_KEY, PUBLIC_KEY, FILE_HASHES.META_FILE_HASH);
            });
        });

        it('should emit an error when user provide incorrect meta file hash', () => {
            const reencryptor = new FileReencryptor(ipfs);

            return new Promise(resolve => {
                reencryptor.reencrypt(PRIVATE_KEY, PUBLIC_KEY, 'INCORRECT_FILE_HASH');
                reencryptor.on('error', () => {
                    resolve();
                });
            });
        });

        it('should emit an error caught from downloadChunk method', () => {
            const reencryptor = new FileReencryptor(ipfs);
            const ERROR = 'ERROR';

            return new Promise(resolve => {
                reencryptor.downloadChunk = () => {
                    throw new Error(ERROR);
                };
                reencryptor.reencrypt(PRIVATE_KEY, PUBLIC_KEY, FILE_HASHES.META_FILE_HASH);
                reencryptor.on('error', (eventType, error) => {
                    expect(error).to.equal(ERROR);
                    resolve();
                });
            });
        });
    });

    describe('downloadChunk()', () => {
        it('should fetch chunk by hash from parameter, import keys from JWK format and call crypt method', function () {
            const reencryptor = new FileReencryptor(ipfs);
            reencryptor.oldPrivateKey = 'OLD_PRIVATE_KEY';
            reencryptor.newPublicKey = 'NEW_PUBLIC_KEY';

            KeyImporter.importPrivateKey = (key) => key + '_IMPORTED';
            KeyImporter.importPublicKey = (key) => key + '_IMPORTED';

            return new Promise(resolve => {
                reencryptor.crypt = (method, symmetricKey, initializationVector, asymmetricKey, content, options) => {
                    expect(method).to.equal('reencrypt');
                    expect(symmetricKey).to.equal(null);
                    expect(initializationVector).to.equal(null);
                    expect(asymmetricKey).to.equal(null);
                    expect(content).to.equal(FILES[FILE_HASHES.FILE_CHUNK_0].content);
                    expect(options.isFirstChunk).to.be.true;
                    expect(options.oldPrivateKey).to.equal('OLD_PRIVATE_KEY_IMPORTED');
                    expect(options.newPublicKey).to.equal('NEW_PUBLIC_KEY_IMPORTED');
                    resolve();
                };

                reencryptor.downloadChunk(FILE_HASHES.FILE_CHUNK_0);
            });
        });

        it('should emit an error when chunk hash is incorrect', () => {
            const reencryptor = new FileReencryptor(ipfs);

            return new Promise(resolve => {
                reencryptor.downloadChunk('INCORRECT_FILE_HASH');
                reencryptor.on('error', () => {
                    resolve();
                });
            });
        });
    });

    describe('onChunkCrypted()', () => {
        it('shoud emit finish event with new meta file hash', async () => {
            KeyEncryptor.decryptSymmetricKey = sinon.fake.returns('DECRYPTED_KEY');
            KeyEncryptor.encryptSymmetricKey = sinon.fake.returns('ENCRYPTED_KEY');
            const vector = new Uint8Array([0, 0, 0]);
            const chunk = new Uint8Array([1, 2, 3]);
            const reencryptor = new FileReencryptor(ipfs);
            reencryptor.fileMeta = {
                chunks: [FILE_HASHES.FILE_CHUNK_0, FILE_HASHES.FILE_CHUNK_1]
            };

            return new Promise(resolve => {
                reencryptor.onChunkCrypted({ vector, chunk });
                reencryptor.on('finish', (eventType, metaFileHash) => {
                    expect(metaFileHash).to.equal(FILE_HASHES.NEW_IPFS_FILE);
                    expect(KeyEncryptor.decryptSymmetricKey.called).to.be.true;
                    expect(KeyEncryptor.encryptSymmetricKey.called).to.be.true;
                    resolve();
                });
            });
        });
    });
});

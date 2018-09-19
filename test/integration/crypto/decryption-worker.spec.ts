import assert from 'assert';
import { FILE_CONTENT, FILE_NAME, IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL } from '../config';
import {
  ASYMMETRIC_ENCRYPTION_ALGORITHM,
  ASYMMETRIC_ENCRYPTION_HASH, CHUNK_SIZE,
  FIRST_CHUNK_SIZE,
  SYMMETRIC_ENCRYPTION_ALGORITHM, VECTOR_SIZE
} from '../../../src/config';
import IpfsAPI, { IpfsFileContent, IpfsFileHash } from 'ipfs-api';
import { AsymmetricKeyPair, RepuxLib, SymmetricKey } from '../../../src';
// @ts-ignore
import { decryptionWorker } from '../../../src/threads/decryption-worker';
import { InternalFileMetaData } from '../../../src/types/internal-file-meta-data';
import { EventType } from '../../../src/types/event-type';

describe('File chunks shouldn\'t be decrypted when user provides improper keys', function () {
  this.timeout(90000);
  let ipfs: IpfsAPI;
  let largeFileContent: string;
  let file: File;
  let repux: RepuxLib;
  let fileHash: IpfsFileHash;
  let asymmetricKeys: AsymmetricKeyPair;
  let symmetricKey: SymmetricKey;
  let metaContent: InternalFileMetaData;
  let initializationVector: Uint8Array;

  before(() => {
    return new Promise(async (resolve, reject) => {
      largeFileContent = '';
      ipfs = new IpfsAPI({
        host: IPFS_HOST,
        protocol: IPFS_PROTOCOL,
        port: IPFS_PORT
      });

      for (let i = 0; i < 1000000; i++) {
        largeFileContent += FILE_CONTENT;
      }

      file = new File([ new Blob([ largeFileContent ]) ], FILE_NAME);

      repux = new RepuxLib(ipfs);

      asymmetricKeys = await repux.generateAsymmetricKeyPair();
      const uploader = repux.createFileUploader();

      uploader.on(EventType.FINISH, (_eventType: EventType, metaFileHash: string) => {
        fileHash = metaFileHash;
        symmetricKey = <SymmetricKey> uploader[ 'symmetricKey' ];

        ipfs.files.get(fileHash, (err: string, files: IpfsFileContent[]) => {
          if (err) {
            reject(err);
          }
          metaContent = JSON.parse(files[ 0 ].content.toString());
          initializationVector = Uint8Array.from(Object.values(<Uint8Array> metaContent.initializationVector));
          resolve();
        });
      });

      uploader.upload(asymmetricKeys.publicKey, file);
    });
  });

  describe('User shouldn\'t be able to decrypt second chunk with first chunk initialization vector', () => {
    it('should return error', (done) => {
      if (!metaContent.chunks) {
        return assert.ok(false);
      }

      ipfs.files.get(metaContent.chunks[ 1 ], async (err: string, files: IpfsFileContent[]) => {
        if (err) {
          throw new Error(err);
        }
        const symmetric = await crypto.subtle.importKey('jwk', symmetricKey, <any> {
          name: SYMMETRIC_ENCRYPTION_ALGORITHM
        }, false, [ 'decrypt' ]);

        decryptionWorker([ files[ 0 ].content, symmetric, initializationVector, null, {
          isFirstChunk: false,
          CHUNK_SIZE,
          FIRST_CHUNK_SIZE,
          VECTOR_SIZE,
          SYMMETRIC_ENCRYPTION_ALGORITHM,
          ASYMMETRIC_ENCRYPTION_ALGORITHM
        } ], () => {
        }, (data: any) => {
          if (data.error !== null) {
            assert.ok(true);
            done();
          }
        });
      });
    });
  });

  describe('User shouldn\'t be able to decrypt first chunk without symmetric key', () => {
    it('decoded chunk shouldn\'t look like original file chunk', (done) => {
      if (!metaContent.chunks) {
        return assert.ok(false);
      }

      ipfs.files.get(metaContent.chunks[ 0 ], async (err: string, files: IpfsFileContent[]) => {
        if (err) {
          throw new Error(err);
        }
        const asymmetric = await crypto.subtle.importKey('jwk', asymmetricKeys.privateKey, {
          name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
          hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
        }, false, [ 'decrypt' ]);

        decryptionWorker([ files[ 0 ].content, null, null, asymmetric, {
          isFirstChunk: true,
          CHUNK_SIZE,
          FIRST_CHUNK_SIZE,
          VECTOR_SIZE,
          SYMMETRIC_ENCRYPTION_ALGORITHM,
          ASYMMETRIC_ENCRYPTION_ALGORITHM
        } ], () => {
        }, (data: any) => {
          if (data.chunk) {
            assert.notStrictEqual(largeFileContent.substring(0, FIRST_CHUNK_SIZE), new TextDecoder('utf8').decode(data.chunk));
            done();
          }
        });
      });
    });
  });

  describe('User shouldn\'t be able to decrypt first chunk without asymmetric key', () => {
    it('should return error', (done) => {
      if (!metaContent.chunks) {
        return assert.ok(false);
      }

      ipfs.files.get(metaContent.chunks[ 0 ], async (err: string, files: IpfsFileContent[]) => {
        if (err) {
          throw new Error(err);
        }
        const symmetric = await crypto.subtle.importKey('jwk', symmetricKey, <any> {
          name: SYMMETRIC_ENCRYPTION_ALGORITHM
        }, false, [ 'decrypt' ]);

        decryptionWorker([ files[ 0 ].content, symmetric, initializationVector, null, {
          isFirstChunk: false,
          CHUNK_SIZE,
          FIRST_CHUNK_SIZE,
          VECTOR_SIZE,
          SYMMETRIC_ENCRYPTION_ALGORITHM,
          ASYMMETRIC_ENCRYPTION_ALGORITHM
        } ], () => {
        }, (data: any) => {
          if (data.error !== null) {
            assert.ok(true);
            done();
          }
        });
      });
    });
  });
});

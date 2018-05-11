/* eslint no-unused-expressions: 0 */

import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH, SYMMETRIC_ENCRYPTION_ALGORITHM } from '../../../src/config';
import { KeyImporter } from '../../../src/crypto/key-importer';

describe('KeyImporter', () => {
    if (!global.crypto) {
        global.crypto = {
            subtle: {}
        };
    }

    describe('importPublicKey()', () => {
        it('should call crypto.subtle.importKey with proper arguments', async () => {
            const publicKey = 'PUBLIC_KEY';
            const result = 'IMPORTED_PUBLIC_KEY';

            global.crypto.subtle.importKey = (type, key, algorithm, extractable, keyUsages) => {
                expect(type).to.equal('jwk');
                expect(key).to.equal(publicKey);
                expect(algorithm).to.deep.equal({
                    name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
                    hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
                });
                expect(extractable).to.be.false;
                expect(keyUsages).to.deep.equal([ 'encrypt' ]);

                return result;
            };

            const importedPublicKey = await KeyImporter.importPublicKey(publicKey);
            expect(importedPublicKey).to.equal(result);
        });
    });

    describe('importPrivateKey()', () => {
        it('should call crypto.subtle.importKey with proper arguments', async () => {
            const privateKey = 'PRIVATE_KEY';
            const result = 'IMPORTED_PRIVATE_KEY';

            global.crypto.subtle.importKey = (type, key, algorithm, extractable, keyUsages) => {
                expect(type).to.equal('jwk');
                expect(key).to.equal(privateKey);
                expect(algorithm).to.deep.equal({
                    name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
                    hash: { name: ASYMMETRIC_ENCRYPTION_HASH }
                });
                expect(extractable).to.be.false;
                expect(keyUsages).to.deep.equal([ 'decrypt' ]);

                return result;
            };

            const importedPrivateKey = await KeyImporter.importPrivateKey(privateKey);
            expect(importedPrivateKey).to.equal(result);
        });
    });

    describe('importSymmetricKey()', () => {
        it('should call crypto.subtle.importKey with proper arguments', async () => {
            const symmetricKey = 'SYMMETRIC_KEY';
            const result = 'IMPORTED_SYMMETRIC_KEY';

            global.crypto.subtle.importKey = (type, key, algorithm, extractable, keyUsages) => {
                expect(type).to.equal('jwk');
                expect(key).to.equal(symmetricKey);
                expect(algorithm).to.deep.equal({
                    name: SYMMETRIC_ENCRYPTION_ALGORITHM
                });
                expect(extractable).to.be.false;
                expect(keyUsages).to.deep.equal([ 'encrypt', 'decrypt' ]);

                return result;
            };

            const importedSymmetricKey = await KeyImporter.importSymmetricKey(symmetricKey);
            expect(importedSymmetricKey).to.equal(result);
        });
    });
});

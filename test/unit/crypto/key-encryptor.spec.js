/* global crypto, TextEncoder, TextDecoder */

import { KeyEncryptor } from '../../../src/crypto/key-encryptor';
import { ASYMMETRIC_ENCRYPTION_ALGORITHM, ASYMMETRIC_ENCRYPTION_HASH } from '../../../src/config';
import { KeyImporter } from '../../../src/crypto/key-importer';
import Base64 from '../../../src/utils/base64';

describe('KeyEncryptor', () => {
    if (!global.crypto) {
        global.crypto = {
            subtle: {}
        };
    }

    describe('encryptSymmetricKey()', () => {
        it('should call importPublicKey then crypto.subtle.encrypt and then Base64.encode', async () => {
            const symmetricKey = 'SYMMETRIC_KEY';
            const publicKey = 'PUBLIC_KEY';

            const encrypt = crypto.subtle.encrypt;
            const encode = TextEncoder.prototype.encode;
            const importPublicKey = KeyImporter.importPublicKey;
            const baseEncode = Base64.encode;

            crypto.subtle.encrypt = (algorithm, publicKey, symmetricKeyEncoded) => {
                expect(algorithm).to.deep.equal({
                    name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
                    hash: {
                        name: ASYMMETRIC_ENCRYPTION_HASH
                    }
                });
                expect(publicKey).to.equal('PUBLIC_KEY_IMPORTED');
                expect(symmetricKeyEncoded).to.equal('"SYMMETRIC_KEY"_TEXT_ENCODED');

                return symmetricKeyEncoded + '_ENCRYPTED_WITH_' + publicKey;
            };

            TextEncoder.prototype.encode = string => string + '_TEXT_ENCODED';
            KeyImporter.importPublicKey = key => key + '_IMPORTED';
            Base64.encode = key => key + '_BASE64_ENCODED';

            const result = await KeyEncryptor.encryptSymmetricKey(symmetricKey, publicKey);
            expect(result).to.equal('"SYMMETRIC_KEY"_TEXT_ENCODED_ENCRYPTED_WITH_PUBLIC_KEY_IMPORTED_BASE64_ENCODED');

            crypto.subtle.encrypt = encrypt;
            TextEncoder.prototype.encode = encode;
            KeyImporter.importPublicKey = importPublicKey;
            Base64.encode = baseEncode;
        });
    });

    describe('decryptSymmetricKey()', () => {
        it('should call Base64.decode then importPrivateKey and then crypto.subtle.decrypt', async () => {
            const symmetricKey = 'SYMMETRIC_KEY';
            const privateKey = 'PRIVATE_KEY';

            const decrypt = crypto.subtle.decrypt;
            const decode = TextEncoder.prototype.decode;
            const importPrivateKey = KeyImporter.importPrivateKey;
            const baseDecode = Base64.decode;

            crypto.subtle.decrypt = (algorithm, privateKey, symmetricKey) => {
                expect(algorithm).to.deep.equal({
                    name: ASYMMETRIC_ENCRYPTION_ALGORITHM,
                    hash: {
                        name: ASYMMETRIC_ENCRYPTION_HASH
                    }
                });
                expect(privateKey).to.equal('PRIVATE_KEY_IMPORTED');
                expect(symmetricKey).to.equal('SYMMETRIC_KEY_BASE64_DECODED');

                return symmetricKey + '_DECRYPTED_WITH_' + privateKey;
            };

            TextDecoder.prototype.decode = string => '{"key": "' + string + '_TEXT_DECODED"}';
            KeyImporter.importPrivateKey = key => key + '_IMPORTED';
            Base64.decode = key => key + '_BASE64_DECODED';

            const result = await KeyEncryptor.decryptSymmetricKey(symmetricKey, privateKey);
            expect(result.key).to.equal('SYMMETRIC_KEY_BASE64_DECODED_DECRYPTED_WITH_PRIVATE_KEY_IMPORTED_TEXT_DECODED');

            crypto.subtle.decrypt = decrypt;
            TextEncoder.prototype.decode = decode;
            KeyImporter.importPrivateKey = importPrivateKey;
            Base64.decode = baseDecode;
        });
    });
});

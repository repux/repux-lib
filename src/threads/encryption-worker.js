/* global FileReader, crypto */

/**
 * Encrypts file with AES-CBC algorithm using password () and emits first chunk (190 bytes) encrypted
 * also with RSA algorithm using publicKey (2048 bits)
 * @param file
 * @param passwordKey
 * @param initializationVector
 * @param publicKey
 * @param options
 * @param done
 * @param progress
 * @returns {Promise<any>}
 */
export function encryptionWorker([file, passwordKey, initializationVector, publicKey, options], done, progress) {
    const startTime = (new Date()).getTime();
    let offset = 0;
    const reader = new FileReader();
    let vector = initializationVector;

    reader.onload = async () => {
        let tmp = await encryptChunk(new Uint8Array(reader.result));

        if (tmp.byteLength) {
            progress({ chunk: tmp, number: offset / options.CHUNK_SIZE + 1, vector });
        }

        offset += options.CHUNK_SIZE;

        if (offset > file.size) {
            offset = file.size;
        }

        progress({ time: (new Date()).getTime() - startTime, progress: offset / file.size });

        seek();
    };

    seek();

    /// ----

    function seek() {
        if (offset >= file.size) {
            return done();
        }

        const slice = file.slice(offset, offset + options.CHUNK_SIZE);
        reader.readAsArrayBuffer(slice);
    }

    function getVector(encryptedChunk, bytes) {
        const vector = new Uint8Array(options.VECTOR_SIZE);

        for (let i = 0; i < options.VECTOR_SIZE; i++) {
            vector[i] = encryptedChunk[i] ^ bytes[i];
        }

        return vector;
    }

    async function encryptFirstChunk(bytes) {
        let encryptedChunk;

        try {
            encryptedChunk = await crypto.subtle.encrypt({
                name: options.ASYMMETRIC_ENCRYPTION_ALGORITHM,
                hash: { name: options.ASYMMETRIC_ENCRYPTION_HASH }
            }, publicKey, bytes);
        } catch (error) {
            progress({ error: options.ENCRYPTION_ERROR });
        }

        progress({ chunk: encryptedChunk, number: 0 });
    }

    async function encryptChunk(bytes) {
        let tmp, encryptedChunk;

        const alg = {
            name: options.SYMMETRIC_ENCRYPTION_ALGORITHM,
            iv: vector
        };

        try {
            encryptedChunk = await crypto.subtle.encrypt(
                alg,
                passwordKey,
                bytes
            );
        } catch (error) {
            progress({ error: options.ENCRYPTION_ERROR });
        }

        vector = getVector(new Uint8Array(encryptedChunk), bytes);

        if (offset === 0) {
            // Encrypt first chunk with asymmetric key
            await encryptFirstChunk(new Uint8Array(encryptedChunk.slice(0, options.FIRST_CHUNK_SIZE)));
            progress({ time: (new Date()).getTime() - startTime, progress: options.FIRST_CHUNK_SIZE / file.size });

            if (encryptedChunk.byteLength > options.FIRST_CHUNK_SIZE) {
                tmp = new Uint8Array(encryptedChunk.slice(options.FIRST_CHUNK_SIZE));
            }
        } else {
            tmp = new Uint8Array(encryptedChunk);
        }

        return tmp;
    }
}

/**
 * Decrypts file chunk
 * @param file
 * @param passwordKey
 * @param initializationVector
 * @param privateKey
 * @param options
 * @param done
 * @param progress
 * @returns {Promise<any>}
 */

export async function decryptionWorker([ bytes, passwordKey, initializationVector, privateKey, options ], done, progress) {
    const startTime = (new Date()).getTime();
    let vector = initializationVector;

    function getVector(decryptedChunk, bytes) {
        const vector = new Uint8Array(options.VECTOR_SIZE);

        for (let i = 0; i < options.VECTOR_SIZE; i++) {
            vector[i] = decryptedChunk[i] ^ bytes[i];
        }

        return vector;
    }

    async function decryptFirstChunk(bytes) {
        let decryptedChunk;

        try {
            decryptedChunk = await crypto.subtle.decrypt({ name: options.ASYMMETRIC_ENCRYPTION_ALGORITHM }, privateKey, bytes);
            progress({ chunk: decryptedChunk, number: 0, vector });
        } catch(error) {
            progress({ error: options.DECRYPTION_ERROR });
        }
    }

    async function decryptChunk(bytes) {
        const alg = {
            name: options.SYMMETRIC_ENCRYPTION_ALGORITHM,
            iv: vector
        };

        let decryptedChunk;

        try {
            decryptedChunk = await crypto.subtle.decrypt(
                alg,
                passwordKey,
                bytes
            );
        } catch(error) {
            progress({ error: options.DECRYPTION_ERROR });
        }

        vector = getVector(new Uint8Array(decryptedChunk), bytes);

        progress({ chunk: decryptedChunk, number: 0, vector });
        progress({ time: (new Date()).getTime() - startTime, progress: 1 });
        done();
    }

    if (options.isFirstChunk) {
        decryptFirstChunk(bytes);
    } else {
        decryptChunk(bytes);
    }
}

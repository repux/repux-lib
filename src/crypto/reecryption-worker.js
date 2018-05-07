/**
 * Reencrypts file chunk
 * @param file
 * @param passwordKey
 * @param initializationVector
 * @param privateKey
 * @param options
 * @param done
 * @param progress
 * @returns {Promise<any>}
 */
export function reencryptionWorker([ bytes, passwordKey, initializationVector, privateKey, options ], done, progress) {
    async function reencrypt() {
        try{
            const decryptedChunk = await crypto.subtle.decrypt({ name: options.ASYMMETRIC_ENCRYPTION_ALGORITHM }, options.oldPrivateKey, bytes);
            const reencryptedChunk = await crypto.subtle.encrypt({ name: options.ASYMMETRIC_ENCRYPTION_ALGORITHM }, options.newPublicKey, decryptedChunk);
            progress({ chunk: reencryptedChunk, number: 0 });
        } catch(error) {
            progress({ error: options.ENCRYPTION_ERROR });
        }
    }

    reencrypt();
}

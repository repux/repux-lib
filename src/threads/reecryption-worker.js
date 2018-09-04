/* global crypto */

/**
 * Re-encrypts file chunk
 * @param file
 * @param passwordKey
 * @param initializationVector
 * @param privateKey
 * @param options
 * @param done
 * @param progress
 * @returns {Promise<any>}
 */
export function reencryptionWorker([bytes, passwordKey, initializationVector, privateKey, options], done, progress) {
  reencrypt(bytes, options.ASYMMETRIC_ENCRYPTION_ALGORITHM, options.ASYMMETRIC_ENCRYPTION_HASH, options.oldPrivateKey, options.newPublicKey, options.REENCRYPTION_ERROR);

  /// ---
  async function reencrypt(_bytes, _algorithmType, _algorithmHash, _privateKey, _publicKey, _error) {
    try {
      const decryptedChunk = await crypto.subtle.decrypt({
        name: _algorithmType,
        hash: _algorithmHash
      }, _privateKey, _bytes);
      const reencryptedChunk = await crypto.subtle.encrypt({
        name: _algorithmType,
        hash: _algorithmHash
      }, _publicKey, decryptedChunk);
      progress({ chunk: reencryptedChunk, number: 0 });
    } catch (error) {
      progress({ error: _error });
    }
  }
}

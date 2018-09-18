
#  API Reference

## Index

### Enumerations

* [BuyerType](enums/buyertype.md)
* [CryptoType](enums/cryptotype.md)
* [ErrorMessage](enums/errormessage.md)
* [EulaType](enums/eulatype.md)
* [EventType](enums/eventtype.md)
* [PurchaseType](enums/purchasetype.md)
* [StorageSize](enums/storagesize.md)
* [WriteStatus](enums/writestatus.md)

### Classes

* [Base64Decoder](classes/base64decoder.md)
* [Base64Encoder](classes/base64encoder.md)
* [BlobWriter](classes/blobwriter.md)
* [FileDownloader](classes/filedownloader.md)
* [FileReencryptor](classes/filereencryptor.md)
* [FileSize](classes/filesize.md)
* [FileSystemWriter](classes/filesystemwriter.md)
* [FileUploader](classes/fileuploader.md)
* [FileWriterFactory](classes/filewriterfactory.md)
* [IpfsApi](classes/ipfsapi.md)
* [KeyDecryptor](classes/keydecryptor.md)
* [KeyDeserializer](classes/keydeserializer.md)
* [KeyEncryptor](classes/keyencryptor.md)
* [KeyGenerator](classes/keygenerator.md)
* [KeyImporter](classes/keyimporter.md)
* [KeySerializer](classes/keyserializer.md)
* [Observable](classes/observable.md)
* [ProgressCrypto](classes/progresscrypto.md)
* [RepuxLib](classes/repuxlib.md)
* [UserAgent](classes/useragent.md)

### Interfaces

* [AsymmetricKeyPair](interfaces/asymmetrickeypair.md)
* [Attachment](interfaces/attachment.md)
* [Chunk](interfaces/chunk.md)
* [DataLocation](interfaces/datalocation.md)
* [DownloadedFile](interfaces/downloadedfile.md)
* [Eula](interfaces/eula.md)
* [EventHandler](interfaces/eventhandler.md)
* [FileMetaData](interfaces/filemetadata.md)
* [FileWriterInterface](interfaces/filewriterinterface.md)
* [InternalFileMetaData](interfaces/internalfilemetadata.md)
* [PrivateKey](interfaces/privatekey.md)
* [PublicKey](interfaces/publickey.md)
* [SymmetricKey](interfaces/symmetrickey.md)

### Variables

* [ASYMMETRIC_ENCRYPTION_ALGORITHM](#asymmetric_encryption_algorithm)
* [ASYMMETRIC_ENCRYPTION_EXPONENT](#asymmetric_encryption_exponent)
* [ASYMMETRIC_ENCRYPTION_HASH](#asymmetric_encryption_hash)
* [ASYMMETRIC_ENCRYPTION_HASH_LENGTH](#asymmetric_encryption_hash_length)
* [ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH](#asymmetric_encryption_modulus_length)
* [CHUNK_SIZE](#chunk_size)
* [ENCRYPTED_SYMMETRIC_KEY](#encrypted_symmetric_key)
* [FILE_CONTENT](#file_content)
* [FILE_NAME](#file_name)
* [FILE_URL](#file_url)
* [FIRST_CHUNK_SIZE](#first_chunk_size)
* [IPFS_HASH_LENGTH](#ipfs_hash_length)
* [IPFS_HOST](#ipfs_host)
* [IPFS_PORT](#ipfs_port)
* [IPFS_PROTOCOL](#ipfs_protocol)
* [STORAGE_TYPE](#storage_type)
* [SYMMETRIC_ENCRYPTION_ALGORITHM](#symmetric_encryption_algorithm)
* [SYMMETRIC_ENCRYPTION_KEY_LENGTH](#symmetric_encryption_key_length)
* [VECTOR_SIZE](#vector_size)
* [alg](#alg)
* [e](#e)
* [ext](#ext)
* [keyOps](#keyops)
* [kty](#kty)

### Functions

* [downloadBlob](#downloadblob)
* [fetchBlobContents](#fetchblobcontents)
* [merge](#merge)
* [mockCryptoGetRandomValues](#mockcryptogetrandomvalues)
* [mockRequestFileSystem](#mockrequestfilesystem)

### Object literals

* [FILES](#files)
* [FILE_HASHES](#file_hashes)
* [PPRIVATE_KEY](#pprivate_key)
* [PUBLIC_KEY](#public_key)
* [SYMMETRIC_KEY](#symmetric_key)

---

## Variables

<a id="asymmetric_encryption_algorithm"></a>

### `<Const>` ASYMMETRIC_ENCRYPTION_ALGORITHM

**● ASYMMETRIC_ENCRYPTION_ALGORITHM**: *"RSA-OAEP"* = "RSA-OAEP"

*Defined in [src/config.ts:3](https://github.com/repux/repux-lib/blob/dcfa8fe/src/config.ts#L3)*

___
<a id="asymmetric_encryption_exponent"></a>

### `<Const>` ASYMMETRIC_ENCRYPTION_EXPONENT

**● ASYMMETRIC_ENCRYPTION_EXPONENT**: *`Uint8Array`* =  new Uint8Array([0x01, 0x00, 0x01])

*Defined in [src/config.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/src/config.ts#L7)*

___
<a id="asymmetric_encryption_hash"></a>

### `<Const>` ASYMMETRIC_ENCRYPTION_HASH

**● ASYMMETRIC_ENCRYPTION_HASH**: *"SHA-256"* = "SHA-256"

*Defined in [src/config.ts:4](https://github.com/repux/repux-lib/blob/dcfa8fe/src/config.ts#L4)*

___
<a id="asymmetric_encryption_hash_length"></a>

### `<Const>` ASYMMETRIC_ENCRYPTION_HASH_LENGTH

**● ASYMMETRIC_ENCRYPTION_HASH_LENGTH**: *`256`* = 256

*Defined in [src/config.ts:6](https://github.com/repux/repux-lib/blob/dcfa8fe/src/config.ts#L6)*

___
<a id="asymmetric_encryption_modulus_length"></a>

### `<Const>` ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH

**● ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH**: *`2048`* = 2048

*Defined in [src/config.ts:5](https://github.com/repux/repux-lib/blob/dcfa8fe/src/config.ts#L5)*

___
<a id="chunk_size"></a>

### `<Const>` CHUNK_SIZE

**● CHUNK_SIZE**: *`number`* =  15 * 64 * 1024

*Defined in [src/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/src/config.ts#L8)*

___
<a id="encrypted_symmetric_key"></a>

### `<Const>` ENCRYPTED_SYMMETRIC_KEY

**● ENCRYPTED_SYMMETRIC_KEY**: *"KlIDXfip0pbJmRAYkhbkz1QBtb1Dw0aZGdpTIwxsySB+yfPZy5XBAvKikg+So8/qIQ0jSExJjDOds1FVW4Pqm/9v++dKP4VybGHNAsCJ6x4Hh+edjvsH5jHIxBAuhJ8MUc7nd3Us80EpdmweGQx1hJG3naSO0CS8ZRqUqjeOBR7yY9jc+YDpPBYCmHCd5hFWO1Ovdzb2uQSeHk4hTlS4FoVFwvypbL5uz56J/O/ttBVE71MH3cZox/Ac0pVENcvGK28b771+FZrJ6+ukPfWgqhL4myLyIWPYI5+mEiHuRAeOLK4bQTAK5Nl1Cafrpq2T+VU4R5MzWRI2NGiWFF58CQ&#x3D;&#x3D;"* = "KlIDXfip0pbJmRAYkhbkz1QBtb1Dw0aZGdpTIwxsySB+yfPZy5XBAvKikg+So8/qIQ0jSExJjDOds1FVW4Pqm/9v++dKP4VybGHNAsCJ6x4Hh+edjvsH5jHIxBAuhJ8MUc7nd3Us80EpdmweGQx1hJG3naSO0CS8ZRqUqjeOBR7yY9jc+YDpPBYCmHCd5hFWO1Ovdzb2uQSeHk4hTlS4FoVFwvypbL5uz56J/O/ttBVE71MH3cZox/Ac0pVENcvGK28b771+FZrJ6+ukPfWgqhL4myLyIWPYI5+mEiHuRAeOLK4bQTAK5Nl1Cafrpq2T+VU4R5MzWRI2NGiWFF58CQ=="

*Defined in [test/integration/config.ts:10](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L10)*

___
<a id="file_content"></a>

### `<Const>` FILE_CONTENT

**● FILE_CONTENT**: *"Lorem ipsum dolor sit amet"* =  `Lorem ipsum dolor sit amet`

*Defined in [test/integration/config.ts:6](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L6)*

___
<a id="file_name"></a>

### `<Const>` FILE_NAME

**● FILE_NAME**: *"test.txt"* = "test.txt"

*Defined in [test/integration/config.ts:4](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L4)*

___
<a id="file_url"></a>

### `<Const>` FILE_URL

**● FILE_URL**: *"TEST_FILE_URL"* = "TEST_FILE_URL"

*Defined in [test/helpers/request-file-system-mock.ts:6](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/request-file-system-mock.ts#L6)*

___
<a id="first_chunk_size"></a>

### `<Const>` FIRST_CHUNK_SIZE

**● FIRST_CHUNK_SIZE**: *`number`* =  ASYMMETRIC_ENCRYPTION_MODULUS_LENGTH / 8 - 2 * ASYMMETRIC_ENCRYPTION_HASH_LENGTH / 8 - 2

*Defined in [src/config.ts:9](https://github.com/repux/repux-lib/blob/dcfa8fe/src/config.ts#L9)*

___
<a id="ipfs_hash_length"></a>

### `<Const>` IPFS_HASH_LENGTH

**● IPFS_HASH_LENGTH**: *`46`* = 46

*Defined in [test/integration/config.ts:5](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L5)*

___
<a id="ipfs_host"></a>

### `<Const>` IPFS_HOST

**● IPFS_HOST**: *"127.0.0.1"* = "127.0.0.1"

*Defined in [test/integration/config.ts:1](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L1)*

___
<a id="ipfs_port"></a>

### `<Const>` IPFS_PORT

**● IPFS_PORT**: *"5002"* = "5002"

*Defined in [test/integration/config.ts:2](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L2)*

___
<a id="ipfs_protocol"></a>

### `<Const>` IPFS_PROTOCOL

**● IPFS_PROTOCOL**: *"http"* = "http"

*Defined in [test/integration/config.ts:3](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L3)*

___
<a id="storage_type"></a>

### `<Const>` STORAGE_TYPE

**● STORAGE_TYPE**: *`number`* =  window && window.TEMPORARY

*Defined in [src/file-handling/file-system-writer.ts:4](https://github.com/repux/repux-lib/blob/dcfa8fe/src/file-handling/file-system-writer.ts#L4)*

___
<a id="symmetric_encryption_algorithm"></a>

### `<Const>` SYMMETRIC_ENCRYPTION_ALGORITHM

**● SYMMETRIC_ENCRYPTION_ALGORITHM**: *"AES-CBC"* = "AES-CBC"

*Defined in [src/config.ts:1](https://github.com/repux/repux-lib/blob/dcfa8fe/src/config.ts#L1)*

___
<a id="symmetric_encryption_key_length"></a>

### `<Const>` SYMMETRIC_ENCRYPTION_KEY_LENGTH

**● SYMMETRIC_ENCRYPTION_KEY_LENGTH**: *`256`* = 256

*Defined in [src/config.ts:2](https://github.com/repux/repux-lib/blob/dcfa8fe/src/config.ts#L2)*

___
<a id="vector_size"></a>

### `<Const>` VECTOR_SIZE

**● VECTOR_SIZE**: *`16`* = 16

*Defined in [src/config.ts:10](https://github.com/repux/repux-lib/blob/dcfa8fe/src/config.ts#L10)*

___
<a id="alg"></a>

### `<Const>` alg

**● alg**: *"RSA-OAEP-256"* = "RSA-OAEP-256"

*Defined in [src/crypto/key-deserializer.ts:3](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/key-deserializer.ts#L3)*

___
<a id="e"></a>

### `<Const>` e

**● e**: *"AQAB"* = "AQAB"

*Defined in [src/crypto/key-deserializer.ts:5](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/key-deserializer.ts#L5)*

___
<a id="ext"></a>

### `<Const>` ext

**● ext**: *`true`* = true

*Defined in [src/crypto/key-deserializer.ts:6](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/key-deserializer.ts#L6)*

___
<a id="keyops"></a>

### `<Const>` keyOps

**● keyOps**: *`string`[]* =  [ 'encrypt' ]

*Defined in [src/crypto/key-deserializer.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/key-deserializer.ts#L7)*

___
<a id="kty"></a>

### `<Const>` kty

**● kty**: *"RSA"* = "RSA"

*Defined in [src/crypto/key-deserializer.ts:4](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/key-deserializer.ts#L4)*

___

## Functions

<a id="downloadblob"></a>

###  downloadBlob

▸ **downloadBlob**(blobUrl: *`string`*, fileName: *`string`*): `void`

*Defined in [test/helpers/download-blob.ts:1](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/download-blob.ts#L1)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| blobUrl | `string` |
| fileName | `string` |

**Returns:** `void`

___
<a id="fetchblobcontents"></a>

###  fetchBlobContents

▸ **fetchBlobContents**(blobUrl: *`string`*): `Promise`<`string`>

*Defined in [test/helpers/fetch-blob-contents.ts:1](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/fetch-blob-contents.ts#L1)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| blobUrl | `string` |

**Returns:** `Promise`<`string`>

___
<a id="merge"></a>

### `<Const>` merge

▸ **merge**(...arrays: *`Uint8Array`[]*): `Uint8Array`

*Defined in [src/utils/uint8-array-utils.ts:1](https://github.com/repux/repux-lib/blob/dcfa8fe/src/utils/uint8-array-utils.ts#L1)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` arrays | `Uint8Array`[] |

**Returns:** `Uint8Array`

___
<a id="mockcryptogetrandomvalues"></a>

###  mockCryptoGetRandomValues

▸ **mockCryptoGetRandomValues**(): `void`

*Defined in [test/helpers/crypto-get-random-values-mock.ts:1](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/crypto-get-random-values-mock.ts#L1)*

**Returns:** `void`

___
<a id="mockrequestfilesystem"></a>

###  mockRequestFileSystem

▸ **mockRequestFileSystem**(): `void`

*Defined in [test/helpers/request-file-system-mock.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/request-file-system-mock.ts#L8)*

**Returns:** `void`

___

## Object literals

<a id="files"></a>

### `<Const>` FILES

**FILES**: *`object`*

*Defined in [test/helpers/ipfs-api-mock.ts:10](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L10)*

<a id="files.__computed"></a>

####  __computed

**__computed**: *`object`*

*Defined in [test/helpers/ipfs-api-mock.ts:11](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L11)*
*Defined in [test/helpers/ipfs-api-mock.ts:14](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L14)*
*Defined in [test/helpers/ipfs-api-mock.ts:17](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L17)*
*Defined in [test/helpers/ipfs-api-mock.ts:20](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L20)*

<a id="files.__computed.content"></a>

####  content

**● content**: *`string`* = "NEW_IPFS_FILE_CONTENT"

*Defined in [test/helpers/ipfs-api-mock.ts:12](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L12)*
*Defined in [test/helpers/ipfs-api-mock.ts:15](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L15)*
*Defined in [test/helpers/ipfs-api-mock.ts:18](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L18)*
*Defined in [test/helpers/ipfs-api-mock.ts:21](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L21)*

___

___

___
<a id="file_hashes"></a>

### `<Const>` FILE_HASHES

**FILE_HASHES**: *`object`*

*Defined in [test/helpers/ipfs-api-mock.ts:3](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L3)*

<a id="file_hashes.file_chunk_0"></a>

####  FILE_CHUNK_0

**● FILE_CHUNK_0**: *`string`* = "FILE_CHUNK_0"

*Defined in [test/helpers/ipfs-api-mock.ts:5](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L5)*

___
<a id="file_hashes.file_chunk_1"></a>

####  FILE_CHUNK_1

**● FILE_CHUNK_1**: *`string`* = "FILE_CHUNK_1"

*Defined in [test/helpers/ipfs-api-mock.ts:6](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L6)*

___
<a id="file_hashes.meta_file_hash"></a>

####  META_FILE_HASH

**● META_FILE_HASH**: *`string`* = "META_FILE_HASH"

*Defined in [test/helpers/ipfs-api-mock.ts:4](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L4)*

___
<a id="file_hashes.new_ipfs_file"></a>

####  NEW_IPFS_FILE

**● NEW_IPFS_FILE**: *`string`* = "NEW_IPFS_FILE"

*Defined in [test/helpers/ipfs-api-mock.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/test/helpers/ipfs-api-mock.ts#L7)*

___

___
<a id="pprivate_key"></a>

### `<Const>` PPRIVATE_KEY

**PPRIVATE_KEY**: *`object`*

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

<a id="pprivate_key.alg"></a>

####  alg

**● alg**: *`string`* = "RSA-OAEP-256"

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.d"></a>

####  d

**● d**: *`string`* = "ROowB3_xeXx-3zl8BZ0LQVQCBLIwUJ1R6Hib-wFVjV9k3KRKzQL6Q3h6lce2AcXrjjIBCC5Z8IcDNl5lwgOa8AVnq5X0mFwWR90NXY3dH85R0SraSyx0ocIeQ6hjnmMjeW9sGl1BAg6R-5DgptcHDX6TEfJRhkb7yE2yrGU4fSxRGyix0rPNLAHeUb9Zfx3ktCBtFOESUb9SkdJ1y0x4vA_T9Fv46UlZ-9qb4pPeE87R6E7VuT-f92I9k7WZn5jWg_TEANl3UWoNXwkabKQfB70eI1VZTe_v8LVNqT3kk2HRTAGOiE5oh0Vt1DMZatL2VKqMibTxyNaoSNsz3zr2TQ"

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.dp"></a>

####  dp

**● dp**: *`string`* = "juaE7riOOig7a4GQW_9ffKwC2zPSOEoCfe-Wc3Auszzs0gVuGFDpDU4E6xyuLotReL2U42qL1I5zwLnljHkLT-hFZkrO2HkYT38K0saMo-alPK4RYUkUwVBbuTaygB0oTz1bGq7VJqhQAED36BfZCb0ya7TVEtkgrotvoQvSOX8"

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.dq"></a>

####  dq

**● dq**: *`string`* = "czeq0JfEY92q5M6FVUn-FiXAi5VRhrh4NH2Rkg5xx1b1oyTVqIvD42_FymX3RRL98QSkQ5Z28C_eLoTsQZO9wF2MUvBDaPopf6zU39YikUNvuBvvY-7orZl97tXZ92w0B1jUBof5E0fFMUffEIDU2JBQQpoLwiHJb7VrtfWGVjU"

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.e"></a>

####  e

**● e**: *`string`* = "AQAB"

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.ext"></a>

####  ext

**● ext**: *`boolean`* = true

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.key_ops"></a>

####  key_ops

**● key_ops**: *`string`[]* = ["decrypt"]

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.kty"></a>

####  kty

**● kty**: *`string`* = "RSA"

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.n"></a>

####  n

**● n**: *`string`* = "s4Gep9n05MRlMcsdUb_Grf1brQmr0A2eeTyPJ1_GW4Kw6FHrvDGVgZZQ8TQ1jePmoCKBMJU5GqmJu8EkYj1-ybdrvqJRiGyHllbfrRbAnQz5VeBCe0tQ6pMdrBNitRYiM_NrXbpJcamBZdopnyoQ7QFSyAnDJrwuaN141JF8jq8hnzeqlUZK5r19uYpLulDYUTX-9tsuv9Y2K527fc_k6O1AV_dloavEvlhfh78C5-XUHHhvKFdVi9k2RCRW517Ywe1EnV-6Fdzk8eudM34NWIijgJxN0MfztL1BbeY-V5w-oH6YCR0524O-JEdnKgSo0Hj7QqGuw2l_zYbkGixIBw"

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.p"></a>

####  p

**● p**: *`string`* = "6UwzOsaAuNO1J85vfwaY3J9ZuoSxcKEUkO3FIdkMhwqN_PDHQqrUFOLDD2_IDeLoRVOvhq0v7oP4xpi5FN0VXQJCbbOymgjYAyix6PYoACyLrpJLG0c6K0HdLYEHMTkzJ3DcCgmNTyTe7NEy4LFYLMg-weaCSMCdLuRuthdSuiM"

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.q"></a>

####  q

**● q**: *`string`* = "xPllTMRkbylxHw4qN4QiAVI3lT67zFNp_hNCegiIiU3TLZtlIjvuVo6-PkAbNocCNeG7C3iPmBUyxnMv0wRlc9Mg7qyx1EvnrYCnnxwA4KIze-8kNrimZEcM7I8Z1Qxlt0GDbMObxaPjIahLOSEcmQNuabpIze6l0vFZ8QJwfs0"

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___
<a id="pprivate_key.qi"></a>

####  qi

**● qi**: *`string`* = "IVrT-A5GFCiNmmljKOsCodpq0yM8MW767oBuD-5-EjBlF9P9uqzgsEKAohl2UWoOsnXQLtaUvc7c6KczH0z3nyTXW86UB5JNZNAUx0jmf4unM7FCgqlE9zs7WlncY9PuGbQNb1OjZ9F2WHwMyJDrd5-WY2_lKLN61gUlmrhwJCQ"

*Defined in [test/integration/config.ts:8](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L8)*

___

___
<a id="public_key"></a>

### `<Const>` PUBLIC_KEY

**PUBLIC_KEY**: *`object`*

*Defined in [test/integration/config.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L7)*

<a id="public_key.alg"></a>

####  alg

**● alg**: *`string`* = "RSA-OAEP-256"

*Defined in [test/integration/config.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L7)*

___
<a id="public_key.e"></a>

####  e

**● e**: *`string`* = "AQAB"

*Defined in [test/integration/config.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L7)*

___
<a id="public_key.ext"></a>

####  ext

**● ext**: *`boolean`* = true

*Defined in [test/integration/config.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L7)*

___
<a id="public_key.key_ops"></a>

####  key_ops

**● key_ops**: *`string`[]* = ["encrypt"]

*Defined in [test/integration/config.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L7)*

___
<a id="public_key.kty"></a>

####  kty

**● kty**: *`string`* = "RSA"

*Defined in [test/integration/config.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L7)*

___
<a id="public_key.n"></a>

####  n

**● n**: *`string`* = "s4Gep9n05MRlMcsdUb_Grf1brQmr0A2eeTyPJ1_GW4Kw6FHrvDGVgZZQ8TQ1jePmoCKBMJU5GqmJu8EkYj1-ybdrvqJRiGyHllbfrRbAnQz5VeBCe0tQ6pMdrBNitRYiM_NrXbpJcamBZdopnyoQ7QFSyAnDJrwuaN141JF8jq8hnzeqlUZK5r19uYpLulDYUTX-9tsuv9Y2K527fc_k6O1AV_dloavEvlhfh78C5-XUHHhvKFdVi9k2RCRW517Ywe1EnV-6Fdzk8eudM34NWIijgJxN0MfztL1BbeY-V5w-oH6YCR0524O-JEdnKgSo0Hj7QqGuw2l_zYbkGixIBw"

*Defined in [test/integration/config.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L7)*

___

___
<a id="symmetric_key"></a>

### `<Const>` SYMMETRIC_KEY

**SYMMETRIC_KEY**: *`object`*

*Defined in [test/integration/config.ts:9](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L9)*

<a id="symmetric_key.alg"></a>

####  alg

**● alg**: *`string`* = "A256CBC"

*Defined in [test/integration/config.ts:9](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L9)*

___
<a id="symmetric_key.ext"></a>

####  ext

**● ext**: *`boolean`* = true

*Defined in [test/integration/config.ts:9](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L9)*

___
<a id="symmetric_key.k"></a>

####  k

**● k**: *`string`* = "rbqGcjD86Njy5ed-6Iw5Q6gGRfXvxExo2FtSQNFaIMQ"

*Defined in [test/integration/config.ts:9](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L9)*

___
<a id="symmetric_key.key_ops"></a>

####  key_ops

**● key_ops**: *`string`[]* = ["encrypt","decrypt"]

*Defined in [test/integration/config.ts:9](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L9)*

___
<a id="symmetric_key.kty"></a>

####  kty

**● kty**: *`string`* = "oct"

*Defined in [test/integration/config.ts:9](https://github.com/repux/repux-lib/blob/dcfa8fe/test/integration/config.ts#L9)*

___

___


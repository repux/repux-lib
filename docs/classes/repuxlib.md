[API Reference](../README.md) > [RepuxLib](../classes/repuxlib.md)

# Class: RepuxLib

Repux Lib

## Hierarchy

**RepuxLib**

## Index

### Constructors

* [constructor](repuxlib.md#constructor)

### Methods

* [createFileDownloader](repuxlib.md#createfiledownloader)
* [createFileReencryptor](repuxlib.md#createfilereencryptor)
* [createFileUploader](repuxlib.md#createfileuploader)
* [decryptSymmetricKey](repuxlib.md#decryptsymmetrickey)
* [deserializePublicKey](repuxlib.md#deserializepublickey)
* [encryptSymmetricKey](repuxlib.md#encryptsymmetrickey)
* [generateAsymmetricKeyPair](repuxlib.md#generateasymmetrickeypair)
* [generateSymmetricKey](repuxlib.md#generatesymmetrickey)
* [getMaxFileSize](repuxlib.md#getmaxfilesize)
* [getVersion](repuxlib.md#getversion)
* [serializePublicKey](repuxlib.md#serializepublickey)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new RepuxLib**(ipfs: *`IpfsAPI`*): [RepuxLib](repuxlib.md)

*Defined in [src/index.ts:58](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L58)*

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ipfs | `IpfsAPI` |  IPFS Api object (see: [https://github.com/ipfs/js-ipfs-api](https://github.com/ipfs/js-ipfs-api)) |

**Returns:** [RepuxLib](repuxlib.md)

___

## Methods

<a id="createfiledownloader"></a>

###  createFileDownloader

▸ **createFileDownloader**(): [FileDownloader](filedownloader.md)

*Defined in [src/index.ts:171](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L171)*

Creates FileDownloader instance

**Returns:** [FileDownloader](filedownloader.md)
FileDownloader instance

___
<a id="createfilereencryptor"></a>

###  createFileReencryptor

▸ **createFileReencryptor**(): [FileReencryptor](filereencryptor.md)

*Defined in [src/index.ts:163](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L163)*

Creates FileReencryptor instance

**Returns:** [FileReencryptor](filereencryptor.md)
FileReencryptor instance

___
<a id="createfileuploader"></a>

###  createFileUploader

▸ **createFileUploader**(): [FileUploader](fileuploader.md)

*Defined in [src/index.ts:155](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L155)*

Creates FileUploader instance

**Returns:** [FileUploader](fileuploader.md)
FileUploader instance

___
<a id="decryptsymmetrickey"></a>

###  decryptSymmetricKey

▸ **decryptSymmetricKey**(encryptedSymmetricKey: *`string`*, privateKey: *[PrivateKey](../interfaces/privatekey.md)*): `Promise`<[SymmetricKey](../interfaces/symmetrickey.md)>

*Defined in [src/index.ts:129](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L129)*

Decrypts encrypted symmetric key using public key

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| encryptedSymmetricKey | `string` |  encrypted symmetric key |
| privateKey | [PrivateKey](../interfaces/privatekey.md) |  private key in JsonWebKey format |

**Returns:** `Promise`<[SymmetricKey](../interfaces/symmetrickey.md)>
decrypted symmetric key in JsonWebKey format

___
<a id="deserializepublickey"></a>

###  deserializePublicKey

▸ **deserializePublicKey**(publicKeyString: *`string`*): [PublicKey](../interfaces/publickey.md)

*Defined in [src/index.ts:147](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L147)*

Deserializes string public key and returns PublicKey

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| publicKeyString | `string` |  serialized public key |

**Returns:** [PublicKey](../interfaces/publickey.md)
public key in JsonWebKey format

___
<a id="encryptsymmetrickey"></a>

###  encryptSymmetricKey

▸ **encryptSymmetricKey**(symmetricKey: *[SymmetricKey](../interfaces/symmetrickey.md)*, publicKey: *[PublicKey](../interfaces/publickey.md)*): `Promise`<`string`>

*Defined in [src/index.ts:119](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L119)*

Encrypts symmetric key using public key

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| symmetricKey | [SymmetricKey](../interfaces/symmetrickey.md) |  symmetric key in JsonWebKey format |
| publicKey | [PublicKey](../interfaces/publickey.md) |  public key in JsonWebKey format |

**Returns:** `Promise`<`string`>
encrypted symmetric key as a string

___
<a id="generateasymmetrickeypair"></a>

###  generateAsymmetricKeyPair

▸ **generateAsymmetricKeyPair**(): `Promise`<[AsymmetricKeyPair](../interfaces/asymmetrickeypair.md)>

*Defined in [src/index.ts:109](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L109)*

Generates keys for asymmetric encryption/decryption

**Returns:** `Promise`<[AsymmetricKeyPair](../interfaces/asymmetrickeypair.md)>
asymmetric key pair in JsonWebKey format

___
<a id="generatesymmetrickey"></a>

###  generateSymmetricKey

▸ **generateSymmetricKey**(): `Promise`<[SymmetricKey](../interfaces/symmetrickey.md)>

*Defined in [src/index.ts:101](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L101)*

Generates key for symmetric encryption/decryption

**Returns:** `Promise`<[SymmetricKey](../interfaces/symmetrickey.md)>
symmetric key in JsonWebKey format

___
<a id="getmaxfilesize"></a>

###  getMaxFileSize

▸ **getMaxFileSize**(): `Promise`<`number`>

*Defined in [src/index.ts:93](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L93)*

Returns maximum file size in bytes

**Returns:** `Promise`<`number`>
maximum file size

___
<a id="getversion"></a>

###  getVersion

▸ **getVersion**(): `string`

*Defined in [src/index.ts:85](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L85)*

Returns API version

**Returns:** `string`
API version

___
<a id="serializepublickey"></a>

###  serializePublicKey

▸ **serializePublicKey**(publicKeyJWK: *[PublicKey](../interfaces/publickey.md)*): `string`

*Defined in [src/index.ts:138](https://github.com/repux/repux-lib/blob/7768859/src/index.ts#L138)*

Serializes public key as a string.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| publicKeyJWK | [PublicKey](../interfaces/publickey.md) |  public key in JsonWebKey format |

**Returns:** `string`
serialized public key

___


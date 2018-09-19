[API Reference](../README.md) > [KeyImporter](../classes/keyimporter.md)

# Class: KeyImporter

## Hierarchy

**KeyImporter**

## Index

### Methods

* [importPrivateKey](keyimporter.md#importprivatekey)
* [importPublicKey](keyimporter.md#importpublickey)
* [importSymmetricKey](keyimporter.md#importsymmetrickey)

---

## Methods

<a id="importprivatekey"></a>

###  importPrivateKey

▸ **importPrivateKey**(privateKeyJwk: *[PrivateKey](../interfaces/privatekey.md)*): `PromiseLike`<`CryptoKey`>

*Defined in [src/crypto/key-importer.ts:14](https://github.com/repux/repux-lib/blob/7768859/src/crypto/key-importer.ts#L14)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| privateKeyJwk | [PrivateKey](../interfaces/privatekey.md) |

**Returns:** `PromiseLike`<`CryptoKey`>

___
<a id="importpublickey"></a>

###  importPublicKey

▸ **importPublicKey**(publicKeyJwk: *[PublicKey](../interfaces/publickey.md)*): `PromiseLike`<`CryptoKey`>

*Defined in [src/crypto/key-importer.ts:7](https://github.com/repux/repux-lib/blob/7768859/src/crypto/key-importer.ts#L7)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| publicKeyJwk | [PublicKey](../interfaces/publickey.md) |

**Returns:** `PromiseLike`<`CryptoKey`>

___
<a id="importsymmetrickey"></a>

###  importSymmetricKey

▸ **importSymmetricKey**(symmetricKeyJwk: *[SymmetricKey](../interfaces/symmetrickey.md)*): `PromiseLike`<`CryptoKey`>

*Defined in [src/crypto/key-importer.ts:21](https://github.com/repux/repux-lib/blob/7768859/src/crypto/key-importer.ts#L21)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| symmetricKeyJwk | [SymmetricKey](../interfaces/symmetrickey.md) |

**Returns:** `PromiseLike`<`CryptoKey`>

___


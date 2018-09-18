[API Reference](../README.md) > [KeyEncryptor](../classes/keyencryptor.md)

# Class: KeyEncryptor

## Hierarchy

**KeyEncryptor**

## Index

### Constructors

* [constructor](keyencryptor.md#constructor)

### Methods

* [encryptSymmetricKey](keyencryptor.md#encryptsymmetrickey)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new KeyEncryptor**(textEncoder: *`TextEncoder`*, keyImporter: *[KeyImporter](keyimporter.md)*, base64Encoder: *[Base64Encoder](base64encoder.md)*): [KeyEncryptor](keyencryptor.md)

*Defined in [src/crypto/key-encryptor.ts:7](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/key-encryptor.ts#L7)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| textEncoder | `TextEncoder` |
| keyImporter | [KeyImporter](keyimporter.md) |
| base64Encoder | [Base64Encoder](base64encoder.md) |

**Returns:** [KeyEncryptor](keyencryptor.md)

___

## Methods

<a id="encryptsymmetrickey"></a>

###  encryptSymmetricKey

▸ **encryptSymmetricKey**(symmetricKey: *[SymmetricKey](../interfaces/symmetrickey.md)*, publicKey: *[PublicKey](../interfaces/publickey.md)*): `Promise`<`string`>

*Defined in [src/crypto/key-encryptor.ts:14](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/key-encryptor.ts#L14)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| symmetricKey | [SymmetricKey](../interfaces/symmetrickey.md) |
| publicKey | [PublicKey](../interfaces/publickey.md) |

**Returns:** `Promise`<`string`>

___


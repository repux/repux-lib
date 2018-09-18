[API Reference](../README.md) > [KeyDecryptor](../classes/keydecryptor.md)

# Class: KeyDecryptor

## Hierarchy

**KeyDecryptor**

## Index

### Constructors

* [constructor](keydecryptor.md#constructor)

### Methods

* [decryptSymmetricKey](keydecryptor.md#decryptsymmetrickey)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new KeyDecryptor**(textDecoder: *`TextDecoder`*, keyImporter: *[KeyImporter](keyimporter.md)*, base64Decoder: *[Base64Decoder](base64decoder.md)*): [KeyDecryptor](keydecryptor.md)

*Defined in [src/crypto/key-decryptor.ts:7](https://github.com/repux/repux-lib/blob/7e923cd/src/crypto/key-decryptor.ts#L7)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| textDecoder | `TextDecoder` |
| keyImporter | [KeyImporter](keyimporter.md) |
| base64Decoder | [Base64Decoder](base64decoder.md) |

**Returns:** [KeyDecryptor](keydecryptor.md)

___

## Methods

<a id="decryptsymmetrickey"></a>

###  decryptSymmetricKey

▸ **decryptSymmetricKey**(encryptedSymmetricKey: *`string`*, privateKey: *[PrivateKey](../interfaces/privatekey.md)*): `Promise`<[SymmetricKey](../interfaces/symmetrickey.md)>

*Defined in [src/crypto/key-decryptor.ts:14](https://github.com/repux/repux-lib/blob/7e923cd/src/crypto/key-decryptor.ts#L14)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| encryptedSymmetricKey | `string` |
| privateKey | [PrivateKey](../interfaces/privatekey.md) |

**Returns:** `Promise`<[SymmetricKey](../interfaces/symmetrickey.md)>

___


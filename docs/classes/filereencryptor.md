[API Reference](../README.md) > [FileReencryptor](../classes/filereencryptor.md)

# Class: FileReencryptor

## Hierarchy

↳  [ProgressCrypto](progresscrypto.md)

**↳ FileReencryptor**

## Index

### Constructors

* [constructor](filereencryptor.md#constructor)

### Methods

* [emit](filereencryptor.md#emit)
* [off](filereencryptor.md#off)
* [on](filereencryptor.md#on)
* [reencrypt](filereencryptor.md#reencrypt)
* [terminate](filereencryptor.md#terminate)
* [getErrorByType](filereencryptor.md#geterrorbytype)
* [getWorkerByType](filereencryptor.md#getworkerbytype)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FileReencryptor**(ipfs: *`IpfsAPI`*, keyEncryptor: *[KeyEncryptor](keyencryptor.md)*, keyDecryptor: *[KeyDecryptor](keydecryptor.md)*, keyImporter: *[KeyImporter](keyimporter.md)*): [FileReencryptor](filereencryptor.md)

*Overrides [ProgressCrypto](progresscrypto.md).[constructor](progresscrypto.md#constructor)*

*Defined in [src/ipfs/file-reencryptor.ts:18](https://github.com/repux/repux-lib/blob/7e923cd/src/ipfs/file-reencryptor.ts#L18)*

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| ipfs | `IpfsAPI` |  IPFS Api object (see: [https://github.com/ipfs/js-ipfs-api](https://github.com/ipfs/js-ipfs-api)) |
| keyEncryptor | [KeyEncryptor](keyencryptor.md) |  KeyEncryptor instance |
| keyDecryptor | [KeyDecryptor](keydecryptor.md) |  KeyDecryptor instance |
| keyImporter | [KeyImporter](keyimporter.md) |  KeyImporter instance |

**Returns:** [FileReencryptor](filereencryptor.md)

___

## Methods

<a id="emit"></a>

###  emit

▸ **emit**(eventTypes: * [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)*, ...args: *`any`[]*): [Observable](observable.md)

*Inherited from [Observable](observable.md).[emit](observable.md#emit)*

*Defined in [src/utils/observable.ts:19](https://github.com/repux/repux-lib/blob/7e923cd/src/utils/observable.ts#L19)*

Emits event

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventTypes |  [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)|  types of events to emit |
| `Rest` args | `any`[] |  event data |

**Returns:** [Observable](observable.md)

___
<a id="off"></a>

###  off

▸ **off**(eventTypes?: * [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)*, handler?: *`any`*): [Observable](observable.md)

*Inherited from [Observable](observable.md).[off](observable.md#off)*

*Defined in [src/utils/observable.ts:61](https://github.com/repux/repux-lib/blob/7e923cd/src/utils/observable.ts#L61)*

Usbuscribes from events

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| `Optional` eventTypes |  [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)|  types of events to unsubscribe |
| `Optional` handler | `any` |  handler method |

**Returns:** [Observable](observable.md)

___
<a id="on"></a>

###  on

▸ **on**(eventTypes: * [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)*, handler: *[EventHandler](../interfaces/eventhandler.md)*): [Observable](observable.md)

*Inherited from [Observable](observable.md).[on](observable.md#on)*

*Defined in [src/utils/observable.ts:41](https://github.com/repux/repux-lib/blob/7e923cd/src/utils/observable.ts#L41)*

Subscribes to events

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventTypes |  [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)|  types of events to subscribe |
| handler | [EventHandler](../interfaces/eventhandler.md) |  handler method |

**Returns:** [Observable](observable.md)

___
<a id="reencrypt"></a>

###  reencrypt

▸ **reencrypt**(oldPrivateKey: *[PrivateKey](../interfaces/privatekey.md)*, newPublicKey: *[PublicKey](../interfaces/publickey.md)*, fileHash: *`IpfsFileHash`*): [FileReencryptor](filereencryptor.md)

*Defined in [src/ipfs/file-reencryptor.ts:41](https://github.com/repux/repux-lib/blob/7e923cd/src/ipfs/file-reencryptor.ts#L41)*

Reencrypts file

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| oldPrivateKey | [PrivateKey](../interfaces/privatekey.md) |  Public key in JWK (JSON Web Key) format to decrypt first chunk of file with RSA-OAEP algorithm |
| newPublicKey | [PublicKey](../interfaces/publickey.md) |  Public key in JWK (JSON Web Key) format to encrypt first chunk of file with RSA-OAEP algorithm |
| fileHash | `IpfsFileHash` |  IPFS hash to meta file |

**Returns:** [FileReencryptor](filereencryptor.md)
FileReencryptor instance

___
<a id="terminate"></a>

###  terminate

▸ **terminate**(): `void`

*Inherited from [ProgressCrypto](progresscrypto.md).[terminate](progresscrypto.md#terminate)*

*Defined in [src/crypto/progress-crypto.ts:85](https://github.com/repux/repux-lib/blob/7e923cd/src/crypto/progress-crypto.ts#L85)*

Terminates worker thread

**Returns:** `void`

___
<a id="geterrorbytype"></a>

### `<Static>` getErrorByType

▸ **getErrorByType**(type: *[CryptoType](../enums/cryptotype.md)*):  [ErrorMessage](../enums/errormessage.md) &#124; `undefined`

*Inherited from [ProgressCrypto](progresscrypto.md).[getErrorByType](progresscrypto.md#geterrorbytype)*

*Defined in [src/crypto/progress-crypto.ts:68](https://github.com/repux/repux-lib/blob/7e923cd/src/crypto/progress-crypto.ts#L68)*

Returns error by worker type

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| type | [CryptoType](../enums/cryptotype.md) |  worker type |

**Returns:**  [ErrorMessage](../enums/errormessage.md) &#124; `undefined`

error message

___
<a id="getworkerbytype"></a>

### `<Static>` getWorkerByType

▸ **getWorkerByType**(type: *`string`*):  `Thread` &#124; `undefined`

*Inherited from [ProgressCrypto](progresscrypto.md).[getWorkerByType](progresscrypto.md#getworkerbytype)*

*Defined in [src/crypto/progress-crypto.ts:49](https://github.com/repux/repux-lib/blob/7e923cd/src/crypto/progress-crypto.ts#L49)*

Returns worker thread by worker type

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| type | `string` |  worker type |

**Returns:**  `Thread` &#124; `undefined`

worker thread

___


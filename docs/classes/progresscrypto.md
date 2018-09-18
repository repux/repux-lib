[API Reference](../README.md) > [ProgressCrypto](../classes/progresscrypto.md)

# Class: ProgressCrypto

## Hierarchy

 [Observable](observable.md)

**↳ ProgressCrypto**

↳  [FileUploader](fileuploader.md)

↳  [FileReencryptor](filereencryptor.md)

↳  [FileDownloader](filedownloader.md)

## Index

### Constructors

* [constructor](progresscrypto.md#constructor)

### Methods

* [emit](progresscrypto.md#emit)
* [off](progresscrypto.md#off)
* [on](progresscrypto.md#on)
* [terminate](progresscrypto.md#terminate)
* [getErrorByType](progresscrypto.md#geterrorbytype)
* [getWorkerByType](progresscrypto.md#getworkerbytype)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ProgressCrypto**(keyImporter: *[KeyImporter](keyimporter.md)*): [ProgressCrypto](progresscrypto.md)

*Overrides [Observable](observable.md).[constructor](observable.md#constructor)*

*Defined in [src/crypto/progress-crypto.ts:35](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/progress-crypto.ts#L35)*

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| keyImporter | [KeyImporter](keyimporter.md) |  KeyImporter instance |

**Returns:** [ProgressCrypto](progresscrypto.md)

___

## Methods

<a id="emit"></a>

###  emit

▸ **emit**(eventTypes: * [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)*, ...args: *`any`[]*): [Observable](observable.md)

*Inherited from [Observable](observable.md).[emit](observable.md#emit)*

*Defined in [src/utils/observable.ts:19](https://github.com/repux/repux-lib/blob/dcfa8fe/src/utils/observable.ts#L19)*

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

*Defined in [src/utils/observable.ts:61](https://github.com/repux/repux-lib/blob/dcfa8fe/src/utils/observable.ts#L61)*

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

*Defined in [src/utils/observable.ts:41](https://github.com/repux/repux-lib/blob/dcfa8fe/src/utils/observable.ts#L41)*

Subscribes to events

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventTypes |  [EventType](../enums/eventtype.md)[] &#124; [EventType](../enums/eventtype.md)|  types of events to subscribe |
| handler | [EventHandler](../interfaces/eventhandler.md) |  handler method |

**Returns:** [Observable](observable.md)

___
<a id="terminate"></a>

###  terminate

▸ **terminate**(): `void`

*Defined in [src/crypto/progress-crypto.ts:85](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/progress-crypto.ts#L85)*

Terminates worker thread

**Returns:** `void`

___
<a id="geterrorbytype"></a>

### `<Static>` getErrorByType

▸ **getErrorByType**(type: *[CryptoType](../enums/cryptotype.md)*):  [ErrorMessage](../enums/errormessage.md) &#124; `undefined`

*Defined in [src/crypto/progress-crypto.ts:68](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/progress-crypto.ts#L68)*

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

*Defined in [src/crypto/progress-crypto.ts:49](https://github.com/repux/repux-lib/blob/dcfa8fe/src/crypto/progress-crypto.ts#L49)*

Returns worker thread by worker type

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| type | `string` |  worker type |

**Returns:**  `Thread` &#124; `undefined`

worker thread

___


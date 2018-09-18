[API Reference](../README.md) > [BlobWriter](../classes/blobwriter.md)

# Class: BlobWriter

## Hierarchy

**BlobWriter**

## Implements

* [FileWriterInterface](../interfaces/filewriterinterface.md)

## Index

### Constructors

* [constructor](blobwriter.md#constructor)

### Properties

* [fileName](blobwriter.md#filename)
* [fileSize](blobwriter.md#filesize)

### Methods

* [getFileURL](blobwriter.md#getfileurl)
* [init](blobwriter.md#init)
* [write](blobwriter.md#write)
* [isSupported](blobwriter.md#issupported)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BlobWriter**(fileName: *`string`*, fileSize: *`number`*): [BlobWriter](blobwriter.md)

*Defined in [src/file-handling/blob-writer.ts:9](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/blob-writer.ts#L9)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| fileName | `string` |
| fileSize | `number` |

**Returns:** [BlobWriter](blobwriter.md)

___

## Properties

<a id="filename"></a>

###  fileName

**● fileName**: *`string`*

*Implementation of [FileWriterInterface](../interfaces/filewriterinterface.md).[fileName](../interfaces/filewriterinterface.md#filename)*

*Defined in [src/file-handling/blob-writer.ts:6](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/blob-writer.ts#L6)*

___
<a id="filesize"></a>

###  fileSize

**● fileSize**: *`number`*

*Implementation of [FileWriterInterface](../interfaces/filewriterinterface.md).[fileSize](../interfaces/filewriterinterface.md#filesize)*

*Defined in [src/file-handling/blob-writer.ts:7](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/blob-writer.ts#L7)*

___

## Methods

<a id="getfileurl"></a>

###  getFileURL

▸ **getFileURL**(): `string`

*Implementation of [FileWriterInterface](../interfaces/filewriterinterface.md).[getFileURL](../interfaces/filewriterinterface.md#getfileurl)*

*Defined in [src/file-handling/blob-writer.ts:40](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/blob-writer.ts#L40)*

**Returns:** `string`

___
<a id="init"></a>

###  init

▸ **init**(): `Promise`<`Object`>

*Implementation of [FileWriterInterface](../interfaces/filewriterinterface.md).[init](../interfaces/filewriterinterface.md#init)*

*Defined in [src/file-handling/blob-writer.ts:20](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/blob-writer.ts#L20)*

**Returns:** `Promise`<`Object`>

___
<a id="write"></a>

###  write

▸ **write**(data: *`Uint8Array`*): `void`

*Implementation of [FileWriterInterface](../interfaces/filewriterinterface.md).[write](../interfaces/filewriterinterface.md#write)*

*Defined in [src/file-handling/blob-writer.ts:32](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/blob-writer.ts#L32)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| data | `Uint8Array` |

**Returns:** `void`

___
<a id="issupported"></a>

### `<Static>` isSupported

▸ **isSupported**(): `boolean`

*Defined in [src/file-handling/blob-writer.ts:16](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/blob-writer.ts#L16)*

**Returns:** `boolean`

___


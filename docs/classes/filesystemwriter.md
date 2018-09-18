[API Reference](../README.md) > [FileSystemWriter](../classes/filesystemwriter.md)

# Class: FileSystemWriter

## Hierarchy

**FileSystemWriter**

## Implements

* [FileWriterInterface](../interfaces/filewriterinterface.md)

## Index

### Constructors

* [constructor](filesystemwriter.md#constructor)

### Properties

* [fileName](filesystemwriter.md#filename)
* [fileSize](filesystemwriter.md#filesize)

### Methods

* [getFileURL](filesystemwriter.md#getfileurl)
* [init](filesystemwriter.md#init)
* [write](filesystemwriter.md#write)
* [isSupported](filesystemwriter.md#issupported)
* [requestFileSystem](filesystemwriter.md#requestfilesystem)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FileSystemWriter**(fileName: *`string`*, fileSize: *`number`*): [FileSystemWriter](filesystemwriter.md)

*Defined in [src/file-handling/file-system-writer.ts:11](https://github.com/repux/repux-lib/blob/7e923cd/src/file-handling/file-system-writer.ts#L11)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| fileName | `string` |
| fileSize | `number` |

**Returns:** [FileSystemWriter](filesystemwriter.md)

___

## Properties

<a id="filename"></a>

###  fileName

**● fileName**: *`string`*

*Implementation of [FileWriterInterface](../interfaces/filewriterinterface.md).[fileName](../interfaces/filewriterinterface.md#filename)*

*Defined in [src/file-handling/file-system-writer.ts:7](https://github.com/repux/repux-lib/blob/7e923cd/src/file-handling/file-system-writer.ts#L7)*

___
<a id="filesize"></a>

###  fileSize

**● fileSize**: *`number`*

*Implementation of [FileWriterInterface](../interfaces/filewriterinterface.md).[fileSize](../interfaces/filewriterinterface.md#filesize)*

*Defined in [src/file-handling/file-system-writer.ts:8](https://github.com/repux/repux-lib/blob/7e923cd/src/file-handling/file-system-writer.ts#L8)*

___

## Methods

<a id="getfileurl"></a>

###  getFileURL

▸ **getFileURL**():  `string` &#124; `undefined`

*Implementation of [FileWriterInterface](../interfaces/filewriterinterface.md).[getFileURL](../interfaces/filewriterinterface.md#getfileurl)*

*Defined in [src/file-handling/file-system-writer.ts:73](https://github.com/repux/repux-lib/blob/7e923cd/src/file-handling/file-system-writer.ts#L73)*

**Returns:**  `string` &#124; `undefined`

___
<a id="init"></a>

###  init

▸ **init**(): `Promise`<`Object`>

*Implementation of [FileWriterInterface](../interfaces/filewriterinterface.md).[init](../interfaces/filewriterinterface.md#init)*

*Defined in [src/file-handling/file-system-writer.ts:34](https://github.com/repux/repux-lib/blob/7e923cd/src/file-handling/file-system-writer.ts#L34)*

**Returns:** `Promise`<`Object`>

___
<a id="write"></a>

###  write

▸ **write**(data: *`Uint8Array`*): `Promise`<`Object`>

*Implementation of [FileWriterInterface](../interfaces/filewriterinterface.md).[write](../interfaces/filewriterinterface.md#write)*

*Defined in [src/file-handling/file-system-writer.ts:60](https://github.com/repux/repux-lib/blob/7e923cd/src/file-handling/file-system-writer.ts#L60)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| data | `Uint8Array` |

**Returns:** `Promise`<`Object`>

___
<a id="issupported"></a>

### `<Static>` isSupported

▸ **isSupported**(): `Promise`<`Object`>

*Defined in [src/file-handling/file-system-writer.ts:22](https://github.com/repux/repux-lib/blob/7e923cd/src/file-handling/file-system-writer.ts#L22)*

**Returns:** `Promise`<`Object`>

___
<a id="requestfilesystem"></a>

### `<Static>` requestFileSystem

▸ **requestFileSystem**():  `null` &#124; `requestFileSystem`

*Defined in [src/file-handling/file-system-writer.ts:18](https://github.com/repux/repux-lib/blob/7e923cd/src/file-handling/file-system-writer.ts#L18)*

**Returns:**  `null` &#124; `requestFileSystem`

___


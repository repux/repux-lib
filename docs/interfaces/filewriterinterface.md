[API Reference](../README.md) > [FileWriterInterface](../interfaces/filewriterinterface.md)

# Interface: FileWriterInterface

## Hierarchy

**FileWriterInterface**

## Implemented by

* [BlobWriter](../classes/blobwriter.md)
* [FileSystemWriter](../classes/filesystemwriter.md)

## Index

### Properties

* [fileName](filewriterinterface.md#filename)
* [fileSize](filewriterinterface.md#filesize)

### Methods

* [getFileURL](filewriterinterface.md#getfileurl)
* [init](filewriterinterface.md#init)
* [write](filewriterinterface.md#write)

---

## Properties

<a id="filename"></a>

###  fileName

**● fileName**: *`string`*

*Defined in [src/file-handling/file-writer-interface.ts:2](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/file-writer-interface.ts#L2)*

___
<a id="filesize"></a>

###  fileSize

**● fileSize**: *`number`*

*Defined in [src/file-handling/file-writer-interface.ts:4](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/file-writer-interface.ts#L4)*

___

## Methods

<a id="getfileurl"></a>

###  getFileURL

▸ **getFileURL**():  `string` &#124; `undefined`

*Defined in [src/file-handling/file-writer-interface.ts:10](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/file-writer-interface.ts#L10)*

**Returns:**  `string` &#124; `undefined`

___
<a id="init"></a>

###  init

▸ **init**(): `Promise`<`any`>

*Defined in [src/file-handling/file-writer-interface.ts:6](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/file-writer-interface.ts#L6)*

**Returns:** `Promise`<`any`>

___
<a id="write"></a>

###  write

▸ **write**(data: *`Uint8Array`*): `void`

*Defined in [src/file-handling/file-writer-interface.ts:8](https://github.com/repux/repux-lib/blob/09025a1/src/file-handling/file-writer-interface.ts#L8)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| data | `Uint8Array` |

**Returns:** `void`

___


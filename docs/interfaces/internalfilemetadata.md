[API Reference](../README.md) > [InternalFileMetaData](../interfaces/internalfilemetadata.md)

# Interface: InternalFileMetaData

## Hierarchy

 [FileMetaData](filemetadata.md)

**↳ InternalFileMetaData**

## Index

### Properties

* [apiDocumentation](internalfilemetadata.md#apidocumentation)
* [buyerType](internalfilemetadata.md#buyertype)
* [category](internalfilemetadata.md#category)
* [chunks](internalfilemetadata.md#chunks)
* [eula](internalfilemetadata.md#eula)
* [fullDescription](internalfilemetadata.md#fulldescription)
* [initializationVector](internalfilemetadata.md#initializationvector)
* [location](internalfilemetadata.md#location)
* [maxNumberOfDownloads](internalfilemetadata.md#maxnumberofdownloads)
* [name](internalfilemetadata.md#name)
* [otherDocumentation](internalfilemetadata.md#otherdocumentation)
* [price](internalfilemetadata.md#price)
* [sampleFile](internalfilemetadata.md#samplefile)
* [shortDescription](internalfilemetadata.md#shortdescription)
* [size](internalfilemetadata.md#size)
* [symmetricKey](internalfilemetadata.md#symmetrickey)
* [title](internalfilemetadata.md#title)
* [type](internalfilemetadata.md#type)
* [useCaseDocumentation](internalfilemetadata.md#usecasedocumentation)

---

## Properties

<a id="apidocumentation"></a>

### `<Optional>` apiDocumentation

**● apiDocumentation**: *[Attachment](attachment.md)[]*

*Inherited from [FileMetaData](filemetadata.md).[apiDocumentation](filemetadata.md#apidocumentation)*

*Defined in [src/types/file-meta-data.ts:62](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L62)*

File API documentation

___
<a id="buyertype"></a>

### `<Optional>` buyerType

**● buyerType**: *[BuyerType](../enums/buyertype.md)[]*

*Inherited from [FileMetaData](filemetadata.md).[buyerType](filemetadata.md#buyertype)*

*Defined in [src/types/file-meta-data.ts:47](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L47)*

Possible buyer types

___
<a id="category"></a>

### `<Optional>` category

**● category**: *`string`[]*

*Inherited from [FileMetaData](filemetadata.md).[category](filemetadata.md#category)*

*Defined in [src/types/file-meta-data.ts:37](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L37)*

File categories

___
<a id="chunks"></a>

### `<Optional>` chunks

**● chunks**: *`string`[]*

*Defined in [src/types/internal-file-meta-data.ts:7](https://github.com/repux/repux-lib/blob/7768859/src/types/internal-file-meta-data.ts#L7)*

File chunks array

___
<a id="eula"></a>

### `<Optional>` eula

**● eula**: *[Eula](eula.md)*

*Inherited from [FileMetaData](filemetadata.md).[eula](filemetadata.md#eula)*

*Defined in [src/types/file-meta-data.ts:57](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L57)*

End User License Agreement

___
<a id="fulldescription"></a>

### `<Optional>` fullDescription

**● fullDescription**: * `undefined` &#124; `string`
*

*Inherited from [FileMetaData](filemetadata.md).[fullDescription](filemetadata.md#fulldescription)*

*Defined in [src/types/file-meta-data.ts:22](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L22)*

Full description of the file - no length limit

___
<a id="initializationvector"></a>

### `<Optional>` initializationVector

**● initializationVector**: *`Uint8Array`*

*Defined in [src/types/internal-file-meta-data.ts:12](https://github.com/repux/repux-lib/blob/7768859/src/types/internal-file-meta-data.ts#L12)*

Initialization vector

___
<a id="location"></a>

### `<Optional>` location

**● location**: *[DataLocation](datalocation.md)*

*Inherited from [FileMetaData](filemetadata.md).[location](filemetadata.md#location)*

*Defined in [src/types/file-meta-data.ts:32](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L32)*

Locations where data is collected

___
<a id="maxnumberofdownloads"></a>

### `<Optional>` maxNumberOfDownloads

**● maxNumberOfDownloads**: * `undefined` &#124; `number`
*

*Inherited from [FileMetaData](filemetadata.md).[maxNumberOfDownloads](filemetadata.md#maxnumberofdownloads)*

*Defined in [src/types/file-meta-data.ts:42](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L42)*

Maximum numbers of downloads (-1 means unlimited downloads number)

___
<a id="name"></a>

### `<Optional>` name

**● name**: * `undefined` &#124; `string`
*

*Defined in [src/types/internal-file-meta-data.ts:22](https://github.com/repux/repux-lib/blob/7768859/src/types/internal-file-meta-data.ts#L22)*

File name

___
<a id="otherdocumentation"></a>

### `<Optional>` otherDocumentation

**● otherDocumentation**: *[Attachment](attachment.md)[]*

*Inherited from [FileMetaData](filemetadata.md).[otherDocumentation](filemetadata.md#otherdocumentation)*

*Defined in [src/types/file-meta-data.ts:67](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L67)*

Other file documentation

___
<a id="price"></a>

### `<Optional>` price

**● price**: *`BigNumber`*

*Inherited from [FileMetaData](filemetadata.md).[price](filemetadata.md#price)*

*Defined in [src/types/file-meta-data.ts:52](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L52)*

Price for file in smallest token unit

___
<a id="samplefile"></a>

### `<Optional>` sampleFile

**● sampleFile**: *[Attachment](attachment.md)[]*

*Inherited from [FileMetaData](filemetadata.md).[sampleFile](filemetadata.md#samplefile)*

*Defined in [src/types/file-meta-data.ts:72](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L72)*

Sample not encrypted file

___
<a id="shortdescription"></a>

### `<Optional>` shortDescription

**● shortDescription**: * `undefined` &#124; `string`
*

*Inherited from [FileMetaData](filemetadata.md).[shortDescription](filemetadata.md#shortdescription)*

*Defined in [src/types/file-meta-data.ts:17](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L17)*

Short description of the file - up to 256 characters

___
<a id="size"></a>

### `<Optional>` size

**● size**: * `undefined` &#124; `number`
*

*Defined in [src/types/internal-file-meta-data.ts:27](https://github.com/repux/repux-lib/blob/7768859/src/types/internal-file-meta-data.ts#L27)*

File size

___
<a id="symmetrickey"></a>

### `<Optional>` symmetricKey

**● symmetricKey**: * `undefined` &#124; `string`
*

*Defined in [src/types/internal-file-meta-data.ts:17](https://github.com/repux/repux-lib/blob/7768859/src/types/internal-file-meta-data.ts#L17)*

Encrypted symmetric key

___
<a id="title"></a>

### `<Optional>` title

**● title**: * `undefined` &#124; `string`
*

*Inherited from [FileMetaData](filemetadata.md).[title](filemetadata.md#title)*

*Defined in [src/types/file-meta-data.ts:12](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L12)*

Title of the file

___
<a id="type"></a>

### `<Optional>` type

**● type**: *[PurchaseType](../enums/purchasetype.md)*

*Inherited from [FileMetaData](filemetadata.md).[type](filemetadata.md#type)*

*Defined in [src/types/file-meta-data.ts:27](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L27)*

Possible type of purchase

___
<a id="usecasedocumentation"></a>

### `<Optional>` useCaseDocumentation

**● useCaseDocumentation**: *[Attachment](attachment.md)[]*

*Inherited from [FileMetaData](filemetadata.md).[useCaseDocumentation](filemetadata.md#usecasedocumentation)*

*Defined in [src/types/file-meta-data.ts:77](https://github.com/repux/repux-lib/blob/7768859/src/types/file-meta-data.ts#L77)*

Use-case documentation

___


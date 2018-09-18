[API Reference](../README.md) > [FileMetaData](../interfaces/filemetadata.md)

# Interface: FileMetaData

## Hierarchy

**FileMetaData**

↳  [InternalFileMetaData](internalfilemetadata.md)

## Index

### Properties

* [apiDocumentation](filemetadata.md#apidocumentation)
* [buyerType](filemetadata.md#buyertype)
* [category](filemetadata.md#category)
* [eula](filemetadata.md#eula)
* [fullDescription](filemetadata.md#fulldescription)
* [location](filemetadata.md#location)
* [maxNumberOfDownloads](filemetadata.md#maxnumberofdownloads)
* [otherDocumentation](filemetadata.md#otherdocumentation)
* [price](filemetadata.md#price)
* [sampleFile](filemetadata.md#samplefile)
* [shortDescription](filemetadata.md#shortdescription)
* [title](filemetadata.md#title)
* [type](filemetadata.md#type)
* [useCaseDocumentation](filemetadata.md#usecasedocumentation)

---

## Properties

<a id="apidocumentation"></a>

### `<Optional>` apiDocumentation

**● apiDocumentation**: *[Attachment](attachment.md)[]*

*Defined in [src/types/file-meta-data.ts:62](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L62)*

File API documentation

___
<a id="buyertype"></a>

### `<Optional>` buyerType

**● buyerType**: *[BuyerType](../enums/buyertype.md)[]*

*Defined in [src/types/file-meta-data.ts:47](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L47)*

Possible buyer types

___
<a id="category"></a>

### `<Optional>` category

**● category**: *`string`[]*

*Defined in [src/types/file-meta-data.ts:37](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L37)*

File categories

___
<a id="eula"></a>

### `<Optional>` eula

**● eula**: *[Eula](eula.md)*

*Defined in [src/types/file-meta-data.ts:57](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L57)*

End User License Agreement

___
<a id="fulldescription"></a>

### `<Optional>` fullDescription

**● fullDescription**: * `undefined` &#124; `string`
*

*Defined in [src/types/file-meta-data.ts:22](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L22)*

Full description of the file - no length limit

___
<a id="location"></a>

### `<Optional>` location

**● location**: *[DataLocation](datalocation.md)*

*Defined in [src/types/file-meta-data.ts:32](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L32)*

Locations where data is collected

___
<a id="maxnumberofdownloads"></a>

### `<Optional>` maxNumberOfDownloads

**● maxNumberOfDownloads**: * `undefined` &#124; `number`
*

*Defined in [src/types/file-meta-data.ts:42](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L42)*

Maximum numbers of downloads (-1 means unlimited downloads number)

___
<a id="otherdocumentation"></a>

### `<Optional>` otherDocumentation

**● otherDocumentation**: *[Attachment](attachment.md)[]*

*Defined in [src/types/file-meta-data.ts:67](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L67)*

Other file documentation

___
<a id="price"></a>

### `<Optional>` price

**● price**: *`BigNumber`*

*Defined in [src/types/file-meta-data.ts:52](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L52)*

Price for file in smallest token unit

___
<a id="samplefile"></a>

### `<Optional>` sampleFile

**● sampleFile**: *[Attachment](attachment.md)[]*

*Defined in [src/types/file-meta-data.ts:72](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L72)*

Sample not encrypted file

___
<a id="shortdescription"></a>

### `<Optional>` shortDescription

**● shortDescription**: * `undefined` &#124; `string`
*

*Defined in [src/types/file-meta-data.ts:17](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L17)*

Short description of the file - up to 256 characters

___
<a id="title"></a>

### `<Optional>` title

**● title**: * `undefined` &#124; `string`
*

*Defined in [src/types/file-meta-data.ts:12](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L12)*

Title of the file

___
<a id="type"></a>

### `<Optional>` type

**● type**: *[PurchaseType](../enums/purchasetype.md)*

*Defined in [src/types/file-meta-data.ts:27](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L27)*

Possible type of purchase

___
<a id="usecasedocumentation"></a>

### `<Optional>` useCaseDocumentation

**● useCaseDocumentation**: *[Attachment](attachment.md)[]*

*Defined in [src/types/file-meta-data.ts:77](https://github.com/repux/repux-lib/blob/09025a1/src/types/file-meta-data.ts#L77)*

Use-case documentation

___


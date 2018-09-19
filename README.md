# RepuX Lib
This library helps developers using RepuX protocol. It supports file encryption, decryption and storage (including in-browser uploading and downloading) of files on IPFS.

## Quickstart

### Installation
```bash
npm install @repux/repux-lib
```

### Usage
```javascript
import IpfsAPI from 'ipfs-api';
import { RepuxLib } from '@repux/repux-lib';
const repux = new RepuxLib(new IpfsAPI({
    host: 'marketplace-ipfs.repux.io',
    port: 443,
    protocol: 'https'
}));
const version = repux.getVersion();
console.log(version);
```

### API Reference
API Reference is available [here](https://github.com/repux/repux-lib/tree/master/docs/README.md)

### How it works
1. Data seller should generate RSA key pair using RepuxLib.generateAsymmetricKeyPair() function. This key pair should be stored on user local device.
2. Data seller should generate AES symmetric key using RepuxLib.generateSymmetricKey() function. This key should be generated per file and should be also stored on user local device.
3. Data seller uploads file using RepuxLib.createFileUploader().upload() function with symmetricKey, publicKey and file in parameters.
   - Library reads file partially encrypts it symmetrically using AES-PCBC algorithm.
   - Library encrypts first 190 bytes of file asymmetrically using seller publicKey.
   - Library uploads all file parts to ipfs storage.
   - Library uploads meta file containing all file parts, size, name and other meta data to ipfs storage.
   - Library emits progress event with uploading progress.
   - Library emits finish event with ipfs hash to meta file after upload is finished.
4. Data buyer should generate RSA key pair using RepuxLib.generateAsymmetricKeyPair() function. This key pair should be stored on user local device.
5. Data buyer communicates somehow with data seller and sends him his publicKey.
6. Data seller re-encrypts first part of file using RepuxLib.createFileReencryptor().reencrypt() function with his privateKey and buyer publicKey and meta file hash.
    - Library fetches meta file.
    - Library fetches first file part.
    - Library decrypts first file part using seller privateKey.
    - Library encrypts first file part using buyer publicKey.
    - Library uploads new meta file (with changed first part) to ipfs and emits progress and finish events as uploadFile function.
7. Data seller encrypts file symmetricKey using buyer publicKey.
8. Data seller communicates somehow with data buyer and sends him re-encrypted file meta hash and encrypted file symmetricKey
9. Data buyer decrypts file symmetricKey with his privateKey.
10. Data buyer downloads file using RepuxLib.createFileDownloader().download() function with symmetricKey, privateKey and re-encrypted file meta hash.
    - Library downloads meta file
    - Library downloads first file part, decrypts it using buyer privateKey and after that using symmetricKey
    - Library downloads other file part and decrypts them using symmetricKey
    - Library emits progress event with downloading progress.
    - Library joins all file parts into one file and exposes url to file in finish event.


## Browser compatibility

| Browser | Type    | Is supported | Max file size           | Notes |
| ------- | ------- |:------------:| -----------------------:| ----- |
| Chrome  | Desktop | &check;      | 100GB                   | Access to the WebCrypto API is restricted to secure origins (which is to say https:// pages). |
| Firefox | Desktop | &check;      | 2GB(64-bit) 1GB(32-bit) |       |
| Safari  | Desktop | &check;      | 2GB(64-bit) 1GB(32-bit) |       |
| Opera   | Desktop | &check;      | 100GB                   |       |
| Brave   | Desktop | &check;      | 100GB                   |       |
| IE      | Desktop | &cross;      | -                       | Web Crypto API must be prefixed, needs async/await polyfill |
| Edge    | Desktop | &cross;      | -                       | Web Crypto API is not supported insize a Web Worker (https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7607496/), needs TextEncryptor/TextDecryptor polyfill |
| Chrome  | Mobile  | &check;      | 100MB                   | Access to the WebCrypto API is restricted to secure origins (which is to say https:// pages). |
| Firefox | Mobile  | &check;      | 100MB                   |       |
| Safari  | Mobile  | Not tested   | -                       |       |

## Want to help?
Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing](https://github.com/repux/repux-lib/tree/master/CONTRIBUTING.md)

# RepuX JavaScript API

## Installation
```bash
npm install @repux/repux-lib
```

### How it works
1. Data seller should generate RSA key pair using RepuxLib.generateAsymmetricKeyPair() function. This key pair should be stored on user local device.
2. Data seller should generate AES symmetric key using RepuxLib.generateSymmetricKey() function. This key should be generated per file and should be also stored on user local device.
3. Data seller uploads file using RepuxLib.uploadFile() function with symmetricKey, publicKey and file in parameters.
   - Library reads file partially encrypts it symmetrically using AES-PCBC algorithm.
   - Library encrypts first 190 bytes of file asymmetrically using seller publicKey.
   - Library uploads all file parts to ipfs storage.
   - Library uploads meta file containing all file parts, size, name and other meta data to ipfs storage.
   - Library emits progress event with uploading progress.
   - Library emits finish event with ipfs hash to meta file after upload is finished.
4. Data buyer should generate RSA key pair using RepuxLib.generateAsymmetricKeyPair() function. This key pair should be stored on user local device.
5. Data buyer communicates somehow with data seller and sends him his publicKey.
6. Data seller re-encrypts first part of file using RepuxLib.reencryptFile() function with his privateKey and buyer publicKey and meta file hash.
    - Library fetches meta file.
    - Library fetches first file part.
    - Library decrypts first file part using seller privateKey.
    - Library encrypts first file part using buyer publicKey.
    - Library uploads new meta file (with changed first part) to ipfs and emits progress and finish events as uploadFile function.
7. Data seller encrypts file symmetricKey using buyer publicKey.
8. Data seller communicates somehow with data buyer and sends him re-encrypted file meta hash and encrypted file symmetricKey
9. Data buyer decrypts file symmetricKey with his privateKey.
10. Data buyer downloads file using RepuxLib.downloadFile function with symmetricKey, privateKey and re-encrypted file meta hash.
    - Library downloads meta file
    - Library downloads first file part, decrypts it using buyer privateKey and after that using symmetricKey
    - Library downloads other file part and decrypts them using symmetricKey
    - Library emits progress event with downloading progress.
    - Library joins all file parts into one file and exposes url to file in finish event.

## Example usage
```javascript
import IpfsAPI from 'ipfs-api';
import { RepuxLib } from 'repux-lib';
const repux = new RepuxLib(new IpfsAPI({
    host: '127.0.0.1',
    port: 5002,
    protocol: 'http'
}));
const version = RepuxLib.getVersion();
console.log(version);
```

## Development
1. Run ethereum node, compile and migrate contracts.

2. Run following commands:
```bash
npm install -g ipfs http-server
npm install
ipfs daemon
```

3. And to build library run:
```bash
npx webpack
```

## Tests
Build library, run `http-server` and then open index.html in browser.

## Browser compability
| Browser | Type    | Is supported | Max file size           |
| ------- | ------- |:------------:| -----------------------:|
| Chrome  | Desktop | &check;      | 100GB                   |
| Firefox | Desktop | &check;      | 2GB(64-bit) 1GB(32-bit) |
| Safari  | Desktop | &check;      | 2GB(64-bit) 1GB(32-bit) |
| Opera   | Desktop | &check;      | 100GB                   |
| IE      | Desktop | &cross;      | -                       |
| Edge    | Desktop | Not tested   | -                       |
| Chrome  | Mobile  | Not tested   | -                       |
| Firefox | Mobile  | Not tested   | -                       |
| Safari  | Mobile  | Not tested   | -                       |

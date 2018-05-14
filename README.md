# RepuX JavaScript API

## Installation
```bash
npm install @repux/repux-lib
```

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
* Run ethereum node, compile and migrate contracts. 

* Run following commands:
```bash
npm install -g ipfs http-server
yarn
ipfs daemon
```

**Note for ipfs-go users**: please make sure that you have properly address API configured. Default port 5001 is busy on MacOSX. Please re-configure IPFS using command:
    
    ipfs config Addresses.API /ip4/127.0.0.1/tcp/5002
    
additionally run these commands to setup CORS for integration tests   
 
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"http://127.0.0.1:8081\"]"
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"


and then start daemon:

    ipfs daemon    

* And to build library run:
```bash
yarn build
```

## Tests

### Unit testing
Unit tests are executed by Karma runner (https://karma-runner.github.io) written in Mocha test framework (https://mochajs.org/) using Chai assertions library (http://www.chaijs.com/) with `expect` style. To run unit tests use command: 

    yarn test
    
To use watch: 

    yarn test:watch    

### Integration testing

Tp perform integration tests please follow these steps:
* build library `yarn build:integration-test` 
* run `http-server` or `npx http-server` 
* open url in a browser `http://127.0.0.1:8081`.

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

## Contribution
We are using [semantic-release](https://github.com/semantic-release/semantic-release) to make semantic versioning easier. 
This tool requires special commit message convention taken from Angular to determine the type of changes in repository. 
You can read more about Angular commit message conventions [here](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).
Please follow this conventions when you contributing.

## Releasing new version
To release new library version checkout master branch and run `GH_TOKEN=YOUR-GITHUB-PERSONAL-ACCESS-TOKEN NPM_TOKEN=YOUR-NPM-TOKEN yarn release` command.
You can also add GH_TOKEN and NPM_TOKEN environment variable to your .bashrc file and then simply run `yarn release` command.
Semantic-release needs access to at least GitHub **repo** scope. If you don't know how to generate your personal token, please read 
[this article](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/). You also have to generate NPM_TOKEN. This 
token is used only to preparing package.json file. Library won't be published to NPM repository until you add "@semantic-release/npm" to **publish** section
in `.releaserc` file.

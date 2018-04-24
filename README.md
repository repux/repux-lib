# RepuX JavaScript API

## Installation
```bash
npm install @repux/repux-lib
```

## Example usage
```javascript
import Web3 from 'web3';
import IpfsAPI from 'ipfs-api';
import { Repux } from 'repux-lib';
let web3 = new Web3(new Web3.providers.HttpProvider('http://local.dev.ico.repux:8545'));
web3.eth.defaultAccount = '0x627306090abaB3A6e2400e9345bC60c78a8BEf57';
const repux = new RepuX(web3, new IpfsAPI({
    host: '127.0.0.1',
    port: 5002,
    protocol: 'http'
}));
const balance = await repux.getBalance();
console.log(balance);
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
| Firefox | Safari  | Not tested   | -                       |
| Node.js | Desktop | &cross; (WIP)| -                       |

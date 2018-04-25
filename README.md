# RepuX JavaScript API

## Installation
```bash
npm install @repux/repux-lib
```

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
| Node.js | Desktop | &cross; (WIP)| -                       |

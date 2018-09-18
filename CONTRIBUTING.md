# Contributing to RepuX

## Development
* Run ethereum node, compile and migrate contracts. 

* Run following commands:
```bash
npm install -g ipfs http-server
yarn
```
    
additionally run these commands to setup CORS for integration tests   
 
    jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"http://127.0.0.1:8081\"]"
    jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
    jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"


and then start daemon:

    jsipfs daemon   

**Note for ipfs-go users**: Instead of `jsipfs` command use `ipfs`. Also please make sure that you have properly address API configured. Default port 5001 is busy on MacOSX. Please re-configure IPFS using command:
    
    ipfs config Addresses.API /ip4/127.0.0.1/tcp/5002 

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


## Code style
Informations below for IntelliJ IDEA apps (PHPStrom, WebStorm, etc.)

### EditorConfig
Enable EditorConfig support in `Settings > Editor > Code Style` section. 

### TSLint
Enable TSLInt support in `Preferences > Languages & Frameworks > TypeScript > TSLint`.

### TypeScript code style
Use TypeScript code styles settings stored in  `intellij-cs.xml`. Import using `Settings > Editor > Code Style > TypeScript` then `Scheme > Import scheme > IntelliJ IDEA code style xml`.


## Version control
We are using [semantic-release](https://github.com/semantic-release/semantic-release) to make semantic versioning easier. 
This tool requires special commit message convention taken from Angular to determine the type of changes in repository. 
You can read more about Angular commit message conventions [here](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).
Please follow this conventions when you contributing.

## Release
To release new library version checkout master branch and run `GH_TOKEN=YOUR-GITHUB-PERSONAL-ACCESS-TOKEN NPM_TOKEN=YOUR-NPM-TOKEN yarn release` command.
You can also add GH_TOKEN and NPM_TOKEN environment variable to your .bashrc file and then simply run `yarn release` command.
Semantic-release needs access to at least GitHub **repo** scope. If you don't know how to generate your personal token, please read 
[this article](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/). You also have to generate NPM_TOKEN. This 
token is used only to preparing package.json file. Library won't be published to NPM repository until you add "@semantic-release/npm" to **publish** section
in `.releaserc` file.


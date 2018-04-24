import assert from 'assert';
import { RepuxLib } from '../src/repux-lib';
import IpfsAPI from 'ipfs-api';
import { IPFS_HOST, IPFS_PORT, IPFS_PROTOCOL, JWK_PUBLIC_KEY, JWK_PRIVATE_KEY, FILE_PASSWORD } from './config';

const FILE_NAME = 'test.txt';
const FILE = new File([ new Blob([
`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pulvinar mollis dolor. Etiam porta ornare vestibulum. Nam vitae odio mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec id ex sed nisl maximus accumsan ut id odio. Maecenas non vehicula augue. Cras luctus sem malesuada ex congue semper. Quisque vel sodales ipsum, sit amet vulputate sem. Vivamus tempus venenatis libero, non molestie libero varius eu. Pellentesque ornare suscipit nulla, a tristique erat laoreet et. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam sed fermentum odio. Nam non mauris dictum, commodo odio maximus, dignissim augue. Curabitur porttitor nunc ligula. Nulla facilisi.
Sed cursus nulla magna. Integer imperdiet eleifend diam, et tincidunt mauris facilisis non. In quis luctus libero, ac aliquet justo. Praesent pharetra vel ipsum quis laoreet. Morbi luctus ante ac dictum imperdiet. Maecenas egestas lobortis odio. Nam tincidunt lacus in ante congue tincidunt. Donec lobortis odio nec rhoncus egestas. Mauris a rhoncus metus, a vulputate diam. Nullam sodales nisl sit amet magna dapibus mollis. Mauris tempor magna accumsan ex facilisis, a dapibus nisi tincidunt. Vestibulum vitae lobortis erat, id elementum lorem. Vivamus laoreet imperdiet nunc et feugiat. Sed vulputate leo in massa tempor auctor. Donec ut nisi malesuada, sollicitudin lacus sed, finibus erat. Donec porttitor ultrices turpis ac aliquam.
Fusce eget iaculis mauris. Aliquam erat volutpat. In vitae urna ac nibh ultrices luctus ac in justo. Suspendisse congue mattis dui quis ultricies. Donec blandit nibh in quam sodales, at luctus sem sodales. Duis cursus est sed volutpat ornare. Aenean ultricies magna nunc, at ornare nisi tincidunt nec. Quisque condimentum nisi sed urna euismod sagittis. Donec imperdiet nulla sit amet enim vehicula posuere. Morbi dignissim turpis et faucibus euismod. In hac habitasse platea dictumst. Sed blandit odio augue, placerat fringilla nunc vehicula sit amet.
Duis venenatis metus quis elit maximus, eget facilisis ipsum mattis. Suspendisse fermentum lorem sed finibus efficitur. Curabitur non neque neque. Etiam mauris nunc, tristique ut sollicitudin et, ultrices et nulla. Donec vulputate ullamcorper sem at elementum. Phasellus dignissim lacinia neque, ac commodo est blandit a. Quisque at magna semper, gravida quam quis, condimentum velit. Mauris iaculis porta ligula. Ut ut justo sodales, dictum purus ut, iaculis mi. Vivamus aliquet finibus tincidunt. Integer arcu nunc, condimentum non erat non, luctus hendrerit elit. Sed magna magna, pretium viverra felis at, porta vehicula velit. Donec efficitur velit efficitur sagittis dignissim. Etiam in tellus porttitor, vestibulum mi in, lobortis velit. Praesent vulputate, lorem at accumsan scelerisque, sem tortor faucibus metus, consectetur consequat est mauris sed diam.
Donec sit amet nibh dui. Praesent vulputate lectus felis. Nam varius nibh viverra, tempus lorem vel, mattis tortor. Integer dignissim faucibus blandit. Quisque vitae nisi vehicula magna tincidunt aliquam. Vestibulum eget ligula eu lacus elementum interdum in ac dui. Nulla nec rhoncus quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris feugiat neque a urna finibus rutrum. Sed congue consectetur quam eu condimentum. Donec a mauris euismod, condimentum dolor porta, dapibus metus. Vivamus tincidunt, lacus ac euismod lobortis, augue velit semper metus, non aliquet neque mi a elit. Suspendisse vel blandit lacus. Donec pretium consectetur orci id lobortis.
`]) ], FILE_NAME);

function downloadBlob(blobUrl, fileName) {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
    }, 0);
}

describe('File can be uploaded and downloaded using encryption/decryption', function () {
    let uploadedFileHash;
    const repux = new RepuxLib(new IpfsAPI({
        host: IPFS_HOST,
        port: IPFS_PORT,
        protocol: IPFS_PROTOCOL
    }));

    describe('RepuxLib.getVersion()', function () {
        it('should return actual version', function () {
            const version = RepuxLib.getVersion();
            console.log('version', version);
            assert.ok(typeof version === 'string');
        });
    });

    describe('RepuxLib.uploadFile()', function () {
        this.timeout(30000);

        it('should emit progress event and emit finish event with meta file hash', function (done) {
            const fileUploader = repux.uploadFile(FILE_PASSWORD, JWK_PUBLIC_KEY, FILE);
            fileUploader.subscribe('progress', function (eventType, progress) {
                console.log('progress', progress);
                assert.ok(progress);
            });

            fileUploader.subscribe('finish', function (eventType, metaFileHash) {
                assert.ok(metaFileHash);
                console.log('metaFileHash', metaFileHash);
                uploadedFileHash = metaFileHash;
                done();
            });
        });
    });

    describe('RepuxLib.downloadFile()', function () {
        this.timeout(30000);

        it('should emit progress event and emit finish event with url to file', async function (done) {
            const fileDownloader = repux.downloadFile(FILE_PASSWORD, JWK_PRIVATE_KEY, uploadedFileHash);
            fileDownloader.subscribe('progress', function (eventType, progress) {
                console.log('progress', progress);
                assert.ok(progress);
            });

            fileDownloader.subscribe('finish', function (eventType, result) {
                console.log('result', result);
                assert.ok(result.fileURL);
                assert.equal(result.fileName, FILE_NAME);

                if (window) {
                    downloadBlob(result.fileURL, result.fileName);
                }

                done();
            });
        });
    });
});

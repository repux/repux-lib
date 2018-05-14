export const FILE_HASHES = {
    META_FILE_HASH: 'META_FILE_HASH',
    FILE_CHUNK_0: 'FILE_CHUNK_0',
    FILE_CHUNK_1: 'FILE_CHUNK_1',
    NEW_IPFS_FILE: 'NEW_IPFS_FILE'
};

export const FILES = {
    [FILE_HASHES.META_FILE_HASH]: {
        content: '{"initializationVector":{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0},"name":"test.txt","size":3567000,"chunks":{"0":"FILE_CHUNK_0","1":"FILE_CHUNK_1"}}'
    },
    [FILE_HASHES.FILE_CHUNK_0]: {
        content: 'FIRST_CHUNK_CONTENT'
    },
    [FILE_HASHES.FILE_CHUNK_1]: {
        content: 'SECOND_CHUNK_CONTENT'
    },
    [FILE_HASHES.NEW_IPFS_FILE]: {
        content: 'NEW_IPFS_FILE_CONTENT'
    }
};

export default function IpfsApi() {
    return {
        files: {
            get: (hash, callback) => {
                const file = FILES[hash];
                if (file) {
                    return callback(null, [file]);
                }

                return callback();
            },
            add: (buffer, callback) => {
                if (buffer instanceof Buffer) {
                    return callback(null, [{ hash: FILE_HASHES.NEW_IPFS_FILE }]);
                }

                callback();
            }
        }
    };
}

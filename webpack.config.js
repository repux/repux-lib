const path = require('path');

module.exports = {
    entry: {
        ['lib/index']: ['./src/repux-lib.js'],
        ['tests/index']: ['./test/run.js']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        library: 'RepuxLib',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [/node_modules\/promisify-es6/],
                use: [ {
                    loader: 'babel-loader',
                    query: {
                        presets: [ 'env' ]
                    }
                } ]
            }
        ]
    }
};

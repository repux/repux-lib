const path = require('path');

module.exports = env => {
    let entries = {};
    entries['lib/index'] = ['./src/repux-lib.js'];

    if (env && env === 'test') {
        entries = {};
        entries['tests/index'] = ['./test/integration/run.js'];
    }

    return {
        entry: entries,
        devtool: 'source-map',
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
                    use: [
                        {
                            loader: 'babel-loader',
                            query: {
                                presets: ['env']
                            }
                        }
                    ]
                },
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader'
                }
            ]
        }
    };
};

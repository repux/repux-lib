const webpackConfig = require('./webpack.config');

module.exports = function (config) {
    const files = [];

    if (config.folder) {
        files.push(config.folder + '/**/*.spec.ts');
    }

    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: files,
        preprocessors: {
            'src/**/*.js': ['eslint', 'coverage'],
            'src/**/*.ts': ['tslint', 'coverage'],
            'test/**/*.spec.ts': ['tslint', 'webpack']
        },

        webpack: {
            module: webpackConfig().module,
            resolve: webpackConfig().resolve
        },
        reporters: ['mocha', 'coverage'],
        port: 9877,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        concurrency: Infinity,
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        }
    });
};

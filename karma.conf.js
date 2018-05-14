const webpackConfig = require('./webpack.config');
delete webpackConfig.entry;

module.exports = function (config) {
    const files = [];

    if (config.folder) {
        files.push(config.folder + '/**/*.spec.js');
    }

    config.set({
        frameworks: ['mocha', 'chai', 'sinon'],
        files: files,

        reporters: ['mocha', 'coverage'],
        port: 9877,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        // singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,

        preprocessors: {
            'src/**/!(*.spec)+(*.js)': ['eslint', 'coverage'],
            'test/**/*.spec.js': ['eslint', 'webpack']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        client: {
            captureConsole: true,
            chai: {
                includeStack: true
            }
        },

        mochaReporter: {
            showDiff: true
        },

        coverageReporter: {
            type: 'html',
            dir: './docs/coverage',
            instrumenterOptions: {
                istanbul: { noCompact: true }
            },
            includeAllSources: true
        }
    });
};

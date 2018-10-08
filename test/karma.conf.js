const testUtils = require('./test-utils');
const headlessChromeFlags = testUtils.karmaHeadlessChromeFlags();

module.exports = function(config) {

	const useCPUcores = testUtils.useCPUcores();
	console.log(`Karma will use ${useCPUcores} cpu cores for parallel testing`);

	config.set({

		basePath : '../',
		
		files : [
			'node_modules/d3/d3.js',
			'node_modules/nvd3/build/nv.d3.js',
			{ pattern: 'node_modules/ng2-nvd3/build/**', included: false, watched: false },

			'node_modules/core-js/client/shim.js',
			'node_modules/reflect-metadata/Reflect.js',

			'node_modules/zone.js/dist/zone.js',
			'node_modules/zone.js/dist/long-stack-trace-zone.js',
			'node_modules/zone.js/dist/proxy.js',
			'node_modules/zone.js/dist/sync-test.js',
			'node_modules/zone.js/dist/jasmine-patch.js',
			'node_modules/zone.js/dist/async-test.js',
			'node_modules/zone.js/dist/fake-async-test.js',

			'node_modules/moment/min/moment-with-locales.min.js',

			'node_modules/systemjs/dist/system.src.js',
			{ pattern: 'node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css' },

			{ pattern: 'systemjs.config.js', included: false, watched: false },
			{ pattern: 'systemjs.karma.config.js', included: false, watched: false },
			{ pattern: 'systemjs.config.extras.js', included: false, watched: false },
			
			'node_modules/hammerjs/hammer.js',
			{ pattern: 'node_modules/@angular/**', included: false, watched: false },
			{ pattern: 'node_modules/rxjs/**', included: false, watched: false },

			{ pattern: 'node_modules/tslib/**', included: false, watched: false },
			{ pattern: 'node_modules/traceur/**', included: false, watched: false },

			'test/karma.test-shim.js',
			{ pattern: 'test/client/**', included: false, watched: false },

			{ pattern: 'public/app/**', included: false, watched: false },

			{ pattern: 'public/service-worker.js', included: false, watched: false },

			{ pattern: 'public/webfonts/**', included: false, watched: false },

			{ pattern: 'public/img/**', included: false, watched: false },
		],

		proxies: {
			'/service-worker.js': '/base/public/service-worker.js',
			'/public/webfonts/': '/base/public/webfonts/',
			'/public/img/': '/base/public/img/'
		},

		// exclude: [],

		frameworks: ['parallel', 'jasmine'],

		browserNoActivityTimeout: 20000,
		browserDisconnectTimeout: 20000,
		customLaunchers: {
			/*
			*	this custom launcher requires setting env var CHROME_BIN=chromium-browser
			*	possible options for env var value depending on what you have installed:
			*	chromium-browser, chromium, google-chrome
			*/
			ChromeHeadless: {
				base: 'Chrome',
				flags: headlessChromeFlags
			}
		},
		browsers: ['ChromeHeadless'],
		
		plugins: [
			'karma-parallel',
			'karma-redirect-preprocessor',
			'karma-chrome-launcher',
			'karma-html-reporter',
			'karma-sourcemap-loader',
			'karma-coverage',
			'karma-jasmine'
		],

		parallelOptions: {
			executors: useCPUcores,
			shardStrategy: 'description-length'
		},

		preprocessors: {
			'public/**/*.html': ['redirect'],
			'public/app/**/!(*.spec).js': ['coverage'],
			'public/app/**/*.js': ['sourcemap']
		},

		redirectPreprocessor: {
			// stripPrefix: '',
			// stripSuffix: '',
			// prependPrefix: ''
		},

		reporters: ['progress', 'coverage', 'html'],
		coverageReporter: {
			dir: 'logs/',
			reporters: [
				{ type: 'json', subdir: 'coverage'}
			]
		},
		htmlReporter: {
			outputDir: 'logs/unit',
			templatePath: null,
			focusOnFailures: true,
			namedFiles: false,
			pageTitle: 'PasswordManager Client Unit Tests',
			urlFriendlyName: true,
			reportName: 'client'
		},

		failOnEmptyTestSuite: false, // overrides the error, warn instead - by default returns error if there're no tests defined

		hostname: process.env.IP,
		port: process.env.PORT,
		runnerPort: 0,

		autoWatch: true,
		singleRun: true,

		logLevel: config.LOG_ERROR, // LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
		browserConsoleLogOptions: {
			level: 'debug',
			format: '%b %T %m',
			path: 'logs/client-unit-browser-console.log',
			terminal: false
		},
		colors: true

	});
};

const vueJsx = require('@vitejs/plugin-vue-jsx');
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
process.env.CHROME_BIN = require('puppeteer').executablePath();

const path = require('path');

/** @type {(config: import("karma").Config) => Promise<void> | undefined} */
module.exports = function (config) {
  config.set({
    basePath: './',
    plugins: ['karma-spec-reporter', 'karma-jasmine', 'karma-vite', 'karma-coverage', 'karma-chrome-launcher'],
    browsers: ['ChromeHeadless'],
    frameworks: ['jasmine', 'vite'],
    reporters: ['spec'],
    files: [
      {
        pattern: '__tests__/_setup/global.module.scss',
        type: 'css',
        watched: false,
        served: false,
      },
      {
        pattern: '__tests__/**/*.spec.ts?(x)',
        type: 'module',
        watched: false,
        served: false,
      },
    ],
    coverageReporter: {
      reporters: [{ type: 'lcov' }],
    },
    vite: {
      config: {
        plugins: [vueJsx()],
        resolve: {
          // @testing-library/vue compatible
          conditions: ['import'],
          alias: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@': path.resolve(__dirname, './src'),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@test': path.resolve(__dirname, './__tests__'),
          },
        },
        define: {
          'process.env.VTL_SKIP_AUTO_CLEANUP': false,
          'process.env.VTL_SKIP_WARN_EVENT_UPDATE': false,
        },
        css: {
          modules: {
            scopeBehaviour: 'global',
          },
        },
      },
    },
  });
};

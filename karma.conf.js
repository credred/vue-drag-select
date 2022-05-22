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
        pattern: '__tests__/_setup/global.css',
        type: 'css',
        watched: true,
        served: true,
      },
      {
        pattern: '__tests__/**/*.spec.ts',
        type: 'module',
        watched: false,
        served: false,
      },
    ],
    vite: {
      config: {
        resolve: {
          alias: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@': path.resolve(__dirname, './src'),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@test': path.resolve(__dirname, './__tests__'),
          },
        },
      },
    },
  });
};

const { pathsToModuleNameMapper } = require('ts-jest');
const tsconfig = require('./tsconfig.test.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
  setupFilesAfterEnv: ['./scripts/setupJestEnv.ts'],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/**/?*.spec.[jt]s?(x)'],
  collectCoverageFrom: ['src/**'],
};

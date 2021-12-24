/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/**/?*.spec.[jt]s?(x)'],
  collectCoverageFrom: ['src/**'],
};

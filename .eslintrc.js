const { defineConfig } = require('eslint-define-config');
/** @type {import("eslint-define-config").EslintConfig} */
// @ts-expect-error The rule of eslintconfig accepts literal quantities such as "error", while the eslint recommended module is derived as a string type, resulting in TS error
const tsForEslintConfig = require('@typescript-eslint/eslint-plugin/dist/configs/eslint-recommended');

module.exports = defineConfig({
  root: true,
  parser: 'vue-eslint-parser',
  env: {
    browser: true,
    es6: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.eslint.json'],
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    // const [_, text] = [null, "Hello"]
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/naming-convention': 'error',
    'vue/max-attributes-per-line': 'off',
    'vue/attribute-hyphenation': ['error', 'never'],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: tsForEslintConfig.overrides[0].rules,
    },
    // configuration file type is cjs，disable no-var-requires
    {
      files: ['.eslintrc.js', '.prettierrc.js', 'vite.config.ts', 'jest.config.js', 'postcss.config.js'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
    {
      files: ['**/__tests__/**/*.{j,t}s?(x)'],
      extends: ['plugin:jest/style', 'plugin:jest/recommended'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'jest/unbound-method': 'error',
      },
    },
  ],
  ignorePatterns: ['dist/**', 'coverage/**'],
});

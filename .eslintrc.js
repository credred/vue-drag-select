// @ts-check
const { defineConfig } = require('eslint-define-config');
/** @type {import("eslint-define-config").EslintConfig} */
// @ts-expect-error The rule of eslintconfig accepts literal quantities such as "error", while the eslint recommended module is derived as a string type, resulting in TS error
const tsForEslintConfig = require('@typescript-eslint/eslint-plugin/dist/configs/eslint-recommended');
const tsconfigConf = require('./tsconfig.conf.json');

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
    project: './tsconfig.json',
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
    'vue/max-attributes-per-line': 'off',
    'vue/attribute-hyphenation': ['error', 'never'],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: tsForEslintConfig.overrides[0].rules,
    },
    {
      parserOptions: {
        project: './tsconfig.conf.json',
      },
      files: tsconfigConf.include,
      env: {
        node: true,
      },
      // configuration file type is cjs，disable no-var-requires
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
    {
      parserOptions: {
        project: './tsconfig.example.json',
      },
      files: ['stories/*'],
    },
    {
      parserOptions: {
        project: './tsconfig.conf.json',
      },
      files: tsconfigConf.include,
      env: {
        node: true,
      },
      // configuration file type is cjs，disable no-var-requires
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
    {
      files: ['**/__tests__/**/*.{j,t}s?(x)'],
      plugins: ['jasmine'],
      extends: ['plugin:jasmine/recommended'],
      parserOptions: {
        project: './tsconfig.test.json',
      },
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'jasmine/prefer-toHaveBeenCalledWith': 'off',
      },
    },
  ],
  ignorePatterns: ['dist/**', 'coverage/**', 'stories/**'],
});

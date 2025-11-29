// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const typescriptESLint = require('@typescript-eslint/eslint-plugin');
const typescriptESLintParser = require('@typescript-eslint/parser');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      '@typescript-eslint': typescriptESLint,
    },
    languageOptions: {
      parser: typescriptESLintParser,
      parserOptions: {
        project: true,
      },
    },
    ignores: [
      'dist/*',
      '.expo/**',
      '.vscode/**',
      'assets/**',
      'node_modules/**',
      '*.config.js',
      '*.d.ts',
      '*.css',
      '*.json',
      '*.md',
      'babel.config.js',
      'eslint.config.js',
      'metro.config.js',
      'tailwind.config.js',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'max-len': [
        'error',
        {
          code: 120,
        },
      ]
    },
  },
]);
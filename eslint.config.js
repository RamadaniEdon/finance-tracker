// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      'dist/*',
      '.expo/*',
      '.vscode/*',
      'assets/*',
      'node_modules/*',
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
  },
]);
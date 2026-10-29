import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const forbiddenInCore = [
  'react',
  'react-dom',
  'react-native',
  'vue',
  '@angular/*',
  'svelte',
  'svelte/*',
  '../web/*',
  '../react/*',
  '../vue/*',
  '../angular/*',
  '../svelte/*',
  '../native/*',
];

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.changeset/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-expect-error': 'allow-with-description',
          minimumDescriptionLength: 10,
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
    },
  },
  {
    files: ['src/core/**/*.ts'],
    languageOptions: { globals: {} },
    rules: {
      'no-restricted-imports': ['error', { patterns: forbiddenInCore }],
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'navigator',
        'HTMLElement',
        'Element',
        'Node',
        'localStorage',
        'sessionStorage',
        'requestAnimationFrame',
        'getComputedStyle',
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.js'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly' },
    },
  },
);

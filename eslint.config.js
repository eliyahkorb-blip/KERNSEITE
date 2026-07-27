import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'php/vendor/',
      'playwright-report/',
      'test-results/',
      'pnpm-lock.yaml',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    // Browser-Interaktionsskripte (client-seitig)
    files: ['src/**/*.{ts,astro}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Node-Skripte (Build/QA)
    files: ['scripts/**/*.mjs', '*.mjs', '*.config.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Skripte, die per Playwright Code im Browser ausführen (page.evaluate).
    files: ['scripts/visual-qa.mjs', 'scripts/check-headings.mjs'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
);

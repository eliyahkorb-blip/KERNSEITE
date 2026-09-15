import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
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
  { files: ['**/*.astro'], processor: 'astro/client-side-ts' },
  { files: ['**/*.astro/*.ts'], languageOptions: { parser: tseslint.parser } },
  {
    // Browser-Interaktionsskripte (client-seitig)
    files: ['src/**/*.{ts,astro}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { parser: tseslint.parser, extraFileExtensions: ['.astro'] },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Skripte, die unverändert aus public/ ausgeliefert werden und im Browser
    // laufen (z. B. das Vorab-Skript des Barrierefreiheits-Schalters).
    files: ['public/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser },
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
];

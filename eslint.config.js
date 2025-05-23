export default [
  {
    ignores: ['node_modules/', 'dist/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    files: ['src/**/*.js'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];

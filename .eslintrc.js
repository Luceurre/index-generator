module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    semi: ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'newline-before-return': ['error'],
  },
};

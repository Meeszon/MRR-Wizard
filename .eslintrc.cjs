module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
  },
  plugins: ['prettier', 'react'],
  rules: {
    'import/no-cycle': 'off',
    'no-nested-ternary': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'react/function-component-definition': [2, { namedComponents: 'function-declaration' }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-no-constructed-context-values': 'off',
    'react/prop-types': 'off',
    'react/state-in-constructor': 'off',
    'no-plusplus': 'off',
    'no-alert': 'off',
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
  },
}

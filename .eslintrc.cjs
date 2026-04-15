module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // React 17+ JSX transform — no need to import React
    'react/react-in-jsx-scope': 'off',
    // Not using PropTypes — relying on code conventions
    'react/prop-types': 'off',
    // Allow JSX in .jsx files only
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx'] }],
    // Allow spreading props (used for passing context-derived props)
    'react/jsx-props-no-spreading': 'off',
    // Allow nested ternaries (used in UI conditional rendering)
    'no-nested-ternary': 'off',
    // Map/canvas areas have onClick without keyboard equivalents by design
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    // Inline styles are used intentionally for pixel-precise sizing
    'react/forbid-component-props': 'off',
    // Allow param reassignment for reducer-style patterns
    'no-param-reassign': ['error', { props: false }],
    // Allow console.warn for debugging
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Vite resolves modules without file extensions
    'import/extensions': 'off',
    // Named exports alongside default are fine
    'import/prefer-default-export': 'off',
  },
};

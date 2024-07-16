import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import airbnbConfig from 'eslint-config-airbnb';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'airbnb',
      'plugin:prettier/recommended',
    ],
    plugins: ['react', 'prettier'],
    rules: {
      'prettier/prettier': '0',
      'react/react-in-jsx-scope': '0',
      'react/prefer-stateless-function': '0',
      'react/jsx-filename-extension': '0',
      'react/jsx-one-expression-per-line': '0',
      'no-nested-ternary': '0',
      'react/prop-types': '0',
      'import/no-extraneous-dependencies': '0',
      'arrow-body-style': ['error', 'always'],
      'react/function-component-definition': [
        '0',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  pluginReactConfig,
  prettierConfig,
];

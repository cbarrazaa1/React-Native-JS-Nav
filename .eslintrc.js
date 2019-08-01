module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  plugins: ['react', 'react-native'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
  ],
  rules: {
    'no-unused-vars': 0,
  },
};

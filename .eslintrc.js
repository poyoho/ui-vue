/** @type import("eslint").Linter.Config */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    extraFileExtensions: [".vue"],
    ecmaFeatures: { jsx: true }
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:vue/recommended"
  ],
  env: {
    "browser": true,
  },
  rules: {
    "indent": ["error", 2],
    "quotes": [1, "single"],
    'semi': [2, 'never'],
    "linebreak-style": 0,
    "no-console": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-non-null-assertion": 0
  }
}

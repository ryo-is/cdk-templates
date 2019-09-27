module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  rules: {
    "@typescript-eslint/no-inferrable-types": 0,
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/typedef": ["error"],
    "prettier/prettier": [
      "error",
      {
        semi: false,
        singleQuote: false
      }
    ]
  },
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        jest: true
      }
    },
    {
      files: ["*.ts", "*.tsx"]
    }
  ]
}

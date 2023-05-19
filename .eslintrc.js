module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  reportUnusedDisableDirectives: true,
  env: {
    node: true,
  },
  rules: {
    "import/extensions": [
      "error",
      {
        ignorePackages: true,
        pattern: {
          js: "never",
          ts: "never",
          json: "always",
        },
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [],
      },
    ],
    "import/no-unused-modules": ["error", { unusedExports: true }],
    "@typescript-eslint/no-use-before-define": ["error", "nofunc"],
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
      },
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
};

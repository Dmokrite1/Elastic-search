module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: ["prettier"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    overrides: [
        {
            files: ["src/**/*.ts"],
            extends: "standard-with-typescript",
            rules: {
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/space-before-function-paren": "off",
                "@typescript-eslint/quotes": "off",
                "@typescript-eslint/semi": ["error", "always"],
                "@typescript-eslint/indent": "off",
            },
        },
    ],
};

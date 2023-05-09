module.exports = {
    env: {
        jest: true,
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        'max-len': 0,
        'import/prefer-default-export': 0,
        indent: ['warn', 4],
    },
};

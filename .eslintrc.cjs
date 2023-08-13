module.exports = {
    env: {
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'standard',
        'plugin:vue/vue3-essential'
    ],
    overrides: [
        {
            env: {
                node: true
            },
            files: [
                '.eslintrc.{js,cjs}'
            ],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        'vue'
    ],
    rules: {
        indent: ['warn', 4],
        'max-depth': ['warn', 4],
        'linebreak-style': [
            'error',
            'unix'
        ],
        semi: [
            'error',
            'always'
        ],
        'eol-last': 0
    }
};

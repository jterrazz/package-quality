import perfectionist from 'eslint-plugin-perfectionist';

export default [
    // Configuration for Perfectionist rules
    {
        plugins: {
            perfectionist,
        },
        rules: {
            ...perfectionist.configs['recommended-natural'].rules,
            'perfectionist/sort-imports': 'off',
            'perfectionist/sort-named-imports': 'off',
            'perfectionist/sort-objects': 'off',
            'eslint-plugin-perfectionist/sort-exports': 'error',
        },
    },
];

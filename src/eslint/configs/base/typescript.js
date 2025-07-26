import ts from 'typescript-eslint';

export default [
    // Configuration for Typescript rules
    ...ts.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true,
                },
            ],
        },
    },

    // Custom rules for TypeScript type imports
    {
        rules: {
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    disallowTypeAnnotations: true,
                    fixStyle: 'inline-type-imports',
                    prefer: 'type-imports',
                },
            ],
        },
    },
];

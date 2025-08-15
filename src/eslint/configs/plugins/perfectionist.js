import unusedImports from 'eslint-plugin-unused-imports';
import perfectionist from 'eslint-plugin-perfectionist';

export default [
    // Configuration for Perfectionist rules
    {
        plugins: {
            perfectionist,
            'unused-imports': unusedImports,
        },
        rules: {
            // Imports and variables
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],

            // Sorting
            'perfectionist/sort-array-includes': ['error', { type: 'natural' }],
            'perfectionist/sort-classes': ['error', { type: 'natural' }],
            'perfectionist/sort-heritage-clauses': ['error', { type: 'natural' }],
            'perfectionist/sort-intersection-types': ['error', { type: 'natural' }],
            'perfectionist/sort-jsx-props': ['error', { type: 'natural' }],
            'perfectionist/sort-named-exports': ['error', { type: 'natural' }],
            'perfectionist/sort-named-imports': ['error', { type: 'natural' }],
            'perfectionist/sort-switch-case': ['error', { type: 'natural' }],
            'perfectionist/sort-union-types': ['error', { type: 'natural' }],
            'perfectionist/sort-variable-declarations': ['error', { type: 'natural' }],
            'perfectionist/sort-imports': [
                'error',
                {
                    type: 'alphabetical',
                    order: 'asc',
                    ignoreCase: true,
                    newlinesBetween: 1,
                    groups: [
                        'react',
                        ['value-external', 'type-external'],
                        { commentAbove: 'Configuration' },
                        ['configuration', 'configuration-type'],
                        { commentAbove: 'Application' },
                        ['application', 'application-type'],
                        { commentAbove: 'Domain' },
                        ['domain', 'domain-type'],
                        { commentAbove: 'Ports' },
                        ['ports', 'ports-type'],
                        { commentAbove: 'Adapters' },
                        ['adapters', 'adapters-type'],
                        { commentAbove: 'Infrastructure' },
                        ['infrastructure', 'infrastructure-type'],
                        { commentAbove: 'Utils' },
                        ['utils', 'utils-type'],
                        ['value-parent', 'type-parent'],
                        ['value-sibling', 'type-sibling'],
                        ['value-index', 'type-index'],
                        'style',
                    ],
                    customGroups: [
                        {
                            groupName: 'react',
                            elementNamePattern: '^react$',
                        },
                        {
                            groupName: 'configuration',
                            elementNamePattern: [
                                '^@configuration(/.*|$)',
                                '/configuration(?!/?$)',
                                '/configuration/?$',
                            ],
                        },
                        {
                            groupName: 'configuration-type',
                            selector: 'type',
                            elementNamePattern: [
                                '^@configuration(/.*|$)',
                                '/configuration(?!/?$)',
                                '/configuration/?$',
                            ],
                        },
                        {
                            groupName: 'application',
                            elementNamePattern: [
                                '^@application(/.*|$)',
                                '/application(?!/?$)',
                                '/application/?$',
                            ],
                        },
                        {
                            groupName: 'application-type',
                            selector: 'type',
                            elementNamePattern: [
                                '^@application(/.*|$)',
                                '/application(?!/?$)',
                                '/application/?$',
                            ],
                        },
                        {
                            groupName: 'domain',
                            elementNamePattern: ['^@domain(/.*|$)', '/domain(?!/?$)', '/domain/?$'],
                        },
                        {
                            groupName: 'domain-type',
                            selector: 'type',
                            elementNamePattern: ['^@domain(/.*|$)', '/domain(?!/?$)', '/domain/?$'],
                        },
                        {
                            groupName: 'ports',
                            elementNamePattern: ['^@ports(/.*|$)', '/ports(?!/?$)', '/ports/?$'],
                        },
                        {
                            groupName: 'ports-type',
                            selector: 'type',
                            elementNamePattern: ['^@ports(/.*|$)', '/ports(?!/?$)', '/ports/?$'],
                        },
                        {
                            groupName: 'adapters',
                            elementNamePattern: [
                                '^@adapters(/.*|$)',
                                '/adapters(?!/?$)',
                                '/adapters/?$',
                            ],
                        },
                        {
                            groupName: 'adapters-type',
                            selector: 'type',
                            elementNamePattern: [
                                '^@adapters(/.*|$)',
                                '/adapters(?!/?$)',
                                '/adapters/?$',
                            ],
                        },
                        {
                            groupName: 'infrastructure',
                            elementNamePattern: [
                                '^@infrastructure(/.*|$)',
                                '/infrastructure(?!/?$)',
                                '/infrastructure/?$',
                            ],
                        },
                        {
                            groupName: 'infrastructure-type',
                            selector: 'type',
                            elementNamePattern: [
                                '^@infrastructure(/.*|$)',
                                '/infrastructure(?!/?$)',
                                '/infrastructure/?$',
                            ],
                        },
                        {
                            groupName: 'utils',
                            elementNamePattern: ['^@utils(/.*|$)', '/utils(?!/?$)', '/utils/?$'],
                        },
                        {
                            groupName: 'utils-type',
                            selector: 'type',
                            elementNamePattern: ['^@utils(/.*|$)', '/utils(?!/?$)', '/utils/?$'],
                        },
                        {
                            groupName: 'style',
                            elementNamePattern: '^.+\\.css$',
                        },
                    ],
                },
            ],
        },
    },
];

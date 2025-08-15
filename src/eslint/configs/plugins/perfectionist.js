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
            'perfectionist/sort-array-includes': 'natural',
            'perfectionist/sort-classes': 'natural',
            'perfectionist/sort-heritage-clauses': 'natural',
            'perfectionist/sort-intersection-types': 'natural',
            'perfectionist/sort-jsx-props': 'natural',
            'perfectionist/sort-named-exports': 'natural',
            'perfectionist/sort-named-imports': 'natural',
            'perfectionist/sort-switch-case': 'natural',
            'perfectionist/sort-union-types': 'natural',
            'perfectionist/sort-variable-declarations': 'natural',
            'perfectionist/sort-imports': [
                'error',
                {
                    type: 'alphabetical',
                    order: 'asc',
                    ignoreCase: true,
                    newlinesBetween: 1,
                    groups: [
                        'react',
                        'value-external',
                        { commentAbove: 'Configuration' },
                        'configuration',
                        { commentAbove: 'Application' },
                        'application',
                        { commentAbove: 'Domain' },
                        'domain',
                        { commentAbove: 'Ports' },
                        'ports',
                        { commentAbove: 'Adapters' },
                        'adapters',
                        { commentAbove: 'Infrastructure' },
                        'infrastructure',
                        { commentAbove: 'Utils' },
                        'utils',
                        'value-parent',
                        'value-sibling',
                        'value-index',
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
                            groupName: 'application',
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
                            groupName: 'ports',
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
                            groupName: 'infrastructure',
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
                            groupName: 'style',
                            elementNamePattern: '^.+\\.css$',
                        },
                    ],
                },
            ],
        },
    },
];

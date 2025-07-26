import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
    // Custom rules for imports and variables
    {
        plugins: {
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            'sort-vars': 'error',
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
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // External packages
                        ['^react', '^@?\\w'],

                        // Internal architecture.
                        ['^@configuration(/.*|$)', '/configuration(?!/?$)', '/configuration/?$'],
                        ['^@application(/.*|$)', '/application(?!/?$)', '/application/?$'],
                        ['^@domain(/.*|$)', '/domain(?!/?$)', '/domain/?$'],
                        ['^@ports(/.*|$)', '/ports(?!/?$)', '/ports/?$'],
                        ['^@adapters(/.*|$)', '/adapters(?!/?$)', '/adapters/?$'],
                        ['^@infrastructure(/.*|$)', '/infrastructure(?!/?$)', '/infrastructure/?$'],
                        ['^@utils(/.*|$)', '/utils(?!/?$)', '/utils/?$'],

                        // Parent imports. Put `..` last.
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                        // Other relative imports. Put same-folder imports and `.` last.
                        ['^\\./(?=.*/)(?!/?$)', '^\\\\.(?!/?$)", "^\\\\./?$'],
                        // Style imports.
                        ['^.+\\.?(css)$'],
                    ],
                },
            ],
        },
    },
];

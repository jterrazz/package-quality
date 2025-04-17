import js from '@eslint/js';
import ts from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import fileExtensionInImportTs from 'eslint-plugin-file-extension-in-import-ts';
import perfectionist from 'eslint-plugin-perfectionist';

export default [
    // Ignore project folders
    {
        ignores: ['dist/*'],
    },

    // Configuration for Javascript rules
    js.configs.recommended,

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

    // Configuration for Perfectionist rules
    {
        plugins: {
            perfectionist,
        },
        rules: {
            ...perfectionist.configs['recommended-natural'].rules,
            'perfectionist/sort-imports': 'off',
            'perfectionist/sort-named-imports': 'off',
        },
    },

    // Custom rules that require .js import extension
    {
        rules: {
            'file-extension-in-import-ts/file-extension-in-import-ts': [
                'error',
                'always',
                { extMapping: { '.ts': '.js', '.tsx': '.jsx' } },
            ],
        },
        plugins: {
            'file-extension-in-import-ts': fileExtensionInImportTs,
        },
    },

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

    // Custom rules for sorting keys in objects
    {
        plugins: {
            'sort-keys-fix': sortKeysFix,
        },
        rules: {
            'sort-keys-fix/sort-keys-fix': 'warn',
        },
    },
];

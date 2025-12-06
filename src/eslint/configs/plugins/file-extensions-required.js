import fileExtensionInImportTs from 'eslint-plugin-file-extension-in-import-ts';

export default [
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
];

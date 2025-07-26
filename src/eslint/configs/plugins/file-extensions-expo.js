import nPlugin from 'eslint-plugin-n';

export default [
    {
        plugins: {
            n: nPlugin,
        },
        rules: {
            // Use n/file-extension-in-import for relative imports (./file.js)
            'n/file-extension-in-import': [
                'error',
                'never',
                {
                    '.js': 'never',
                    '.jsx': 'never',
                    '.ts': 'never',
                    '.tsx': 'never',
                    '.json': 'never',
                    '.jpg': 'always',
                    '.png': 'always',
                    '.svg': 'always',
                    '.webp': 'always',
                    '.gif': 'always',
                    '.mp4': 'always',
                    '.mp3': 'always',
                    '.wav': 'always',
                    '.ogg': 'always',
                    '.webm': 'always',
                },
            ],
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
                },
            },
        },
    },
];

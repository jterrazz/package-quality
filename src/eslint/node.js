import globals from 'globals';
import ignores from './configs/base/ignores.js';
import javascript from './configs/base/javascript.js';
import typescript from './configs/base/typescript.js';
import fileExtensions from './configs/plugins/file-extensions-required.js';
import perfectionist from './configs/plugins/perfectionist.js';

export default [
    ...ignores,
    ...javascript,
    ...typescript,
    ...perfectionist,
    ...fileExtensions,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];

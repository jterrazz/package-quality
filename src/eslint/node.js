import globals from 'globals';
import commonConfig from './configs/core-node.js';

export default [
    ...commonConfig,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];

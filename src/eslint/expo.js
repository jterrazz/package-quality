import globals from 'globals';
import commonConfig from './configs/core-expo.js';

export default [
    ...commonConfig,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
];

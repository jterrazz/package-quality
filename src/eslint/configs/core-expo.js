import ignores from './base/ignores.js';
import javascript from './base/javascript.js';
import typescript from './base/typescript.js';
import perfectionist from './plugins/perfectionist.js';
import fileExtensions from './plugins/file-extensions-expo.js';
import imports from './plugins/imports.js';
import sortKeys from './plugins/sort-keys.js';

export default [
    ...ignores,
    ...javascript,
    ...typescript,
    ...perfectionist,
    ...fileExtensions,
    ...imports,
    ...sortKeys,
]; 
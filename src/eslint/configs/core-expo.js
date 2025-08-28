import ignores from './base/ignores.js';
import javascript from './base/javascript.js';
import typescript from './base/typescript.js';
import fileExtensions from './plugins/file-extensions-expo.js';
import perfectionist from './plugins/perfectionist.js';

export default [...ignores, ...javascript, ...typescript, ...perfectionist, ...fileExtensions];

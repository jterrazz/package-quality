// Invalid: imports are not sorted (path should come before fs alphabetically? No, external should be grouped)
// Actually invalid because: missing newline between external and local imports
import fs from 'fs';
import path from 'path';
import { something } from './local.js';

export function greet(name: string): string {
    const fullPath = path.join(fs.realpathSync('.'), name);
    return `Hello ${fullPath} - ${something}`;
}

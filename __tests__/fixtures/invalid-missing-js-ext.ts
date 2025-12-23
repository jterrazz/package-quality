// Invalid for node config: missing .js extension on relative import
import fs from 'fs';
import path from 'path';

import { something } from './local';

export function greet(name: string): string {
    const fullPath = path.join(fs.realpathSync('.'), name);
    return `Hello ${fullPath} - ${something}`;
}

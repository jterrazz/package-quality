// Valid file for expo/nextjs: imports sorted, no extensions on relative imports
import fs from 'fs';
import path from 'path';

import { something } from './local';

export function greet(name: string): string {
    const fullPath = path.join(fs.realpathSync('.'), name);
    return `Hello ${fullPath} - ${something}`;
}

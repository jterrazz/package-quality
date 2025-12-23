// Invalid for expo/nextjs config: has .ts extension on relative import (should be removed)
import fs from 'fs';
import path from 'path';

import { something } from './local.ts';

export function greet(name: string): string {
    const fullPath = path.join(fs.realpathSync('.'), name);
    return `Hello ${fullPath} - ${something}`;
}

// Invalid: unused variable
import fs from 'fs';
import path from 'path';

const unused = 42;

export function greet(name: string): string {
    const fullPath = path.join(fs.realpathSync('.'), name);
    return `Hello ${fullPath}`;
}

// Invalid: import not at the top
const config = { debug: true };

import fs from 'fs';

export function readFile(path: string): string {
  return fs.readFileSync(path, 'utf-8');
}

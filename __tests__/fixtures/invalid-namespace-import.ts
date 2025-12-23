// Invalid: using namespace import
import * as fs from 'fs';

export function readFile(path: string): string {
  return fs.readFileSync(path, 'utf-8');
}

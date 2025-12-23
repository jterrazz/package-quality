// Unformatted file: inconsistent spacing, wrong quotes, missing semicolons
import fs from "fs";
import path from "path";

import { something } from "./local.js";

export function greet(name: string): string {
  const fullPath = path.join(fs.realpathSync("."), name);
  return `Hello ${fullPath} - ${something}`;
}

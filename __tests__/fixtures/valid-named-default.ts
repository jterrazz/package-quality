// Valid: named default import should be allowed (import/no-named-default disabled)
import { default as path } from "node:path";

export const dirname = path.dirname;

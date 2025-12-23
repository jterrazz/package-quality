import { execSync } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "../..");
const OXLINT_BIN = resolve(ROOT_DIR, "node_modules/.bin/oxlint");

export type LintResult = {
  success: boolean;
  output: string;
};

export function runOxlint(configPath: string, cwd: string): LintResult {
  try {
    const output = execSync(`${OXLINT_BIN} -c ${configPath} .`, {
      cwd,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { success: true, output };
  } catch (error: any) {
    const output = error.stdout?.toString() + error.stderr?.toString() || "";
    return { success: false, output };
  }
}

export function hasErrorOnFile(output: string, file: string, rule: string): boolean {
  // Format: "rule(name): message" then ",-[filename:line:col]"
  const regex = new RegExp(`${rule}[\\s\\S]*?\\[${file}:\\d+:\\d+\\]`, "m");
  return regex.test(output);
}

export function expectError(output: string, file: string, rule: string): void {
  const has = hasErrorOnFile(output, file, rule);
  if (!has) {
    throw new Error(`Expected rule "${rule}" to trigger on "${file}"`);
  }
}

export function expectNoError(output: string, file: string, rule: string): void {
  const has = hasErrorOnFile(output, file, rule);
  if (has) {
    throw new Error(`Expected rule "${rule}" NOT to trigger on "${file}"`);
  }
}

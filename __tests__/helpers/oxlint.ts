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
    const stdout = error.stdout || "";
    const stderr = error.stderr || "";
    const output = stdout + stderr;
    return { success: false, output };
  }
}

export function hasErrorOnFile(output: string, file: string, rule: string): boolean {
  // Format: "plugin(rule): message" then ",-[filename:line:col]" or "╭─[filename:line:col]"
  // The bracket style varies between TTY and non-TTY modes
  const regex = new RegExp(`${rule}[\\s\\S]*?[\\[─]${file}:\\d+:\\d+\\]`, "m");
  return regex.test(output);
}

export function expectError(output: string, file: string, rule: string): void {
  const has = hasErrorOnFile(output, file, rule);
  if (!has) {
    // Include diagnostic info for debugging CI failures
    const hasRule = output.includes(rule);
    const hasFile = output.includes(file);
    const outputPreview = output.length > 500 ? output.substring(0, 500) + "..." : output;
    throw new Error(
      `Expected rule "${rule}" to trigger on "${file}"\n` +
        `  Output contains rule "${rule}": ${hasRule}\n` +
        `  Output contains file "${file}": ${hasFile}\n` +
        `  Output length: ${output.length}\n` +
        `  Output preview: ${outputPreview}`,
    );
  }
}

export function expectNoError(output: string, file: string, rule: string): void {
  const has = hasErrorOnFile(output, file, rule);
  if (has) {
    throw new Error(`Expected rule "${rule}" NOT to trigger on "${file}"`);
  }
}

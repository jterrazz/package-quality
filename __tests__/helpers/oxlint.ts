import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "../..");
const OXLINT_BIN = resolve(ROOT_DIR, "node_modules/.bin/oxlint");
const CODESTYLE_PLUGIN = resolve(ROOT_DIR, "src/oxlint/plugins/codestyle.js");

export type LintResult = {
  success: boolean;
  output: string;
};

export type RunOxlintOptions = {
  withCodestylePlugin?: boolean;
};

export function runOxlint(
  configPath: string,
  cwd: string,
  options: RunOxlintOptions = {},
): LintResult {
  let actualConfig = configPath;

  // If we need the codestyle plugin, create a wrapper config
  if (options.withCodestylePlugin) {
    const wrapperConfig = {
      extends: [configPath],
      jsPlugins: [CODESTYLE_PLUGIN],
    };
    const wrapperPath = resolve(cwd, ".oxlintrc.temp.json");
    writeFileSync(wrapperPath, JSON.stringify(wrapperConfig));
    actualConfig = wrapperPath;
  }

  try {
    const output = execSync(`${OXLINT_BIN} -c ${actualConfig} .`, {
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
  // Strip ANSI escape codes for reliable matching
  // eslint-disable-next-line no-control-regex
  const ansiRegex = /\x1b\[[0-9;]*m/g;
  const cleanOutput = output.replace(ansiRegex, "");

  const escapedFile = file.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  // Find all occurrences of the file in error block headers
  const filePattern = new RegExp(`(?:╭─\\[|,─\\[|\\[)${escapedFile}:\\d+:\\d+\\]`, "g");
  let match;
  while ((match = filePattern.exec(cleanOutput)) !== null) {
    // Look at the ~300 chars before this file reference for the rule
    const start = Math.max(0, match.index - 300);
    const preceding = cleanOutput.substring(start, match.index);
    if (preceding.includes(rule)) {
      return true;
    }
  }
  return false;
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

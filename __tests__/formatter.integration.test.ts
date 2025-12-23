import { execSync } from "child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const ROOT_DIR = resolve(import.meta.dirname, "..");
const FIXTURES_DIR = resolve(import.meta.dirname, "fixtures");
const CODESTYLE_BIN = resolve(ROOT_DIR, "src/codestyle.sh");
const CONFIG_PATH = resolve(ROOT_DIR, "src/oxfmt/index.json");

type FormatResult = {
  success: boolean;
  output: string;
  hasIssues: boolean;
};

function runFormatCheck(targetFile: string, targetDir: string): FormatResult {
  try {
    const filePath = resolve(targetDir, targetFile);
    const output = execSync(
      `${CODESTYLE_BIN} --format --config ${CONFIG_PATH} ${filePath}`,
      {
        cwd: ROOT_DIR,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    );
    return {
      success: true,
      output,
      hasIssues: false,
    };
  } catch (error: any) {
    const output = error.stdout?.toString() || error.stderr?.toString() || "";
    return {
      success: false,
      output,
      hasIssues: output.includes("Format issues found"),
    };
  }
}

function runFormat(targetFile: string, targetDir: string): string {
  const filePath = resolve(targetDir, targetFile);
  execSync(
    `${CODESTYLE_BIN} --format --fix --config ${CONFIG_PATH} ${filePath}`,
    {
      cwd: ROOT_DIR,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  return readFileSync(filePath, "utf-8");
}

describe("formatter integration", () => {
  let tempDir: string;

  beforeAll(() => {
    tempDir = mkdtempSync(resolve(tmpdir(), "formatter-test-"));
    cpSync(FIXTURES_DIR, tempDir, { recursive: true });
  });

  afterAll(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe("format checking", () => {
    it("should detect unformatted code", () => {
      const result = runFormatCheck("unformatted.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.hasIssues).toBe(true);
    });

    it("should pass for properly formatted code", () => {
      const result = runFormatCheck("formatted.ts", tempDir);
      expect(result.success).toBe(true);
      expect(result.hasIssues).toBe(false);
    });
  });

  describe("format fixing", () => {
    it("should format unformatted code correctly", () => {
      const formatted = runFormat("unformatted.ts", tempDir);

      // Check formatting rules applied
      expect(formatted).toContain("import fs from 'fs';"); // single quotes, semicolons
      expect(formatted).toContain("function greet(name: string): string"); // proper spacing
      expect(formatted).not.toMatch(/^\s{2}const/m); // should use 4 spaces (tabWidth: 4)
      expect(formatted).toMatch(/^\s{4}const/m); // 4-space indentation
    });

    it("should be idempotent (formatting twice gives same result)", () => {
      const before = readFileSync(resolve(tempDir, "formatted.ts"), "utf-8");
      runFormat("formatted.ts", tempDir);
      const after = readFileSync(resolve(tempDir, "formatted.ts"), "utf-8");

      expect(after).toBe(before);
    });
  });

  describe("config options", () => {
    it("should use single quotes", () => {
      const formatted = runFormat("unformatted.ts", tempDir);
      expect(formatted).toContain("'fs'");
      expect(formatted).not.toContain('"fs"');
    });

    it("should use semicolons", () => {
      const formatted = runFormat("unformatted.ts", tempDir);
      expect(formatted).toMatch(/;\s*$/m); // lines end with semicolons
    });

    it("should use 4-space indentation", () => {
      const formatted = runFormat("unformatted.ts", tempDir);
      const lines = formatted.split("\n");
      const indentedLine = lines.find(
        (l) => l.startsWith("    ") && !l.startsWith("     "),
      );
      expect(indentedLine).toBeTruthy();
    });
  });
});

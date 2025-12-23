import { execSync } from "child_process";
import { cpSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const ROOT_DIR = resolve(import.meta.dirname, "..");
const FIXTURES_DIR = resolve(import.meta.dirname, "fixtures");

type LintResult = {
  success: boolean;
  output: string;
  errorCount: number;
  warningCount: number;
};

function runOxlint(
  configPath: string,
  targetPath: string,
  cwd: string = ROOT_DIR,
): LintResult {
  try {
    const output = execSync(`npx oxlint -c ${configPath} ${targetPath}`, {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const match = output.match(/Found (\d+) warnings? and (\d+) errors?/);
    return {
      success: true,
      output,
      warningCount: match ? parseInt(match[1], 10) : 0,
      errorCount: match ? parseInt(match[2], 10) : 0,
    };
  } catch (error: any) {
    const output = error.stdout?.toString() || error.stderr?.toString() || "";
    const match = output.match(/Found (\d+) warnings? and (\d+) errors?/);
    return {
      success: false,
      output,
      warningCount: match ? parseInt(match[1], 10) : 0,
      errorCount: match ? parseInt(match[2], 10) : 0,
    };
  }
}

describe("oxlint integration", () => {
  let tempDir: string;

  beforeAll(() => {
    tempDir = mkdtempSync(resolve(tmpdir(), "oxlint-test-"));
    cpSync(FIXTURES_DIR, tempDir, { recursive: true });
  });

  afterAll(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe("base config", () => {
    const configPath = resolve(ROOT_DIR, "src/oxlint/base.json");

    it("should detect unused variables", () => {
      const result = runOxlint(configPath, "invalid-unused-var.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.output).toContain("no-unused-vars");
    });

    it("should detect unsorted imports", () => {
      const result = runOxlint(
        configPath,
        "invalid-unsorted-imports.ts",
        tempDir,
      );
      expect(result.success).toBe(false);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.output).toContain("perfectionist");
    });

    it("should pass for valid sorted code", () => {
      const result = runOxlint(configPath, "valid-sorted.ts", tempDir);
      expect(result.errorCount).toBe(0);
    });
  });

  describe("node config", () => {
    const configPath = resolve(ROOT_DIR, "src/oxlint/node.json");

    it("should require .js extension on relative imports", () => {
      const result = runOxlint(
        configPath,
        "invalid-missing-js-ext.ts",
        tempDir,
      );
      expect(result.success).toBe(false);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.output).toContain("require-js-extensions");
    });

    it("should pass when .js extension is present", () => {
      const result = runOxlint(configPath, "valid-sorted.ts", tempDir);
      expect(result.errorCount).toBe(0);
    });

    it("should inherit base rules (detect unused vars)", () => {
      const result = runOxlint(configPath, "invalid-unused-var.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.output).toContain("no-unused-vars");
    });
  });

  describe("expo config", () => {
    const configPath = resolve(ROOT_DIR, "src/oxlint/expo.json");

    it("should reject .ts extension on relative imports", () => {
      const result = runOxlint(configPath, "invalid-has-ts-ext.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.output).toContain("remove-ts-extensions");
    });

    it("should pass when no extension on relative imports", () => {
      const result = runOxlint(configPath, "valid-sorted-no-ext.ts", tempDir);
      expect(result.errorCount).toBe(0);
    });

    it("should inherit base rules (detect unsorted imports)", () => {
      const result = runOxlint(
        configPath,
        "invalid-unsorted-imports.ts",
        tempDir,
      );
      expect(result.success).toBe(false);
      expect(result.output).toContain("perfectionist");
    });
  });

  describe("nextjs config", () => {
    const configPath = resolve(ROOT_DIR, "src/oxlint/nextjs.json");

    it("should reject .ts extension on relative imports", () => {
      const result = runOxlint(configPath, "invalid-has-ts-ext.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.output).toContain("remove-ts-extensions");
    });

    it("should pass when no extension on relative imports", () => {
      const result = runOxlint(configPath, "valid-sorted-no-ext.ts", tempDir);
      expect(result.errorCount).toBe(0);
    });

    it("should inherit base rules (detect unused vars)", () => {
      const result = runOxlint(configPath, "invalid-unused-var.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.output).toContain("no-unused-vars");
    });
  });
});

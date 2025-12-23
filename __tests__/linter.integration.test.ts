import { execSync } from "child_process";
import { cpSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const ROOT_DIR = resolve(import.meta.dirname, "..");
const FIXTURES_DIR = resolve(import.meta.dirname, "fixtures");
const CODESTYLE_BIN = resolve(ROOT_DIR, "src/codestyle.sh");

type LintResult = {
  success: boolean;
  output: string;
  errorCount: number;
  warningCount: number;
};

function runLint(
  configPath: string,
  targetFile: string,
  cwd: string,
): LintResult {
  try {
    const output = execSync(
      `${CODESTYLE_BIN} --lint -c ${configPath} ${targetFile}`,
      {
        cwd,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    );
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

describe("linter integration", () => {
  let tempDir: string;

  beforeAll(() => {
    tempDir = mkdtempSync(resolve(tmpdir(), "linter-test-"));
    cpSync(FIXTURES_DIR, tempDir, { recursive: true });
  });

  afterAll(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe("base config", () => {
    const configPath = resolve(ROOT_DIR, "src/oxlint/base.json");

    describe("no-unused-vars", () => {
      it("should detect unused variables", () => {
        const result = runLint(configPath, "invalid-unused-var.ts", tempDir);
        expect(result.success).toBe(false);
        expect(result.errorCount).toBeGreaterThan(0);
        expect(result.output).toContain("no-unused-vars");
      });
    });

    describe("typescript/consistent-type-imports", () => {
      it("should require type imports for type-only imports", () => {
        const result = runLint(configPath, "invalid-type-import.ts", tempDir);
        expect(result.success).toBe(false);
        expect(result.errorCount).toBeGreaterThan(0);
        expect(result.output).toContain("consistent-type-imports");
      });

      it("should pass for valid type imports", () => {
        const result = runLint(configPath, "valid-type-import.ts", tempDir);
        expect(result.errorCount).toBe(0);
      });
    });

    describe("typescript/no-unused-expressions", () => {
      it("should detect unused expressions", () => {
        const result = runLint(
          configPath,
          "invalid-unused-expression.ts",
          tempDir,
        );
        expect(result.success).toBe(false);
        expect(result.errorCount).toBeGreaterThan(0);
        expect(result.output).toContain("no-unused-expressions");
      });
    });

    describe("perfectionist/sort-imports", () => {
      it("should detect unsorted imports", () => {
        const result = runLint(
          configPath,
          "invalid-unsorted-imports.ts",
          tempDir,
        );
        expect(result.success).toBe(false);
        expect(result.errorCount).toBeGreaterThan(0);
        expect(result.output).toContain("perfectionist");
      });

      it("should pass for valid sorted imports", () => {
        const result = runLint(configPath, "valid-sorted.ts", tempDir);
        expect(result.errorCount).toBe(0);
      });
    });

    describe("perfectionist/sort-union-types", () => {
      it("should detect unsorted union types", () => {
        const result = runLint(
          configPath,
          "invalid-unsorted-union.ts",
          tempDir,
        );
        expect(result.success).toBe(false);
        expect(result.errorCount).toBeGreaterThan(0);
        expect(result.output).toContain("sort-union-types");
      });

      it("should pass for sorted union types", () => {
        const result = runLint(configPath, "valid-sorted-union.ts", tempDir);
        expect(result.errorCount).toBe(0);
      });
    });

    describe("perfectionist/sort-named-exports", () => {
      it("should detect unsorted named exports", () => {
        const result = runLint(
          configPath,
          "invalid-unsorted-named-exports.ts",
          tempDir,
        );
        expect(result.success).toBe(false);
        expect(result.errorCount).toBeGreaterThan(0);
        expect(result.output).toContain("sort-named-exports");
      });

      it("should pass for sorted named exports", () => {
        const result = runLint(
          configPath,
          "valid-sorted-named-exports.ts",
          tempDir,
        );
        expect(result.errorCount).toBe(0);
      });
    });

    describe("perf category", () => {
      it("should warn about spread in reduce accumulator", () => {
        const result = runLint(
          configPath,
          "invalid-perf-spread-in-accumulator.ts",
          tempDir,
        );
        expect(result.warningCount).toBeGreaterThan(0);
        expect(result.output).toContain("no-accumulating-spread");
      });
    });
  });

  describe("node config", () => {
    const configPath = resolve(ROOT_DIR, "src/oxlint/node.json");

    it("should require .js extension on relative imports", () => {
      const result = runLint(configPath, "invalid-missing-js-ext.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.output).toContain("require-js-extensions");
    });

    it("should pass when .js extension is present", () => {
      const result = runLint(configPath, "valid-sorted.ts", tempDir);
      expect(result.errorCount).toBe(0);
    });

    it("should inherit base rules (detect unused vars)", () => {
      const result = runLint(configPath, "invalid-unused-var.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.output).toContain("no-unused-vars");
    });
  });

  describe("expo config", () => {
    const configPath = resolve(ROOT_DIR, "src/oxlint/expo.json");

    it("should reject .ts extension on relative imports", () => {
      const result = runLint(configPath, "invalid-has-ts-ext.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.output).toContain("remove-ts-extensions");
    });

    it("should pass when no extension on relative imports", () => {
      const result = runLint(configPath, "valid-sorted-no-ext.ts", tempDir);
      expect(result.errorCount).toBe(0);
    });

    it("should inherit base rules (detect unsorted imports)", () => {
      const result = runLint(
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
      const result = runLint(configPath, "invalid-has-ts-ext.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.errorCount).toBeGreaterThan(0);
      expect(result.output).toContain("remove-ts-extensions");
    });

    it("should pass when no extension on relative imports", () => {
      const result = runLint(configPath, "valid-sorted-no-ext.ts", tempDir);
      expect(result.errorCount).toBe(0);
    });

    it("should inherit base rules (detect unused vars)", () => {
      const result = runLint(configPath, "invalid-unused-var.ts", tempDir);
      expect(result.success).toBe(false);
      expect(result.output).toContain("no-unused-vars");
    });
  });
});

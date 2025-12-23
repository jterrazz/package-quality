import { cpSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import { afterAll, beforeAll, describe, it } from "vitest";

import { expectError, expectNoError, type LintResult, runOxlint } from "./helpers/oxlint.js";

const ROOT_DIR = resolve(import.meta.dirname, "..");
const FIXTURES_DIR = resolve(import.meta.dirname, "fixtures");

describe("linter integration", () => {
  let tempDir: string;
  let baseResult: LintResult;
  let nodeResult: LintResult;
  let expoResult: LintResult;
  let nextjsResult: LintResult;

  beforeAll(() => {
    tempDir = mkdtempSync(resolve(tmpdir(), "linter-test-"));
    cpSync(FIXTURES_DIR, tempDir, { recursive: true });

    // Run oxlint once per config - this is the key optimization
    const baseConfig = resolve(ROOT_DIR, "src/oxlint/base.json");
    const nodeConfig = resolve(ROOT_DIR, "src/oxlint/node.json");
    const expoConfig = resolve(ROOT_DIR, "src/oxlint/expo.json");
    const nextjsConfig = resolve(ROOT_DIR, "src/oxlint/nextjs.json");

    baseResult = runOxlint(baseConfig, tempDir);
    nodeResult = runOxlint(nodeConfig, tempDir, { withCodestylePlugin: true });
    expoResult = runOxlint(expoConfig, tempDir, { withCodestylePlugin: true });
    nextjsResult = runOxlint(nextjsConfig, tempDir, { withCodestylePlugin: true });
  });

  afterAll(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe("base config", () => {
    describe("no-unused-vars", () => {
      it("should detect unused variables", () => {
        expectError(baseResult.output, "invalid-unused-var.ts", "no-unused-vars");
      });
    });

    describe("typescript/consistent-type-imports", () => {
      it("should require type imports for type-only imports", () => {
        expectError(baseResult.output, "invalid-type-import.ts", "consistent-type-imports");
      });

      it("should pass for valid type imports", () => {
        expectNoError(baseResult.output, "valid-type-import.ts", "consistent-type-imports");
      });
    });

    describe("typescript/no-unused-expressions", () => {
      it("should detect unused expressions", () => {
        expectError(baseResult.output, "invalid-unused-expression.ts", "no-unused-expressions");
      });
    });

    describe("perfectionist/sort-imports", () => {
      it("should detect unsorted imports", () => {
        expectError(baseResult.output, "invalid-unsorted-imports.ts", "sort-imports");
      });

      it("should pass for valid sorted imports", () => {
        expectNoError(baseResult.output, "valid-sorted.ts", "sort-imports");
      });
    });

    describe("perfectionist/sort-union-types", () => {
      it("should detect unsorted union types", () => {
        expectError(baseResult.output, "invalid-unsorted-union.ts", "sort-union-types");
      });

      it("should pass for sorted union types", () => {
        expectNoError(baseResult.output, "valid-sorted-union.ts", "sort-union-types");
      });
    });

    describe("perfectionist/sort-named-exports", () => {
      it("should detect unsorted named exports", () => {
        expectError(baseResult.output, "invalid-unsorted-named-exports.ts", "sort-named-exports");
      });

      it("should pass for sorted named exports", () => {
        expectNoError(baseResult.output, "valid-sorted-named-exports.ts", "sort-named-exports");
      });
    });

    describe("perf category", () => {
      it("should warn about spread in reduce accumulator", () => {
        expectError(
          baseResult.output,
          "invalid-perf-spread-in-accumulator.ts",
          "no-accumulating-spread",
        );
      });
    });

    describe("import/no-default-export", () => {
      it("should allow default exports", () => {
        expectNoError(baseResult.output, "invalid-default-export.ts", "no-default-export");
      });

      it("should pass for named exports", () => {
        expectNoError(baseResult.output, "valid-named-export.ts", "no-default-export");
      });
    });

    describe("import/first", () => {
      it("should reject imports not at the top", () => {
        expectError(baseResult.output, "invalid-import-not-first.ts", "first");
      });
    });

    describe("import/no-namespace", () => {
      it("should reject namespace imports", () => {
        expectError(baseResult.output, "invalid-namespace-import.ts", "no-namespace");
      });
    });

    describe("unicorn/catch-error-name", () => {
      it("should require error variable to be named 'error'", () => {
        expectError(baseResult.output, "invalid-catch-error-name.ts", "catch-error-name");
      });
    });

    describe("unicorn/numeric-separators-style", () => {
      it("should warn about large numbers without separators", () => {
        expectError(baseResult.output, "invalid-numeric-separators.ts", "numeric-separators");
      });
    });

    describe("no-nested-ternary", () => {
      it("should reject nested ternary expressions", () => {
        expectError(baseResult.output, "invalid-nested-ternary.ts", "nested-ternary");
      });
    });

    describe("curly", () => {
      it("should require curly braces", () => {
        expectError(baseResult.output, "invalid-curly.ts", "curly");
      });
    });

    describe("new-cap", () => {
      it("should require constructors to start with uppercase", () => {
        expectError(baseResult.output, "invalid-new-cap.ts", "new-cap");
      });
    });

    describe("capitalized-comments", () => {
      it("should warn about lowercase comments", () => {
        expectError(baseResult.output, "invalid-capitalized-comment.ts", "capitalized-comments");
      });
    });
  });

  describe("node config", () => {
    it("should require .js extension on relative imports", () => {
      expectError(nodeResult.output, "invalid-missing-js-ext.ts", "imports-with-ext");
    });

    it("should pass when .js extension is present", () => {
      expectNoError(nodeResult.output, "valid-sorted.ts", "imports-with-ext");
    });

    it("should inherit base rules (detect unused vars)", () => {
      expectError(nodeResult.output, "invalid-unused-var.ts", "no-unused-vars");
    });
  });

  describe("expo config", () => {
    it("should reject .ts extension on relative imports", () => {
      expectError(expoResult.output, "invalid-has-ts-ext.ts", "imports-without-ext");
    });

    it("should pass when no extension on relative imports", () => {
      expectNoError(expoResult.output, "valid-sorted-no-ext.ts", "imports-without-ext");
    });

    it("should inherit base rules (detect unsorted imports)", () => {
      expectError(expoResult.output, "invalid-unsorted-imports.ts", "sort-imports");
    });
  });

  describe("nextjs config", () => {
    it("should reject .ts extension on relative imports", () => {
      expectError(nextjsResult.output, "invalid-has-ts-ext.ts", "imports-without-ext");
    });

    it("should pass when no extension on relative imports", () => {
      expectNoError(nextjsResult.output, "valid-sorted-no-ext.ts", "imports-without-ext");
    });

    it("should inherit base rules (detect unused vars)", () => {
      expectError(nextjsResult.output, "invalid-unused-var.ts", "no-unused-vars");
    });
  });
});

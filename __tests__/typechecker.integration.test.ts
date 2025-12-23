import { execSync } from "child_process";
import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const ROOT_DIR = resolve(import.meta.dirname, "..");
const FIXTURES_DIR = resolve(import.meta.dirname, "fixtures");
const CODESTYLE_BIN = resolve(ROOT_DIR, "src/codestyle.sh");

type TypeCheckResult = {
  success: boolean;
  output: string;
  errorCount: number;
};

function runTypeCheck(cwd: string): TypeCheckResult {
  try {
    const output = execSync(`${CODESTYLE_BIN} --type`, {
      cwd,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return {
      success: true,
      output,
      errorCount: 0,
    };
  } catch (error: any) {
    const output = error.stdout?.toString() || error.stderr?.toString() || "";
    const errorMatches = output.match(/error TS\d+/g);
    return {
      success: false,
      output,
      errorCount: errorMatches ? errorMatches.length : 1,
    };
  }
}

function copyFixture(fixtureName: string, destDir: string): void {
  const content = require("fs").readFileSync(resolve(FIXTURES_DIR, fixtureName), "utf8");
  writeFileSync(resolve(destDir, fixtureName), content);
}

describe("typechecker integration", () => {
  let tempDir: string;

  beforeAll(() => {
    tempDir = mkdtempSync(resolve(tmpdir(), "typechecker-test-"));
    // Create a minimal tsconfig.json
    writeFileSync(
      resolve(tempDir, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            strict: true,
            noEmit: true,
            skipLibCheck: true,
          },
          include: ["*.ts"],
        },
        null,
        2,
      ),
    );
  });

  afterAll(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("should pass for valid typed code", () => {
    copyFixture("valid-types.ts", tempDir);
    const result = runTypeCheck(tempDir);
    expect(result.success).toBe(true);
    expect(result.errorCount).toBe(0);
  });

  it("should detect type errors", () => {
    copyFixture("invalid-types.ts", tempDir);
    const result = runTypeCheck(tempDir);
    expect(result.success).toBe(false);
    expect(result.errorCount).toBeGreaterThan(0);
    expect(result.output).toContain("error TS");
  });
});

import { execSync } from "child_process";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const ROOT_DIR = resolve(import.meta.dirname, "..");
const FIXTURES_DIR = resolve(import.meta.dirname, "fixtures/architecture");
const HEXAGONAL_CONFIG = resolve(ROOT_DIR, "src/oxlint/architectures/hexagonal.json");

type LintResult = {
  success: boolean;
  output: string;
  errorCount: number;
};

function runArchLint(targetFile: string): LintResult {
  const fullPath = resolve(FIXTURES_DIR, targetFile);
  try {
    const output = execSync(`npx oxlint -c ${HEXAGONAL_CONFIG} ${fullPath}`, {
      cwd: ROOT_DIR,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const match = output.match(/(\d+) errors?/);
    return {
      success: true,
      output,
      errorCount: match ? parseInt(match[1], 10) : 0,
    };
  } catch (error: any) {
    const output = error.stdout?.toString() || error.stderr?.toString() || "";
    const match = output.match(/(\d+) errors?/);
    return {
      success: false,
      output,
      errorCount: match ? parseInt(match[1], 10) : 0,
    };
  }
}

describe("architecture integration", () => {
  describe("hexagonal architecture", () => {
    describe("domain layer", () => {
      it("should allow pure domain files", () => {
        const result = runArchLint("domain/user.entity.ts");
        expect(result.output).not.toContain("architecture-boundaries");
      });

      it("should reject domain importing infrastructure", () => {
        const result = runArchLint("domain/invalid-domain.ts");
        expect(result.errorCount).toBeGreaterThan(0);
        expect(result.output).toContain("architecture-boundaries");
        expect(result.output).toContain("Domain layer must be pure");
      });
    });

    describe("application layer", () => {
      it("should allow use cases importing domain", () => {
        const result = runArchLint("application/use-cases/get-user.ts");
        expect(result.output).not.toContain("architecture-boundaries");
      });

      it("should reject use cases importing infrastructure", () => {
        const result = runArchLint("application/use-cases/invalid-use-case.ts");
        expect(result.errorCount).toBeGreaterThan(0);
        expect(result.output).toContain("architecture-boundaries");
        expect(result.output).toContain("Use cases can only depend on domain and ports");
      });
    });

    describe("presentation layer", () => {
      it("should allow pure UI atoms", () => {
        const result = runArchLint("presentation/ui/atoms/button.tsx");
        expect(result.output).not.toContain("architecture-boundaries");
      });

      it("should reject atoms importing navigation", () => {
        const result = runArchLint("presentation/ui/atoms/invalid-atom.tsx");
        expect(result.errorCount).toBeGreaterThan(0);
        expect(result.output).toContain("architecture-boundaries");
        expect(result.output).toContain("no navigation imports");
      });
    });
  });
});

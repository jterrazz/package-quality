import { resolve } from "path";
import { beforeAll, describe, it } from "vitest";

import { expectError, expectNoError, type LintResult, runOxlint } from "./helpers/oxlint.js";

const ROOT_DIR = resolve(import.meta.dirname, "..");
const FIXTURES_DIR = resolve(import.meta.dirname, "fixtures/architecture");
const HEXAGONAL_CONFIG = resolve(ROOT_DIR, "src/oxlint/architectures/hexagonal.json");

describe("architecture integration", () => {
  let result: LintResult;

  beforeAll(() => {
    result = runOxlint(HEXAGONAL_CONFIG, FIXTURES_DIR, { withCodestylePlugin: true });
  });

  describe("hexagonal architecture", () => {
    describe("domain layer", () => {
      it("should allow pure domain files", () => {
        expectNoError(result.output, "domain/user.entity.ts", "arch-hexagonal");
      });

      it("should reject domain importing infrastructure", () => {
        expectError(result.output, "domain/invalid-domain.ts", "arch-hexagonal");
      });
    });

    describe("application layer", () => {
      it("should allow use cases importing domain", () => {
        expectNoError(result.output, "application/use-cases/get-user.ts", "arch-hexagonal");
      });

      it("should reject use cases importing infrastructure", () => {
        expectError(result.output, "application/use-cases/invalid-use-case.ts", "arch-hexagonal");
      });
    });

    describe("presentation layer", () => {
      it("should allow pure UI atoms", () => {
        expectNoError(result.output, "presentation/ui/atoms/button.tsx", "arch-hexagonal");
      });

      it("should reject atoms importing navigation", () => {
        expectError(result.output, "presentation/ui/atoms/invalid-atom.tsx", "arch-hexagonal");
      });
    });
  });
});

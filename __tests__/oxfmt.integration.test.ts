import { execSync } from 'child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { resolve } from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const ROOT_DIR = resolve(import.meta.dirname, '..');
const FIXTURES_DIR = resolve(import.meta.dirname, 'fixtures');
const CONFIG_PATH = resolve(ROOT_DIR, 'src/oxfmt/index.json');

type FormatResult = {
    success: boolean;
    output: string;
    hasIssues: boolean;
};

function runOxfmtCheck(targetPath: string): FormatResult {
    try {
        const output = execSync(`npx oxfmt --config ${CONFIG_PATH} --check ${targetPath}`, {
            cwd: ROOT_DIR,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        });
        return {
            success: true,
            output,
            hasIssues: false,
        };
    } catch (error: any) {
        const output = error.stdout?.toString() || error.stderr?.toString() || '';
        return {
            success: false,
            output,
            hasIssues: output.includes('Format issues found'),
        };
    }
}

function runOxfmtFormat(targetPath: string): string {
    execSync(`npx oxfmt --config ${CONFIG_PATH} ${targetPath}`, {
        cwd: ROOT_DIR,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
    });
    return readFileSync(targetPath, 'utf-8');
}

describe('oxfmt integration', () => {
    let tempDir: string;

    beforeAll(() => {
        tempDir = mkdtempSync(resolve(tmpdir(), 'oxfmt-test-'));
        cpSync(FIXTURES_DIR, tempDir, { recursive: true });
    });

    afterAll(() => {
        rmSync(tempDir, { recursive: true, force: true });
    });

    describe('format checking', () => {
        it('should detect unformatted code', () => {
            const result = runOxfmtCheck(resolve(tempDir, 'unformatted.ts'));
            expect(result.success).toBe(false);
            expect(result.hasIssues).toBe(true);
        });

        it('should pass for properly formatted code', () => {
            const result = runOxfmtCheck(resolve(tempDir, 'formatted.ts'));
            expect(result.success).toBe(true);
            expect(result.hasIssues).toBe(false);
        });
    });

    describe('format fixing', () => {
        it('should format unformatted code correctly', () => {
            const filePath = resolve(tempDir, 'unformatted.ts');
            const formatted = runOxfmtFormat(filePath);

            // Check formatting rules applied
            expect(formatted).toContain("import fs from 'fs';"); // single quotes, semicolons
            expect(formatted).toContain('function greet(name: string): string'); // proper spacing
            expect(formatted).not.toMatch(/^\s{2}const/m); // should use 4 spaces (tabWidth: 4)
            expect(formatted).toMatch(/^\s{4}const/m); // 4-space indentation
        });

        it('should be idempotent (formatting twice gives same result)', () => {
            const filePath = resolve(tempDir, 'formatted.ts');
            const before = readFileSync(filePath, 'utf-8');
            runOxfmtFormat(filePath);
            const after = readFileSync(filePath, 'utf-8');

            expect(after).toBe(before);
        });
    });

    describe('config options', () => {
        it('should use single quotes', () => {
            const filePath = resolve(tempDir, 'unformatted.ts');
            const formatted = runOxfmtFormat(filePath);
            expect(formatted).toContain("'fs'");
            expect(formatted).not.toContain('"fs"');
        });

        it('should use semicolons', () => {
            const filePath = resolve(tempDir, 'unformatted.ts');
            const formatted = runOxfmtFormat(filePath);
            expect(formatted).toMatch(/;\s*$/m); // lines end with semicolons
        });

        it('should use 4-space indentation', () => {
            const filePath = resolve(tempDir, 'unformatted.ts');
            const formatted = runOxfmtFormat(filePath);
            const lines = formatted.split('\n');
            const indentedLine = lines.find((l) => l.startsWith('    ') && !l.startsWith('     '));
            expect(indentedLine).toBeTruthy();
        });
    });
});

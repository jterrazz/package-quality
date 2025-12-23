// Codestyle plugin - custom rules for code quality
// Contains: architecture boundaries, import extensions

import hexagonalConfig from "../architectures/hexagonal.json" with { type: "json" };

// ============================================
// Hexagonal - Architecture boundary rules
// ============================================

function createHexagonalRule() {
  const ruleConfig = hexagonalConfig.rules["codestyle/arch-hexagonal"];
  const defaultRules = Array.isArray(ruleConfig) ? ruleConfig[1]?.rules || [] : [];

  return {
    meta: {
      type: "problem",
      docs: {
        description: "Enforce hexagonal architecture layer boundaries",
        category: "Best Practices",
      },
      schema: [
        {
          type: "object",
          properties: {
            rules: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  from: { type: "string" },
                  disallow: { type: "array", items: { type: "string" } },
                  message: { type: "string" },
                },
                required: ["from", "disallow"],
              },
            },
          },
        },
      ],
    },
    create(context) {
      const options = context.options[0];
      const rules = options && options.rules ? options.rules : defaultRules;
      const filename = context.getFilename();

      function checkNode(node) {
        if (!node.source || !node.source.value) {
          return;
        }

        const importPath = node.source.value;

        for (const rule of rules) {
          const fromPattern = new RegExp(rule.from);
          if (!fromPattern.test(filename)) {
            continue;
          }

          for (const disallowPattern of rule.disallow) {
            if (new RegExp(disallowPattern).test(importPath)) {
              context.report({
                node: node.source,
                message: rule.message || "Import violates architecture boundaries",
              });
              break;
            }
          }
        }
      }

      return {
        ImportDeclaration: checkNode,
        ExportNamedDeclaration: checkNode,
        ExportAllDeclaration: checkNode,
      };
    },
  };
}

// ============================================
// Imports-with-ext - Require .js extensions
// ============================================

const importsWithExtRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require .js extension in imports for Node.js ESM compatibility",
      category: "Best Practices",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    const hasExtension = /\.[a-zA-Z0-9]+$/;

    function checkNode(node) {
      if (!node.source || !node.source.value) {
        return;
      }

      const importPath = node.source.value;

      // Only check relative imports
      if (!importPath.startsWith(".")) {
        return;
      }

      // Skip if it already has an extension
      if (hasExtension.test(importPath)) {
        return;
      }

      // Skip type-only imports (they are erased at runtime)
      if (node.importKind === "type") {
        return;
      }

      context.report({
        node: node.source,
        message: "Missing .js extension in import (required for Node.js ESM)",
        fix(fixer) {
          const newPath = `${importPath}.js`;
          return fixer.replaceText(node.source, `'${newPath}'`);
        },
      });
    }

    return {
      ImportDeclaration: checkNode,
      ExportNamedDeclaration: checkNode,
      ExportAllDeclaration: checkNode,
    };
  },
};

// ============================================
// Imports-without-ext - Remove extensions
// ============================================

const importsWithoutExtRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Remove .js, .jsx, .ts, .tsx extensions from imports",
      category: "Best Practices",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    const extensionsToRemove = /\.(js|jsx|ts|tsx)$/;

    function checkNode(node) {
      if (!node.source || !node.source.value) {
        return;
      }

      const importPath = node.source.value;

      // Check both relative imports and path alias imports
      if (!importPath.startsWith(".") && !importPath.startsWith("@/")) {
        return;
      }

      if (extensionsToRemove.test(importPath)) {
        const match = importPath.match(extensionsToRemove);
        context.report({
          node: node.source,
          message: `Remove "${match[0]}" extension from import`,
          fix(fixer) {
            const newPath = importPath.replace(extensionsToRemove, "");
            return fixer.replaceText(node.source, `'${newPath}'`);
          },
        });
      }
    }

    return {
      ImportDeclaration: checkNode,
      ExportNamedDeclaration: checkNode,
      ExportAllDeclaration: checkNode,
    };
  },
};

export default {
  meta: {
    name: "codestyle",
    version: "1.0.0",
  },
  rules: {
    "arch-hexagonal": createHexagonalRule(),
    "imports-with-ext": importsWithExtRule,
    "imports-without-ext": importsWithoutExtRule,
  },
};

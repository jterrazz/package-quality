// Custom rule to require .js extensions in imports (for Node.js ESM)
// Compatible with both ESLint and Oxlint JS plugin API

const requireJsExtensionsRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require .js extension in imports for Node.js ESM compatibility",
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

export default {
  meta: {
    name: "require-js-extensions",
    version: "1.0.0",
  },
  rules: {
    "require-js-extensions": requireJsExtensionsRule,
  },
};

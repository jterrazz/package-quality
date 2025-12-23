// Custom rule to enforce architecture boundaries
// Prevents imports between layers (e.g., domain cannot import infra)

const architectureBoundariesRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce architecture layer boundaries",
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
                from: { type: "string" }, // Regex pattern for source file path
                disallow: {
                  type: "array",
                  items: { type: "string" }, // Regex patterns for disallowed imports
                },
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
    const options = context.options[0] || {};
    const rules = options.rules || [];
    const filename = context.getFilename();

    function checkNode(node) {
      if (!node.source || !node.source.value) {
        return;
      }

      const importPath = node.source.value;

      for (const rule of rules) {
        const fromPattern = new RegExp(rule.from);

        // Check if this file matches the "from" pattern
        if (!fromPattern.test(filename)) {
          continue;
        }

        // Check if the import matches any disallowed pattern
        for (const disallowPattern of rule.disallow) {
          const disallowRegex = new RegExp(disallowPattern);

          if (disallowRegex.test(importPath)) {
            context.report({
              node: node.source,
              message:
                rule.message || `Import from "${importPath}" violates architecture boundaries`,
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

export default {
  meta: {
    name: "architecture-boundaries",
    version: "1.0.0",
  },
  rules: {
    "architecture-boundaries": architectureBoundariesRule,
  },
};

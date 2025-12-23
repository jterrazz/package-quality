// Custom rule to remove TS/JS extensions from imports
// Compatible with both ESLint and Oxlint JS plugin API

const removeTsExtensionsRule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Remove .js, .jsx, .ts, .tsx extensions from imports',
            category: 'Best Practices',
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        const extensionsToRemove = /\.(js|jsx|ts|tsx)$/;

        function checkNode(node) {
            if (!node.source || !node.source.value) return;

            const importPath = node.source.value;

            // Check both relative imports (starting with . or ..) AND path alias imports (starting with @/)
            if (!importPath.startsWith('.') && !importPath.startsWith('@/')) return;

            if (extensionsToRemove.test(importPath)) {
                context.report({
                    node: node.source,
                    message: `Remove "${importPath.match(extensionsToRemove)[0]}" extension from import`,
                    fix(fixer) {
                        const newPath = importPath.replace(extensionsToRemove, '');
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
        name: 'remove-ts-extensions',
        version: '1.0.0',
    },
    rules: {
        'remove-ts-extensions': removeTsExtensionsRule,
    },
};

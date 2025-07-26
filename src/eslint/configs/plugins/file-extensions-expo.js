// Custom rule to remove TS/JS extensions
const removeTsExtensionsRule = {
    create(context) {
        const extensionsToRemove = /\.(js|jsx|ts|tsx)$/;

        function checkNode(node) {
            if (!node.source || !node.source.value) return;

            const importPath = node.source.value;

            // Check both relative imports (starting with . or ..) AND path alias imports (starting with @/)
            if (!importPath.startsWith('.') && !importPath.startsWith('@/')) return;

            if (extensionsToRemove.test(importPath)) {
                context.report({
                    fix(fixer) {
                        const newPath = importPath.replace(extensionsToRemove, '');
                        return fixer.replaceText(node.source, `'${newPath}'`);
                    },
                    message: `Remove "${importPath.match(extensionsToRemove)[0]}" extension from import`,
                    node: node.source,
                });
            }
        }

        return {
            ExportAllDeclaration: checkNode,
            ExportNamedDeclaration: checkNode,
            ImportDeclaration: checkNode,
        };
    },
    meta: {
        docs: {
            category: 'Best Practices',
            description: 'Remove .js, .jsx, .ts, .tsx extensions from imports',
        },
        fixable: 'code',
        schema: [],
        type: 'problem',
    },
};

export default [
    {
        plugins: {
            custom: {
                rules: {
                    'remove-ts-extensions': removeTsExtensionsRule,
                },
            },
        },
        rules: {
            // Use our custom rule to remove TS/JS extensions
            'custom/remove-ts-extensions': 'error',
        },
    },
];

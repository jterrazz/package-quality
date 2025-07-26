import sortKeysFix from 'eslint-plugin-sort-keys-fix';

export default [
    // Custom rules for sorting keys in objects
    {
        plugins: {
            'sort-keys-fix': sortKeysFix,
        },
        rules: {
            'sort-keys-fix/sort-keys-fix': 'warn',
        },
    },
]; 
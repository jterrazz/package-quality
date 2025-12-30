# @jterrazz/codestyle

Fast, opinionated linting and formatting for TypeScript. Powered by Oxlint (2-3x faster than ESLint) and Oxfmt.

## Quick Start

```bash
npm install @jterrazz/codestyle --save-dev
```

Create `.oxlintrc.json`:

```json
{
    "extends": ["node_modules/@jterrazz/codestyle/src/oxlint/node.json"]
}
```

Run:

```bash
npx codestyle          # Check everything
npx codestyle --fix    # Fix everything
```

## Configurations

| Config                                                                     | Use Case                           |
| -------------------------------------------------------------------------- | ---------------------------------- |
| `node_modules/@jterrazz/codestyle/src/oxlint/node.json`                    | Node.js (requires .js extensions)  |
| `node_modules/@jterrazz/codestyle/src/oxlint/expo.json`                    | Expo / React Native                |
| `node_modules/@jterrazz/codestyle/src/oxlint/nextjs.json`                  | Next.js                            |
| `node_modules/@jterrazz/codestyle/src/oxlint/architectures/hexagonal.json` | Hexagonal architecture enforcement |

## What's Included

- TypeScript strict mode with `type` imports
- Import sorting and grouping (perfectionist)
- Named exports enforcement (no default exports)
- Performance warnings (spread in loops, etc.)
- Style consistency (curly braces, comments, naming)
- Custom rules: architecture boundaries, import extensions

## CLI

```bash
npx codestyle              # Run all checks (type + lint + format)
npx codestyle --fix        # Auto-fix all issues

npx codestyle --type       # TypeScript only
npx codestyle --lint       # Lint only
npx codestyle --format     # Format only
```

## Architecture Enforcement (Optional)

Enforce hexagonal architecture boundaries:

```json
{
    "extends": [
        "node_modules/@jterrazz/codestyle/src/oxlint/node.json",
        "node_modules/@jterrazz/codestyle/src/oxlint/architectures/hexagonal.json"
    ]
}
```

Rules enforced:

- `domain/` cannot import from other layers
- `application/` cannot import infrastructure
- `presentation/ui/` cannot import navigation
- `features/` cannot import other features

---

By [Jean-Baptiste Terrazzoni](https://jterrazz.com)

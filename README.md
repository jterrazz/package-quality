# @jterrazz/codestyle

Fast, opinionated linting and formatting for TypeScript. Powered by Oxlint (2-3x faster than ESLint) and Oxfmt.

## Quick Start

```bash
npm install @jterrazz/codestyle --save-dev
```

Create `.oxlintrc.json`:

```json
{
    "extends": ["@jterrazz/codestyle/oxlint/node"]
}
```

Run:

```bash
npx codestyle          # Check everything
npx codestyle --fix    # Fix everything
```

## Configurations

| Config                              | Use Case                          |
| ----------------------------------- | --------------------------------- |
| `@jterrazz/codestyle/oxlint/node`   | Node.js (requires .js extensions) |
| `@jterrazz/codestyle/oxlint/expo`   | Expo / React Native               |
| `@jterrazz/codestyle/oxlint/nextjs` | Next.js                           |

## What's Included

- TypeScript strict mode with `type` imports
- Import sorting and grouping (perfectionist)
- Named exports enforcement (no default exports)
- Performance warnings (spread in loops, etc.)
- Style consistency (curly braces, comments, naming)

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
        "@jterrazz/codestyle/oxlint/node",
        "@jterrazz/codestyle/oxlint/architectures/hexagonal"
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

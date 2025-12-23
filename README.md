_Hey there - I'm Jean-Baptiste, just another developer doing weird things with code. All my projects live on [jterrazz.com](https://jterrazz.com) - complete with backstories and lessons learned. Feel free to poke around - you might just find something useful!_

# @jterrazz/codestyle

Unified lint/format configs to standardize TypeScript codebases with Oxlint + Oxfmt.

## Installation

Install the package using npm:

```bash
npm install @jterrazz/codestyle --save-dev
```

## Usage

### Oxlint Configuration

Choose the configuration that matches your environment:

**For Node.js projects:**

```json
// oxlint.json
{
    "extends": ["@jterrazz/codestyle/oxlint/node"]
}
```

**For Expo/React Native projects:**

```json
// oxlint.json
{
    "extends": ["@jterrazz/codestyle/oxlint/expo"]
}
```

**For Next.js projects:**

```json
// oxlint.json
{
    "extends": ["@jterrazz/codestyle/oxlint/nextjs"]
}
```

### Oxfmt Configuration

```json
// oxfmt.json
{
    "extends": ["@jterrazz/codestyle/oxfmt"]
}
```

## Features

### Environment-Specific Configurations

**Node.js Configuration:**

- Requires explicit file extensions (`.js`) for imports
- Optimized for Node.js patterns

**Expo/React Native Configuration:**

- No file extensions in imports (auto-fixed)
- React plugin enabled

**Next.js Configuration:**

- No file extensions in imports (Turbopack compatibility, auto-fixed)
- React and Next.js plugins enabled

### Shared Features

- **TypeScript**: Strict type checking with consistent type imports
- **Import Sorting**: Automated import organization with architectural grouping (via perfectionist)
- **Code Quality**: Perfectionist plugin for consistent code style
- **Performance**: Oxlint is 50-100x faster than ESLint, Oxfmt is 10x faster than Prettier, tsgo is 10x faster than tsc

## CLI Tools

This package includes a CLI tool for running quality checks:

```bash
# Run all quality checks (tsgo, Oxlint, Oxfmt) in parallel
npx codestyle

# Automatically fix all fixable issues (Oxlint --fix, Oxfmt format)
npx codestyle --fix

# Run individual checks
npx codestyle --type      # TypeScript type checking only
npx codestyle --lint      # Linting only
npx codestyle --format    # Format checking only

# Combine flags
npx codestyle --lint --fix    # Fix lint issues only
npx codestyle --format --fix  # Format files only
```

## Scripts

Add these scripts to your `package.json` for common development tasks:

```json
{
    "scripts": {
        "codestyle": "codestyle",
        "codestyle:fix": "codestyle --fix"
    }
}
```

## Configuration

The configurations are fully modular and include:

- **Base configuration**: Common rules for TypeScript, import sorting, code quality
- **Environment-specific**: Tailored rules for Node.js, Expo/React Native, and Next.js
- **Custom plugins**: JS plugins for import extension enforcement

Happy coding!

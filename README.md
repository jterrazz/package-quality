*Hey there – I’m Jean-Baptiste, just another developer doing weird things with code. All my projects live on [jterrazz.com](https://jterrazz.com) – complete with backstories and lessons learned. Feel free to poke around – you might just find something useful!*

# @jterrazz/quality

Unified lint/format rules to standardize TypeScript codebases with ESLint + Biome.

## Installation

Install the package using npm:

```bash
npm install @jterrazz/quality --save-dev
```

## Usage

### ESLint Configuration

Choose the configuration that matches your environment:

**For Node.js projects:**

```javascript
// eslint.config.js
import { node } from '@jterrazz/quality';

export default node;
```

**For Expo/React Native projects:**

```javascript
// eslint.config.js
import { expo } from '@jterrazz/quality';

export default expo;
```

**For Next.js projects:**

```javascript
// eslint.config.js
import { nextjs } from '@jterrazz/quality';

export default nextjs;
```

### Biome Configuration

```json
// biome.json
{
  "extends": ["@jterrazz/quality/biome"]
}
```

## Features

### Environment-Specific Configurations

**Node.js Configuration:**

- Requires explicit file extensions (`.js`) for imports
- Optimized for Node.js globals and patterns
- Uses `eslint-plugin-file-extension-in-import-ts` for extension mapping

**Expo/React Native Configuration:**

- No file extensions in imports (auto-fixed)
- Allows `require()` for image assets (`.png`, `.jpg`, etc.)
- Browser and Node.js globals included

**Next.js Configuration:**

- No file extensions in imports (Turbopack compatibility, auto-fixed)
- Browser and Node.js globals included

### Shared Features

- **TypeScript**: Strict type checking with consistent type imports
- **Import Sorting**: Automated import organization with architectural grouping
- **Code Quality**: Perfectionist plugin for consistent code style
- **Fast Formatting**: Biome formatting ~10x faster than Prettier
- **Performance**: Modular structure for fast ESLint processing

## CLI Tools

This package includes powerful CLI tools for running quality checks:

```bash
# Run all quality checks (TypeScript, ESLint, Biome) in parallel
npx ts-check

# Automatically fix all fixable issues (ESLint --fix, Biome format --write)
npx ts-fix
```

## Scripts

Add these scripts to your `package.json` for common development tasks:

```json
{
    "scripts": {
    "check": "ts-check",
    "fix": "ts-fix"
  }
```

## Configuration

The configurations are fully modular and include:

- **Base configurations**: JavaScript, TypeScript, and ignore patterns
- **Plugin configurations**: Import sorting, perfectionist, file extensions
- **Environment-specific**: Tailored rules for Node.js, Expo/React Native, and Next.js

Happy coding! 🚀

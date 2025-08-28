# Package Quality

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

- No file extensions required for code files (`.js`, `.jsx`, `.ts`, `.tsx`)
- Extensions required for media files (`.png`, `.svg`, `.mp4`, etc.)
- Browser and Node.js globals included
- Uses `eslint-plugin-n` for import validation

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
npx quality

# Automatically fix all fixable issues (ESLint --fix, Biome format --write)
npx quality-fix
```

## Scripts

Add these scripts to your `package.json` for common development tasks:

```json
{
    "scripts": {
    "quality": "quality",
    "quality:fix": "quality-fix"
  }
```

## Configuration

The configurations are fully modular and include:

- **Base configurations**: JavaScript, TypeScript, and ignore patterns
- **Plugin configurations**: Import sorting, perfectionist, file extensions
- **Environment-specific**: Tailored rules for Node.js vs Expo/React Native

Happy coding! 🚀

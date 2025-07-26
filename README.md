# Package Quality

This package provides modular ESLint and Prettier configurations for TypeScript projects, with environment-specific optimizations for Node.js and Expo/React Native development.

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

### Prettier Configuration

```javascript
// prettier.config.js
import { prettier } from '@jterrazz/quality';

export default prettier;
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
- **Performance**: Modular structure for fast ESLint processing

## Scripts

Add these scripts to your `package.json` for common development tasks:

```json
{
  "scripts": {
    "lint": "j-quality"
  }
}
```

## Configuration

The configurations are fully modular and include:

- **Base configurations**: JavaScript, TypeScript, and ignore patterns
- **Plugin configurations**: Import sorting, perfectionist, file extensions
- **Environment-specific**: Tailored rules for Node.js vs Expo/React Native

Happy coding! 🚀

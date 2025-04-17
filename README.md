# Code Standards

This package provides ESLint and Prettier configurations for TypeScript projects, along with a convenient code-standards command to run all quality checks in parallel.

## Installation

Install the package using npm:

```bash
npm install @jterrazz/quality --save-dev
```

## Usage

1. Create an ESLint configuration file (e.g., `eslint.config.js`) in your project root:

```javascript
// eslint.config.js
import { eslintConfig } from '@jterrazz/quality';

export default eslintConfig;
```

2. Create a Prettier configuration file (e.g., `prettier.config.js`) in your project root:

```javascript
// prettier.config.js
import { prettierConfig } from '@jterrazz/quality';

export default prettierConfig;
```

3. Add the following script to your `package.json`:

```json
{
  "scripts": {
    "lint": "code-standards"
  }
}
```

4. You can now run all quality checks in parallel using:

```bash
npm run lint
```

This will run:

- TypeScript type checking (`tsc --noEmit`)
- ESLint code quality checks (`eslint . --ext .ts,.tsx`)
- Prettier style checks (`prettier . --check`)

All checks run in parallel and provide a clear summary of the results.

Happy linting! 🚀

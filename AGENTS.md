# AGENTS.md - Guidelines for Agentic Coding Agents

This document provides guidelines for agentic coding agents working on this Chrome extension codebase. It includes build, lint, and test commands, as well as code style guidelines to ensure consistency and maintainability.

## Project Overview

This is a Chrome extension that hides specific HTML elements and links based on predefined rules. The extension uses Manifest V3 and consists of:
- `manifest.json`: Extension configuration
- `content.js`: Content script that manipulates the DOM

## Build Commands

Since this is a vanilla JavaScript Chrome extension without a build system, no compilation is required. To "build" the extension:

```bash
# No build step needed - files are ready for loading in Chrome
echo "Extension is ready to load in chrome://extensions/"
```

If you add a build system (e.g., for bundling or transpilation), update this section.

## Lint Commands

Install ESLint for code quality:

```bash
npm install --save-dev eslint eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise
```

Create `.eslintrc.js`:

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Add custom rules here
  }
}
```

Run linting:

```bash
# Lint all JavaScript files
npx eslint content.js

# Lint and fix
npx eslint content.js --fix

# Lint with output format
npx eslint content.js --format=compact
```

## Test Commands

Set up Jest for testing:

```bash
npm install --save-dev jest jsdom
```

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "jsdom"
  }
}
```

Run tests:

```bash
# Run all tests
npm test

# Run a single test file
npm test -- content.test.js

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a specific test by name
npm test -- --testNamePattern="should hide elements with class"
```

Example test file `content.test.js`:

```javascript
const { JSDOM } = require('jsdom');

describe('Content Script', () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = new JSDOM('<html><body><div class="BIG_BROTHER_BRASIL">test</div><a href="https://example.com/bbb">link</a></body></html>');
    document = dom.window.document;
    global.document = document;
    global.window = dom.window;
    // Load content.js here
  });

  test('should hide elements with BIG_BROTHER_BRASIL class', () => {
    // Test implementation
  });
});
```

## Code Style Guidelines

### General Principles

- Follow clean code principles: readable, maintainable, and self-documenting code
- Use SOLID principles where applicable
- Prefer functional programming over imperative where it improves readability
- Keep functions small and focused on a single responsibility
- Use meaningful names for variables, functions, and files

### JavaScript Specific

#### Variables and Constants

```javascript
// Use const for constants and variables that don't change
const MAX_RETRIES = 3;
const hideRules = [
  { type: 'class', value: 'BIG_BROTHER_BRASIL' }
];

// Use let for variables that change
let retryCount = 0;

// Avoid var - use const/let instead
```

#### Functions

```javascript
// Use arrow functions for anonymous functions and short expressions
const hideElement = (element) => {
  element.style.display = 'none';
};

// Use function declarations for named functions
function applyHideRule(rule) {
  // implementation
}

// Prefer pure functions when possible
const shouldHideNode = (node) => {
  return node.classList.contains('BIG_BROTHER_BRASIL') ||
         (node.tagName === 'A' && node.href.includes('bbb'));
};
```

#### Imports and Modules

Since this is a content script, we don't use ES6 imports. If you add modules:

```javascript
// Use named imports
import { hideElement, applyHideRule } from './utils.js';

// Avoid default imports unless necessary
// import Utils from './utils.js'; // Not preferred
```

#### DOM Manipulation

```javascript
// Use querySelector/querySelectorAll instead of getElementById/getElementsByClassName for consistency
const elements = document.querySelectorAll('.target-class');

// Use modern DOM APIs
element.classList.add('hidden'); // Instead of element.className += ' hidden'

// Avoid direct style manipulation when possible - prefer CSS classes
element.classList.add('hidden'); // Instead of element.style.display = 'none'
```

#### Error Handling

```javascript
// Use try-catch for synchronous operations
try {
  const result = riskyOperation();
} catch (error) {
  console.error('Error occurred:', error);
  // Handle error appropriately
}

// For asynchronous operations
async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    return null; // or appropriate fallback
  }
}
```

#### Naming Conventions

- **Variables and functions**: camelCase
  ```javascript
  const hideElement = () => {};
  let elementCount = 0;
  ```

- **Constants**: UPPER_SNAKE_CASE
  ```javascript
  const MAX_ELEMENTS = 100;
  const DEFAULT_TIMEOUT = 5000;
  ```

- **Classes/Constructors**: PascalCase (if using classes)
  ```javascript
  class ElementHider {
    // implementation
  }
  ```

- **Files**: kebab-case for multi-word names
  ```
  content-script.js
  background-script.js
  ```

#### Code Organization

```javascript
// Group related constants at the top
const HIDE_RULES = [
  // rules
];

// Group helper functions
const hideElement = (element) => { /* ... */ };
const applyHideRule = (rule) => { /* ... */ };

// Main logic at the bottom
(function initialize() {
  // initialization code
})();
```

#### Comments

- Use comments sparingly - prefer self-documenting code
- Use JSDoc for function documentation if needed

```javascript
/**
 * Hides an element by setting display to none
 * @param {HTMLElement} element - The element to hide
 */
const hideElement = (element) => {
  element.style.display = 'none';
};
```

#### Performance Considerations

- Cache DOM queries when used multiple times
- Use event delegation for dynamic content
- Avoid unnecessary DOM manipulations in loops

```javascript
// Good - cache query
const elements = document.querySelectorAll('.target');
elements.forEach(hideElement);

// Bad - query in loop
document.querySelectorAll('.target').forEach(hideElement);
```

#### Security

- Never inject untrusted data into innerHTML
- Validate and sanitize any user inputs
- Use HTTPS for any external requests

### Chrome Extension Specific

- Follow Manifest V3 best practices
- Use content scripts responsibly - avoid performance issues
- Request minimal permissions in manifest.json
- Handle extension updates gracefully

### Git and Versioning

- Use semantic versioning (major.minor.patch)
- Write clear commit messages
- Keep commits focused and atomic

### Testing Guidelines

- Write tests for all new functionality
- Aim for good test coverage (>80%)
- Use descriptive test names
- Test edge cases and error conditions

This document should be updated as the codebase evolves and new tools/patterns are adopted.
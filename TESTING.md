# Testing Guide

This project uses **Jest** for unit testing and **Husky** for Git hooks to ensure code quality.

## Setup

### Install Dependencies

Make sure all dependencies are installed:

```bash
# Install root dependencies (Husky, lint-staged)
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Initialize Husky

Husky is already configured, but if you need to reinitialize:

```bash
npm run prepare
```

## Running Tests

### Client Tests

Run all client tests:

```bash
cd client
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### Server Tests

Run all server tests:

```bash
cd server
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### Run All Tests

From the root directory:

```bash
npm test
```

Or run individually:

```bash
npm run test:client
npm run test:server
```

## Git Hooks

### Pre-commit Hook

Before each commit, Husky will:
- Run `lint-staged` which executes tests for staged files
- Only run tests related to the files you've changed (using `--findRelatedTests`)
- Pass even if no tests are found (`--passWithNoTests`)

### Pre-push Hook

Before pushing to remote, Husky will:
- Run all client tests
- Run all server tests
- Prevent push if any tests fail

## Test Structure

### Client Tests

Client tests are located in `client/src/**/__tests__/` directories:

- **Components**: `client/src/components/*/__tests__/*.test.tsx`
- **Hooks**: `client/src/hooks/__tests__/*.test.ts`
- **Utils**: `client/src/utils/__tests__/*.test.ts`

### Server Tests

Server tests are located in `server/__tests__/`:

- **Server**: `server/__tests__/server.test.js`
- **PDF Processing**: `server/__tests__/processPDF.test.js`

## Writing Tests

### Client Test Example

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })
})
```

### Server Test Example

```javascript
import { describe, it, expect } from '@jest/globals'
import { processPDF } from '../processPDF.js'

describe('processPDF', () => {
  it('should process PDF and return modified PDF bytes', async () => {
    const result = await processPDF(testPdfPath, null)
    expect(result).toBeInstanceOf(Uint8Array)
  })
})
```

## Test Coverage

Current test coverage includes:

### Client
- ✅ All React components (Button, Header, UploadArea, PDFViewer, SuccessView, ErrorMessage, LoadingSpinner)
- ✅ Custom hooks (usePdfUpload)
- ✅ Utility functions (fileValidation, api)

### Server
- ✅ PDF processing functions
- ✅ Server setup and configuration

## Configuration Files

### Jest Configuration

- **Client**: `client/jest.config.js`
- **Server**: `server/jest.config.js`

### Husky Configuration

- **Pre-commit**: `.husky/pre-commit`
- **Pre-push**: `.husky/pre-push`

### Lint-staged Configuration

Configured in root `package.json`:

```json
{
  "lint-staged": {
    "client/**/*.{ts,tsx}": [
      "cd client && npm test -- --findRelatedTests --passWithNoTests"
    ],
    "server/**/*.js": [
      "cd server && npm test -- --findRelatedTests --passWithNoTests"
    ]
  }
}
```

## Troubleshooting

### Tests failing on Windows

If you encounter line ending issues (CRLF vs LF), ensure your `.gitattributes` file is configured correctly.

### Jest not found

Make sure dependencies are installed:

```bash
cd client && npm install
cd ../server && npm install
```

### Husky hooks not running

Reinitialize Husky:

```bash
npm run prepare
```

### Coverage reports

Coverage reports are generated in:
- Client: `client/coverage/`
- Server: `server/coverage/`

Open `coverage/lcov-report/index.html` in your browser to view detailed coverage.

## Best Practices

1. **Write tests before or alongside code** - Follow TDD when possible
2. **Keep tests focused** - Each test should test one thing
3. **Use descriptive test names** - Test names should clearly describe what they test
4. **Mock external dependencies** - Don't rely on network calls or file system in unit tests
5. **Clean up after tests** - Use `beforeEach` and `afterEach` to set up and tear down test fixtures
6. **Test edge cases** - Don't just test the happy path
7. **Maintain high coverage** - Aim for at least 80% code coverage

## Continuous Integration

When setting up CI/CD, make sure to:

1. Install dependencies
2. Run tests
3. Generate coverage reports
4. Upload coverage to coverage service (optional)

Example GitHub Actions workflow:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: cd client && npm install
      - run: cd server && npm install
      - run: npm test
```



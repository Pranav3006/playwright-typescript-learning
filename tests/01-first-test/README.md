# 01 – Project setup and first typed tests

## What
- Scaffolded a Playwright + TypeScript project with `npm init playwright@latest` (Playwright 1.65.1, Node 20+).
- Added a strict `tsconfig.json` and a `typecheck` script, because the scaffold doesn't create one.
- Wrote first typed tests against the TodoMVC demo app (`demo.playwright.dev/todomvc`):
  - a `TodoItem` interface for test data
  - a typed helper `addTodo(page: Page, item: TodoItem): Promise<void>`
  - tests for page title, adding todos and completing a todo

## How to run
```bash
npm ci
npx playwright install
npm run typecheck                          # type-check only, no output = OK
npx playwright test tests/01-first-test    # expected: 3 passed
npx playwright test --ui                   # UI mode: timeline, DOM snapshots, watch mode
npx playwright show-report                 # open the HTML report
```

## What I learned
- `npm init playwright` creates `package.json`, `playwright.config.ts`, an example test and `.gitignore`, but **no `tsconfig.json`**.
- Playwright removes the types and runs the code. It **does not type-check**, so a test with type errors still runs. `tsc --noEmit` is the real safety check, and it should run before the tests (locally and in CI).
- Recent TypeScript needs `"types": ["node"]` in `tsconfig.json`, or `process.env.CI` fails with TS2591.
- `strict` and `noUncheckedIndexedAccess` catch bad test data and "maybe undefined" values before run time.
- A missing `await` is **not** caught by `tsc`. It causes flaky tests. ESLint's `no-floating-promises` rule catches it.

## Interview question
**Q: Does Playwright type-check TypeScript tests?**
No. Playwright transpiles `.ts` files and runs them without checking types. I run `tsc --noEmit` as a separate step, locally and in CI before the test run, so type errors such as a misspelled test-data field fail fast instead of causing a confusing failure at run time.
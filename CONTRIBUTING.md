# Contributing to toastory

Thank you for your interest in contributing to toastory!

## Development Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/iamtashanto/toastory.git
   cd glazekit
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run verification commands**:
   ```bash
   npm run check       # Runs typecheck, lint, unit tests, contrast, build, size, and readme:check
   npm run check:all   # Runs check plus Playwright E2E suites
   ```

## Hard Quality Rules

- **Zero Runtime Dependencies**: The published package contains zero runtime dependencies.
- **Strict TypeScript**: No `any`, no `@ts-ignore` (`@ts-expect-error` permitted only with documented justification).
- **Size Budgets**:
  - Core + Toast + 1 Theme: `< 6.00 KB` gzipped.
  - Full Web Bundle: `< 22.00 KB` gzipped.
  - Tree-shaking: Toast-only imports must not bundle dialog or sheet logic.
- **Accessibility**: 100% WCAG 2.2 AA compliant. 0 axe-core errors allowed.

## Publishing & Release Credentials

Release publishing is automated via GitHub Actions using npm Provenance:

1. **Automation Token (`NPM_TOKEN`)**:
   - Maintainers configure an npm **Automation Token** in the repository secrets (`NPM_TOKEN`).
   - Automation tokens bypass interactive 2FA prompts during automated CI release publishing while cryptographically signing the package with OpenID Connect (OIDC) provenance.
   - Maintainer npm user accounts must have **Two-Factor Authentication (2FA)** enabled (`Authorization and writes`).
2. **Provenance**:
   - GitHub Actions publishes with `--provenance --access public`.
   - Never print, echo, or log secret tokens.

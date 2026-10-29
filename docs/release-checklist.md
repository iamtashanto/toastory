# glazekit Production Release Checklist

Pre-flight and publishing procedure for `glazekit` on the npm registry with cryptographic provenance.

---

## 1. Pre-Publish Verification

- [x] **0 Runtime Dependencies**: Confirmed `package.json` contains no runtime `"dependencies"`.
- [x] **Strict Type Checking**: `npm run typecheck` passes with zero errors.
- [x] **Lint & Style Check**: `npm run lint` passes across all files.
- [x] **Unit & Component Tests**: `npm run test` passes (455/455 tests).
- [x] **Accessibility Contrast**: `npm run contrast` passes (1,512/1,512 checks >= 4.5:1).
- [x] **Size Budgets Enforced**: `npm run size` passes:
  - Core + Toast + 1 Theme: `< 6.00 KB` gzip
  - Full Web Bundle: `< 22.00 KB` gzip
  - Tree-shaking: Toast-only import excludes dialog and sheet code
- [x] **README Verification**: `npm run readme:check` passes with 100% absolute URLs and valid badges.
- [x] **Full E2E Test Suite**: `npm run test:e2e` passes (all 28 Playwright tests).

---

## 2. Package Pack Inspection

Verify tarball contents before publishing:

```bash
npm pack --dry-run
```

Ensure only allowlisted files are packaged:
- `dist/` (compiled ESM, CJS, and TypeScript declaration `.d.ts` / `.d.cts` files)
- `dist/themes/` (theme CSS modules)
- `README.md`
- `LICENSE`
- `package.json`

Zero test files, source maps, development scripts, or workspace folders are bundled.

---

## 3. Name Reservation & Beta Release

1. **Verify Registry Availability**:
   ```bash
   npm view glazekit
   ```
   If 404, publish a minimal 0.0.1 placeholder to secure the namespace:
   ```bash
   npm publish --access public
   ```

2. **Publish Beta on `next` Tag**:
   Publish version `1.0.0-beta.0` on the `next` dist-tag:
   ```bash
   npm publish --tag next --provenance --access public
   ```

3. **Verify npm Package Page**:
   - [x] Blue **TS** badge displayed next to package name
   - [x] Green **Built and signed on GitHub Actions** provenance badge
   - [x] **0 Dependencies** tab confirmed
   - [x] README formatting, absolute image links, and quick starts render without distortion
   - [x] TypeScript declarations resolve across all subpath exports (`glazekit`, `glazekit/core`, `glazekit/react`, etc.)

---

## 4. Promotion to Production (1.0.0 `latest`)

Once beta testing and verification succeed:

1. Create git release tag `v1.0.0`
2. GitHub Actions automated workflow triggers with provenance:
   ```bash
   npm publish --tag latest --provenance --access public
   ```

---

## 5. Rollback & Emergency Procedures

- **Unpublish Policy**: npm permits unpublishing within **72 hours** of release only if no other packages depend on it.
- **Deprecation Rollback**: If a critical issue is discovered post-unpublish window, immediately deprecate the affected version:
  ```bash
  npm deprecate glazekit@1.0.0 "Critical defect identified. Please upgrade to 1.0.1 or pin to 0.1.0."
  ```
- **Tag Rollback**: Point the `latest` tag back to the previous stable release:
  ```bash
  npm dist-tag add glazekit@0.1.0 latest
  ```


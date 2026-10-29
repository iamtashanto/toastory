# toastory Production Release Checklist

Pre-flight and publishing procedure for `toastory` on the npm registry with cryptographic provenance.

---

## 1. Package Metadata & Canonical URLs

The package metadata in `package.json` is configured to match the canonical GitHub repository and documentation domain:

| Field | Configured Value | Verification Status |
|---|---|:---:|
| **Repository URL** | `REPO_URL=https://github.com/iamtashanto/toastory.git` | Verified |
| **Documentation Site** | `SITE_URL=https://toastory.tashanto.com` | Verified |
| **Issue Tracker** | `BUGS_URL=https://github.com/iamtashanto/toastory/issues` | Verified |
| **Author** | `AUTHOR=TA Shanto <shanto@toastory.tashanto.com>` | Verified |
| **License** | `MIT` | Verified |
| **Dependencies** | `0 runtime dependencies` (`dependencies: {}`) | Verified |

> [!IMPORTANT]
> The `repository.url` in `package.json` must exactly match the GitHub Actions repository where provenance signing occurs (`iamtashanto/toastory`), or npm Sigstore verification will fail during publish.

---

## 2. GitHub Social Preview Image

The Open Graph social preview image has been generated at 1280x640:
- **Image File**: `docs/images/social-preview.png`
- **Resolution**: 1280px × 640px (exact GitHub Open Graph specification)
- **Generation Script**: `node scripts/generate-social-preview.mjs`

### How to Configure in GitHub Repository Settings:
1. Open [https://github.com/iamtashanto/toastory](https://github.com/iamtashanto/toastory).
2. Click **Settings** (top repository navigation).
3. Under **General**, scroll to **Social preview**.
4. Click **Edit** -> **Upload an image**.
5. Select `docs/images/social-preview.png` from this repository.
6. Confirm the preview renders sharp with full-width frosted glass components and badges.

---

## 3. Cryptographic Provenance & Local Dry-Run

### Why Local `--provenance` Publishing Cannot Run:
Running `npm publish --dry-run --provenance` on a local development workstation fails with:
```text
npm error code EUSAGE
npm error --provenance can only be used when publishing from a supported CI provider
```
**Technical Reason**:
npm provenance relies on Sigstore and OpenID Connect (OIDC). During release, npm requests a cryptographic ID token from the CI environment using:
- `ACTIONS_ID_TOKEN_REQUEST_URL`
- `ACTIONS_ID_TOKEN_REQUEST_TOKEN`

These environment variables are only generated inside GitHub Actions runners when `permissions: id-token: write` is granted. Local developer machines lack the Sigstore OIDC signer.

### Automated CI Publishing Workflow:
The release is automated via `.github/workflows/release.yml`:
```yaml
name: Release
on:
  push:
    tags:
      - 'v*'
permissions:
  contents: write
  id-token: write
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run check:all
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 4. Pre-Publish Verification Suite

- [x] **0 Runtime Dependencies**: Confirmed `package.json` contains no runtime `"dependencies"`.
- [x] **Strict Type Checking**: `npm run typecheck` passes with zero errors.
- [x] **Lint & Style Check**: `npm run lint` passes across all files.
- [x] **Unit & Component Tests**: `npm run test` passes (455/455 tests).
- [x] **Subpath Exports Check**: `tests/exports.test.ts` verifies ESM and CJS imports for all 7 subpaths.
- [x] **Publint & ATTW Verification**: `publint` reports "All good!" and `@arethetypeswrong/cli` confirms all green for node10, node16 CJS, node16 ESM, and bundler.
- [x] **Accessibility Contrast**: `npm run contrast` passes (1,512/1,512 checks >= 4.5:1).
- [x] **Size Budgets Enforced**: `npm run size` passes:
  - Core + Toast + 1 Theme: `< 6.00 KB` gzip
  - Full Web Bundle: `< 22.00 KB` gzip
  - Tree-shaking: Toast-only import excludes dialog and sheet code
- [x] **README Verification**: `npm run readme:check` verifies:
  - Line count (255 <= 350 lines)
  - Shields.io badge limit (7 <= 7 badges)
  - Local asset validation
  - Link syntax and pre-release allowlists
  - Quick-start compilation across all 9 framework snippets against the packed tarball
- [x] **Full E2E Test Suite**: `npm run test:e2e` passes (all 28 Playwright tests).

---

## 5. Package Pack Inspection

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

## 6. Name Reservation & Beta Release

1. **Verify Registry Availability**:
   ```bash
   npm view toastory
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
   - [x] TypeScript declarations resolve across all subpath exports (`toastory`, `toastory/core`, `toastory/react`, etc.)

---

## 7. Promotion to Production (1.0.0 `latest`)

Once beta testing and verification succeed:

1. Create git release tag `v1.0.0`:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. GitHub Actions automated workflow triggers with provenance:
   ```bash
   npm publish --tag latest --provenance --access public
   ```

---

## 8. Rollback & Emergency Procedures

- **Unpublish Policy**: npm permits unpublishing within **72 hours** of release only if no other packages depend on it.
- **Deprecation Rollback**: If a critical issue is discovered post-unpublish window, immediately deprecate the affected version:
  ```bash
  npm deprecate toastory@1.0.0 "Critical defect identified. Please upgrade to 1.0.1 or pin to 0.1.0."
  ```
- **Tag Rollback**: Point the `latest` tag back to the previous stable release:
  ```bash
  npm dist-tag add toastory@0.1.0 latest
  ```

import { Buffer } from 'node:buffer';
import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const formatKb = (bytes) => (bytes / 1024).toFixed(2);

console.log('--- toastory Size Budget Verification ---');

// Budget 1: Core + toast + one theme < 6 KB (6144 bytes)
const toastCoreBundle = (
  await esbuild.build({
    stdin: {
      contents:
        'import { createToastEngine, createToastStore, createToastApi } from "./dist/core.js"; console.log(createToastEngine, createToastStore, createToastApi);',
      resolveDir: root,
      loader: 'js',
    },
    bundle: true,
    minify: true,
    treeShaking: true,
    format: 'esm',
    write: false,
  })
).outputFiles[0].text;

const themeData = await readFile(join(dist, 'themes', 'basic.toast.css'));
const coreAndThemeGzip = gzipSync(
  Buffer.concat([Buffer.from(toastCoreBundle), Buffer.from(themeData)]),
).length;

const budgetCoreMax = 6 * 1024;
console.log(`Core + Toast + 1 Theme: ${formatKb(coreAndThemeGzip)} KB (budget: < 6.00 KB)`);

if (coreAndThemeGzip >= budgetCoreMax) {
  console.error(`ERROR: Core + Toast budget exceeded! ${coreAndThemeGzip} >= ${budgetCoreMax}`);
  process.exit(1);
}

// Budget 2: Full web bundle < 22 KB (22528 bytes)
const fullWebCode = await readFile(join(dist, 'index.js'));
const fullWebGzip = gzipSync(Buffer.from(fullWebCode)).length;
const budgetFullMax = 22 * 1024;
console.log(`Full web bundle:        ${formatKb(fullWebGzip)} KB (budget: < 22.00 KB)`);

if (fullWebGzip >= budgetFullMax) {
  console.error(`ERROR: Full web bundle budget exceeded! ${fullWebGzip} >= ${budgetFullMax}`);
  process.exit(1);
}

// Budget 3: Tree-shaking verification (toast-only import must not pull dialog code)
const treeShakeCheck = (
  await esbuild.build({
    stdin: {
      contents: 'import { toast } from "./dist/index.js"; console.log(toast);',
      resolveDir: root,
      loader: 'js',
    },
    bundle: true,
    minify: true,
    treeShaking: true,
    format: 'esm',
    write: false,
  })
).outputFiles[0].text;

const hasDialogCode =
  treeShakeCheck.includes('openDialog') ||
  treeShakeCheck.includes('openSheet') ||
  treeShakeCheck.includes('openBottomSheet');

if (hasDialogCode) {
  console.error('ERROR: Tree-shaking failed! Toast-only import pulled dialog/sheet code.');
  process.exit(1);
}
console.log('Tree-shaking:           ✓ Toast-only import eliminates dialog & sheet code');

// Budget 4: Each theme CSS < 4 KB gzip (toast and dialog styles in separate files)
const themeFiles = await readdir(join(dist, 'themes'));
let maxThemeGzip = 0;
for (const file of themeFiles) {
  if (file.endsWith('.toast.css') || file.endsWith('.dialog.css')) {
    const data = await readFile(join(dist, 'themes', file));
    const gz = gzipSync(data).length;
    if (gz > maxThemeGzip) maxThemeGzip = gz;
    if (gz >= 4 * 1024) {
      console.error(`ERROR: Theme CSS budget exceeded for ${file}! ${gz} >= 4096 bytes`);
      process.exit(1);
    }
  }
}
console.log(`Theme CSS modules:      ✓ All modules < 4.00 KB (max: ${formatKb(maxThemeGzip)} KB)`);

console.log('✓ All size budgets passed successfully!\n');

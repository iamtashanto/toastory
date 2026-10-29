import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

async function getGzipSize(...relativePaths) {
  let combined = Buffer.alloc(0);
  for (const rel of relativePaths) {
    const data = await readFile(join(dist, rel));
    combined = Buffer.concat([combined, Buffer.isBuffer(data) ? data : Buffer.from(data)]);
  }
  return gzipSync(combined).length;
}

const formatKb = (bytes) => (bytes / 1024).toFixed(2);

console.log('--- Size Budget Verification ---');

// Budget 1: Core + toast + one theme < 6 KB (6144 bytes)
const coreAndThemeGzip = await getGzipSize('core.js', 'themes/ios-glass.toast.css');
const budgetCoreMax = 6 * 1024;
console.log(`Core + Toast Theme: ${formatKb(coreAndThemeGzip)} KB (budget: < 6.00 KB)`);

if (coreAndThemeGzip >= budgetCoreMax) {
  console.error(`ERROR: Core + Toast budget exceeded! ${coreAndThemeGzip} >= ${budgetCoreMax}`);
  process.exit(1);
}

// Budget 2: Full web bundle < 22 KB (22528 bytes)
const fullWebGzip = await getGzipSize('index.js');
const budgetFullMax = 22 * 1024;
console.log(`Full web bundle:    ${formatKb(fullWebGzip)} KB (budget: < 22.00 KB)`);

if (fullWebGzip >= budgetFullMax) {
  console.error(`ERROR: Full web bundle budget exceeded! ${fullWebGzip} >= ${budgetFullMax}`);
  process.exit(1);
}

console.log('✓ All size budgets passed successfully!\n');

import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readmePath = join(root, 'README.md');

console.log('--- glazekit README Verification Suite ---');

const readme = await readFile(readmePath, 'utf8');
const lines = readme.split('\n');

console.log(`Total lines: ${lines.length} (target: <= 350 lines)`);
if (lines.length > 350) {
  console.error(`ERROR: README line count exceeded! ${lines.length} > 350`);
  process.exit(1);
}

// 1. Check Badges
const badgeRegex = /\[!\[.*?\]\((https?:\/\/.*?)\)\]\((https?:\/\/.*?)\)/g;
const badges = [...readme.matchAll(badgeRegex)];
console.log(`Verified ${badges.length} shields.io badges (budget: <= 7)`);
if (badges.length > 7) {
  console.error(`ERROR: Badge count exceeded! ${badges.length} > 7`);
  process.exit(1);
}
for (const b of badges) {
  const imgUrl = b[1];
  const linkUrl = b[2];
  if (!imgUrl.startsWith('https://img.shields.io/')) {
    console.error(`ERROR: Badge image must use https://img.shields.io: ${imgUrl}`);
    process.exit(1);
  }
  if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
    console.error(`ERROR: Badge link must be absolute: ${linkUrl}`);
    process.exit(1);
  }
}

// 2. Check all other Links
const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
for (const match of readme.matchAll(linkRegex)) {
  const url = match[2];
  if (url.startsWith('#')) continue; // local anchor is fine
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.error(`ERROR: Link must be absolute for npm: ${url}`);
    process.exit(1);
  }
}

// 3. Check Image references
const imgRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
for (const match of readme.matchAll(imgRegex)) {
  const url = match[2];
  if (url.includes('raw.githubusercontent.com/glazekit/glazekit/main/')) {
    const localRelPath = url.split('raw.githubusercontent.com/glazekit/glazekit/main/')[1];
    const localPath = join(root, localRelPath);
    try {
      await access(localPath, constants.R_OK);
      console.log(`✓ Image verified against local repository asset: ${localRelPath}`);
    } catch {
      console.error(`ERROR: Local asset not found for URL: ${url}`);
      process.exit(1);
    }
  }
}

// 4. Check Code Blocks
const codeBlockRegex = /```([a-z0-9_-]*)\n([\s\S]*?)```/g;
const validLangs = new Set(['bash', 'html', 'tsx', 'vue', 'ts', 'svelte', 'js', 'text', 'json']);
let codeCount = 0;
for (const match of readme.matchAll(codeBlockRegex)) {
  codeCount++;
  const lang = match[1];
  if (!lang || !validLangs.has(lang)) {
    console.error(`ERROR: Invalid or missing language tag in code block: "${lang}"`);
    process.exit(1);
  }
}
console.log(`✓ Verified ${codeCount} code blocks across supported platform snippets.`);

console.log('✓ README verification passed successfully!\n');


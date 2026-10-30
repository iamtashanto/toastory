import { createServer } from 'node:http';
import { readFile, stat, unlink } from 'node:fs/promises';
import { join, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { chromium } from '@playwright/test';

const root = resolve(join(dirname(fileURLToPath(import.meta.url)), '..'));
const outDir = join(root, 'design-refs');
const tmpDir = join(root, 'node_modules', '.cache', 'recordings');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

// Start static file server
const server = createServer(async (req, res) => {
  const urlPath = (req.url ?? '/').split('?')[0] ?? '/';
  const cleanPath = urlPath === '/' ? '/tests/e2e/record-demo.html' : urlPath;
  const filePath = join(root, cleanPath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 3589;
await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`Server listening on http://127.0.0.1:${PORT}`);

const browser = await chromium.launch({ headless: true });

const scenarios = [
  {
    name: 'toasts-demo.gif',
    fn: 'runToastsDemo',
    duration: 4400,
  },
  {
    name: 'dialogs-demo.gif',
    fn: 'runDialogsDemo',
    duration: 4500,
  },
  {
    name: 'sheets-demo.gif',
    fn: 'runSheetsDemo',
    duration: 4500,
  },
  {
    name: 'themes-demo.gif',
    fn: 'runThemesDemo',
    duration: 4500,
  },
];

const fs = await import('node:fs');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

for (const scenario of scenarios) {
  console.log(`\nRecording scenario: ${scenario.name}...`);
  const context = await browser.newContext({
    viewport: { width: 760, height: 420 },
    recordVideo: { dir: tmpDir, size: { width: 760, height: 420 } },
  });

  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/tests/e2e/record-demo.html`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(400);

  // Run the scenario in the page
  await page.evaluate((fnName) => {
    const targetFn = globalThis[fnName];
    if (typeof targetFn === 'function') targetFn();
  }, scenario.fn);

  // Wait for animation sequence
  await page.waitForTimeout(scenario.duration);

  // Close context to finish writing webm
  const video = page.video();
  const videoPath = await video.path();
  await context.close();

  const gifPath = join(outDir, scenario.name);
  console.log(`Converting ${videoPath} -> ${gifPath} via ffmpeg...`);

  // ffmpeg convert with two-pass palettegen for ultra crisp colors
  const ffmpegRes = spawnSync('ffmpeg', [
    '-y',
    '-i',
    videoPath,
    '-vf',
    'fps=18,scale=760:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3',
    '-loop',
    '0',
    gifPath,
  ]);

  if (ffmpegRes.status !== 0) {
    console.error('ffmpeg failed:', ffmpegRes.stderr.toString());
  } else {
    const size = (await stat(gifPath)).size;
    console.log(`✓ Generated ${scenario.name} (${(size / 1024).toFixed(1)} KB)`);
  }

  try {
    await unlink(videoPath);
  } catch (err) {
    void err;
  }
}

await browser.close();
server.close();
console.log('\nAll GIF demos generated successfully in design-refs/!');

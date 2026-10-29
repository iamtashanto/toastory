import { chromium } from 'playwright';
import { resolve, join } from 'node:path';
import { readFile } from 'node:fs/promises';

const ROOT = resolve(process.cwd());
const outputPath = join(ROOT, 'docs/images/social-preview.png');

console.log('Generating 1280x640 social preview image...');

const browser = await chromium.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage({
  viewport: { width: 1280, height: 640 },
  deviceScaleFactor: 2,
});

// Load the compiled themes CSS
const baseCss = await readFile(join(ROOT, 'dist/themes/_base.css'), 'utf8');
const iosCss = await readFile(join(ROOT, 'dist/themes/ios-glass.css'), 'utf8');
const liquidCss = await readFile(join(ROOT, 'dist/themes/liquid-glass.css'), 'utf8');
const auroraCss = await readFile(join(ROOT, 'dist/themes/aurora.css'), 'utf8');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
${baseCss}
${iosCss}
${liquidCss}
${auroraCss}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 1280px;
  height: 640px;
  background: #090a0f;
  color: #f4f4f5;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 60px;
}

/* Background ambient aurora lighting */
.ambient-1 {
  position: absolute;
  top: -120px;
  left: 20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(99, 102, 241, 0) 70%);
  filter: blur(60px);
  pointer-events: none;
}
.ambient-2 {
  position: absolute;
  top: 150px;
  right: 10%;
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.22) 0%, rgba(236, 72, 153, 0) 70%);
  filter: blur(70px);
  pointer-events: none;
}
.ambient-3 {
  position: absolute;
  bottom: -150px;
  left: 45%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(56, 189, 248, 0) 70%);
  filter: blur(80px);
  pointer-events: none;
}

/* Header section */
.header {
  position: relative;
  z-index: 10;
}
.brand-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}
.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
}
.logo-icon svg {
  width: 26px;
  height: 26px;
  fill: none;
  stroke: #ffffff;
  stroke-width: 2;
}
.title {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(180deg, #ffffff 30%, rgba(255, 255, 255, 0.75) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.version-badge {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #38bdf8;
  letter-spacing: 0.02em;
}
.tagline {
  font-size: 18px;
  color: #a1a1aa;
  font-weight: 400;
  max-width: 760px;
  line-height: 1.45;
}

/* Showcase grid */
.showcase {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
  margin: 18px 0;
}

/* Cards */
.preview-card {
  border-radius: 20px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  position: relative;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s;
}

/* Card 1: ios-glass toast */
.card-ios {
  background: rgba(30, 30, 36, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
/* Card 2: liquid-glass prompt dialog */
.card-liquid {
  background: rgba(20, 24, 38, 0.72);
  border: 1px solid rgba(130, 180, 255, 0.25);
  box-shadow: 0 20px 45px rgba(10, 20, 50, 0.45);
}
/* Card 3: aurora toast */
.card-aurora {
  background: rgba(25, 20, 35, 0.72);
  border: 1px solid rgba(244, 114, 182, 0.25);
  box-shadow: 0 16px 40px rgba(168, 85, 247, 0.25);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.status-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-success {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}
.icon-prompt {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}
.icon-aurora {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.01em;
}
.card-desc {
  font-size: 13.5px;
  color: #a1a1aa;
  line-height: 1.4;
  margin-bottom: 14px;
}

.pill-tag {
  align-self: flex-start;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}
.pill-ios { background: rgba(255, 255, 255, 0.12); color: #e4e4e7; }
.pill-liquid { background: rgba(56, 189, 248, 0.18); color: #38bdf8; }
.pill-aurora { background: rgba(244, 114, 182, 0.18); color: #f472b6; }

.action-row {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 6px;
}
.btn {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}
.btn-primary {
  background: #38bdf8;
  color: #090a0f;
}
.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.progress-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 10px;
}
.progress-fill {
  height: 100%;
  width: 65%;
  background: linear-gradient(90deg, #ec4899, #a855f7);
}

/* Footer section */
.footer {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.feature-list {
  display: flex;
  gap: 20px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #d4d4d8;
}
.feature-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
}
.frameworks {
  font-size: 13.5px;
  color: #71717a;
  font-weight: 500;
}
.frameworks span {
  color: #a1a1aa;
}
</style>
</head>
<body>
  <div class="ambient-1"></div>
  <div class="ambient-2"></div>
  <div class="ambient-3"></div>

  <div class="header">
    <div class="brand-row">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <div class="title">toastory</div>
      <div class="version-badge">v0.1.0 · TypeScript</div>
    </div>
    <div class="tagline">
      Complete UI feedback toolkit: toast notifications, confirm / prompt / alert dialogs, sheets and loading overlays with frosted glass design.
    </div>
  </div>

  <div class="showcase">
    <!-- Card 1: iOS Glass Toast -->
    <div class="preview-card card-ios">
      <div>
        <div class="pill-tag pill-ios">ios-glass theme</div>
        <div class="card-top">
          <div class="status-icon icon-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="card-title">Deployment Complete</div>
        </div>
        <div class="card-desc">All 4 edge regions synchronized in 412ms without downtime.</div>
      </div>
      <div class="action-row">
        <button class="btn btn-secondary">Logs</button>
        <button class="btn btn-primary">Open</button>
      </div>
    </div>

    <!-- Card 2: Liquid Glass Dialog -->
    <div class="preview-card card-liquid">
      <div>
        <div class="pill-tag pill-liquid">liquid-glass prompt</div>
        <div class="card-top">
          <div class="status-icon icon-prompt">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="card-title">Project Renamed</div>
        </div>
        <div class="card-desc">Async result resolved: "glazekit-production" validated with 0 errors.</div>
      </div>
      <div class="action-row">
        <button class="btn btn-secondary">Dismiss</button>
        <button class="btn btn-primary">Confirm</button>
      </div>
    </div>

    <!-- Card 3: Aurora Theme Toast -->
    <div class="preview-card card-aurora">
      <div>
        <div class="pill-tag pill-aurora">aurora theme</div>
        <div class="card-top">
          <div class="status-icon icon-aurora">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
          </div>
          <div class="card-title">Syncing Cloud Database</div>
        </div>
        <div class="card-desc">Transferring 1,240 records with automatic retry on disconnect.</div>
      </div>
      <div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="feature-list">
      <div class="feature-item"><span class="feature-dot"></span> 0 Runtime Dependencies</div>
      <div class="feature-item"><span class="feature-dot"></span> &lt; 6 KB Gzip Core</div>
      <div class="feature-item"><span class="feature-dot"></span> WCAG 2.2 AA Contrast Verified</div>
      <div class="feature-item"><span class="feature-dot"></span> 21 Frosted Themes</div>
    </div>
    <div class="frameworks">
      <span>React · Next.js · Vue · Nuxt · Angular · Svelte · Native</span>
    </div>
  </div>
</body>
</html>`;

await page.setContent(html);
await page.waitForTimeout(300);

await page.screenshot({
  path: outputPath,
  clip: { x: 0, y: 0, width: 1280, height: 640 },
});

await browser.close();
console.log(`✓ Social preview successfully saved to ${outputPath}`);

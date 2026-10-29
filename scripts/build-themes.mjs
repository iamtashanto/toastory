// Generates dist/themes/<name>.css (toast + dialog) and dist/themes/<name>.toast.css (toast only).
import { Buffer } from 'node:buffer';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, transform } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist', 'themes');

async function loadTs(filePath) {
  const res = await build({
    entryPoints: [filePath],
    bundle: true,
    format: 'esm',
    write: false,
  });
  const code = res.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}

const { themeCss } = await loadTs(join(root, 'src/themes/css.ts'));
const { THEMES } = await loadTs(join(root, 'src/themes/themes.ts'));

const minify = async (css) => (await transform(css, { loader: 'css', minify: true })).code;

const baseToast = await readFile(join(root, 'src/themes/base-toast.css'), 'utf8');
const baseDialog = await readFile(join(root, 'src/themes/base-dialog.css'), 'utf8');

await mkdir(out, { recursive: true });
await writeFile(join(out, '_base.toast.css'), await minify(baseToast));
await writeFile(join(out, '_base.dialog.css'), await minify(baseDialog));
await writeFile(join(out, '_base.css'), await minify(baseToast + baseDialog));
for (const def of THEMES) {
  const own = themeCss(def);
  await writeFile(join(out, `${def.name}.toast.css`), await minify(baseToast + own));
  await writeFile(join(out, `${def.name}.dialog.css`), await minify(baseDialog + own));
  await writeFile(join(out, `${def.name}.css`), await minify(baseToast + baseDialog + own));
}
console.log(`themes: wrote ${THEMES.length * 3 + 3} files to dist/themes`);

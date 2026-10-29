// Generates dist/themes/<name>.css (toast + dialog) and dist/themes/<name>.toast.css (toast only).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';
import { themeCss } from '../src/themes/css.ts';
import { THEMES } from '../src/themes/themes.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist', 'themes');

const minify = async (css) => (await transform(css, { loader: 'css', minify: true })).code;

const baseToast = await readFile(join(root, 'src/themes/base-toast.css'), 'utf8');
const baseDialog = await readFile(join(root, 'src/themes/base-dialog.css'), 'utf8');

await mkdir(out, { recursive: true });
await writeFile(join(out, '_base.toast.css'), await minify(baseToast));
await writeFile(join(out, '_base.css'), await minify(baseToast + baseDialog));
for (const def of THEMES) {
  const own = themeCss(def);
  await writeFile(join(out, `${def.name}.toast.css`), await minify(baseToast + own));
  await writeFile(join(out, `${def.name}.css`), await minify(baseToast + baseDialog + own));
}
console.log(`themes: wrote ${THEMES.length * 2 + 2} files to dist/themes`);

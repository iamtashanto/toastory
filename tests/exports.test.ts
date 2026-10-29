import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { beforeAll, describe, expect, it } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

describe('Package Subpath Exports Verification', () => {
  beforeAll(() => {
    if (!existsSync(join(root, 'dist/index.js')) || !existsSync(join(root, 'dist/index.cjs'))) {
      execSync('npm run build', { cwd: root, stdio: 'pipe' });
    }
  });

  const subpaths = [
    {
      name: '.',
      esm: './dist/index.js',
      cjs: './dist/index.cjs',
      check: (m: Record<string, unknown>) => Boolean(m.ui && m.toast),
    },
    {
      name: './core',
      esm: './dist/core.js',
      cjs: './dist/core.cjs',
      check: (m: Record<string, unknown>) => Boolean(m.createToastEngine),
    },
    {
      name: './react',
      esm: './dist/react.js',
      cjs: './dist/react.cjs',
      check: (m: Record<string, unknown>) => Boolean(m.Toaster),
    },
    {
      name: './vue',
      esm: './dist/vue.js',
      cjs: './dist/vue.cjs',
      check: (m: Record<string, unknown>) => Boolean(m.ToastoryToaster || m.GlazeToaster),
    },
    {
      name: './angular',
      esm: './dist/angular.js',
      cjs: './dist/angular.cjs',
      check: (m: Record<string, unknown>) =>
        Boolean(m.ToastoryToasterComponent || m.GlazeToasterComponent),
    },
    {
      name: './svelte',
      esm: './dist/svelte.js',
      cjs: './dist/svelte.cjs',
      check: (m: Record<string, unknown>) => Boolean(m.toasts),
    },
    {
      name: './native',
      esm: './dist/native.js',
      cjs: './dist/native.cjs',
      check: (m: Record<string, unknown>) => Boolean(m.toast),
    },
  ];

  for (const { name, esm, cjs, check } of subpaths) {
    it(`imports ${name} in ESM format`, async () => {
      const mod = await import(join(root, esm));
      expect(mod).toBeDefined();
      expect(check(mod)).toBeTruthy();
    });

    it(`requires ${name} in CommonJS format`, () => {
      const mod = require(join(root, cjs));
      expect(mod).toBeDefined();
      expect(check(mod)).toBeTruthy();
    });
  }
});

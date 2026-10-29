import { composite, contrast, flatten, parseColor } from '../src/themes/color.ts';
import { THEMES } from '../src/themes/themes.ts';
import type { ThemeTokens } from '../src/themes/themes.ts';

interface ContrastResult {
  theme: string;
  mode: string;
  property: string;
  backdrop: string;
  ratio: number;
  threshold: number;
  passed: boolean;
}

const BACKDROPS = ['#ffffff', '#000000'];
const TYPE_KEYS = ['success', 'error', 'warning', 'info'] as const;

export function evaluateContrast(): {
  results: ContrastResult[];
  failures: ContrastResult[];
  totalChecks: number;
} {
  const results: ContrastResult[] = [];
  const failures: ContrastResult[] = [];

  for (const theme of THEMES) {
    const themeModes: [string, ThemeTokens][] = [
      ['light', theme.light],
      ['dark', theme.dark],
    ];

    for (const [mode, tokens] of themeModes) {
      const solid = parseColor(tokens.solid);

      // Check solid fallback
      const fgSolidRatio = contrast(parseColor(tokens.fg), solid);
      results.push({
        theme: theme.name,
        mode,
        property: 'fg on solid',
        backdrop: tokens.solid,
        ratio: fgSolidRatio,
        threshold: 4.5,
        passed: fgSolidRatio >= 4.5,
      });

      const mutSolidRatio = contrast(parseColor(tokens.muted), solid);
      results.push({
        theme: theme.name,
        mode,
        property: 'muted on solid',
        backdrop: tokens.solid,
        ratio: mutSolidRatio,
        threshold: 4.5,
        passed: mutSolidRatio >= 4.5,
      });

      // Check button text contrast
      const btnAccentRatio = contrast(parseColor(tokens.accentFg), parseColor(tokens.accent));
      results.push({
        theme: theme.name,
        mode,
        property: 'accentFg on accent',
        backdrop: tokens.accent,
        ratio: btnAccentRatio,
        threshold: 4.5,
        passed: btnAccentRatio >= 4.5,
      });

      const btnDangerRatio = contrast(parseColor(tokens.dangerFg), parseColor(tokens.danger));
      results.push({
        theme: theme.name,
        mode,
        property: 'dangerFg on danger',
        backdrop: tokens.danger,
        ratio: btnDangerRatio,
        threshold: 4.5,
        passed: btnDangerRatio >= 4.5,
      });

      // Check translucent surface over white and black backdrops
      for (const backdrop of BACKDROPS) {
        const surface = flatten(tokens.bg, backdrop);

        // Body and subtitle text (WCAG AA: >= 4.5:1)
        const fgRatio = contrast(parseColor(tokens.fg), surface);
        results.push({
          theme: theme.name,
          mode,
          property: 'fg on surface',
          backdrop,
          ratio: fgRatio,
          threshold: 4.5,
          passed: fgRatio >= 4.5,
        });

        const mutRatio = contrast(parseColor(tokens.muted), surface);
        results.push({
          theme: theme.name,
          mode,
          property: 'muted on surface',
          backdrop,
          ratio: mutRatio,
          threshold: 4.5,
          passed: mutRatio >= 4.5,
        });

        const accRatio = contrast(parseColor(tokens.accent), surface);
        results.push({
          theme: theme.name,
          mode,
          property: 'accent text on surface',
          backdrop,
          ratio: accRatio,
          threshold: 4.5,
          passed: accRatio >= 4.5,
        });

        const errRatio = contrast(parseColor(tokens.error), surface);
        results.push({
          theme: theme.name,
          mode,
          property: 'error text on surface',
          backdrop,
          ratio: errRatio,
          threshold: 4.5,
          passed: errRatio >= 4.5,
        });

        // UI status icons (WCAG AA UI components: >= 3.0:1)
        for (const key of TYPE_KEYS) {
          const iconRatio = contrast(parseColor(tokens[key]), surface);
          results.push({
            theme: theme.name,
            mode,
            property: `${key} icon on surface`,
            backdrop,
            ratio: iconRatio,
            threshold: 3.0,
            passed: iconRatio >= 3.0,
          });
        }

        // Rich colors tint test: tinted translucent glass over backdrop
        const alpha = Math.max(0.16, theme.tint ?? 0);
        for (const key of TYPE_KEYS) {
          const tint = { ...parseColor(tokens[key]), a: alpha };
          const tintedSurface = composite(tint, surface);

          const tintedFgRatio = contrast(parseColor(tokens.fg), tintedSurface);
          results.push({
            theme: theme.name,
            mode,
            property: `fg on ${key}-tinted surface`,
            backdrop,
            ratio: tintedFgRatio,
            threshold: 4.5,
            passed: tintedFgRatio >= 4.5,
          });

          const tintedMutRatio = contrast(parseColor(tokens.muted), tintedSurface);
          results.push({
            theme: theme.name,
            mode,
            property: `muted on ${key}-tinted surface`,
            backdrop,
            ratio: tintedMutRatio,
            threshold: 4.5,
            passed: tintedMutRatio >= 4.5,
          });
        }
      }
    }
  }

  for (const r of results) {
    if (!r.passed) failures.push(r);
  }

  return { results, failures, totalChecks: results.length };
}

function run(): void {
  console.log('--- toastory Contrast Verification Tool (WCAG 2.2 AA) ---');
  const { failures, totalChecks } = evaluateContrast();

  const themesCount = THEMES.length;
  console.log(
    `Evaluated ${themesCount} themes across light and dark modes over white and black backdrops.`,
  );
  console.log(`Total contrast assertions evaluated: ${totalChecks}`);

  if (failures.length > 0) {
    console.error(`\n✖ FAIL: ${failures.length} contrast violations found:\n`);
    for (const f of failures) {
      console.error(
        `  - [${f.theme}] (${f.mode}) ${f.property} over ${f.backdrop}: ${f.ratio.toFixed(2)}:1 (required >= ${f.threshold}:1)`,
      );
    }
    process.exit(1);
  }

  console.log(
    `✓ SUCCESS: 0 violations found. All ${totalChecks} color contrast combinations satisfy WCAG 2.2 AA!`,
  );
}

if (process.argv[1]?.endsWith('contrast.ts') || process.argv[1]?.endsWith('contrast.js')) {
  run();
}

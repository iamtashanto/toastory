import { describe, expect, it } from 'vitest';
import { composite, contrast, flatten, parseColor, toHex } from '../src/themes/color';
import { themeCss } from '../src/themes/css';
import { THEMES } from '../src/themes/themes';
import type { ThemeTokens } from '../src/themes/themes';

const EXPECTED = [
  'ios-glass',
  'liquid-glass',
  'aurora',
  'classic-stack',
  'classic-bar',
  'pill',
  'ripple',
  'gradient-strip',
  'sweet',
  'material',
  'basic',
  'minimal',
  'flat',
  'outline',
  'neon',
  'gradient',
  'brutal',
  'pastel',
];

const modes = (def: (typeof THEMES)[number]): [string, ThemeTokens][] => [
  ['light', def.light],
  ['dark', def.dark],
];

/** Backdrops a translucent surface can end up over. */
const BACKDROPS = ['#ffffff', '#000000'];

describe('color math', () => {
  it('parses hex and rgba, composites and computes contrast', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('#00000080').a).toBeCloseTo(0.5, 1);
    expect(parseColor('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
    expect(toHex(flatten('rgba(255,255,255,0.5)', '#000000'))).toBe('#808080');
    expect(contrast(parseColor('#000'), parseColor('#fff'))).toBeCloseTo(21, 0);
    expect(composite(parseColor('rgba(0,0,0,0)'), parseColor('#123456')).r).toBe(0x12);
    expect(() => parseColor('hotpink')).toThrow();
  });
});

describe('theme set', () => {
  it('ships exactly the required themes, each with light and dark tokens', () => {
    expect(THEMES.map((t) => t.name)).toEqual(EXPECTED);
    for (const theme of THEMES) {
      expect(theme.light.bg).toBeTruthy();
      expect(theme.dark.bg).toBeTruthy();
    }
  });

  it('generates light, dark and auto blocks defining every required token', () => {
    const required = [
      '--gk-bg',
      '--gk-fg',
      '--gk-muted',
      '--gk-border',
      '--gk-radius',
      '--gk-blur',
      '--gk-saturate',
      '--gk-shadow',
      '--gk-success',
      '--gk-error',
      '--gk-warning',
      '--gk-info',
      '--gk-accent',
    ];
    for (const theme of THEMES) {
      const css = themeCss(theme);
      expect(css).toContain(`[data-gk-theme="${theme.name}"]{`);
      expect(css).toContain(`[data-gk-theme="${theme.name}"][data-gk-mode="dark"]`);
      expect(css).toContain(`[data-gk-mode="auto"]`);
      expect(css).toContain('prefers-color-scheme:dark');
      for (const token of required) expect(css, `${theme.name} ${token}`).toContain(`${token}:`);
      expect(css).not.toContain('&');
    }
  });
});

describe('theme contrast (WCAG 2.2 AA)', () => {
  for (const theme of THEMES) {
    for (const [mode, t] of modes(theme)) {
      it(`${theme.name} ${mode}: text on surface is at least 4.5:1`, () => {
        const solid = parseColor(t.solid);
        expect(contrast(parseColor(t.fg), solid), 'fg on solid').toBeGreaterThanOrEqual(4.5);
        expect(contrast(parseColor(t.muted), solid), 'muted on solid').toBeGreaterThanOrEqual(4.5);
        for (const backdrop of BACKDROPS) {
          const surface = flatten(t.bg, backdrop);
          expect(contrast(parseColor(t.fg), surface), `fg on bg over ${backdrop}`).toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseColor(t.muted), surface), `muted on bg over ${backdrop}`).toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseColor(t.accent), surface), `accent text over ${backdrop}`).toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseColor(t.error), surface), `error text over ${backdrop}`).toBeGreaterThanOrEqual(4.5);
        }
      });

      it(`${theme.name} ${mode}: buttons and status icons meet contrast`, () => {
        expect(contrast(parseColor(t.accentFg), parseColor(t.accent)), 'accent button').toBeGreaterThanOrEqual(4.5);
        expect(contrast(parseColor(t.dangerFg), parseColor(t.danger)), 'danger button').toBeGreaterThanOrEqual(4.5);
        for (const backdrop of BACKDROPS) {
          const surface = flatten(t.bg, backdrop);
          for (const key of ['success', 'error', 'warning', 'info'] as const) {
            expect(contrast(parseColor(t[key]), surface), `${key} icon over ${backdrop}`).toBeGreaterThanOrEqual(3);
          }
        }
      });

      it(`${theme.name} ${mode}: rich and tinted surfaces keep text readable`, () => {
        const alpha = Math.max(0.16, theme.tint ?? 0);
        for (const key of ['success', 'error', 'warning', 'info'] as const) {
          const tint = { ...parseColor(t[key]), a: alpha };
          const surface = composite(tint, flatten(t.bg, '#ffffff'));
          const dark = composite(tint, flatten(t.bg, '#000000'));
          expect(contrast(parseColor(t.fg), surface), `${key} fg tint`).toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseColor(t.muted), surface), `${key} muted tint`).toBeGreaterThanOrEqual(4.5);
          expect(contrast(parseColor(t.fg), dark), `${key} fg tint dark backdrop`).toBeGreaterThanOrEqual(4.5);
        }
      });
    }
  }
});


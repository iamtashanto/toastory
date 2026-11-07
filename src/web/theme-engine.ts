import { themeCss } from '../themes/css.ts';
import type { ThemeDefinition, ThemeTokens } from '../themes/themes.ts';

const W = '#ffffff';
const R = '#b71c1c';
const D = '#1c1c1e';
const sh = (a: number) => `0 8px 28px rgba(0,0,0,${a})`;
const mk = (
  bg: string,
  fg: string,
  muted: string,
  border: string,
  s: number,
  accent: string,
  accentFg: string,
  danger: string,
  dangerFg: string,
  success: string,
  error: string,
  warning: string,
  info: string,
): ThemeTokens => ({
  bg,
  solid: bg,
  fg,
  muted,
  border,
  shadow: sh(s),
  accent,
  accentFg,
  danger,
  dangerFg,
  success,
  error,
  warning,
  info,
});

const DEFAULT_LIGHT = mk(
  W,
  '#1d1d1f',
  '#515156',
  'rgba(60,60,67,0.22)',
  0.14,
  '#0057c2',
  W,
  R,
  W,
  '#1a7f37',
  R,
  '#8a5a00',
  '#0b5cc7',
);
const DEFAULT_DARK = mk(
  D,
  '#f5f5f7',
  '#b4b4bb',
  'rgba(255,255,255,0.16)',
  0.5,
  '#4da3ff',
  '#00152e',
  '#ff8a8a',
  '#2b0000',
  '#4ade80',
  '#ff7b7b',
  '#ffc857',
  '#6cb6ff',
);

/** Options for registering a custom theme via `ui.defineTheme()`. */
export interface CustomThemeDefinition {
  radius?: string;
  blur?: string;
  saturate?: string;
  font?: string;
  ease?: string;
  duration?: string;
  borderWidth?: string;
  tokens?:
    | {
        light?: Partial<ThemeTokens>;
        dark?: Partial<ThemeTokens>;
      }
    | Partial<ThemeTokens>;
  light?: Partial<ThemeTokens>;
  dark?: Partial<ThemeTokens>;
  css?: string;
  supportedVariants?: readonly string[];
}

const customThemes = new Map<string, ThemeDefinition>();

/**
 * Defines a custom theme. Compiles the tokens to CSS, registers the theme name with toastory,
 * and automatically injects a `<style data-gk-theme="<name>">` element when called in the browser.
 *
 * @returns The compiled CSS string.
 */
export function defineTheme(name: string, def: CustomThemeDefinition): string {
  const t = def.tokens as { light?: Partial<ThemeTokens>; dark?: Partial<ThemeTokens> } | undefined;
  const lightInput =
    def.light ?? (t && ('light' in t || 'dark' in t) ? t.light : (t as Partial<ThemeTokens>));
  const darkInput = def.dark ?? (t && 'dark' in t ? t.dark : undefined);

  const fullDef: ThemeDefinition = {
    radius: '16px',
    blur: '16px',
    saturate: '160%',
    ...def,
    name,
    light: { ...DEFAULT_LIGHT, ...lightInput },
    dark: { ...DEFAULT_DARK, ...darkInput },
  };

  customThemes.set(name, fullDef);
  const css = themeCss(fullDef);

  if (typeof document !== 'undefined') {
    const sel = `style[data-gk-theme="${name}"]`;
    let styleEl = document.querySelector<HTMLStyleElement>(sel);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('data-gk-theme', name);
      document.head.append(styleEl);
    }
    styleEl.textContent = css;
  }

  return css;
}

/** Returns a custom theme definition if registered. */
export function getCustomTheme(name: string): ThemeDefinition | undefined {
  return customThemes.get(name);
}

/** Clears registered custom themes. Used for testing. */
export function clearCustomThemes(): void {
  if (typeof document !== 'undefined') {
    for (const name of customThemes.keys()) {
      document.querySelector(`style[data-gk-theme="${name}"]`)?.remove();
    }
  }
  customThemes.clear();
}

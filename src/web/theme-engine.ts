import { themeCss } from '../themes/css.ts';
import type { ThemeDefinition, ThemeTokens } from '../themes/themes.ts';

const mkTokens = (
  bg: string,
  fg: string,
  muted: string,
  border: string,
  shadow: string,
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
  shadow,
  accent,
  accentFg,
  danger,
  dangerFg,
  success,
  error,
  warning,
  info,
});

const DEFAULT_LIGHT: ThemeTokens = mkTokens(
  '#ffffff',
  '#1d1d1f',
  '#515156',
  'rgba(60,60,67,0.22)',
  '0 8px 28px rgba(0,0,0,0.14)',
  '#0057c2',
  '#ffffff',
  '#b71c1c',
  '#ffffff',
  '#1a7f37',
  '#b71c1c',
  '#8a5a00',
  '#0b5cc7',
);

const DEFAULT_DARK: ThemeTokens = mkTokens(
  '#1c1c1e',
  '#f5f5f7',
  '#b4b4bb',
  'rgba(255,255,255,0.16)',
  '0 8px 28px rgba(0,0,0,0.5)',
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
 * Defines a custom theme. Compiles the tokens to CSS, registers the theme name with glazekit,
 * and automatically injects a `<style data-gk-theme="<name>">` element when called in the browser.
 *
 * @returns The compiled CSS string.
 */
export function defineTheme(name: string, def: CustomThemeDefinition): string {
  const tokenObj = def.tokens;
  const lightInput =
    def.light ??
    (tokenObj && typeof tokenObj === 'object' && 'light' in tokenObj
      ? (tokenObj as { light?: Partial<ThemeTokens> }).light
      : (tokenObj as Partial<ThemeTokens> | undefined));

  const darkInput =
    def.dark ??
    (tokenObj && typeof tokenObj === 'object' && 'dark' in tokenObj
      ? (tokenObj as { dark?: Partial<ThemeTokens> }).dark
      : undefined);

  const fullDef: ThemeDefinition = {
    name,
    radius: def.radius ?? '16px',
    blur: def.blur ?? '16px',
    saturate: def.saturate ?? '160%',
    font: def.font,
    ease: def.ease,
    duration: def.duration,
    borderWidth: def.borderWidth,
    light: { ...DEFAULT_LIGHT, ...lightInput },
    dark: { ...DEFAULT_DARK, ...darkInput },
    css: def.css,
    supportedVariants: def.supportedVariants,
  };

  customThemes.set(name, fullDef);
  const css = themeCss(fullDef);

  if (typeof document !== 'undefined') {
    let styleEl = document.querySelector<HTMLStyleElement>(`style[data-gk-theme="${name}"]`);
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

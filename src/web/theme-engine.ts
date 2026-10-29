import { themeCss } from '../themes/css.ts';
import type { ThemeDefinition, ThemeTokens } from '../themes/themes.ts';

const DEFAULT_LIGHT: ThemeTokens = {
  bg: '#ffffff',
  solid: '#ffffff',
  fg: '#1d1d1f',
  muted: '#515156',
  border: 'rgba(60,60,67,0.22)',
  shadow: '0 8px 28px rgba(0,0,0,0.14)',
  accent: '#0057c2',
  accentFg: '#ffffff',
  danger: '#b71c1c',
  dangerFg: '#ffffff',
  success: '#1a7f37',
  error: '#b71c1c',
  warning: '#8a5a00',
  info: '#0b5cc7',
};

const DEFAULT_DARK: ThemeTokens = {
  bg: '#1c1c1e',
  solid: '#1c1c1e',
  fg: '#f5f5f7',
  muted: '#b4b4bb',
  border: 'rgba(255,255,255,0.16)',
  shadow: '0 8px 28px rgba(0,0,0,0.5)',
  accent: '#4da3ff',
  accentFg: '#00152e',
  danger: '#ff8a8a',
  dangerFg: '#2b0000',
  success: '#4ade80',
  error: '#ff7b7b',
  warning: '#ffc857',
  info: '#6cb6ff',
};

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

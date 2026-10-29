import type { ThemeDefinition, ThemeTokens } from '../themes.ts';
import { css as iosCss, variants } from '../ios-glass/tokens.ts';

const SYSTEM =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, system-ui, sans-serif';

export const tokensLight: ThemeTokens = {
  bg: 'rgba(255, 255, 255, 0.74)',
  solid: '#ffffff',
  fg: '#0a0a0c',
  muted: '#2c2c32',
  border: 'rgba(255, 255, 255, 0.65)',
  shadow:
    '0 14px 44px rgba(0, 0, 0, 0.16), inset 0 1.5px 0 rgba(255, 255, 255, 0.95), inset 0 3px 8px rgba(255, 255, 255, 0.35), inset 0 -1px 0 rgba(255, 255, 255, 0.25)',
  accent: '#003d8f',
  accentFg: '#ffffff',
  danger: '#8a0a0a',
  dangerFg: '#ffffff',
  success: '#0d5926',
  error: '#8a0a0a',
  warning: '#5e3a00',
  info: '#003f8a',
};

export const tokensDark: ThemeTokens = {
  bg: 'rgba(24, 24, 28, 0.74)',
  solid: '#1c1c20',
  fg: '#ffffff',
  muted: '#f0f0f6',
  border: 'rgba(255, 255, 255, 0.22)',
  shadow:
    '0 16px 48px rgba(0, 0, 0, 0.6), inset 0 1.5px 0 rgba(255, 255, 255, 0.3), inset 0 3px 8px rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(255, 255, 255, 0.06)',
  accent: '#b0dcff',
  accentFg: '#00152e',
  danger: '#ff9494',
  dangerFg: '#2b0000',
  success: '#6ae69a',
  error: '#ffc2c2',
  warning: '#ffd470',
  info: '#a8d8ff',
};

export const css =
  `.gk-toast&,.gk-dialog&,.gk-sheet&,.gk-bsheet&{background-image:radial-gradient(ellipse 90% 60% at 50% -20%,rgba(255,255,255,.32),transparent 70%),radial-gradient(ellipse 60% 40% at 50% 120%,rgba(255,255,255,.08),transparent 70%)}` +
  `.gk-toast&[data-gk-variant="pill"],.gk-toast&.gk-toast--pill{border-radius:9999px;padding:8px 18px}` +
  iosCss;

export const liquidGlassTheme: ThemeDefinition = {
  name: 'liquid-glass',
  radius: '28px',
  blur: '32px',
  saturate: '200%',
  font: SYSTEM,
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
  duration: '360ms',
  light: tokensLight,
  dark: tokensDark,
  css,
  supportedVariants: variants,
};

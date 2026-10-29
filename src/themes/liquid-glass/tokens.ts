import type { ThemeDefinition, ThemeTokens } from '../themes.ts';
import { css as iosCss, variants } from '../ios-glass/tokens.ts';

const SYSTEM =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, system-ui, sans-serif';

export const tokensLight: ThemeTokens = {
  bg: 'rgba(255, 255, 255, 0.88)',
  solid: '#f2f2f7',
  fg: '#0a0a0d',
  muted: '#33333a',
  border: 'rgba(255, 255, 255, 0.55)',
  shadow:
    '0 14px 44px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(255, 255, 255, 0.25)',
  accent: '#0057c2',
  accentFg: '#ffffff',
  danger: '#b71c1c',
  dangerFg: '#ffffff',
  success: '#1a7f37',
  error: '#b71c1c',
  warning: '#8a5a00',
  info: '#0b5cc7',
};

export const tokensDark: ThemeTokens = {
  bg: 'rgba(24, 24, 28, 0.88)',
  solid: '#1c1c20',
  fg: '#f5f5f7',
  muted: '#d0d0d8',
  border: 'rgba(255, 255, 255, 0.2)',
  shadow:
    '0 14px 44px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(255, 255, 255, 0.05)',
  accent: '#4da3ff',
  accentFg: '#00152e',
  danger: '#ff8a8a',
  dangerFg: '#2b0000',
  success: '#4ade80',
  error: '#ff7b7b',
  warning: '#ffc857',
  info: '#6cb6ff',
};

export const css =
  '.gk-toast&::before,.gk-dialog&::before,.gk-sheet&::before,.gk-bsheet&::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.22),rgba(255,255,255,0) 45%)}.gk-dialog&,.gk-sheet&,.gk-bsheet&{isolation:isolate}' +
  iosCss;

export const liquidGlassTheme: ThemeDefinition = {
  name: 'liquid-glass',
  radius: '28px',
  blur: '36px',
  saturate: '220%',
  font: SYSTEM,
  light: tokensLight,
  dark: tokensDark,
  css,
  supportedVariants: variants,
};


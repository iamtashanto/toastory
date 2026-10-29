import type { ThemeDefinition, ThemeTokens } from '../themes.ts';

export const tokensLight: ThemeTokens = {
  bg: '#ffffff',
  solid: '#ffffff',
  fg: '#18181b',
  muted: '#52525b',
  border: '#e4e4e7',
  shadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  accent: '#1d4ed8',
  accentFg: '#ffffff',
  danger: '#b91c1c',
  dangerFg: '#ffffff',
  success: '#15803d',
  error: '#b91c1c',
  warning: '#92400e',
  info: '#1d4ed8',
};

export const tokensDark: ThemeTokens = {
  bg: '#18181b',
  solid: '#18181b',
  fg: '#f4f4f5',
  muted: '#b4b4bc',
  border: '#27272a',
  shadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
  accent: '#60a5fa',
  accentFg: '#0f172a',
  danger: '#f87171',
  dangerFg: '#450a0a',
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
};

export const variants = [
  'minimal',
  'success',
  'error',
  'warning',
  'accent-bar',
  'badge-title',
  'progress-bar',
  'pill',
  'undo-bar',
  'inline-confirm',
  'loading-percent',
  'avatar',
] as const;

export const css = `
.gk-toast&[data-gk-variant="accent-bar"]{border-inline-start:4px solid var(--gk-type,var(--gk-accent));padding-inline-start:18px}
.gk-toast&[data-gk-variant="pill"]{border-radius:9999px;padding:10px 20px;align-items:center}
.gk-toast&[data-gk-variant="badge-title"] .gk-badge{width:32px;height:32px;border-radius:8px;background:color-mix(in srgb,var(--gk-type,var(--gk-accent)) 14%,transparent);display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="minimal"]{padding:10px 14px;box-shadow:none}
.gk-toast&[data-gk-variant="loading-percent"] .gk-percent{margin-left:auto;font-size:12px;font-weight:600;padding:2px 8px;border-radius:99px;background:color-mix(in srgb,var(--gk-type,var(--gk-accent)) 14%,transparent);color:var(--gk-type,var(--gk-accent))}
.gk-toast&[data-gk-variant="undo-bar"] .gk-action{font-weight:600;color:var(--gk-accent)}
.gk-toast&[data-gk-variant="inline-confirm"] .gk-actions{display:flex;gap:8px;margin-top:10px}
.gk-toast&[data-gk-variant="avatar"] .gk-avatar{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-weight:600;font-size:13px;flex:none}
`;

export const essentialsTheme: ThemeDefinition = {
  name: 'essentials',
  radius: '14px',
  blur: '0px',
  saturate: '100%',
  font: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, "Segoe UI", Roboto, sans-serif',
  light: tokensLight,
  dark: tokensDark,
  css,
  supportedVariants: variants,
};

import type { ThemeDefinition, ThemeTokens } from '../themes.ts';

const SYSTEM =
  'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif';

export const tokensLight: ThemeTokens = {
  bg: '#ffffff',
  solid: '#ffffff',
  fg: '#18181b',
  muted: '#52525b',
  border: '#e4e4e7',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
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
  bg: '#17171c',
  solid: '#17171c',
  fg: '#f4f4f5',
  muted: '#b4b4bc',
  border: '#2c2c34',
  shadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
  accent: '#60a5fa',
  accentFg: '#0b1a3a',
  danger: '#f87171',
  dangerFg: '#300303',
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
};

export const variants = [
  'warning-confirm',
  'danger-confirm',
  'type-to-confirm',
  'rename-prompt',
  'success',
  'update-info',
  'dark-logout',
  'ios-glass-alert',
  'bottom-sheet-confirm',
  'reauth-password',
  'otp-code',
  'session-countdown',
] as const;

export const css = `
.gk-dialog&{text-align:center;padding:24px 22px 20px;border-radius:20px}
.gk-dialog&[data-gk-variant="type-to-confirm"],.gk-dialog&[data-gk-variant="rename-prompt"],.gk-dialog&[data-gk-variant="reauth-password"]{text-align:left}
.gk-dialog-badge{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;margin:0 auto 14px}
.gk-dialog-badge[data-tone="warning"]{background:#fef3c7;color:#d97706}
.gk-dialog-badge[data-tone="danger"]{background:#fee2e2;color:#dc2626}
.gk-dialog-badge[data-tone="success"]{background:#dcfce7;color:#16a34a}
.gk-dialog-badge[data-tone="info"]{background:#dbeafe;color:#2563eb}
.gk-dialog-badge[data-tone="purple"]{background:#ede9fe;color:#7c3aed}
.gk-dialog-code{background:rgba(128,128,128,.14);border-radius:6px;padding:1px 6px;font-family:ui-monospace,Menlo,monospace;font-size:12.5px;font-weight:600}
.gk-dialog-notice{display:flex;gap:8px;align-items:flex-start;background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:10px;padding:9px 11px;font-size:12.5px;text-align:left;margin-top:14px}
[data-gk-mode="dark"] .gk-dialog-notice{background:rgba(245,158,11,.15);border-color:rgba(245,158,11,.3);color:#fbbf24}
.gk-dialog-notice svg{width:16px;height:16px;flex:none;margin-top:1px}
.gk-dialog-actions[data-layout="stack"]{flex-direction:column}
.gk-dialog-actions[data-layout="divided"]{display:flex;border-top:.5px solid rgba(128,128,128,.25);margin:20px -22px -20px;gap:0}
.gk-dialog-actions[data-layout="divided"] button{flex:1;padding:13px 0;background:transparent;border:none;border-radius:0;font-size:16px;color:var(--gk-accent);cursor:pointer}
.gk-dialog-actions[data-layout="divided"] button+button{border-left:.5px solid rgba(128,128,128,.25);font-weight:600}
.gk-otp{display:flex;gap:8px;justify-content:center;margin-top:18px}
.gk-otp input{width:42px;height:50px;text-align:center;font:inherit;font-size:20px;font-weight:600;border-radius:10px;border:1px solid var(--gk-border);outline:none;background:var(--gk-bg-solid);color:var(--gk-fg)}
.gk-otp input:focus{border-color:var(--gk-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--gk-accent) 25%,transparent)}
.gk-countdown-big{font-size:34px;font-weight:600;letter-spacing:-.03em;margin:10px 0 2px}
.gk-countdown-track{height:5px;border-radius:9px;background:rgba(128,128,128,.2);overflow:hidden;margin-top:16px}
.gk-countdown-fill{display:block;height:100%;background:#f59e0b;transition:width 1s linear}
`;

export const dialogsTheme: ThemeDefinition = {
  name: 'dialogs',
  radius: '20px',
  blur: '0px',
  saturate: '100%',
  font: SYSTEM,
  light: tokensLight,
  dark: tokensDark,
  css,
  supportedVariants: variants,
};


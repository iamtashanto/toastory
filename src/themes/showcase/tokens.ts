import type { ThemeDefinition, ThemeTokens } from '../themes.ts';

export const tokensLight: ThemeTokens = {
  bg: 'rgba(255, 255, 255, 0.92)',
  solid: '#ffffff',
  fg: '#18181b',
  muted: '#52525b',
  border: '#e4e4e7',
  shadow: '0 12px 32px rgba(0, 0, 0, 0.14)',
  accent: '#4338ca',
  accentFg: '#ffffff',
  danger: '#be123c',
  dangerFg: '#ffffff',
  success: '#047857',
  error: '#be123c',
  warning: '#92400e',
  info: '#0369a1',
};

export const tokensDark: ThemeTokens = {
  bg: 'rgba(20, 20, 24, 0.92)',
  solid: '#141418',
  fg: '#f4f4f5',
  muted: '#b4b4bc',
  border: '#2e2e34',
  shadow: '0 14px 34px rgba(0, 0, 0, 0.5)',
  accent: '#818cf8',
  accentFg: '#0f0e26',
  danger: '#fb7185',
  dangerFg: '#2b0008',
  success: '#34d399',
  error: '#fb7185',
  warning: '#fbbf24',
  info: '#38bdf8',
};

export const variants = [
  'glass-gradient',
  'emerald',
  'neon-error',
  'ios-banner',
  'dev-dark',
  'countdown-ring',
  'stacked',
  'upload-card',
  'island',
  'gradient-border',
  'soft-light',
  'message-actions',
] as const;

export const css = `
@keyframes gk-sc-pulse{0%,100%{box-shadow:0 0 0 0 rgba(244,63,94,.5)}50%{box-shadow:0 0 0 7px rgba(244,63,94,0)}}
@keyframes gk-sc-eq{0%,100%{height:4px}50%{height:15px}}
.gk-toast&[data-gk-variant="glass-gradient"]{background:rgba(255,255,255,.14);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.28);color:#fff;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,.25)}
.gk-toast&[data-gk-variant="glass-gradient"] .gk-chip{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.22);display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="emerald"]{background:linear-gradient(135deg,#059669,#10b981);color:#fff;border-radius:14px;box-shadow:0 10px 28px rgba(16,185,129,.4)}
.gk-toast&[data-gk-variant="emerald"] .gk-chip{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.22);display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="neon-error"]{background:#140509;color:#fecdd3;border:1px solid #f43f5e;border-radius:12px;box-shadow:0 0 24px rgba(244,63,94,.45),inset 0 0 14px rgba(244,63,94,.12)}
.gk-toast&[data-gk-variant="neon-error"] .gk-icon{color:#fb7185;animation:gk-sc-pulse 1.8s infinite;border-radius:50%}
.gk-toast&[data-gk-variant="ios-banner"]{background:rgba(250,250,250,.82);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);color:#111;border-radius:22px;box-shadow:0 8px 30px rgba(0,0,0,.14)}
[data-gk-mode="dark"] .gk-toast&[data-gk-variant="ios-banner"]{background:rgba(28,28,32,.78);color:#f4f4f5}
.gk-toast&[data-gk-variant="ios-banner"] .gk-app-chip{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#34d399,#0ea5e9);display:grid;place-items:center;color:#fff;flex:none}
.gk-toast&[data-gk-variant="dev-dark"]{background:#000;color:#ededed;border:1px solid #2e2e2e;border-radius:10px;font-size:13.5px}
.gk-toast&[data-gk-variant="dev-dark"] .gk-dot{width:8px;height:8px;border-radius:50%;background:#3b82f6;flex:none}
.gk-toast&[data-gk-variant="dev-dark"] kbd{margin-left:auto;font:inherit;font-size:11.5px;color:#a1a1a1;border:1px solid #333;border-radius:6px;padding:2px 7px;background:#111}
.gk-toast&[data-gk-variant="countdown-ring"]{border-radius:16px}
.gk-toast&[data-gk-variant="countdown-ring"] .gk-ring-svg{width:30px;height:30px;transform:rotate(-90deg);flex:none}
.gk-toast&[data-gk-variant="upload-card"]{border-radius:16px;flex-wrap:wrap}
.gk-toast&[data-gk-variant="upload-card"] .gk-file-chip{width:38px;height:38px;border-radius:10px;background:#eef2ff;color:#4f46e5;display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="upload-card"] .gk-track{width:100%;height:6px;border-radius:99px;background:#e7e5e4;overflow:hidden;margin-top:6px}
.gk-toast&[data-gk-variant="upload-card"] .gk-track i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#6366f1,#a855f7)}
.gk-toast&[data-gk-variant="island"]{background:#000;color:#fff;border-radius:999px;padding:10px 16px;max-width:360px}
.gk-toast&[data-gk-variant="island"] .gk-art{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#f97316,#ec4899);flex:none}
.gk-toast&[data-gk-variant="island"] .gk-eq{display:flex;gap:3px;align-items:flex-end;height:16px;margin-left:auto}
.gk-toast&[data-gk-variant="island"] .gk-eq i{display:block;width:3px;background:#34d399;border-radius:2px;animation:gk-sc-eq .9s ease-in-out infinite}
.gk-toast&[data-gk-variant="gradient-border"]{padding:1.5px;border-radius:16px;background:linear-gradient(120deg,#f59e0b,#ec4899,#8b5cf6,#3b82f6);box-shadow:0 12px 34px rgba(139,92,246,.4)}
.gk-toast&[data-gk-variant="gradient-border"] .gk-in{background:#0f0f14;color:#f4f4f5;border-radius:14.5px;padding:14px 16px;display:flex;align-items:center;gap:12px;width:100%}
.gk-toast&[data-gk-variant="gradient-border"] .gk-btn{margin-left:auto;background:#fff;color:#111;font-size:12.5px;font-weight:600;border-radius:8px;padding:6px 11px;flex:none}
.gk-toast&[data-gk-variant="soft-light"]{border-radius:14px;border:1px solid #e7e5e4;box-shadow:0 6px 20px rgba(0,0,0,.07)}
.gk-toast&[data-gk-variant="soft-light"] .gk-chip{width:32px;height:32px;border-radius:10px;background:#dcfce7;color:#15803d;display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="message-actions"]{border-radius:16px;padding:14px;flex-wrap:wrap;box-shadow:0 14px 34px rgba(0,0,0,.4)}
.gk-toast&[data-gk-variant="message-actions"] .gk-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#38bdf8,#6366f1);display:grid;place-items:center;font-weight:600;font-size:13px;flex:none;color:#fff}
.gk-toast&[data-gk-variant="message-actions"] .gk-acts{display:flex;gap:8px;width:100%;padding-left:50px;margin-top:8px}
@media (prefers-reduced-motion:reduce){.gk-toast&[data-gk-variant="neon-error"] .gk-icon,.gk-toast&[data-gk-variant="island"] .gk-eq i{animation:none}}
`;

export const showcaseTheme: ThemeDefinition = {
  name: 'showcase',
  radius: '16px',
  blur: '18px',
  saturate: '180%',
  font: 'Inter, -apple-system, "Segoe UI", Roboto, sans-serif',
  light: tokensLight,
  dark: tokensDark,
  css,
  supportedVariants: variants,
};


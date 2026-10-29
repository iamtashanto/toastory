import type { ThemeDefinition, ThemeTokens } from '../themes.ts';

const SYSTEM =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, system-ui, sans-serif';

export const tokensLight: ThemeTokens = {
  bg: 'rgba(255, 255, 255, 0.9)',
  solid: '#f5f5f7',
  fg: '#111114',
  muted: '#44444a',
  border: 'rgba(60, 60, 67, 0.2)',
  shadow: '0 10px 36px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
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
  bg: 'rgba(30, 30, 32, 0.9)',
  solid: '#1c1c1e',
  fg: '#f5f5f7',
  muted: '#c4c4cc',
  border: 'rgba(255, 255, 255, 0.14)',
  shadow: '0 10px 36px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
  accent: '#4da3ff',
  accentFg: '#00152e',
  danger: '#ff8a8a',
  dangerFg: '#2b0000',
  success: '#4ade80',
  error: '#ff7b7b',
  warning: '#ffc857',
  info: '#6cb6ff',
};

export const variants = [
  'banner-light',
  'banner-dark',
  'capsule-success',
  'island-call',
  'hud-silent',
  'system-alert',
  'device-popup',
  'grouped-stack',
  'progress-ring',
  'shake-error',
  'focus-toggle',
  'compact-action',
] as const;

export const css = `
@keyframes gk-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}
@keyframes gk-draw{to{stroke-dashoffset:0}}
@keyframes gk-sweep{to{stroke-dashoffset:0}}
.gk-toast&[data-gk-variant="banner-light"]{background:rgba(255,255,255,.75);backdrop-filter:blur(26px) saturate(190%);border:.5px solid rgba(255,255,255,.55);border-radius:22px;color:#111;box-shadow:0 10px 30px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.6)}
.gk-toast&[data-gk-variant="banner-dark"]{background:rgba(28,28,32,.75);backdrop-filter:blur(26px) saturate(180%);border:.5px solid rgba(255,255,255,.18);color:#fff;border-radius:22px;box-shadow:0 12px 34px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.2)}
.gk-toast&[data-gk-variant="capsule-success"]{border-radius:999px;padding:10px 20px 10px 12px;width:fit-content;max-width:100%}
.gk-toast&[data-gk-variant="capsule-success"] .gk-ck{width:30px;height:30px;border-radius:50%;background:rgba(52,199,89,.95);display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="capsule-success"] .gk-ck svg path{stroke-dasharray:24;stroke-dashoffset:24;animation:gk-draw .5s .3s ease forwards}
.gk-toast&[data-gk-variant="hud-silent"],.gk-hud&{background:rgba(40,40,44,.75);backdrop-filter:blur(30px) saturate(180%);border:.5px solid rgba(255,255,255,.16);color:#fff;border-radius:999px;padding:10px 18px 10px 12px;width:fit-content;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.gk-toast&[data-gk-variant="hud-silent"] .gk-ib,.gk-hud& .gk-ib{width:30px;height:30px;border-radius:50%;background:#ff9f0a;display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="device-popup"]{border-radius:26px;padding:16px;flex-direction:column;text-align:center;gap:6px;max-width:300px}
.gk-toast&[data-gk-variant="device-popup"] .gk-big-icon{width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.7);display:grid;place-items:center;color:#0a84ff;margin:0 auto 4px}
.gk-toast&[data-gk-variant="device-popup"] .gk-btn-connect{margin-top:8px;background:#0a84ff;color:#fff;font-weight:600;border-radius:999px;padding:9px 0;width:100%;font-size:14.5px;border:none;cursor:pointer}
.gk-toast&[data-gk-variant="shake-error"]{background:rgba(255,69,58,.35);backdrop-filter:blur(24px) saturate(180%);border:.5px solid rgba(255,180,175,.6);color:#fff;border-radius:18px}
.gk-toast&[data-gk-variant="shake-error"][data-mounted="true"]{animation:gk-shake .5s .4s}
.gk-toast&[data-gk-variant="focus-toggle"]{background:rgba(88,86,214,.45);backdrop-filter:blur(26px) saturate(190%);border:.5px solid rgba(200,198,255,.5);color:#fff;border-radius:20px}
.gk-toast&[data-gk-variant="focus-toggle"] .gk-ib{width:34px;height:34px;border-radius:50%;background:#5e5ce6;display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="focus-toggle"] .gk-sw{margin-left:auto;width:40px;height:24px;border-radius:99px;background:#34c759;position:relative;flex:none;cursor:pointer}
.gk-toast&[data-gk-variant="focus-toggle"] .gk-sw::after{content:"";position:absolute;right:2px;top:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s}
.gk-toast&[data-gk-variant="focus-toggle"] .gk-sw[aria-checked="false"]{background:#636366}
.gk-toast&[data-gk-variant="focus-toggle"] .gk-sw[aria-checked="false"]::after{transform:translateX(-16px)}
.gk-toast&[data-gk-variant="compact-action"]{border-radius:16px;padding:10px 12px}
.gk-toast&[data-gk-variant="compact-action"] .gk-ib{width:28px;height:28px;border-radius:50%;background:#0a84ff;color:#fff;display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="compact-action"] .gk-lnk{margin-left:auto;color:#0a84ff;font-weight:600;font-size:14px;cursor:pointer}
@media (prefers-reduced-motion:reduce){.gk-toast&[data-gk-variant="shake-error"][data-mounted="true"]{animation:none}}
`;

export const iosGlassTheme: ThemeDefinition = {
  name: 'ios-glass',
  radius: '22px',
  blur: '26px',
  saturate: '190%',
  font: SYSTEM,
  light: tokensLight,
  dark: tokensDark,
  css,
  supportedVariants: variants,
};

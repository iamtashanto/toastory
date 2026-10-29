import type { ThemeDefinition, ThemeTokens } from '../themes.ts';

const SYSTEM =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, system-ui, sans-serif';

export const tokensLight: ThemeTokens = {
  bg: 'rgba(255, 255, 255, 0.72)',
  solid: '#ffffff',
  fg: '#0a0a0c',
  muted: '#2c2c32',
  border: 'rgba(255, 255, 255, 0.45)',
  shadow:
    '0 4px 12px rgba(0, 0, 0, 0.08), 0 16px 36px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 1px 0 0 rgba(255, 255, 255, 0.5)',
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
  bg: 'rgba(28, 28, 32, 0.74)',
  solid: '#1c1c1e',
  fg: '#ffffff',
  muted: '#f0f0f6',
  border: 'rgba(255, 255, 255, 0.16)',
  shadow:
    '0 4px 16px rgba(0, 0, 0, 0.4), 0 20px 48px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 1px 0 0 rgba(255, 255, 255, 0.12)',
  accent: '#b0dcff',
  accentFg: '#00152e',
  danger: '#ff9494',
  dangerFg: '#2b0000',
  success: '#6ae69a',
  error: '#ffc2c2',
  warning: '#ffd470',
  info: '#a8d8ff',
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
.gk-toast&{transition:transform 320ms cubic-bezier(0.16,1,0.3,1),opacity 220ms ease,box-shadow 320ms ease;font-feature-settings:"cv02","cv03","cv04","cv11"}
.gk-toast&:not([data-mounted="true"]),.gk-toast&[data-state="exiting"],.gk-toast&[data-swiping="true"]{will-change:transform,opacity}
.gk-toast& .gk-title{font-weight:600;letter-spacing:-0.015em;line-height:1.25}
.gk-toast& .gk-desc{letter-spacing:-0.01em;line-height:1.35;opacity:0.88}
.gk-toast&[data-rich="true"],.gk-toast&[data-rich]{background:color-mix(in srgb,var(--gk-bg) 88%,var(--gk-type,transparent) 12%)}
.gk-toast&[data-gk-variant="banner-light"]{background:rgba(255,255,255,.72);backdrop-filter:blur(22px) saturate(180%);border:.5px solid rgba(255,255,255,.55);border-radius:20px;color:#0a0a0c;box-shadow:0 10px 30px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.8)}
.gk-toast&[data-gk-variant="banner-dark"]{background:rgba(28,28,32,.74);backdrop-filter:blur(22px) saturate(180%);border:.5px solid rgba(255,255,255,.18);color:#fff;border-radius:20px;box-shadow:0 12px 34px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.25)}
.gk-toast&[data-gk-variant="capsule-success"]{border-radius:999px;padding:10px 20px 10px 12px;width:fit-content;max-width:100%}
.gk-toast&[data-gk-variant="capsule-success"] .gk-ck{width:30px;height:30px;border-radius:50%;background:rgba(52,199,89,.95);display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="capsule-success"] .gk-ck svg path{stroke-dasharray:24;stroke-dashoffset:24;animation:gk-draw .5s .3s ease forwards}
.gk-toast&[data-gk-variant="hud-silent"],.gk-hud&{background:rgba(36,36,40,.75);backdrop-filter:blur(24px) saturate(180%);border:.5px solid rgba(255,255,255,.18);color:#fff;border-radius:999px;padding:10px 18px 10px 12px;width:fit-content;box-shadow:0 10px 30px rgba(0,0,0,.35)}
.gk-toast&[data-gk-variant="hud-silent"] .gk-ib,.gk-hud& .gk-ib{width:30px;height:30px;border-radius:50%;background:#ff9f0a;display:grid;place-items:center;flex:none}
.gk-toast&[data-gk-variant="device-popup"]{border-radius:24px;padding:16px;flex-direction:column;text-align:center;gap:6px;max-width:300px}
.gk-toast&[data-gk-variant="device-popup"] .gk-big-icon{width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.7);display:grid;place-items:center;color:#0a84ff;margin:0 auto 4px}
.gk-toast&[data-gk-variant="device-popup"] .gk-btn-connect{margin-top:8px;background:#0a84ff;color:#fff;font-weight:600;border-radius:999px;padding:9px 0;width:100%;font-size:14.5px;border:none;cursor:pointer}
.gk-toast&[data-gk-variant="shake-error"]{background:rgba(255,69,58,.35);backdrop-filter:blur(22px) saturate(180%);border:.5px solid rgba(255,180,175,.6);color:#fff;border-radius:18px}
.gk-toast&[data-gk-variant="shake-error"][data-mounted="true"]{animation:gk-shake .5s .4s}
.gk-toast&[data-gk-variant="focus-toggle"]{background:rgba(88,86,214,.45);backdrop-filter:blur(22px) saturate(190%);border:.5px solid rgba(200,198,255,.5);color:#fff;border-radius:20px}
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
  radius: '20px',
  blur: '22px',
  saturate: '180%',
  font: SYSTEM,
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
  duration: '340ms',
  light: tokensLight,
  dark: tokensDark,
  css,
  supportedVariants: variants,
};

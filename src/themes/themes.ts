/**
 * Theme definitions. The build script turns each definition into a CSS file; the tests check every
 * token pair for WCAG contrast. This file must stay free of TypeScript-only runtime constructs so
 * Node can load it directly.
 */

export interface ThemeTokens {
  /** Surface color. May be translucent for glass themes. */
  bg: string;
  /** Opaque stand-in used when `backdrop-filter` is unsupported and for form fields. */
  solid: string;
  /** Primary text. */
  fg: string;
  /** Secondary text. */
  muted: string;
  /** Border and divider color. */
  border: string;
  /** Box shadow value. */
  shadow: string;
  /** Accent color for actions, links and focus rings. */
  accent: string;
  /** Text on top of the accent color. */
  accentFg: string;
  /** Destructive button background. */
  danger: string;
  /** Text on top of the destructive background. */
  dangerFg: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface ThemeDefinition {
  name: string;
  radius: string;
  blur: string;
  saturate: string;
  font?: string;
  ease?: string;
  duration?: string;
  borderWidth?: string;
  /** Alpha of the type-colored tint the theme paints over the surface, checked by the tests. */
  tint?: number;
  light: ThemeTokens;
  dark: ThemeTokens;
  /** Extra CSS. `&` stands for the attribute selector of the theme. */
  css?: string;
  /** Variants supported by this theme. */
  supportedVariants?: readonly string[];
}

const SYSTEM =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, system-ui, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const LIGHT: ThemeTokens = {
  bg: '#ffffff',
  solid: '#ffffff',
  fg: '#1d1d1f',
  muted: '#515156',
  border: 'rgba(60, 60, 67, 0.22)',
  shadow: '0 8px 28px rgba(0, 0, 0, 0.14)',
  accent: '#0057c2',
  accentFg: '#ffffff',
  danger: '#b71c1c',
  dangerFg: '#ffffff',
  success: '#1a7f37',
  error: '#b71c1c',
  warning: '#8a5a00',
  info: '#0b5cc7',
};

const DARK: ThemeTokens = {
  bg: '#1c1c1e',
  solid: '#1c1c1e',
  fg: '#f5f5f7',
  muted: '#b4b4bb',
  border: 'rgba(255, 255, 255, 0.16)',
  shadow: '0 8px 28px rgba(0, 0, 0, 0.5)',
  accent: '#4da3ff',
  accentFg: '#00152e',
  danger: '#ff8a8a',
  dangerFg: '#2b0000',
  success: '#4ade80',
  error: '#ff7b7b',
  warning: '#ffc857',
  info: '#6cb6ff',
};

const make = (
  name: string,
  shape: Partial<Omit<ThemeDefinition, 'name' | 'light' | 'dark'>>,
  light: Partial<ThemeTokens>,
  dark: Partial<ThemeTokens>,
  css?: string,
): ThemeDefinition => ({
  name,
  radius: '12px',
  blur: '0px',
  saturate: '100%',
  ...shape,
  light: { ...LIGHT, ...light },
  dark: { ...DARK, ...dark },
  ...(css ? { css } : {}),
});

import { essentialsTheme } from './essentials/tokens.ts';
import { showcaseTheme } from './showcase/tokens.ts';
import { iosGlassTheme } from './ios-glass/tokens.ts';
import { liquidGlassTheme } from './liquid-glass/tokens.ts';
import { dialogsTheme } from './dialogs/tokens.ts';

/** All built-in themes. */
export const THEMES: readonly ThemeDefinition[] = [
  essentialsTheme,
  showcaseTheme,
  iosGlassTheme,
  liquidGlassTheme,
  dialogsTheme,
  make(
    'aurora',
    { radius: '20px', blur: '28px', saturate: '170%', font: SYSTEM, tint: 0.28 },
    {
      bg: 'rgba(255, 255, 255, 0.9)',
      solid: '#f6f4ff',
      fg: '#17142b',
      muted: '#463f66',
    },
    {
      bg: 'rgba(20, 18, 38, 0.9)',
      solid: '#161428',
      fg: '#f4f1ff',
      muted: '#d2ccf0',
    },
    '@keyframes gk-aurora-glow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}' +
      '.gk-toast&::before,.gk-dialog&::before,.gk-sheet&::before,.gk-bsheet&::before{content:"";position:absolute;inset:-3px;z-index:-1;border-radius:inherit;pointer-events:none;background:linear-gradient(135deg,rgba(120,119,255,.28),rgba(255,119,200,.24) 40%,rgba(80,220,255,.26) 70%,rgba(168,85,247,.25));background-size:200% 200%;animation:gk-aurora-glow 10s ease infinite;filter:blur(6px);opacity:0.85}.gk-toast&,.gk-dialog&,.gk-sheet&,.gk-bsheet&{isolation:isolate}' +
      '.gk-toast& .gk-btn{border-radius:999px;transition:all .18s ease}.gk-toast& .gk-action{background:var(--gk-accent);color:var(--gk-accent-fg);border-color:transparent;box-shadow:0 2px 10px color-mix(in srgb,var(--gk-accent) 35%,transparent)}.gk-toast& .gk-btn:not(.gk-action){background:color-mix(in srgb,var(--gk-fg) 9%,transparent);border-color:var(--gk-border)}' +
      '@media (prefers-reduced-motion:reduce){.gk-toast&::before,.gk-dialog&::before,.gk-sheet&::before,.gk-bsheet&::before{animation:none}}',
  ),
  make(
    'classic-stack',
    { radius: '8px', font: SYSTEM },
    { shadow: '0 4px 14px rgba(0, 0, 0, 0.16)' },
    { bg: '#222226', solid: '#222226', shadow: '0 4px 14px rgba(0, 0, 0, 0.5)' },
    '.gk-toast&{border-inline-start:4px solid var(--gk-type,var(--gk-border))}',
  ),
  make(
    'classic-bar',
    { radius: '4px', font: SYSTEM },
    { shadow: '0 2px 10px rgba(0, 0, 0, 0.15)' },
    { bg: '#222226', solid: '#222226', shadow: '0 2px 10px rgba(0, 0, 0, 0.5)' },
    '.gk-toast&{border-top:4px solid var(--gk-type,var(--gk-border))}',
  ),
  make(
    'pill',
    { radius: '999px', font: SYSTEM },
    { shadow: '0 6px 20px rgba(0, 0, 0, 0.16)' },
    { bg: '#242428', solid: '#242428', shadow: '0 6px 20px rgba(0, 0, 0, 0.5)' },
    '.gk-toast&{align-items:center;padding:10px 20px}.gk-toast& .gk-desc{margin-top:0}.gk-toast& .gk-btn{border-radius:999px;transition:all .16s ease}.gk-toast& .gk-action{background:var(--gk-accent);color:var(--gk-accent-fg);border-color:transparent}.gk-toast& .gk-btn:not(.gk-action){background:color-mix(in srgb,var(--gk-fg) 8%,transparent);border-color:var(--gk-border)}',
  ),
  make(
    'ripple',
    { radius: '16px', font: SYSTEM, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    { shadow: '0 8px 26px rgba(0, 0, 0, 0.16)' },
    { bg: '#202024', solid: '#202024', shadow: '0 8px 26px rgba(0, 0, 0, 0.5)' },
    '@keyframes gk-ripple{from{clip-path:circle(0 at 30px 50%)}to{clip-path:circle(160% at 30px 50%)}}.gk-toast&[data-mounted="true"]{animation:gk-ripple .7s var(--gk-ease) both}@media (prefers-reduced-motion:reduce){.gk-toast&[data-mounted="true"]{animation:none}}',
  ),
  make(
    'gradient-strip',
    { radius: '12px', font: SYSTEM },
    { shadow: '0 6px 22px rgba(0, 0, 0, 0.14)' },
    { bg: '#202024', solid: '#202024', shadow: '0 6px 22px rgba(0, 0, 0, 0.5)' },
    '.gk-toast&{padding-inline-start:22px}.gk-toast&::before{content:"";position:absolute;inset-block:0;inset-inline-start:0;width:6px;background:linear-gradient(180deg,var(--gk-type,var(--gk-accent)),var(--gk-accent))}.gk-toast& .gk-btn{border-radius:8px;transition:all .16s ease}.gk-toast& .gk-action{background:var(--gk-accent);color:var(--gk-accent-fg);border-color:transparent;box-shadow:0 2px 6px color-mix(in srgb,var(--gk-accent) 25%,transparent)}.gk-toast& .gk-btn:not(.gk-action){background:color-mix(in srgb,var(--gk-fg) 7%,transparent);border-color:var(--gk-border)}',
  ),
  make(
    'sweet',
    { radius: '14px', font: SYSTEM },
    { shadow: '0 12px 34px rgba(0, 0, 0, 0.2)' },
    { bg: '#26262b', solid: '#26262b', shadow: '0 12px 34px rgba(0, 0, 0, 0.55)' },
    '.gk-toast&{align-items:center;padding:16px 18px}.gk-toast& .gk-icon{align-items:center;justify-content:center;width:36px;height:36px;margin:0;border:3px solid var(--gk-type,var(--gk-border));border-radius:50%}.gk-toast& .gk-title{font-size:15px;font-weight:700}.gk-toast& .gk-btn{border-radius:10px;transition:all .16s ease}.gk-toast& .gk-action{background:var(--gk-accent);color:var(--gk-accent-fg);border-color:transparent;box-shadow:0 3px 10px color-mix(in srgb,var(--gk-accent) 30%,transparent)}.gk-toast& .gk-btn:not(.gk-action){background:color-mix(in srgb,var(--gk-fg) 8%,transparent);border-color:var(--gk-border)}',
  ),
  make(
    'material',
    { radius: '4px', font: 'Roboto, system-ui, sans-serif', ease: 'cubic-bezier(0.4, 0, 0.2, 1)', duration: '280ms' },
    {
      bg: '#323232',
      solid: '#323232',
      fg: '#ffffff',
      muted: '#d3d3d8',
      border: 'rgba(255, 255, 255, 0.12)',
      shadow: '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px rgba(0,0,0,.14), 0 1px 18px rgba(0,0,0,.12)',
      accent: '#8ab4f8',
      accentFg: '#0b1b33',
      danger: '#ff8a8a',
      dangerFg: '#2b0000',
      success: '#4ade80',
      error: '#ff8a8a',
      warning: '#ffc857',
      info: '#8ab4f8',
    },
    {
      bg: '#e8e8ec',
      solid: '#e8e8ec',
      fg: '#1d1d1f',
      muted: '#4a4a50',
      border: 'rgba(0, 0, 0, 0.12)',
      shadow: '0 3px 5px -1px rgba(0,0,0,.3), 0 6px 10px rgba(0,0,0,.24), 0 1px 18px rgba(0,0,0,.2)',
      accent: '#0b57d0',
      accentFg: '#ffffff',
      danger: '#b3261e',
      dangerFg: '#ffffff',
      success: '#146c2e',
      error: '#b3261e',
      warning: '#7a4b00',
      info: '#0b57d0',
    },
  ),
  make(
    'basic',
    { radius: '6px' },
    { border: '#cfcfd6', shadow: '0 2px 8px rgba(0, 0, 0, 0.1)' },
    { bg: '#202024', solid: '#202024', border: '#3a3a40', shadow: '0 2px 8px rgba(0, 0, 0, 0.4)' },
  ),
  make(
    'minimal',
    { radius: '10px', font: SYSTEM },
    { border: 'rgba(0, 0, 0, 0.12)', shadow: '0 4px 16px rgba(0, 0, 0, 0.08)' },
    { bg: '#161618', solid: '#161618', border: 'rgba(255, 255, 255, 0.14)', shadow: '0 6px 22px rgba(0, 0, 0, 0.55)' },
    '.gk-toast&{padding:12px 16px}.gk-toast& .gk-title{font-weight:600}.gk-toast& .gk-btn{border-radius:8px;transition:all .15s ease}.gk-toast& .gk-action{background:var(--gk-accent);color:var(--gk-accent-fg);border-color:transparent}.gk-toast& .gk-btn:not(.gk-action){background:rgba(255,255,255,.07);border-color:var(--gk-border)}',
  ),
  make(
    'flat',
    { radius: '6px', font: SYSTEM },
    { bg: '#e9ecf1', solid: '#e9ecf1', border: 'transparent', shadow: 'none' },
    { bg: '#2a2d33', solid: '#2a2d33', border: 'transparent', shadow: 'none' },
  ),
  make(
    'outline',
    { radius: '10px', font: SYSTEM, borderWidth: '2px' },
    { border: '#1d1d1f', shadow: 'none' },
    { bg: '#111113', solid: '#111113', border: '#f5f5f7', shadow: 'none' },
    '.gk-toast&{border-color:var(--gk-type,var(--gk-border))}',
  ),
  make(
    'neon',
    { radius: '10px', font: SYSTEM, ease: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)' },
    {
      bg: '#fbfaff',
      solid: '#fbfaff',
      fg: '#150a2e',
      muted: '#4a3d73',
      border: '#6a00f4',
      shadow: '0 0 0 1px rgba(106,0,244,.35), 0 0 22px rgba(106,0,244,.28)',
      accent: '#6a00f4',
      accentFg: '#ffffff',
      success: '#00724a',
      error: '#c4003a',
      warning: '#8f5b00',
      info: '#005ec2',
      danger: '#c4003a',
    },
    {
      bg: '#0b0b14',
      solid: '#0b0b14',
      fg: '#eaffff',
      muted: '#a9c4d6',
      border: '#00f0ff',
      shadow: '0 0 0 1px rgba(0,240,255,.5), 0 0 24px rgba(0,240,255,.35)',
      accent: '#00f0ff',
      accentFg: '#00131a',
      success: '#39ff88',
      error: '#ff5c8a',
      warning: '#ffd24a',
      info: '#5ec8ff',
      danger: '#ff5c8a',
      dangerFg: '#1a0008',
    },
    '.gk-toast&{border-color:var(--gk-type,var(--gk-accent));box-shadow:0 0 20px color-mix(in srgb,var(--gk-type,var(--gk-accent)) 50%,transparent)}.gk-toast& .gk-btn{border-radius:6px;transition:all .15s ease}.gk-toast& .gk-action{background:var(--gk-accent);color:var(--gk-accent-fg);border-color:transparent;box-shadow:0 0 12px var(--gk-accent)}.gk-toast& .gk-btn:not(.gk-action){background:transparent;border-color:var(--gk-border)}',
  ),
  make(
    'gradient',
    { radius: '16px', font: SYSTEM, tint: 0.22 },
    { shadow: '0 8px 26px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.7)' },
    { bg: '#1c1c20', solid: '#1c1c20', shadow: '0 8px 28px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)' },
    '.gk-toast&{background-image:linear-gradient(135deg,color-mix(in srgb,var(--gk-type,var(--gk-accent)) 22%,transparent),transparent 70%)}.gk-toast& .gk-btn{border-radius:10px;transition:all .16s ease}.gk-toast& .gk-action{background:var(--gk-accent);color:var(--gk-accent-fg);border-color:transparent;box-shadow:0 2px 8px color-mix(in srgb,var(--gk-accent) 30%,transparent)}.gk-toast& .gk-btn:not(.gk-action){background:rgba(255,255,255,.07);border-color:var(--gk-border)}',
  ),
  make(
    'brutal',
    { radius: '0px', font: MONO, borderWidth: '3px', ease: 'linear', duration: '160ms' },
    {
      bg: '#fffdf5',
      solid: '#fffdf5',
      fg: '#000000',
      muted: '#3a3a3a',
      border: '#000000',
      shadow: '6px 6px 0 #000000',
      accent: '#c92e00',
      accentFg: '#ffffff',
      danger: '#b00020',
      error: '#b00020',
      success: '#0b6b2a',
      warning: '#7a4b00',
      info: '#0a4fb3',
    },
    {
      bg: '#111111',
      solid: '#111111',
      border: '#ffffff',
      shadow: '6px 6px 0 #ffffff',
      accent: '#ffb199',
      accentFg: '#1a0600',
    },
    '.gk-toast& .gk-btn{border-radius:0;font-family:inherit;font-weight:700;text-transform:uppercase;letter-spacing:0.02em;transition:transform .1s ease,box-shadow .1s ease}.gk-toast& .gk-action{background:var(--gk-accent);color:var(--gk-accent-fg);border:2px solid var(--gk-border);box-shadow:3px 3px 0 var(--gk-border)}.gk-toast& .gk-action:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--gk-border)}.gk-toast& .gk-btn:not(.gk-action){background:transparent;border:2px solid var(--gk-border);box-shadow:3px 3px 0 var(--gk-border)}',
  ),
  make(
    'pastel',
    { radius: '16px', font: SYSTEM },
    {
      bg: '#fdf0f6',
      solid: '#fdf0f6',
      fg: '#3b2a3d',
      muted: '#68506e',
      border: '#ecc9dc',
      shadow: '0 8px 24px rgba(160, 90, 130, 0.18)',
      accent: '#7c3aed',
      accentFg: '#ffffff',
    },
    {
      bg: '#2a2433',
      solid: '#2a2433',
      fg: '#f3e8ff',
      muted: '#c9b8dc',
      border: '#4a3d5c',
      shadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
      accent: '#c4a1ff',
      accentFg: '#1e0a3a',
    },
    '.gk-toast& .gk-btn{border-radius:999px;transition:all .16s ease}.gk-toast& .gk-action{background:var(--gk-accent);color:var(--gk-accent-fg);border-color:transparent;box-shadow:0 2px 8px color-mix(in srgb,var(--gk-accent) 25%,transparent)}.gk-toast& .gk-btn:not(.gk-action){background:rgba(255,255,255,.4);border-color:var(--gk-border)}',
  ),
];

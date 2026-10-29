import type { ThemeDefinition, ThemeTokens } from './themes.ts';

const tokens = (t: ThemeTokens): string =>
  `--gk-bg:${t.bg};--gk-bg-solid:${t.solid};--gk-fg:${t.fg};--gk-muted:${t.muted};--gk-border:${t.border};--gk-shadow:${t.shadow};--gk-accent:${t.accent};--gk-accent-fg:${t.accentFg};--gk-danger:${t.danger};--gk-danger-fg:${t.dangerFg};--gk-success:${t.success};--gk-error:${t.error};--gk-warning:${t.warning};--gk-info:${t.info};`;

/**
 * Renders the token blocks (light, explicit dark, class-based dark, and automatic dark) plus
 * fallbacks (no backdrop-filter, forced-colors, reduced transparency) and mobile optimizations.
 */
export function themeCss(def: ThemeDefinition): string {
  const sel = `[data-gk-theme="${def.name}"]`;
  const shape =
    `--gk-radius:${def.radius};--gk-blur:${def.blur};--gk-saturate:${def.saturate};` +
    (def.borderWidth ? `--gk-border-w:${def.borderWidth};` : '') +
    (def.font ? `--gk-font:${def.font};` : '') +
    (def.ease ? `--gk-ease:${def.ease};` : '') +
    (def.duration ? `--gk-duration:${def.duration};` : '');

  const darkSel = `${sel}[data-gk-mode="dark"],:is(.dark,[data-theme="dark"]) ${sel}`;
  const extra = (def.css ?? '').split('&').join(sel);
  const darkTokens = tokens(def.dark);

  return (
    `${sel}{color-scheme:light;${shape}${tokens(def.light)}}` +
    `${darkSel}{color-scheme:dark;${darkTokens}}` +
    `@media (prefers-color-scheme:dark){${sel}[data-gk-mode="auto"]{color-scheme:dark;${darkTokens}}}` +
    extra
  );
}

import type { ThemeDefinition, ThemeTokens } from './themes.ts';

const tokens = (t: ThemeTokens): string =>
  (
    [
      ['bg', t.bg],
      ['bg-solid', t.solid],
      ['fg', t.fg],
      ['muted', t.muted],
      ['border', t.border],
      ['shadow', t.shadow],
      ['accent', t.accent],
      ['accent-fg', t.accentFg],
      ['danger', t.danger],
      ['danger-fg', t.dangerFg],
      ['success', t.success],
      ['error', t.error],
      ['warning', t.warning],
      ['info', t.info],
    ] as const
  )
    .map(([name, value]) => `--gk-${name}:${value};`)
    .join('');

/**
 * Renders the token blocks (light, explicit dark, and automatic dark) plus the extra rules of a
 * theme. The result is unminified CSS without the shared base styles.
 */
export function themeCss(def: ThemeDefinition): string {
  const sel = `[data-gk-theme="${def.name}"]`;
  const shape =
    `--gk-radius:${def.radius};--gk-blur:${def.blur};--gk-saturate:${def.saturate};` +
    `--gk-border-w:${def.borderWidth ?? '1px'};` +
    (def.font ? `--gk-font:${def.font};` : '') +
    (def.ease ? `--gk-ease:${def.ease};` : '') +
    (def.duration ? `--gk-duration:${def.duration};` : '');
  const extra = (def.css ?? '').split('&').join(sel);
  return (
    `${sel}{color-scheme:light;${shape}${tokens(def.light)}}` +
    `${sel}[data-gk-mode="dark"]{color-scheme:dark;${tokens(def.dark)}}` +
    `@media (prefers-color-scheme:dark){${sel}[data-gk-mode="auto"]{color-scheme:dark;${tokens(def.dark)}}}` +
    extra
  );
}

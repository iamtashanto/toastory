const NS = 'http://www.w3.org/2000/svg';
const C = 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z';

/** Built-in icon names. */
export type IconName =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'question'
  | 'loading'
  | 'close'
  | 'trash'
  | 'lock'
  | 'shield'
  | 'check';

export const PATHS: Record<IconName, string[]> = {
  success: [C, 'M8 12.4l2.6 2.6L16 9.4'],
  error: [C, 'M9 9l6 6M15 9l-6 6'],
  warning: ['M12 3.5l9.2 16H2.8z', 'M12 10v4.2M12 17.2h.01'],
  info: [C, 'M12 11v5.2M12 7.8h.01'],
  question: [C, 'M9.6 9.6a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2 1-1.2 1.8M12 17h.01'],
  loading: ['M12 3a9 9 0 1 0 9 9'],
  close: ['M6 6l12 12M18 6L6 18'],
  trash: [
    'M3 6h18',
    'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  ],
  lock: [
    'M7 11V7a5 5 0 0 1 10 0v4',
    'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',
  ],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  check: ['M20 6L9 17l-5-5'],
};

const SVG_HEAD =
  'viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';

/**
 * Builds an inline SVG for a built-in icon. The SVG is decorative (`aria-hidden`) because
 * every toast and dialog states its meaning in text as well.
 */
export function icon(name: IconName): SVGElement {
  const paths = (PATHS[name] ?? PATHS.info).map((d) => `<path d="${d}"/>`).join('');
  const cls = name === 'loading' ? ' class="gk-spin"' : '';
  const div = document.createElement('div');
  div.innerHTML = `<svg xmlns="${NS}" ${SVG_HEAD}${cls}>${paths}</svg>`;
  return div.firstElementChild as SVGElement;
}

/** Maps a toast type to its built-in icon name, if any. */
export function iconForType(type: string): IconName | undefined {
  return type === 'success' ||
    type === 'error' ||
    type === 'warning' ||
    type === 'info' ||
    type === 'loading'
    ? type
    : undefined;
}

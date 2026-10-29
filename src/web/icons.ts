const NS = 'http://www.w3.org/2000/svg';

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
  | 'upload'
  | 'pencil'
  | 'clock'
  | 'shield'
  | 'check'
  | 'bell'
  | 'phone'
  | 'moon'
  | 'star'
  | 'file'
  | 'mail';

export const PATHS: Record<IconName, string[]> = {
  success: ['M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z', 'M8 12.4l2.6 2.6L16 9.4'],
  error: ['M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z', 'M9 9l6 6M15 9l-6 6'],
  warning: ['M12 3.5l9.2 16H2.8z', 'M12 10v4.2M12 17.2h.01'],
  info: ['M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z', 'M12 11v5.2M12 7.8h.01'],
  question: [
    'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z',
    'M9.6 9.6a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2 1-1.2 1.8M12 17h.01',
  ],
  loading: ['M12 3a9 9 0 1 0 9 9'],
  close: ['M6 6l12 12M18 6L6 18'],
  trash: [
    'M3 6h18',
    'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
    'M10 11v6',
    'M14 11v6',
  ],
  lock: [
    'M7 11V7a5 5 0 0 1 10 0v4',
    'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',
  ],
  upload: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
  pencil: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'],
  clock: ['M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20z', 'M12 6v6l4 2'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  check: ['M20 6L9 17l-5-5'],
  bell: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  phone: [
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  ],
  moon: ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],
  star: [
    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  ],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6'],
  mail: [
    'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z',
    'M22 6l-10 7L2 6',
  ],
};

/**
 * Builds an inline SVG for a built-in icon. The SVG is decorative (`aria-hidden`) because
 * every toast and dialog states its meaning in text as well.
 */
export function icon(name: IconName): SVGElement {
  const svg = document.createElementNS(NS, 'svg');
  const attrs: Record<string, string> = {
    viewBox: '0 0 24 24',
    width: '20',
    height: '20',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    focusable: 'false',
  };
  if (name === 'loading') attrs.class = 'gk-spin';
  for (const k in attrs) svg.setAttribute(k, attrs[k]);
  for (const d of PATHS[name] ?? PATHS.info) {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
  }
  return svg;
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

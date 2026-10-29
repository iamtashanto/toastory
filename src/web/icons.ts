const NS = 'http://www.w3.org/2000/svg';

/** Built-in icon names. */
export type IconName = 'success' | 'error' | 'warning' | 'info' | 'question' | 'loading' | 'close';

const PATHS: Record<IconName, string[]> = {
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
};

/**
 * Builds an inline SVG for a built-in icon. The SVG is decorative (`aria-hidden`) because
 * every toast and dialog states its meaning in text as well.
 */
export function icon(name: IconName): SVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  if (name === 'loading') svg.setAttribute('class', 'gk-spin');
  for (const d of PATHS[name]) {
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

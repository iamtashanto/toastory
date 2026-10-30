import type {
  CloseReason,
  Direction,
  GlazeConfig,
  PauseOn,
  Renderable,
  SwipeDirection,
  ToastAvatarOption,
  ToastId,
  ToastPosition,
  ToastRecord,
  ToastStore,
} from '../core';
import { el, fill, hasDom, prefersDark, prefersReducedMotion } from './dom';
import { icon, iconForType, PATHS } from './icons';
import type { IconName } from './icons';
import { safeUrl, sanitizeToFragment } from './sanitize';
import { resolveVariant } from './variants';

const COLORS = ['#38bdf8', '#818cf8', '#ec4899', '#f97316', '#10b981', '#6366f1', '#eab308'];

function deterministicColor(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return COLORS[h % 7] as string;
}

function formatRelativeTime(ts: number | Date | string | boolean, locale = 'en'): string {
  if (typeof ts === 'string') return ts;
  if (ts === true) return 'now';
  const d = ts instanceof Date ? ts.getTime() : Number(ts) || Date.now();
  const min = Math.round((Date.now() - d) / 60000);
  if (!min) return 'now';
  const hr = Math.round(min / 60),
    day = Math.round(hr / 24);
  const [val, unit] = hr < 1 ? [min, 'minute'] : day < 1 ? [hr, 'hour'] : [day, 'day'];
  try {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
      -val,
      unit as Intl.RelativeTimeFormatUnit,
    );
  } catch {
    return `${val}${unit[0]} ago`;
  }
}

/** Options passed when mounting the DOM toaster. */
export interface ToasterOptions {
  /** Target element or selector to host regions. */
  container?: string | HTMLElement;
  /** Whether to mount inside a Shadow DOM root. */
  shadow?: boolean | 'open' | 'closed';
}

/** Handle of a mounted toast renderer. */
export interface ToasterHandle {
  /** Removes all DOM and listeners. */
  destroy(): void;
  /** Moves focus to the newest toast. Returns whether a toast was focused. */
  focus(): boolean;
}

interface Item {
  el: HTMLElement;
  record: ToastRecord;
  stamp: string;
  hover: boolean;
  swiping: boolean;
  height: number;
  measured: boolean;
}

interface Region {
  key: string;
  el: HTMLElement;
  list: HTMLElement;
  items: Map<ToastId, Item>;
  hover: boolean;
  focus: boolean;
}

const stampOf = (record: ToastRecord): string =>
  `${record.updatedAt}:${record.timerEpoch}:${record.count}`;

const INTERACTIVE = 'button,a,input,select,textarea,[role=button]';

/** Default swipe directions for a position: toward the nearest screen edge. */
export function defaultSwipe(position: ToastPosition): SwipeDirection[] {
  if (position.endsWith('left')) return ['left'];
  if (position.endsWith('right')) return ['right'];
  return position.startsWith('top') ? ['up'] : ['down'];
}

/** Parses `alt+t` style hotkeys. Returns `undefined` for an empty or invalid string. */
export function parseHotkey(
  hotkey: string,
): { alt: boolean; ctrl: boolean; shift: boolean; meta: boolean; code: string } | undefined {
  const parts = hotkey
    .toLowerCase()
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean);
  const key = parts.find((p) => !/^(alt|ctrl|control|shift|meta|cmd)$/.test(p));
  if (!key) return undefined;
  return {
    alt: parts.includes('alt'),
    ctrl: parts.some((p) => p === 'ctrl' || p === 'control'),
    shift: parts.includes('shift'),
    meta: parts.some((p) => p === 'meta' || p === 'cmd'),
    code: /^[a-z]$/.test(key) ? `Key${key.toUpperCase()}` : /^\d$/.test(key) ? `Digit${key}` : key,
  };
}

/** Detects whether the host document has an explicit dark mode via .dark class or data attribute. */
export function isDocumentDark(): boolean {
  if (!hasDom()) return false;
  const doc = document.documentElement;
  return (
    doc.classList.contains('dark') ||
    document.body?.classList.contains('dark') ||
    doc.getAttribute('data-theme') === 'dark' ||
    doc.getAttribute('data-gk-mode') === 'dark' ||
    document.body?.getAttribute('data-theme') === 'dark' ||
    document.body?.getAttribute('data-gk-mode') === 'dark'
  );
}

/** Resolves the mode attribute value, flipping it for inverted toasts. */
export function resolveMode(mode: GlazeConfig['mode'], invert: boolean): string {
  if (!invert) return mode;
  return mode === 'dark' || (mode === 'auto' && (isDocumentDark() || prefersDark()))
    ? 'light'
    : 'dark';
}

/**
 * Mounts the DOM renderer for a toast store. Call only in a browser.
 * The renderer creates one labelled region per placement, reconciles toasts into it, and handles
 * pausing, swiping, stacking and keyboard access.
 */
export function mountToaster(store: ToastStore, options?: ToasterOptions): ToasterHandle {
  const regions = new Map<string, Region>();
  const cleanups: (() => void)[] = [];
  let lastFocus: Element | null = null;
  let pendingHost = false;
  let shadowRoot: ShadowRoot | undefined;

  const cfg = (): Readonly<GlazeConfig> => store.config.get();
  const pauseSet = (record: ToastRecord): PauseOn[] => record.pauseOn ?? cfg().pauseOn;
  const flag = (value: boolean | undefined, fallback: boolean): boolean => value ?? fallback;

  const hostFor = (container: string | undefined): HTMLElement | ShadowRoot | null => {
    const target = container ?? options?.container ?? cfg().container;
    const parent =
      typeof target === 'string'
        ? ((document.getElementById(target) || document.querySelector<HTMLElement>(target)) ??
          document.body)
        : target instanceof HTMLElement
          ? target
          : document.body;

    if (!parent) return null;

    if (options?.shadow) {
      if (!shadowRoot) {
        let portalHost = parent.querySelector<HTMLElement>('#gk-shadow-portal');
        if (!portalHost) {
          portalHost = el('div', 'gk-portal', { id: 'gk-shadow-portal' });
          parent.append(portalHost);
        }
        shadowRoot = portalHost.shadowRoot ?? portalHost.attachShadow({ mode: 'open' });
        if (!shadowRoot.querySelector('style[data-gk-styles]')) {
          const style = el('style', '', { 'data-gk-styles': '' });
          style.textContent = `
            :host { all: initial; }
            .gk-region { position: fixed; z-index: var(--gk-z, 2147483000); }
          `;
          shadowRoot.append(style);
        }
      }
      return shadowRoot;
    }

    return parent;
  };

  const raf = (fn: () => void): void => {
    if (prefersReducedMotion() || typeof requestAnimationFrame !== 'function') fn();
    else requestAnimationFrame(() => requestAnimationFrame(fn));
  };

  const setPause = (region: Region, on: boolean, reason: PauseOn): void => {
    for (const item of region.items.values()) {
      if (!pauseSet(item.record).includes(reason)) continue;
      if (on) store.pause(item.record.id, reason);
      else store.resume(item.record.id, reason);
    }
  };

  const layout = (region: Region): void => {
    const stackConfig = cfg().stack;
    const stackMode: 'stacked' | 'expanded' | 'list' =
      stackConfig === false || stackConfig === 'list'
        ? 'list'
        : stackConfig === 'expanded'
          ? 'expanded'
          : 'stacked';

    const isExpanded =
      stackMode === 'expanded' || stackMode === 'list' || region.hover || region.focus;
    const newestOnTop = cfg().newestOnTop !== false;
    const rawItems = [...region.items.values()];
    const list = newestOnTop ? rawItems.reverse() : rawItems;
    const gap = cfg().gap;
    const isTop = region.key.includes('top-');
    let offset = 0;
    let front = 0;

    list.forEach((item, index) => {
      const height = item.measured && item.height > 0 ? item.height : item.el.offsetHeight || 50;
      if (index === 0) front = height;
      item.el.style.setProperty('--gk-index', String(index));
      item.el.style.setProperty('--gk-offset', `${offset}px`);
      item.el.style.setProperty('--gk-height', `${height}px`);
      item.el.style.zIndex = String(1000 - index);

      if (index > 2) {
        item.el.dataset.far = '';
      } else {
        delete item.el.dataset.far;
      }
      offset += height + gap;
    });

    const total = Math.max(0, offset - gap);
    region.el.style.setProperty('--gk-front', `${front}px`);
    region.el.style.setProperty('--gk-total', `${total}px`);
    region.el.style.setProperty('--gk-dir', isTop ? '1' : '-1');
    region.el.style.setProperty('--gk-gap', `${gap}px`);
    region.el.dataset.stackMode = stackMode;
    region.el.dataset.expanded = String(isExpanded);
    region.el.style.height = `${isExpanded ? total : front}px`;
  };

  // Max one ResizeObserver per container
  let resizeObserver: ResizeObserver | undefined;
  if (typeof ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        for (const r of regions.values()) {
          for (const item of r.items.values()) {
            if (item.el === target) {
              const h = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
              if (Math.abs(item.height - h) > 1) {
                item.height = h;
                item.measured = true;
                changed = true;
              }
            }
          }
        }
      }
      if (changed) regions.forEach(layout);
    });
  }

  const ensureRegion = (record: ToastRecord): Region | undefined => {
    const key = `${record.container ?? ''}|${record.position}`;
    const existing = regions.get(key);
    if (existing) return existing;
    const host = hostFor(record.container);
    if (!host) return undefined;
    const list = el('ol', 'gk-toast-list gk-list', { role: 'presentation', tabindex: '-1' });
    const root = el(
      'section',
      'gk-region gk-root',
      { 'aria-label': cfg().regionLabel, tabindex: '-1', role: 'region' },
      list,
    );
    const region: Region = { key, el: root, list, items: new Map(), hover: false, focus: false };
    root.dataset.position = record.position;
    if (host !== document.body) root.dataset.contained = '';
    const refresh = (): void => layout(region);

    const onEv = (prop: 'hover' | 'focus', on: boolean): void => {
      region[prop] = on;
      setPause(region, on, prop);
      refresh();
    };
    root.addEventListener('pointerenter', () => onEv('hover', true));
    root.addEventListener('pointerleave', () => onEv('hover', false));
    root.addEventListener('focusin', () => onEv('focus', true));
    root.addEventListener('focusout', (e) => {
      if (e.relatedTarget instanceof Node && root.contains(e.relatedTarget)) return;
      onEv('focus', false);
    });
    root.addEventListener('keydown', (event) => {
      const target = (event.target as Element).closest<HTMLElement>('.gk-toast');
      const item = target
        ? [...region.items.values()].find((entry) => entry.el === target)
        : undefined;

      if (event.key === 'Escape') {
        if (!item || item.record.dismissible === false) return;
        event.stopPropagation();
        store.dismiss(item.record.id, 'user');
        (lastFocus as HTMLElement | null)?.focus?.();
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const toastNodes = [...region.items.values()].map((i) => i.el);
        if (toastNodes.length <= 1) return;
        const currentIdx = target ? toastNodes.indexOf(target) : -1;
        const nextIdx =
          event.key === 'ArrowDown'
            ? (currentIdx + 1) % toastNodes.length
            : (currentIdx - 1 + toastNodes.length) % toastNodes.length;
        toastNodes[nextIdx]?.focus();
      }
    });

    host.append(root);
    regions.set(key, region);
    return region;
  };

  const close = (id: ToastId, reason: CloseReason): void => store.dismiss(id, reason);

  const button = (
    cls: string,
    spec: { label: string; ariaLabel?: string },
    record: ToastRecord,
    reason: CloseReason,
    onClick: ((event: { preventDefault(): void; defaultPrevented: boolean }) => void) | undefined,
  ): HTMLButtonElement => {
    const node = el('button', cls, { type: 'button', 'aria-label': spec.ariaLabel }, spec.label);
    node.addEventListener('click', (event) => {
      event.stopPropagation();
      let p = false;
      onClick?.({
        preventDefault: () => {
          p = true;
        },
        get defaultPrevented() {
          return p;
        },
      });
      if (!p) close(record.id, reason);
    });
    return node;
  };

  const build = (item: Item): void => {
    const record = item.record;
    item.stamp = stampOf(record);
    const c = cfg();
    const names = record.classNames ?? {};
    const unstyled = record.unstyled === true;
    const k = (base: string, extra?: string): string =>
      [unstyled ? '' : base, extra].filter(Boolean).join(' ');
    const node = item.el;
    node.replaceChildren();
    node.className = k(
      `gk-toast gk-toast--${record.type}`,
      [names.toast, record.className].filter(Boolean).join(' '),
    );

    const content = el('div', k('gk-toast__content gk-content', names.content));
    if (record.custom) {
      fill(
        content,
        record.custom({
          id: record.id,
          dismiss: () => close(record.id, 'api'),
          update: (patch) => void store.update(record.id, patch),
        }) as Renderable,
      );
    } else {
      if (record.badge !== undefined) {
        const bObj =
          typeof record.badge === 'object' && record.badge !== null ? record.badge : undefined;
        const tone: string = bObj ? (bObj.tone ?? 'info') : (record.badge as string);
        const badgeEl = el('div', k('gk-toast__badge gk-badge', names.badge), {
          'aria-hidden': 'true',
          'data-tone': tone,
        });
        if (bObj && bObj.icon) fill(badgeEl, bObj.icon);
        else if (bObj && bObj.label) badgeEl.textContent = bObj.label;
        else if (typeof record.badge === 'string' && !PATHS[tone as IconName])
          badgeEl.textContent = record.badge;
        else badgeEl.append(icon((PATHS[tone as IconName] ? tone : 'info') as IconName));
        node.append(badgeEl);
      } else {
        const customIcon = record.icon;
        const builtIn = customIcon === undefined ? iconForType(record.type) : undefined;
        const typeDef = store.types.get(record.type);
        const iconValue = customIcon === undefined ? typeDef?.icon : customIcon;
        if (customIcon !== false && (builtIn || iconValue !== undefined)) {
          const holder = el('div', k('gk-toast__icon gk-icon', names.icon), {
            'aria-hidden': 'true',
          });
          if (builtIn) holder.append(icon(builtIn));
          else fill(holder, iconValue);
          node.append(holder);
        }
      }

      if (record.avatar !== undefined) {
        const holder = el('div', k('gk-toast__avatar gk-avatar', names.avatar));
        const av = record.avatar;
        if (typeof av === 'object' && av !== null && !('nodeType' in av)) {
          const opt = av as ToastAvatarOption;
          if (opt.src) {
            holder.append(
              el('img', '', {
                src: safeUrl(opt.src) ? opt.src : '',
                alt: opt.alt ?? opt.name ?? '',
              }),
            );
          } else {
            const initials =
              opt.initials ??
              (opt.name
                ? opt.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : '?');
            holder.textContent = initials;
            holder.style.background = opt.color ?? deterministicColor(opt.name ?? initials);
            holder.style.color = '#fff';
          }
        } else if (typeof av === 'string') {
          holder.append(el('img', '', { src: safeUrl(av) ? av : '', alt: '' }));
        } else fill(holder, av as Renderable);
        node.append(holder);
      }

      if (record.title) {
        const title = el('div', k('gk-toast__title gk-title', names.title));
        fill(title, record.title);
        content.append(title);
      }
      if (record.description || record.html) {
        const desc = el('div', k('gk-toast__description gk-desc', names.description));
        fill(desc, record.description);
        if (record.html) {
          const fragment = sanitizeToFragment(record.html);
          if (fragment) desc.append(fragment);
        }
        content.append(desc);
      }

      if (record.progressValue !== undefined) {
        const pct = Math.max(0, Math.min(100, Math.round(record.progressValue * 100)));
        const fillEl = el('i', 'gk-progress-fill');
        fillEl.style.width = `${pct}%`;
        const track = el(
          'div',
          'gk-toast__track gk-track',
          {
            role: 'progressbar',
            'aria-label': record.progressLabel ?? 'Progress',
            'aria-valuenow': String(pct),
            'aria-valuemin': '0',
            'aria-valuemax': '100',
            ...(record.progressLabel ? { 'aria-valuetext': record.progressLabel } : {}),
          },
          fillEl,
        );
        content.append(track);
      }

      if (record.count > 1) {
        content.append(
          el(
            'span',
            k('gk-toast__count gk-count', names.count),
            { 'aria-hidden': 'true' },
            `${record.count}`,
          ),
        );
      }
    }
    const body =
      record.href && safeUrl(record.href)
        ? el(
            'a',
            k('gk-toast__link gk-link', names.link),
            {
              href: record.href,
              target: record.target ?? '_self',
              rel: record.target === '_blank' ? 'noopener noreferrer' : undefined,
            },
            content,
          )
        : content;
    node.append(body);

    if (record.timestamp) {
      node.append(
        el(
          'time',
          k('gk-toast__time gk-time', names.time),
          {},
          formatRelativeTime(record.timestamp, record.timestampLocale),
        ),
      );
    }

    if (record.kbd) node.append(el('kbd', k('gk-toast__kbd gk-kbd', names.kbd), {}, record.kbd));

    if (record.toggle) {
      const tg = record.toggle;
      const sw = el('button', 'gk-toast__switch gk-sw', {
        type: 'button',
        role: 'switch',
        'aria-checked': String(Boolean(tg.checked)),
        'aria-label': tg.label ?? 'Toggle option',
      });
      sw.addEventListener('click', (e) => {
        e.stopPropagation();
        const next = sw.getAttribute('aria-checked') !== 'true';
        sw.setAttribute('aria-checked', String(next));
        tg.onChange?.(next);
      });
      node.append(sw);
    }

    if (
      record.progress === 'ring' ||
      record.variant === 'countdown-ring' ||
      record.variant === 'progress-ring'
    ) {
      const val =
        record.progressValue ??
        (record.duration > 0 ? store.getRemaining(record.id) / record.duration : 1);
      const dash = 100.5 * (1 - val);
      const div = document.createElement('div');
      div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" class="gk-ring-svg"><circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="3" opacity="0.2"/><circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="100.5" stroke-linecap="round" stroke-dashoffset="${dash}"/></svg>`;
      node.append(div.firstElementChild as Element);
    }

    if (record.actions?.length) {
      const actionsDiv = el('div', k('gk-toast__actions gk-actions', names.actions));
      for (const act of record.actions) {
        const label = act.label ?? act.text ?? 'Action';
        const actBtn = el(
          'button',
          `gk-toast__action gk-btn gk-action gk-btn--${act.kind ?? 'secondary'}`,
          { type: 'button', 'aria-label': label },
          label,
        );
        actBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          act.onClick?.(e);
          if (act.autoDismiss !== false && !e.defaultPrevented) close(record.id, 'action');
        });
        actionsDiv.append(actBtn);
      }
      node.append(actionsDiv);
    } else if (record.action || record.cancel) {
      const actions = el('div', k('gk-toast__actions gk-actions', names.actions));
      if (record.cancel) {
        actions.append(
          button(
            k('gk-toast__cancel gk-btn gk-cancel gk-cancel-btn', names.cancelButton),
            record.cancel,
            record,
            'cancel',
            record.cancel.onClick,
          ),
        );
      }
      if (record.action) {
        actions.append(
          button(
            k('gk-toast__action gk-btn gk-action gk-action-btn', names.actionButton),
            record.action,
            record,
            'action',
            record.action.onClick,
          ),
        );
      }
      node.append(actions);
    }
    if (flag(record.closeButton, c.closeButton) && record.dismissible !== false) {
      const closeBtn = el(
        'button',
        k('gk-toast__close gk-close', names.closeButton),
        {
          type: 'button',
          'aria-label': record.closeButtonLabel ?? c.closeLabel ?? 'Close notification',
        },
        icon('close'),
      );
      closeBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        close(record.id, 'user');
      });
      node.append(closeBtn);
    }
    const showBar =
      record.duration > 0 &&
      (record.progress === 'bar' ||
        (record.progress !== 'none' &&
          record.progress !== 'ring' &&
          flag(record.progress as boolean | undefined, c.progress)));
    if (showBar) {
      const bar = el('i');
      bar.style.setProperty('--gk-d', `${record.duration}ms`);
      bar.style.setProperty(
        '--gk-delay',
        `-${Math.max(0, record.duration - store.getRemaining(record.id))}ms`,
      );
      node.append(
        el(
          'div',
          k('gk-toast__progress gk-progress', names.progress),
          { 'aria-hidden': 'true' },
          bar,
        ),
      );
    }
    item.stamp = stampOf(record);
  };

  const syncAttrs = (item: Item): void => {
    const record = item.record;
    const c = cfg();
    const node = item.el;
    const set = (name: string, value: string | undefined): void => {
      if (value === undefined) node.removeAttribute(name);
      else node.setAttribute(name, value);
    };

    const hostEl =
      (record.container ? document.getElementById(record.container) : undefined) ??
      node.parentElement?.closest('[data-gk-theme]');
    const containerTheme = hostEl?.getAttribute('data-gk-theme');
    const themeName = record.theme ?? containerTheme ?? c.theme;
    const activeVariant = resolveVariant(themeName, record.variant);
    set('data-gk-variant', activeVariant);

    if (record.hud || activeVariant === 'hud-silent') {
      set('role', 'status');
      set('aria-live', 'polite');
      set('data-hud', '');
    } else {
      set('role', record.role);
      set('aria-live', record.ariaLive);
    }
    set('aria-atomic', 'true');
    set('data-type', record.type);
    set('data-gk-theme', themeName);
    set('data-gk-mode', resolveMode(c.mode, flag(record.invert, c.invert)));
    set('data-dir', record.dir ?? c.dir);
    set('dir', (record.dir ?? c.dir) === 'auto' ? undefined : (record.dir ?? c.dir));
    set('data-animation', record.animation ?? c.animation ?? 'slide');
    if (record.shake || activeVariant === 'shake-error') set('data-shake', '');
    if (record.glow) set('data-glow', '');
    if (record.gradientBorder || activeVariant === 'gradient-border')
      set('data-gradient-border', '');
    if (record.group) set('data-group', record.group);
    if (record.island || activeVariant === 'island') set('data-island', '');
    const typeColor = store.types.get(record.type)?.color;
    if (typeColor) node.style.setProperty('--gk-type', typeColor);
    set('data-rich', flag(record.richColors, c.richColors) ? '' : undefined);
    set('data-dismissed', record.dismissed ? '' : undefined);
    set('data-state', record.dismissed ? 'exiting' : 'entered');
    set('data-paused', record.pausedBy.length > 0 ? '' : undefined);
    if (
      record.description ||
      record.html ||
      (record.action && record.cancel) ||
      (record.actions && record.actions.length > 1)
    )
      set('data-wrap', '');
    if (flag(record.closeButton, c.closeButton) && record.dismissible !== false)
      set('data-has-close', '');
    set(
      'data-clickable',
      flag(record.closeOnClick, c.closeOnClick) && record.dismissible !== false ? '' : undefined,
    );
    if (record.style) {
      for (const key of Object.keys(record.style))
        node.style.setProperty(key, String(record.style[key]));
    }
    const dirs = record.swipeDirections ?? defaultSwipe(record.position);
    const horizontal = dirs.some((d) => d === 'left' || d === 'right');
    const vertical = dirs.some((d) => d === 'up' || d === 'down');
    node.style.touchAction =
      horizontal && !vertical ? 'pan-y' : vertical && !horizontal ? 'pan-x' : 'none';
  };

  const attachGestures = (item: Item): void => {
    const node = item.el;
    let start: { x: number; y: number; time: number } | undefined;
    let axis: 'x' | 'y' | undefined;
    let hasDragged = false;

    const settings = (): { dirs: SwipeDirection[]; threshold: number; on: boolean } => ({
      dirs: item.record.swipeDirections ?? defaultSwipe(item.record.position),
      threshold: item.record.dragThreshold ?? cfg().dragThreshold,
      on: flag(item.record.swipe, cfg().swipe) && item.record.dismissible !== false,
    });

    node.addEventListener('pointerenter', () => {
      item.hover = true;
      if (!cfg().stack && pauseSet(item.record).includes('hover'))
        store.pause(item.record.id, 'hover');
    });
    node.addEventListener('pointerleave', () => {
      item.hover = false;
      if (!cfg().stack) store.resume(item.record.id, 'hover');
    });
    node.addEventListener('click', (event) => {
      if (hasDragged || item.swiping || (event.target as Element).closest(INTERACTIVE)) return;
      if (flag(item.record.closeOnClick, cfg().closeOnClick)) close(item.record.id, 'click');
    });
    node.addEventListener('pointerdown', (event) => {
      if (!settings().on || event.button !== 0 || (event.target as Element).closest(INTERACTIVE))
        return;
      start = { x: event.clientX, y: event.clientY, time: performance.now() };
      axis = undefined;
      hasDragged = false;
    });
    node.addEventListener('pointermove', (event) => {
      if (!start) return;
      const { dirs } = settings();
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (!axis) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 4) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        item.swiping = true;
        hasDragged = true;
        node.setPointerCapture?.(event.pointerId);
        node.dataset.swiping = '';
        store.pause(item.record.id, 'swipe');
      }
      const allowed = (
        axis === 'x' ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up'
      ) as SwipeDirection;
      const val = dirs.includes(allowed) ? (axis === 'x' ? dx : dy) : 0;
      node.style.setProperty('--gk-sx', axis === 'x' ? `${val}px` : '0px');
      node.style.setProperty('--gk-sy', axis === 'y' ? `${val}px` : '0px');
    });
    const finish = (event: PointerEvent): void => {
      if (!start) return;
      const { dirs, threshold } = settings();
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const duration = Math.max(1, performance.now() - start.time);
      const out = axis === 'x' ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
      const travelled = Math.abs(axis === 'x' ? dx : dy);
      const velocity = travelled / duration;
      const wasSwiping = item.swiping;
      start = undefined;
      delete node.dataset.swiping;
      store.resume(item.record.id, 'swipe');

      const dim = axis === 'x' ? node.offsetWidth || 350 : node.offsetHeight || 60;
      const limit = threshold <= 1 && threshold > 0 ? threshold * dim : threshold;
      if (
        wasSwiping &&
        dirs.includes(out as SwipeDirection) &&
        (travelled >= limit || (duration >= 40 && velocity > 0.6 && travelled > 20))
      ) {
        node.dataset.swipeOut = out;
        close(item.record.id, 'swipe');
      } else {
        node.style.setProperty('--gk-sx', '0px');
        node.style.setProperty('--gk-sy', '0px');
      }
      setTimeout(() => {
        item.swiping = false;
        hasDragged = false;
      }, 50);
    };
    node.addEventListener('pointerup', finish);
    node.addEventListener('pointercancel', finish);
  };

  let rendering = false;
  let rerenderRequested = false;

  const render = (): void => {
    if (rendering) {
      rerenderRequested = true;
      return;
    }
    rendering = true;
    try {
      do {
        rerenderRequested = false;
        doRender();
      } while (rerenderRequested);
    } finally {
      rendering = false;
    }
  };

  const doRender = (): void => {
    if (!document.body && !pendingHost) {
      pendingHost = true;
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          pendingHost = false;
          render();
        },
        { once: true },
      );
      return;
    }
    const c = cfg();
    const visible = store.getToasts().filter((t) => t.visible);
    const seen = new Set<string>();
    for (const record of visible) {
      const region = ensureRegion(record);
      if (!region) continue;
      seen.add(`${region.key}#${String(record.id)}`);
      let item = region.items.get(record.id);
      if (!item) {
        item = {
          el: el('li'),
          record,
          stamp: '',
          hover: false,
          swiping: false,
          height: 0,
          measured: false,
        };
        item.el.dataset.mounted = 'false';
        item.el.tabIndex = -1;
        region.items.set(record.id, item);
        region.list.append(item.el);
        resizeObserver?.observe(item.el);
        attachGestures(item);
        const created = item;
        raf(() => {
          created.el.dataset.mounted = 'true';
        });
      }
      item.record = record;
      syncAttrs(item);
      if (item.stamp !== stampOf(record)) build(item);
    }
    for (const region of regions.values()) {
      for (const [id, item] of region.items) {
        if (!seen.has(`${region.key}#${String(id)}`)) {
          resizeObserver?.unobserve(item.el);
          item.el.remove();
          region.items.delete(id);
        }
      }
      region.el.setAttribute('data-gk-theme', c.theme);
      region.el.setAttribute('data-gk-mode', c.mode);
      region.el.dataset.shadow = String(c.shadow);
      region.el.setAttribute('aria-label', c.regionLabel);
      const dir: Direction = c.dir;
      if (dir === 'auto') region.el.removeAttribute('dir');
      else region.el.setAttribute('dir', dir);

      // Offsets
      const setPx = (p: string, v: string | number | undefined) => {
        if (v !== undefined) region.el.style.setProperty(p, typeof v === 'number' ? `${v}px` : v);
      };
      const off = c.offset,
        isOff = typeof off === 'object' && off !== null;
      for (const s of ['top', 'bottom', 'left', 'right'] as const) {
        setPx(`--gk-offset-${s}`, isOff ? (off as Record<string, string | number>)[s] : off);
      }
      setPx('--gk-mobile-offset', c.mobileOffset);

      if (region.items.size === 0) {
        region.el.remove();
        regions.delete(region.key);
      } else layout(region);
    }
  };

  cleanups.push(store.subscribe(render), store.config.subscribe(render));

  const toggleHidden = (pause: boolean): void => {
    for (const t of store.getToasts()) {
      if (pauseSet(t).includes('hidden')) {
        if (pause) store.pause(t.id, 'hidden');
        else store.resume(t.id, 'hidden');
      }
    }
  };

  const focusNewest = (): boolean => {
    for (const region of regions.values()) {
      const last = [...region.items.values()].filter((i) => !i.record.dismissed).pop();
      if (last) {
        lastFocus = document.activeElement;
        last.el.focus();
        return true;
      }
    }
    return false;
  };

  const addEvt = (tgt: EventTarget, ev: string, fn: EventListener) => {
    tgt.addEventListener(ev, fn);
    cleanups.push(() => tgt.removeEventListener(ev, fn));
  };
  addEvt(document, 'visibilitychange', () => toggleHidden(document.visibilityState === 'hidden'));
  addEvt(window, 'blur', () => toggleHidden(true));
  addEvt(window, 'focus', () => toggleHidden(false));
  addEvt(window, 'resize', () => regions.forEach(layout));
  addEvt(document, 'keydown', ((event: KeyboardEvent) => {
    const spec = parseHotkey(cfg().hotkey);
    if (
      spec &&
      event.code === spec.code &&
      event.altKey === spec.alt &&
      event.ctrlKey === spec.ctrl &&
      event.shiftKey === spec.shift &&
      event.metaKey === spec.meta &&
      focusNewest()
    ) {
      event.preventDefault();
    }
  }) as EventListener);

  render();

  return {
    focus: focusNewest,
    destroy() {
      for (const fn of cleanups.splice(0)) fn();
      resizeObserver?.disconnect();
      for (const region of regions.values()) region.el.remove();
      regions.clear();
      shadowRoot?.host.remove();
      shadowRoot = undefined;
    },
  };
}

/** Whether the renderer can run in this environment. */
export function canMountToaster(): boolean {
  return hasDom() && typeof window !== 'undefined';
}

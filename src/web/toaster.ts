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
import { playSound, resolveToastSound } from './sound';

const COLORS = ['#38bdf8', '#818cf8', '#ec4899', '#f97316', '#10b981', '#6366f1', '#eab308'];

function deterministicColor(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return COLORS[h % 7] as string;
}

function formatRelativeTime(ts: number | Date | string | boolean, locale = 'en'): string {
  if (typeof ts === 'string') return ts;
  if (ts === true) return 'now';
  const min = Math.round(
    (Date.now() - (ts instanceof Date ? ts.getTime() : Number(ts) || Date.now())) / 6e4,
  );
  if (!min) return 'now';
  const [v, u] =
    min < 60
      ? [min, 'minute']
      : min < 1440
        ? [Math.round(min / 60), 'hour']
        : [Math.round(min / 1440), 'day'];
  try {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
      -v,
      u as Intl.RelativeTimeFormatUnit,
    );
  } catch {
    return `${v}${u[0]} ago`;
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
function getRobotSvg(c: string): string {
  const dot = (x: number, y = 18) => `<circle cx="${x}" cy="${y}" r="2" fill="currentColor"/>`;
  const eyes = dot(12) + dot(20);
  const ant = '<path d="M16 4v6M12 4h8"/>';
  const map: Record<string, string> = {
    wave: `${eyes}${ant}<path d="M2 14l4 4M30 10l-4 4"/>`,
    success: `<path d="M11 18l3 3 7-7"/>${ant}`,
    error: `<path d="M12 16l8 8M20 16l-8 8"/>${ant}`,
    think: `${eyes}<path d="M12 22h8M16 4v6"/>`,
    loading:
      '<circle cx="16" cy="18" r="4" stroke-dasharray="16" stroke-linecap="round"/><path d="M16 4v6"/>',
    sleep: '<path d="M10 18h4M18 18h4M16 4v6"/>',
    shock: `${dot(12, 16)}${dot(20, 16)}${dot(16, 22)}<path d="M16 4v6"/>`,
    search: '<circle cx="14" cy="18" r="4"/><path d="M17 21l4 4M16 4v6"/>',
    headPalm: `${dot(12)}<path d="M18 16h6v6M16 4v6"/>`,
  };
  return `<svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"${c === 'loading' ? ' class="gk-spin"' : ''}><rect x="6" y="10" width="20" height="16" rx="4"/>${map[c] ?? eyes + ant}</svg>`;
}

export function defaultSwipe(position?: ToastPosition): SwipeDirection[] {
  void position;
  return ['up', 'down', 'left', 'right'];
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
  return [document.documentElement, document.body].some(
    (el) =>
      el?.classList.contains('dark') ||
      el?.getAttribute('data-theme') === 'dark' ||
      el?.getAttribute('data-gk-mode') === 'dark',
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
    const isTop =
      region.key.includes('top-') ||
      region.key.endsWith('|center') ||
      region.key.endsWith('|middle');
    let offset = 0;
    let front = 0;
    let activeIdx = 0;

    list.forEach((item) => {
      const height = item.measured && item.height > 0 ? item.height : item.el.offsetHeight || 50;
      if (item.record.dismissed) return;
      const index = activeIdx++;
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
    region.list.style.pointerEvents = isExpanded ? 'auto' : '';
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
    const k = (base: string, extra?: string, short = base): string => {
      const cls = unstyled ? '' : `gk-toast__${base} gk-${short}`;
      return extra ? (cls ? `${cls} ${extra}` : extra) : cls;
    };
    const node = item.el;
    node.replaceChildren();
    node.className = [
      unstyled ? '' : `gk-toast gk-toast--${record.type}`,
      names.toast,
      record.className,
    ]
      .filter(Boolean)
      .join(' ');

    const content = el('div', k('content', names.content));
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
      const char = record.character ?? record.robotVariant;
      const hasMascot = Boolean(char || record.avatar);

      if (record.badge !== undefined) {
        const bObj =
          typeof record.badge === 'object' && record.badge !== null ? record.badge : undefined;
        const tone: string = bObj ? (bObj.tone ?? 'info') : (record.badge as string);
        const badgeEl = el('div', k('badge', names.badge), {
          'aria-hidden': 'true',
          'data-tone': tone,
        });
        if (bObj && bObj.icon) fill(badgeEl, bObj.icon);
        else if (bObj && bObj.label) badgeEl.textContent = bObj.label;
        else if (typeof record.badge === 'string' && !PATHS[tone as IconName])
          badgeEl.textContent = record.badge;
        else badgeEl.append(icon((PATHS[tone as IconName] ? tone : 'info') as IconName));
        node.append(badgeEl);
      } else if (!hasMascot || record.icon !== undefined) {
        const customIcon = record.icon;
        const builtIn = customIcon === undefined ? iconForType(record.type) : undefined;
        const typeDef = store.types.get(record.type);
        const iconValue = customIcon === undefined ? typeDef?.icon : customIcon;
        if (customIcon !== false && (builtIn || iconValue !== undefined)) {
          const holder = el('div', k('icon', names.icon), {
            'aria-hidden': 'true',
          });
          const a = record.iconAnimation ?? c.iconAnimation;
          const anim =
            record.animateIcon === false
              ? 'none'
              : (a ?? (record.type === 'loading' ? 'spin' : 'pop'));
          if (anim !== 'none') holder.dataset.iconAnim = anim;
          if (builtIn) holder.append(icon(builtIn));
          else fill(holder, iconValue);
          node.append(holder);
        }
      }

      if (char) {
        const holder = el(
          'div',
          `${k('avatar', names.avatar)}${unstyled ? '' : ' gk-character'}`.trim(),
        );
        holder.innerHTML = getRobotSvg(char);
        node.append(holder);
      }

      if (record.image) {
        const imgSrc = typeof record.image === 'string' ? record.image : record.image.src;
        if (imgSrc && safeUrl(imgSrc)) {
          const imgEl = el('img', k('image', names.image, 'image'), {
            src: imgSrc,
            alt: typeof record.image === 'object' ? (record.image.alt ?? '') : '',
          });
          node.prepend(imgEl);
        }
      }

      if (record.avatar !== undefined) {
        const holder = el('div', k('avatar', names.avatar));
        const av = record.avatar;
        if (typeof av === 'object' && av !== null && !('nodeType' in av)) {
          const opt = av as ToastAvatarOption;
          const src = opt.src && safeUrl(opt.src) ? opt.src : '';
          const renderInitials = (): void => {
            const init =
              opt.initials ??
              (opt.name
                ? opt.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : typeof record.title === 'string'
                  ? record.title.slice(0, 2).toUpperCase()
                  : '?');
            holder.textContent = init;
            holder.style.cssText = `background:${opt.color ?? deterministicColor(opt.name ?? init)};color:#fff`;
          };
          if (src) {
            const imgEl = el('img', '', {
              src,
              alt: opt.alt ?? opt.name ?? '',
            });
            imgEl.addEventListener('error', () => {
              imgEl.remove();
              renderInitials();
            });
            holder.append(imgEl);
          } else {
            renderInitials();
          }
        } else if (typeof av === 'string') {
          const imgEl = el('img', '', { src: safeUrl(av) ? av : '', alt: '' });
          imgEl.addEventListener('error', () => {
            imgEl.style.display = 'none';
            if (!holder.textContent) {
              const init =
                typeof record.title === 'string' ? record.title.slice(0, 2).toUpperCase() : '?';
              holder.textContent = init;
              holder.style.cssText = 'background:var(--gk-accent);color:#fff';
            }
          });
          holder.append(imgEl);
        } else fill(holder, av as Renderable);
        node.append(holder);
      }

      if (record.title) {
        const title = el('div', k('title', names.title));
        fill(title, record.title);
        if (record.count > 1) {
          title.append(
            el('span', k('count', names.count), { 'aria-hidden': 'true' }, `${record.count}`),
          );
        }
        content.append(title);
      } else if (record.count > 1) {
        content.append(
          el('span', k('count', names.count), { 'aria-hidden': 'true' }, `${record.count}`),
        );
      }
      if (record.description || record.html) {
        const desc = el('div', k('description', names.description, 'desc'));
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
    }
    const body =
      record.href && safeUrl(record.href)
        ? el(
            'a',
            k('link', names.link),
            {
              href: record.href,
              target: record.target ?? '_self',
              rel: record.target === '_blank' ? 'noopener noreferrer' : undefined,
            },
            content,
          )
        : content;
    node.append(body);

    const cText = record.closeText ?? record.discardText;
    const cIcon = record.closeIcon ?? record.discardIcon;
    const showClose =
      (flag(record.closeButton, c.closeButton) || Boolean(cText || cIcon)) &&
      record.dismissible !== false;

    const onCloseClick = (e: MouseEvent): void => {
      e.stopPropagation();
      close(record.id, 'user');
    };

    if (record.timestamp || record.kbd || (showClose && cText)) {
      const meta = el('div', k('meta', names.meta));
      if (record.timestamp) {
        meta.append(
          el(
            'time',
            k('time', names.time),
            {},
            formatRelativeTime(record.timestamp, record.timestampLocale),
          ),
        );
      }
      if (record.kbd) meta.append(el('kbd', k('kbd', names.kbd), {}, record.kbd));
      if (showClose && cText) {
        const closeBtn = el(
          'button',
          k('close', names.closeButton, 'close gk-close--text'),
          {
            type: 'button',
            'aria-label': record.closeButtonLabel ?? cText,
          },
          cText,
        );
        closeBtn.addEventListener('click', onCloseClick);
        meta.append(closeBtn);
      }
      node.append(meta);
    }

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
      const c = '<circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="3"';
      div.innerHTML = `<svg viewBox="0 0 36 36" class="gk-ring-svg">${c} opacity="0.2"/>${c} stroke-dasharray="100.5" stroke-linecap="round" stroke-dashoffset="${dash}"/></svg>`;
      node.append(div.firstElementChild as Element);
    }

    if (record.actions?.length) {
      const actionsDiv = el('div', k('actions', names.actions));
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
      const actions = el('div', k('actions', names.actions));
      if (record.cancel) {
        actions.append(
          button(
            k('cancel', names.cancelButton, 'btn gk-cancel gk-cancel-btn'),
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
            k('action', names.actionButton, 'btn gk-action gk-action-btn'),
            record.action,
            record,
            'action',
            record.action.onClick,
          ),
        );
      }
      node.append(actions);
    }

    if (showClose && !cText) {
      const closeBtn = el('button', k('close', names.closeButton), {
        type: 'button',
        'aria-label': record.closeButtonLabel ?? c.closeLabel ?? 'Close notification',
      });
      if (cIcon) fill(closeBtn, cIcon);
      else closeBtn.append(icon('close'));
      closeBtn.addEventListener('click', onCloseClick);
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
      node.append(el('div', k('progress', names.progress), { 'aria-hidden': 'true' }, bar));
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
    const toggle = (name: string, condition: unknown): void => {
      node.toggleAttribute(name, Boolean(condition));
    };

    const hostEl =
      (record.container ? document.getElementById(record.container) : undefined) ??
      node.parentElement?.closest('[data-gk-theme]');
    const themeName = record.theme ?? hostEl?.getAttribute('data-gk-theme') ?? c.theme;
    const activeVariant = resolveVariant(themeName, record.variant);
    set('data-gk-variant', activeVariant);

    const isHud = record.hud || activeVariant === 'hud-silent';
    set('role', isHud ? 'status' : record.role);
    set('aria-live', isHud ? 'polite' : record.ariaLive);
    toggle('data-hud', isHud);
    set('aria-atomic', 'true');
    set('data-type', record.type);
    set('data-gk-theme', themeName);
    set('data-gk-mode', resolveMode(c.mode, flag(record.invert, c.invert)));
    set('data-dir', record.dir ?? c.dir);
    set('dir', (record.dir ?? c.dir) === 'auto' ? undefined : (record.dir ?? c.dir));
    set('data-animation', record.animation ?? c.animation ?? 'slide');
    toggle('data-shake', record.shake || activeVariant === 'shake-error');
    toggle('data-glow', record.glow);
    toggle('data-gradient-border', record.gradientBorder || activeVariant === 'gradient-border');
    toggle('data-group', record.group);
    toggle('data-island', record.island || activeVariant === 'island');
    const typeColor = store.types.get(record.type)?.color;
    if (typeColor) node.style.setProperty('--gk-type', typeColor);
    toggle('data-rich', flag(record.richColors, c.richColors));
    toggle('data-dismissed', record.dismissed);
    set('data-state', record.dismissed ? 'exiting' : 'entered');
    toggle('data-paused', record.pausedBy.length > 0);
    toggle(
      'data-wrap',
      record.description ||
        record.html ||
        (record.action && record.cancel) ||
        (record.actions && record.actions.length > 1),
    );
    toggle(
      'data-has-close',
      flag(record.closeButton, c.closeButton) &&
        record.dismissible !== false &&
        !(record.closeText ?? record.discardText),
    );
    toggle(
      'data-clickable',
      flag(record.closeOnClick, c.closeOnClick) && record.dismissible !== false,
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
    let start: { x: number; y: number; t: number } | undefined;

    const setS = (x: number, y: number, r = 0): void => {
      node.style.setProperty('--gk-sx', `${Math.round(x)}px`);
      node.style.setProperty('--gk-sy', `${Math.round(y)}px`);
      if (r) node.style.setProperty('--gk-rot', `${r.toFixed(1)}deg`);
    };

    const settings = () => ({
      dirs: item.record.swipeDirections ?? defaultSwipe(item.record.position),
      threshold: item.record.dragThreshold ?? cfg().dragThreshold,
      on: flag(item.record.swipe, cfg().swipe) && item.record.dismissible !== false,
    });

    const delta = (e: PointerEvent, dirs: SwipeDirection[]) => {
      const rx = e.clientX - (start?.x ?? 0),
        ry = e.clientY - (start?.y ?? 0);
      return {
        dx: dirs.includes(rx >= 0 ? 'right' : 'left') ? rx : rx * 0.18,
        dy: dirs.includes(ry >= 0 ? 'down' : 'up') ? ry : ry * 0.18,
        rx,
        ry,
      };
    };

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
      if (item.swiping || (event.target as Element).closest(INTERACTIVE)) return;
      item.record.onPress?.(item.record);
      if (flag(item.record.closeOnClick, cfg().closeOnClick)) close(item.record.id, 'click');
    });
    node.addEventListener('pointerdown', (e) => {
      if (!settings().on || e.button !== 0 || (e.target as Element).closest(INTERACTIVE)) return;
      start = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    });
    node.addEventListener('pointermove', (e) => {
      if (!start) return;
      const { dx, dy } = delta(e, settings().dirs);
      if (!item.swiping) {
        if (Math.hypot(dx, dy) < 3) return;
        item.swiping = true;
        node.setPointerCapture?.(e.pointerId);
        node.dataset.swiping = '';
        store.pause(item.record.id, 'swipe');
      }
      setS(dx, dy, Math.max(-5, Math.min(5, dx * 0.028)));
    });
    const finish = (e: PointerEvent): void => {
      if (!start) return;
      const { dirs, threshold } = settings();
      const { dx, dy, rx, ry } = delta(e, dirs);
      const startT = start.t;
      const duration = Math.max(1, (e.timeStamp || performance.now()) - startT);
      const speed = Math.hypot(dx, dy) / duration;
      const wasSwiping = item.swiping;
      start = undefined;
      delete node.dataset.swiping;
      store.resume(item.record.id, 'swipe');

      const horiz = Math.abs(rx) >= Math.abs(ry);
      const out: SwipeDirection = horiz ? (rx >= 0 ? 'right' : 'left') : ry >= 0 ? 'down' : 'up';
      const dim = horiz ? node.offsetWidth || 350 : node.offsetHeight || 60;
      const limit = threshold <= 1 && threshold > 0 ? threshold * dim : threshold;
      const dist = Math.hypot(dx, dy);

      const isFlick = duration >= 40 && speed > 0.45 && dist > 15;
      if (wasSwiping && dirs.includes(out) && (dist >= limit || isFlick)) {
        node.dataset.swipeOut = out;
        node.dataset.flung = '';
        const len = dist || 1;
        const reach = Math.max(280, speed * 360);
        const fx = (dx / len) * reach;
        const fy = (dy / len) * reach;
        setS(fx, fy, Math.max(-10, Math.min(10, fx * 0.02)));
        close(item.record.id, 'swipe');
      } else setS(0, 0);
      setTimeout(() => {
        item.swiping = false;
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
        const cue = resolveToastSound(record.sound, c.sound, record.type);
        if (cue) {
          playSound(cue, record.soundVolume ?? c.soundVolume ?? 0.5);
        }
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

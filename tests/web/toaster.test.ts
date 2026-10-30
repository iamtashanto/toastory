// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetEngine, setAutoMount, registerWebRenderer, ui } from '../../src/web';
import { defaultSwipe, parseHotkey, resolveMode, mountToaster } from '../../src/web/toaster';

const region = (): HTMLElement | null => document.querySelector('.gk-region');
const toastEls = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>('.gk-list > *'));
const last = (): HTMLElement => {
  const list = toastEls();
  const node = list[list.length - 1];
  if (!node) throw new Error('no toast rendered');
  return node;
};

function pointer(target: Element, type: string, init: { x?: number; y?: number } = {}): void {
  const Ctor = typeof PointerEvent === 'function' ? PointerEvent : MouseEvent;
  target.dispatchEvent(
    new Ctor(type, { bubbles: true, button: 0, clientX: init.x ?? 0, clientY: init.y ?? 0 }),
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  resetEngine();
});
afterEach(() => {
  resetEngine();
  document.body.replaceChildren();
  vi.useRealTimers();
});

describe('region and semantics', () => {
  it('creates one labelled region and renders title and description', () => {
    ui.toast('Saved', { description: 'All good' });
    const r = region();
    expect(r?.getAttribute('aria-label')).toBe('Notifications');
    expect(r?.dataset.position).toBe('top-right');
    expect(last().querySelector('.gk-title')?.textContent).toBe('Saved');
    expect(last().querySelector('.gk-desc')?.textContent).toBe('All good');
  });

  it('exposes role and aria-live from the resolved record', () => {
    ui.toast('plain');
    expect(last().getAttribute('role')).toBe('status');
    expect(last().getAttribute('aria-live')).toBe('polite');
    expect(last().getAttribute('aria-atomic')).toBe('true');
    ui.toast.error('bad');
    expect(last().getAttribute('role')).toBe('alert');
    expect(last().getAttribute('aria-live')).toBe('assertive');
    ui.toast('custom', { role: 'log', ariaLive: 'off' });
    expect(last().getAttribute('role')).toBe('log');
    expect(last().getAttribute('aria-live')).toBe('off');
  });

  it('renders built-in icons per type and hides them with icon:false', () => {
    for (const type of ['success', 'error', 'warning', 'info', 'loading'] as const) {
      ui.toast[type](type);
      expect(last().querySelector('.gk-icon svg'), type).not.toBeNull();
      expect(last().querySelector('.gk-icon svg')?.getAttribute('aria-hidden')).toBe('true');
    }
    ui.toast('none');
    expect(last().querySelector('.gk-icon')).toBeNull();
    ui.toast.success('hidden', { icon: false });
    expect(last().querySelector('.gk-icon')).toBeNull();
  });

  it('supports string and node icons, avatars and custom type icons', () => {
    ui.toast('s', { icon: '*' });
    expect(last().querySelector('.gk-icon')?.textContent).toBe('*');
    const node = document.createElement('b');
    node.textContent = 'n';
    ui.toast('n', { icon: node });
    expect(last().querySelector('.gk-icon b')).toBe(node);
    ui.toast('a', { avatar: 'https://example.com/a.png' });
    expect(last().querySelector('.gk-avatar img')?.getAttribute('src')).toBe(
      'https://example.com/a.png',
    );
    ui.toast('bad', { avatar: 'javascript:alert(1)' });
    expect(last().querySelector('.gk-avatar img')?.getAttribute('src')).toBe('');
    ui.toast.types.add('rocket', { icon: 'R', color: '#ff00ff' });
    ui.toast('r', { type: 'rocket' });
    expect(last().querySelector('.gk-icon')?.textContent).toBe('R');
    expect(last().style.getPropertyValue('--gk-type')).toBe('#ff00ff');
  });

  it('applies theme, mode, direction, rich, invert, className, classNames and unstyled', () => {
    ui.configure({ theme: 'neon', mode: 'dark', dir: 'rtl' });
    ui.toast('x', { richColors: true, className: 'mine', classNames: { title: 'my-title' } });
    const t = last();
    expect(t.getAttribute('data-gk-theme')).toBe('neon');
    expect(t.getAttribute('data-gk-mode')).toBe('dark');
    expect(t.getAttribute('dir')).toBe('rtl');
    expect(t.hasAttribute('data-rich')).toBe(true);
    expect(t.classList.contains('mine')).toBe(true);
    expect(t.querySelector('.gk-title')?.classList.contains('my-title')).toBe(true);
    ui.toast('y', { theme: 'pastel', invert: true });
    expect(last().getAttribute('data-gk-theme')).toBe('pastel');
    expect(last().getAttribute('data-gk-mode')).toBe('light');
    ui.toast('z', { unstyled: true, className: 'bare', classNames: { title: 't' } });
    expect(last().classList.contains('gk-toast')).toBe(false);
    expect(last().classList.contains('bare')).toBe(true);
    expect(last().querySelector('.gk-title')).toBeNull();
    expect(last().querySelector('.t')?.textContent).toBe('z');
  });

  it('applies inline style and dir overrides per toast', () => {
    ui.toast('x', { style: { '--gk-width': '500px', color: 'red' }, dir: 'ltr' });
    expect(last().style.getPropertyValue('--gk-width')).toBe('500px');
    expect(last().style.color).toBe('red');
    expect(last().getAttribute('dir')).toBe('ltr');
  });

  it('creates separate regions per position and container', () => {
    const host = document.createElement('div');
    host.id = 'host';
    document.body.append(host);
    ui.toast('a', { position: 'bottom-left' });
    ui.toast('b', { position: 'top-center' });
    ui.toast('c', { container: 'host' });
    const regions = Array.from(document.querySelectorAll<HTMLElement>('.gk-region'));
    expect(regions.map((r) => r.dataset.position).sort()).toEqual([
      'bottom-left',
      'top-center',
      'top-right',
    ]);
    expect(host.querySelector('.gk-region')?.hasAttribute('data-contained')).toBe(true);
    ui.configure({ container: 'host' });
    ui.toast('d', { position: 'top-left' });
    expect(host.querySelectorAll('.gk-region')).toHaveLength(2);
  });

  it('removes the region after the last toast leaves', () => {
    const id = ui.toast('x');
    ui.toast.dismiss(id);
    vi.advanceTimersByTime(300);
    expect(region()).toBeNull();
  });

  it('applies the shadow flag and region label from configuration', () => {
    ui.configure({ shadow: false, regionLabel: 'Alerts' });
    ui.toast('x');
    expect(region()?.dataset.shadow).toBe('false');
    expect(region()?.getAttribute('aria-label')).toBe('Alerts');
  });
});

describe('content', () => {
  it('sanitizes html and keeps safe markup', () => {
    ui.toast('x', {
      html: '<b>bold</b><script>window.__x=1</script><img src="javascript:1" onerror="window.__y=1"><a href="https://a.test" target="_blank" onclick="1">l</a>',
    });
    const desc = last().querySelector('.gk-desc') as HTMLElement;
    expect(desc.querySelector('b')?.textContent).toBe('bold');
    expect(desc.querySelector('script')).toBeNull();
    expect(desc.querySelector('img')?.hasAttribute('onerror')).toBe(false);
    expect(desc.querySelector('img')?.hasAttribute('src')).toBe(false);
    const a = desc.querySelector('a');
    expect(a?.hasAttribute('onclick')).toBe(false);
    expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders href as a link with target and rel, and ignores unsafe urls', () => {
    ui.toast('x', { href: 'https://example.com', target: '_blank' });
    const a = last().querySelector('a.gk-link');
    expect(a?.getAttribute('href')).toBe('https://example.com');
    expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
    ui.toast('y', { href: 'javascript:alert(1)' });
    expect(last().querySelector('a.gk-link')).toBeNull();
  });

  it('renders custom renderers (node and string) and passes dismiss and update', () => {
    const node = document.createElement('div');
    node.className = 'mine';
    const id = ui.toast.custom(() => node, { duration: 0 });
    expect(last().querySelector('.mine')).toBe(node);
    ui.toast.custom(() => 'plain text');
    expect(last().textContent).toBe('plain text');
    ui.toast.custom(
      ({ dismiss, update }) => {
        update({ duration: 0 });
        const b = document.createElement('button');
        b.addEventListener('click', dismiss);
        return b;
      },
      { id: 'c' },
    );
    last().querySelector('button')?.click();
    expect(ui.toast.getToasts().find((t) => t.id === 'c')?.dismissed).toBe(true);
    ui.toast.dismiss(id);
  });

  it('shows a counter for deduplicated toasts', () => {
    ui.toast('same', { dedupe: true });
    ui.toast('same', { dedupe: true });
    expect(toastEls()).toHaveLength(1);
    expect(last().querySelector('.gk-count')?.textContent).toBe('2');
  });

  it('rebuilds content on update', () => {
    const id = ui.toast('before');
    ui.toast.update(id, { title: 'after', description: 'more' });
    expect(last().querySelector('.gk-title')?.textContent).toBe('after');
    expect(last().querySelector('.gk-desc')?.textContent).toBe('more');
  });
});

describe('buttons', () => {
  it('action closes the toast after onClick; preventDefault keeps it open', () => {
    const onClick = vi.fn();
    ui.toast('x', { id: 'a', action: { label: 'Undo', onClick } });
    last().querySelector<HTMLButtonElement>('.gk-action')?.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
    ui.toast('y', {
      id: 'b',
      action: {
        label: 'Keep',
        onClick: (e) => {
          e.preventDefault();
        },
      },
    });
    document.querySelectorAll<HTMLButtonElement>('.gk-action')[1]?.click();
    expect(ui.toast.getToasts().find((t) => t.id === 'b')?.dismissed).toBe(false);
  });

  it('cancel button dismisses and honours its ariaLabel', () => {
    const onClick = vi.fn();
    ui.toast('x', { cancel: { label: 'No', onClick, ariaLabel: 'Do not do it' } });
    const btn = last().querySelector<HTMLButtonElement>('.gk-cancel');
    expect(btn?.getAttribute('aria-label')).toBe('Do not do it');
    btn?.click();
    expect(onClick).toHaveBeenCalled();
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
  });

  it('close button is a labelled keyboard-reachable button and respects dismissible', () => {
    ui.toast('x', { closeButton: true });
    const close = last().querySelector<HTMLButtonElement>('.gk-close');
    expect(close?.tagName).toBe('BUTTON');
    expect(close?.getAttribute('aria-label')).toBe('Close notification');
    close?.click();
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
    ui.toast('y', { closeButton: true, dismissible: false });
    expect(last().querySelector('.gk-close')).toBeNull();
  });

  it('closeOnClick dismisses when the body is clicked but not when a button is', () => {
    ui.toast('x', {
      closeOnClick: true,
      id: 'c',
      action: { label: 'A', onClick: (e) => e.preventDefault() },
    });
    expect(last().hasAttribute('data-clickable')).toBe(true);
    last().querySelector<HTMLElement>('.gk-action')?.click();
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(false);
    last().click();
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
  });
});

describe('progress', () => {
  it('renders a progress bar with the duration when enabled', () => {
    ui.toast('x', { progress: true, duration: 3000 });
    const bar = last().querySelector<HTMLElement>('.gk-progress i');
    expect(bar?.style.getPropertyValue('--gk-d')).toBe('3000ms');
    ui.toast('y', { progress: false });
    expect(last().querySelector('.gk-progress')).toBeNull();
    ui.toast('z', { progress: true, duration: 0 });
    expect(last().querySelector('.gk-progress')).toBeNull();
  });

  it('marks paused toasts so the animation stops', () => {
    ui.toast('x', { progress: true });
    last().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(last().hasAttribute('data-paused')).toBe(true);
  });
});

describe('pausing', () => {
  it('pauses on hover and resumes on leave', () => {
    ui.toast('x', { duration: 1000 });
    region()?.dispatchEvent(new MouseEvent('pointerenter'));
    vi.advanceTimersByTime(5000);
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(false);
    region()?.dispatchEvent(new MouseEvent('pointerleave'));
    vi.advanceTimersByTime(1000);
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
  });

  it('pauses on focus and resumes on blur', () => {
    ui.toast('x', { duration: 1000, action: { label: 'A' } });
    const button = last().querySelector<HTMLElement>('.gk-action');
    button?.focus();
    region()?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    vi.advanceTimersByTime(5000);
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(false);
    region()?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    vi.advanceTimersByTime(1000);
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
  });

  it('pauses while the page is hidden', () => {
    ui.toast('x', { duration: 1000 });
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(5000);
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(false);
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(1000);
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
  });

  it('respects a pauseOn list that excludes a trigger', () => {
    ui.toast('x', { duration: 1000, pauseOn: [] });
    region()?.dispatchEvent(new MouseEvent('pointerenter'));
    vi.advanceTimersByTime(1000);
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
  });
});

describe('swipe', () => {
  it('dismisses when dragged past the threshold in an allowed direction', () => {
    ui.toast('x', { id: 's', position: 'top-right' });
    const t = last();
    pointer(t, 'pointerdown', { x: 0 });
    pointer(t, 'pointermove', { x: 30 });
    pointer(t, 'pointermove', { x: 90 });
    expect(t.hasAttribute('data-swiping')).toBe(true);
    pointer(t, 'pointerup', { x: 90 });
    expect(t.dataset.swipeOut).toBe('right');
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
  });

  it('snaps back below the threshold and ignores disallowed directions', () => {
    ui.toast('x', { dragThreshold: 100 });
    const t = last();
    pointer(t, 'pointerdown', { x: 0 });
    pointer(t, 'pointermove', { x: 60 });
    pointer(t, 'pointerup', { x: 60 });
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(false);
    expect(t.style.getPropertyValue('--gk-sx')).toBe('0px');
    pointer(t, 'pointerdown', { x: 0 });
    pointer(t, 'pointermove', { x: -200 });
    pointer(t, 'pointerup', { x: -200 });
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(false);
  });

  it('honours swipeDirections, swipe:false and non-dismissible toasts', () => {
    ui.toast('x', { swipeDirections: ['left'], id: 'l' });
    const t = last();
    pointer(t, 'pointerdown', { x: 0 });
    pointer(t, 'pointermove', { x: -80 });
    pointer(t, 'pointerup', { x: -80 });
    expect(t.dataset.swipeOut).toBe('left');
    ui.toast('y', { swipe: false, id: 'n' });
    const n = last();
    pointer(n, 'pointerdown', { x: 0 });
    pointer(n, 'pointermove', { x: 200 });
    pointer(n, 'pointerup', { x: 200 });
    expect(ui.toast.getToasts().find((x) => x.id === 'n')?.dismissed).toBe(false);
    ui.toast('z', { dismissible: false, id: 'd' });
    const d = last();
    pointer(d, 'pointerdown', { x: 0 });
    pointer(d, 'pointermove', { x: 200 });
    pointer(d, 'pointerup', { x: 200 });
    expect(ui.toast.getToasts().find((x) => x.id === 'd')?.dismissed).toBe(false);
  });

  it('does not start a swipe from a button', () => {
    ui.toast('x', { action: { label: 'A', onClick: (e) => e.preventDefault() } });
    const button = last().querySelector('.gk-action') as HTMLElement;
    pointer(button, 'pointerdown', { x: 0 });
    pointer(button, 'pointermove', { x: 200 });
    expect(last().hasAttribute('data-swiping')).toBe(false);
  });

  it('computes default swipe directions by position', () => {
    expect(defaultSwipe('top-left')).toEqual(['left']);
    expect(defaultSwipe('bottom-right')).toEqual(['right']);
    expect(defaultSwipe('top-center')).toEqual(['up']);
    expect(defaultSwipe('bottom-center')).toEqual(['down']);
  });
});

describe('keyboard', () => {
  it('Escape on a focused toast dismisses it, unless non-dismissible', () => {
    ui.toast('x', { id: 'e' });
    last().focus();
    last().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
    ui.toast('y', { id: 'f', dismissible: false });
    last().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(ui.toast.getToasts().find((t) => t.id === 'f')?.dismissed).toBe(false);
  });

  it('the hotkey focuses the newest toast', () => {
    ui.toast('old');
    ui.toast('new');
    document.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'KeyT', altKey: true, bubbles: true }),
    );
    expect(document.activeElement).toBe(last());
  });

  it('ignores other keys, and can be disabled', () => {
    ui.toast('x');
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyT', bubbles: true }));
    expect(document.activeElement).not.toBe(last());
    ui.configure({ hotkey: '' });
    document.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'KeyT', altKey: true, bubbles: true }),
    );
    expect(document.activeElement).not.toBe(last());
  });

  it('parses hotkeys', () => {
    expect(parseHotkey('alt+t')).toEqual({
      alt: true,
      ctrl: false,
      shift: false,
      meta: false,
      code: 'KeyT',
    });
    expect(parseHotkey('ctrl+shift+5')).toMatchObject({ ctrl: true, shift: true, code: 'Digit5' });
    expect(parseHotkey('')).toBeUndefined();
    expect(parseHotkey('alt+')).toBeUndefined();
  });
});

describe('stack and queue', () => {
  it('writes stacking variables and expands on hover when stack is on', () => {
    ui.toast('a', { duration: 0 });
    ui.toast('b', { duration: 0 });
    const [first, second] = toastEls();
    expect(first?.style.getPropertyValue('--gk-index')).toBe('1');
    expect(second?.style.getPropertyValue('--gk-index')).toBe('0');
    expect(region()?.dataset.expanded).toBe('false');
    region()?.dispatchEvent(new MouseEvent('pointerenter'));
    expect(region()?.dataset.expanded).toBe('true');
    region()?.dispatchEvent(new MouseEvent('pointerleave'));
    expect(region()?.dataset.expanded).toBe('false');
  });

  it('is always expanded with stack:false and exposes the gap', () => {
    ui.configure({ stack: false, gap: 20 });
    ui.toast('a', { duration: 0 });
    ui.toast('b', { duration: 0 });
    expect(region()?.dataset.expanded).toBe('true');
    expect(region()?.style.getPropertyValue('--gk-gap')).toBe('20px');
  });

  it('renders at most maxVisible toasts and promotes queued ones', () => {
    ui.configure({ maxVisible: 2 });
    ui.toast('a', { duration: 0, id: 'a' });
    ui.toast('b', { duration: 0 });
    ui.toast('c', { duration: 0 });
    expect(toastEls()).toHaveLength(2);
    ui.toast.dismiss('a');
    vi.advanceTimersByTime(300);
    expect(toastEls().map((t) => t.querySelector('.gk-title')?.textContent)).toEqual(['b', 'c']);
  });

  it('marks cards far behind the front as hidden', () => {
    ui.configure({ maxVisible: 6 });
    for (let i = 0; i < 5; i += 1) ui.toast(`t${i}`, { duration: 0 });
    expect(toastEls().filter((t) => t.hasAttribute('data-far'))).toHaveLength(2);
  });
});

describe('mode and adapters', () => {
  it('resolves inverted modes', () => {
    expect(resolveMode('light', true)).toBe('dark');
    expect(resolveMode('dark', true)).toBe('light');
    expect(resolveMode('dark', false)).toBe('dark');
    expect(resolveMode('auto', false)).toBe('auto');
  });

  it('does not render when auto-mount is disabled, and mounts when re-enabled', () => {
    setAutoMount(false);
    ui.toast('hidden');
    expect(region()).toBeNull();
    setAutoMount(true);
    expect(toastEls()).toHaveLength(1);
    setAutoMount(false);
    expect(region()).toBeNull();
  });

  it('exposes the live toast list through the store', () => {
    const id = ui.toast('x');
    expect(ui.toast.getToasts().map((t) => t.id)).toEqual([id]);
  });
});

describe('open callbacks', () => {
  it('fires onOpen, onDismiss and onClose through the renderer', () => {
    const onOpen = vi.fn();
    const onDismiss = vi.fn();
    const onClose = vi.fn();
    const onAutoClose = vi.fn();
    ui.toast('x', { duration: 500, onOpen, onDismiss, onClose, onAutoClose });
    expect(onOpen).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(500);
    expect(onAutoClose).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(300);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});

describe('advanced web renderer features', () => {
  it('supports BEM class names and structure', () => {
    ui.toast('BEM title', {
      description: 'BEM description',
      action: { label: 'BEM Action' },
      cancel: { label: 'BEM Cancel' },
      closeButton: true,
      progress: true,
      duration: 3000,
    });
    const t = last();
    expect(t.tagName).toBe('LI');
    expect(t.classList.contains('gk-toast')).toBe(true);
    expect(t.querySelector('.gk-toast__title')).not.toBeNull();
    expect(t.querySelector('.gk-toast__description')).not.toBeNull();
    expect(t.querySelector('.gk-toast__actions')).not.toBeNull();
    expect(t.querySelector('.gk-toast__action')).not.toBeNull();
    expect(t.querySelector('.gk-toast__cancel')).not.toBeNull();
    expect(t.querySelector('.gk-toast__close')).not.toBeNull();
    expect(t.querySelector('.gk-toast__progress')).not.toBeNull();
  });

  it('sets animation data attributes for custom animations', () => {
    ui.toast('Bounce', { animation: 'bounce' });
    expect(last().getAttribute('data-animation')).toBe('bounce');

    ui.toast('Zoom', { animation: 'zoom' });
    expect(last().getAttribute('data-animation')).toBe('zoom');

    ui.toast('Spring', { animation: 'spring' });
    expect(last().getAttribute('data-animation')).toBe('spring');
  });

  it('supports per-side offset and mobileOffset configuration', () => {
    ui.configure({
      offset: { top: 24, bottom: 32, left: '20px', right: '20px' },
      mobileOffset: 40,
    });
    ui.toast('Offset toast');
    const r = region();
    expect(r?.style.getPropertyValue('--gk-offset-top')).toBe('24px');
    expect(r?.style.getPropertyValue('--gk-offset-bottom')).toBe('32px');
    expect(r?.style.getPropertyValue('--gk-offset-left')).toBe('20px');
    expect(r?.style.getPropertyValue('--gk-offset-right')).toBe('20px');
    expect(r?.style.getPropertyValue('--gk-mobile-offset')).toBe('40px');
  });

  it('pauses toasts on window blur and resumes on window focus', () => {
    ui.toast('Blur pause', { duration: 1000 });
    window.dispatchEvent(new Event('blur'));
    vi.advanceTimersByTime(5000);
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(false);

    window.dispatchEvent(new Event('focus'));
    vi.advanceTimersByTime(1000);
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
  });

  it('supports arrow key roving focus between toasts in the region', () => {
    ui.toast('First', { duration: 0 });
    ui.toast('Second', { duration: 0 });
    const toasts = toastEls();
    toasts[0]?.focus();

    toasts[0]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(toasts[1]);

    toasts[1]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(toasts[0]);
  });

  it('registers web renderer and mounts in shadow DOM mode', () => {
    const host = document.createElement('div');
    host.id = 'shadow-host';
    document.body.append(host);

    const handle = mountToaster(ui.toastStore, { container: host, shadow: true });
    ui.toast('Shadow toast', { duration: 0 });

    const shadowPortal = host.querySelector('#gk-shadow-portal');
    expect(shadowPortal).not.toBeNull();
    expect(shadowPortal?.shadowRoot).not.toBeNull();
    const shadowToast = shadowPortal?.shadowRoot?.querySelector('.gk-toast');
    expect(shadowToast).not.toBeNull();

    handle.destroy();
  });

  it('sets data-wrap and data-has-close for responsive layout wrapping', () => {
    ui.toast('Short title');
    expect(last().hasAttribute('data-wrap')).toBe(false);
    expect(last().hasAttribute('data-has-close')).toBe(false);

    ui.toast('Title with desc', { description: 'Detail prose', closeButton: true });
    expect(last().hasAttribute('data-wrap')).toBe(true);
    expect(last().hasAttribute('data-has-close')).toBe(true);

    ui.toast('Title with 2 buttons', {
      action: { label: 'Confirm' },
      cancel: { label: 'Dismiss' },
    });
    expect(last().hasAttribute('data-wrap')).toBe(true);
  });

  it('registerWebRenderer connects engine and returns it', () => {
    const engine = registerWebRenderer();
    expect(engine).toBeDefined();
    expect(engine.store).toBeDefined();
    expect(engine.toast).toBeDefined();
  });
});

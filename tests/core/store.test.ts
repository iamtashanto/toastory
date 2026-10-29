import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createConfigStore, createToastEngine, MANUAL_PAUSE } from '../../src/core';
import type { ToastRecord } from '../../src/core';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

const find = (list: readonly ToastRecord[], id: string | number): ToastRecord | undefined =>
  list.find((t) => t.id === id);

describe('toast store: creation and resolution', () => {
  it('creates a toast with resolved defaults', () => {
    const { toast, store } = createToastEngine();
    const id = toast('Saved', { description: 'All good' });
    const record = find(store.getToasts(), id);
    expect(record).toMatchObject({
      title: 'Saved',
      description: 'All good',
      type: 'default',
      duration: 4000,
      position: 'top-right',
      ariaLive: 'polite',
      role: 'status',
      visible: true,
      dismissed: false,
      count: 1,
    });
  });

  it('honours an explicit id, type, position, container and dir', () => {
    const { toast, store } = createToastEngine();
    const id = toast.success('ok', {
      id: 'fixed',
      position: 'bottom-center',
      container: 'main',
      dir: 'rtl',
    });
    expect(id).toBe('fixed');
    expect(find(store.getToasts(), id)).toMatchObject({
      type: 'success',
      position: 'bottom-center',
      container: 'main',
      dir: 'rtl',
    });
  });

  it('prefers options.title over the message argument', () => {
    const { toast, store } = createToastEngine();
    const id = toast('ignored', { title: 'wins' });
    expect(find(store.getToasts(), id)?.title).toBe('wins');
  });

  it('keeps passthrough options on the record', () => {
    const { toast, store } = createToastEngine();
    const id = toast('x', {
      icon: false,
      avatar: 'a.png',
      action: { label: 'Undo' },
      cancel: { label: 'Nope' },
      closeButton: true,
      dismissible: true,
      closeOnClick: true,
      progress: true,
      pauseOn: ['hover'],
      swipe: true,
      swipeDirections: ['left'],
      dragThreshold: 80,
      richColors: true,
      invert: true,
      theme: 'neon',
      className: 'c',
      classNames: { title: 't' },
      style: { color: 'red' },
      unstyled: true,
      html: '<b>x</b>',
      href: '/a',
      target: '_blank',
    });
    const record = find(store.getToasts(), id);
    expect(record).toMatchObject({
      icon: false,
      avatar: 'a.png',
      closeButton: true,
      closeOnClick: true,
      progress: true,
      pauseOn: ['hover'],
      swipeDirections: ['left'],
      dragThreshold: 80,
      richColors: true,
      invert: true,
      theme: 'neon',
      className: 'c',
      unstyled: true,
      html: '<b>x</b>',
      href: '/a',
      target: '_blank',
    });
    expect(record?.action?.label).toBe('Undo');
    expect(record?.cancel?.label).toBe('Nope');
    expect(record?.classNames?.title).toBe('t');
    expect(record?.style).toEqual({ color: 'red' });
  });

  it('uses assertive semantics for errors and important toasts', () => {
    const { toast, store } = createToastEngine();
    const error = toast.error('boom');
    const important = toast('urgent', { important: true });
    const custom = toast('quiet', { ariaLive: 'off', role: 'log' });
    expect(find(store.getToasts(), error)).toMatchObject({ ariaLive: 'assertive', role: 'alert' });
    expect(find(store.getToasts(), important)).toMatchObject({
      ariaLive: 'assertive',
      role: 'alert',
    });
    expect(find(store.getToasts(), custom)).toMatchObject({ ariaLive: 'off', role: 'log' });
  });

  it('treats duration 0 and Infinity as persistent', () => {
    const { toast, store } = createToastEngine();
    const a = toast('a', { duration: 0 });
    const b = toast('b', { duration: Infinity });
    vi.advanceTimersByTime(1e7);
    expect(find(store.getToasts(), a)?.remaining).toBe(Infinity);
    expect(find(store.getToasts(), b)?.duration).toBe(0);
    expect(store.getToasts()).toHaveLength(2);
  });

  it('loading toasts are persistent by default', () => {
    const { toast, store } = createToastEngine();
    const id = toast.loading('wait');
    vi.advanceTimersByTime(60000);
    expect(find(store.getToasts(), id)?.type).toBe('loading');
  });

  it('applies config defaults for duration and position', () => {
    const config = createConfigStore({ duration: 1000, position: 'bottom-left' });
    const { toast, store } = createToastEngine({ config });
    const id = toast('x');
    expect(find(store.getToasts(), id)).toMatchObject({ duration: 1000, position: 'bottom-left' });
  });
});

describe('toast store: lifecycle', () => {
  it('auto-closes after the duration and fires callbacks in order', () => {
    const { toast, store } = createToastEngine();
    const calls: string[] = [];
    toast('x', {
      duration: 1000,
      onOpen: () => calls.push('open'),
      onAutoClose: () => calls.push('auto'),
      onDismiss: () => calls.push('dismiss'),
      onClose: (_t, reason) => calls.push(`close:${reason}`),
    });
    expect(calls).toEqual(['open']);
    vi.advanceTimersByTime(1000);
    expect(store.getToasts()[0]?.dismissed).toBe(true);
    vi.advanceTimersByTime(250);
    expect(store.getToasts()).toHaveLength(0);
    expect(calls).toEqual(['open', 'auto', 'close:auto']);
  });

  it('dismiss fires onDismiss then onClose with the reason', () => {
    const { toast, store } = createToastEngine();
    const onDismiss = vi.fn();
    const onClose = vi.fn();
    const id = toast('x', { onDismiss, onClose });
    store.dismiss(id, 'user');
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(250);
    expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ id }), 'user');
  });

  it('removes immediately when exitDuration is 0', () => {
    const config = createConfigStore({ exitDuration: 0 });
    const { toast, store } = createToastEngine({ config });
    const id = toast('x');
    toast.dismiss(id);
    expect(store.getToasts()).toHaveLength(0);
  });

  it('blocks user dismissal of non-dismissible toasts but allows the API', () => {
    const { toast, store } = createToastEngine();
    const id = toast('x', { dismissible: false });
    store.dismiss(id, 'swipe');
    store.dismiss(id, 'click');
    expect(store.getToasts()[0]?.dismissed).toBe(false);
    toast.dismiss(id);
    expect(store.getToasts()[0]?.dismissed).toBe(true);
  });

  it('dismissAll and dismiss() without id clear everything', () => {
    const { toast, store } = createToastEngine();
    toast('a');
    toast('b');
    toast.dismissAll();
    expect(store.getToasts().every((t) => t.dismissed)).toBe(true);
    toast('c');
    toast.dismiss();
    vi.advanceTimersByTime(250);
    expect(store.getToasts()).toHaveLength(0);
  });

  it('records closed toasts in history, newest first, capped by historyLimit', () => {
    const config = createConfigStore({ exitDuration: 0, historyLimit: 2 });
    const { toast, store } = createToastEngine({ config });
    toast('one', { id: 'one' });
    toast('two', { id: 'two' });
    toast('three', { id: 'three' });
    toast.dismissAll();
    expect(toast.getHistory().map((t) => t.id)).toHaveLength(2);
    store.clearHistory();
    expect(toast.getHistory()).toHaveLength(0);
  });

  it('subscribers receive changes and can unsubscribe', () => {
    const { toast, store } = createToastEngine();
    const listener = vi.fn();
    const off = store.subscribe(listener);
    toast('x');
    expect(listener).toHaveBeenCalled();
    const calls = listener.mock.calls.length;
    off();
    toast('y');
    expect(listener.mock.calls.length).toBe(calls);
  });

  it('getToasts returns a stable reference between changes', () => {
    const { toast, store } = createToastEngine();
    toast('x');
    expect(store.getToasts()).toBe(store.getToasts());
  });
});

describe('toast store: queue', () => {
  it('queues beyond maxVisible per region and promotes on close', () => {
    const config = createConfigStore({ maxVisible: 2, exitDuration: 0 });
    const { toast, store } = createToastEngine({ config });
    const onOpen = vi.fn();
    const a = toast('a', { duration: 0 });
    toast('b', { duration: 0 });
    const c = toast('c', { duration: 0, onOpen });
    expect(find(store.getToasts(), c)?.visible).toBe(false);
    expect(onOpen).not.toHaveBeenCalled();
    toast.dismiss(a);
    expect(find(store.getToasts(), c)?.visible).toBe(true);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('counts regions separately and lets important toasts bypass the limit', () => {
    const config = createConfigStore({ maxVisible: 1 });
    const { toast, store } = createToastEngine({ config });
    const a = toast('a', { position: 'top-left' });
    const b = toast('b', { position: 'top-right' });
    const c = toast('c', { position: 'top-left', important: true });
    const d = toast('d', { position: 'top-left' });
    expect(find(store.getToasts(), a)?.visible).toBe(true);
    expect(find(store.getToasts(), b)?.visible).toBe(true);
    expect(find(store.getToasts(), c)?.visible).toBe(true);
    expect(find(store.getToasts(), d)?.visible).toBe(false);
  });

  it('dismissing a queued toast removes it without animation', () => {
    const config = createConfigStore({ maxVisible: 1 });
    const { toast, store } = createToastEngine({ config });
    toast('a');
    const b = toast('b');
    toast.dismiss(b);
    expect(find(store.getToasts(), b)).toBeUndefined();
  });

  it('starts the timer only when a queued toast becomes visible', () => {
    const config = createConfigStore({ maxVisible: 1, exitDuration: 0 });
    const { toast, store } = createToastEngine({ config });
    toast('a', { duration: 1000 });
    const b = toast('b', { duration: 1000 });
    vi.advanceTimersByTime(1000);
    expect(find(store.getToasts(), b)?.visible).toBe(true);
    vi.advanceTimersByTime(999);
    expect(find(store.getToasts(), b)).toBeDefined();
    vi.advanceTimersByTime(1);
    expect(find(store.getToasts(), b)).toBeUndefined();
  });
});

describe('toast store: update, dedupe and pause', () => {
  it('reusing an id updates the toast', () => {
    const { toast, store } = createToastEngine();
    toast('first', { id: 'x' });
    toast('second', { id: 'x' });
    expect(store.getToasts()).toHaveLength(1);
    expect(store.getToasts()[0]?.title).toBe('second');
  });

  it('update patches fields, bumps revision and resets the timer', () => {
    const { toast, store } = createToastEngine();
    const id = toast('a', { duration: 1000 });
    vi.advanceTimersByTime(900);
    const revision = store.getToasts()[0]?.revision ?? 0;
    expect(toast.update(id, { title: 'b' })).toBe(true);
    expect(store.getToasts()[0]?.title).toBe('b');
    expect(store.getToasts()[0]?.revision).toBeGreaterThan(revision);
    vi.advanceTimersByTime(900);
    expect(store.getToasts()[0]?.dismissed).toBe(false);
    vi.advanceTimersByTime(100);
    expect(store.getToasts()[0]?.dismissed).toBe(true);
  });

  it('update with resetTimer false keeps the countdown', () => {
    const { toast, store } = createToastEngine();
    const id = toast('a', { duration: 1000 });
    vi.advanceTimersByTime(900);
    toast.update(id, { title: 'b', resetTimer: false });
    vi.advanceTimersByTime(100);
    expect(store.getToasts()[0]?.dismissed).toBe(true);
  });

  it('changing type recomputes duration, role and live politeness', () => {
    const { toast, store } = createToastEngine();
    const id = toast.loading('wait');
    toast.update(id, { type: 'error', title: 'failed' });
    expect(store.getToasts()[0]).toMatchObject({
      duration: 4000,
      role: 'alert',
      ariaLive: 'assertive',
    });
  });

  it('update returns false for unknown or dismissed toasts', () => {
    const { toast } = createToastEngine();
    expect(toast.update('nope', { title: 'x' })).toBe(false);
    const id = toast('x');
    toast.dismiss(id);
    expect(toast.update(id, { title: 'y' })).toBe(false);
  });

  it('moving to another position reflows visibility', () => {
    const { toast, store } = createToastEngine();
    const id = toast('x');
    toast.update(id, { position: 'bottom-left' });
    expect(store.getToasts()[0]).toMatchObject({ position: 'bottom-left', visible: true });
  });

  it('dedupe collapses identical toasts and restarts the timer', () => {
    const { toast, store } = createToastEngine();
    const a = toast('same', { dedupe: true, duration: 1000 });
    vi.advanceTimersByTime(800);
    const b = toast('same', { dedupe: true, duration: 1000 });
    expect(b).toBe(a);
    expect(store.getToasts()).toHaveLength(1);
    expect(store.getToasts()[0]?.count).toBe(2);
    vi.advanceTimersByTime(800);
    expect(store.getToasts()[0]?.dismissed).toBe(false);
  });

  it('dedupe accepts a custom key and distinguishes content', () => {
    const { toast, store } = createToastEngine();
    toast('one', { dedupe: 'k' });
    toast('two', { dedupe: 'k' });
    toast('three', { dedupe: true });
    toast('four', { dedupe: true });
    expect(store.getToasts()).toHaveLength(3);
  });

  it('pause and resume hold the timer by reason', () => {
    const { toast, store } = createToastEngine();
    const id = toast('x', { duration: 1000 });
    vi.advanceTimersByTime(500);
    store.pause(id, 'hover');
    store.pause(id, 'focus');
    vi.advanceTimersByTime(5000);
    expect(store.getToasts()[0]?.pausedBy).toEqual(['hover', 'focus']);
    expect(store.getRemaining(id)).toBe(500);
    store.resume(id, 'hover');
    vi.advanceTimersByTime(5000);
    expect(store.getToasts()[0]?.dismissed).toBe(false);
    store.resume(id, 'focus');
    vi.advanceTimersByTime(500);
    expect(store.getToasts()[0]?.dismissed).toBe(true);
  });

  it('pause without id affects all toasts', () => {
    const { toast, store } = createToastEngine();
    toast('a', { duration: 100 });
    toast('b', { duration: 100 });
    store.pause(undefined, 'hidden');
    vi.advanceTimersByTime(1000);
    expect(store.getToasts().every((t) => !t.dismissed)).toBe(true);
    store.resume(undefined, 'hidden');
    vi.advanceTimersByTime(100);
    expect(store.getToasts().every((t) => t.dismissed)).toBe(true);
  });

  it('startPaused holds timers until resumed', () => {
    const config = createConfigStore({ startPaused: true });
    const { toast, store } = createToastEngine({ config });
    const id = toast('x', { duration: 100 });
    vi.advanceTimersByTime(1000);
    expect(store.getToasts()[0]?.dismissed).toBe(false);
    store.resume(id, MANUAL_PAUSE);
    vi.advanceTimersByTime(100);
    expect(store.getToasts()[0]?.dismissed).toBe(true);
  });

  it('extend adds time to the running timer', () => {
    const { toast, store } = createToastEngine();
    const id = toast('x', { duration: 1000 });
    store.extend(id, 1000);
    vi.advanceTimersByTime(1500);
    expect(store.getToasts()[0]?.dismissed).toBe(false);
    vi.advanceTimersByTime(500);
    expect(store.getToasts()[0]?.dismissed).toBe(true);
  });

  it('custom renderers survive updates', () => {
    const { toast, store } = createToastEngine();
    const renderer = vi.fn(() => 'node');
    const id = toast.custom(renderer, { duration: 0 });
    toast.update(id, { title: 'x' });
    expect(store.getToasts()[0]?.custom).toBe(renderer);
  });
});

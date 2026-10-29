import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createConfigStore,
  createTimer,
  createToastEngine,
  createTypeRegistry,
} from '../../src/core';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('timer', () => {
  it('fires after the duration', () => {
    const done = vi.fn();
    const timer = createTimer(1000, done);
    timer.start();
    vi.advanceTimersByTime(999);
    expect(done).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('keeps elapsed time across pause and resume', () => {
    const done = vi.fn();
    const timer = createTimer(1000, done);
    timer.start();
    vi.advanceTimersByTime(400);
    timer.pause();
    expect(timer.remaining()).toBe(600);
    vi.advanceTimersByTime(5000);
    expect(done).not.toHaveBeenCalled();
    timer.start();
    vi.advanceTimersByTime(600);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('adds time while running and while paused', () => {
    const done = vi.fn();
    const timer = createTimer(1000, done);
    timer.start();
    vi.advanceTimersByTime(500);
    timer.add(500);
    vi.advanceTimersByTime(999);
    expect(done).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(done).toHaveBeenCalledTimes(1);
    const paused = createTimer(1000, done);
    paused.add(250);
    expect(paused.remaining()).toBe(1250);
  });

  it('never fires for infinite or zero durations', () => {
    const done = vi.fn();
    createTimer(Infinity, done).start();
    createTimer(0, done).start();
    vi.advanceTimersByTime(1e9);
    expect(done).not.toHaveBeenCalled();
  });

  it('reset restarts and cancel stops', () => {
    const done = vi.fn();
    const timer = createTimer(1000, done);
    timer.start();
    vi.advanceTimersByTime(900);
    timer.reset(1000);
    vi.advanceTimersByTime(900);
    expect(done).not.toHaveBeenCalled();
    timer.cancel();
    vi.advanceTimersByTime(1000);
    expect(done).not.toHaveBeenCalled();
    expect(timer.isRunning()).toBe(false);
  });
});

describe('config store', () => {
  it('merges patches, ignores undefined and notifies', () => {
    const config = createConfigStore();
    const listener = vi.fn();
    const off = config.subscribe(listener);
    config.set({ position: 'bottom-left', duration: undefined });
    expect(config.get().position).toBe('bottom-left');
    expect(config.get().duration).toBe(4000);
    expect(listener).toHaveBeenCalledTimes(1);
    off();
    config.reset();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(config.get().position).toBe('top-right');
  });

  it('accepts initial values', () => {
    expect(createConfigStore({ gap: 20 }).get().gap).toBe(20);
  });
});

describe('type registry', () => {
  it('adds, lists, removes and validates names', () => {
    const registry = createTypeRegistry();
    registry.add('rocket', { color: '#f00' });
    expect(registry.get('rocket')?.color).toBe('#f00');
    expect(registry.list()).toEqual(['rocket']);
    expect(registry.remove('rocket')).toBe(true);
    expect(() => registry.add(' ')).toThrow(TypeError);
  });

  it('applies defaults of custom types to toasts', () => {
    const { toast, store } = createToastEngine();
    toast.types.add('sticky', { defaults: { duration: 0, closeButton: true } });
    const id = toast('hello', { type: 'sticky' });
    const record = store.getToasts().find((t) => t.id === id);
    expect(record?.duration).toBe(0);
    expect(record?.closeButton).toBe(true);
  });
});

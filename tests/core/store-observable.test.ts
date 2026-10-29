import { describe, expect, it, vi } from 'vitest';
import { createStore } from '../../src/core/store';

describe('observable store (createStore)', () => {
  it('manages state snapshots and notifies subscribers', async () => {
    const store = createStore({ count: 0 });
    expect(store.getSnapshot()).toEqual({ count: 0 });

    const subscriber = vi.fn();
    const unsubscribe = store.subscribe(subscriber);

    expect(subscriber).not.toHaveBeenCalled();

    store.setState({ count: 1 }, true);
    expect(store.getSnapshot()).toEqual({ count: 1 });
    expect(subscriber).toHaveBeenCalledTimes(1);

    // Functional updater
    store.setState((prev) => ({ count: prev.count + 5 }), true);
    expect(store.getSnapshot()).toEqual({ count: 6 });
    expect(subscriber).toHaveBeenCalledTimes(2);

    unsubscribe();
    store.setState({ count: 10 }, true);
    expect(subscriber).toHaveBeenCalledTimes(2);
  });

  it('batches updates scheduled via microtask', async () => {
    const store = createStore(0);
    const listener = vi.fn();
    store.subscribe(listener);

    store.setState(1);
    store.setState(2);
    store.setState(3);

    expect(listener).not.toHaveBeenCalled();
    await Promise.resolve();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toBe(3);
  });

  it('immediately invokes subscriber if it accepts state parameter (Svelte contract)', () => {
    const store = createStore('hello');
    const svelteSubscriber = vi.fn((val: string) => val);

    store.subscribe(svelteSubscriber);
    expect(svelteSubscriber).toHaveBeenCalledWith('hello');
  });

  it('handles subscriber exceptions safely without stopping other listeners', () => {
    const store = createStore(10);
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Bad initial subscriber
    store.subscribe((val) => {
      if (val === 10) throw new Error('Subscriber crash');
    });

    const goodSubscriber = vi.fn();
    store.subscribe(() => {
      goodSubscriber();
    });

    store.subscribe(() => {
      throw new Error('Update crash');
    });

    store.setState(20, true);
    expect(goodSubscriber).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it('falls back to Promise.resolve microtask when queueMicrotask is unavailable', async () => {
    const originalQueueMicrotask = globalThis.queueMicrotask;
    try {
      // @ts-expect-error intentionally removing queueMicrotask for test
      delete globalThis.queueMicrotask;

      const store = createStore(100);
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState(200);
      expect(listener).not.toHaveBeenCalled();

      await Promise.resolve();
      expect(listener).toHaveBeenCalledTimes(1);
      expect(store.getSnapshot()).toBe(200);
    } finally {
      globalThis.queueMicrotask = originalQueueMicrotask;
    }
  });
});

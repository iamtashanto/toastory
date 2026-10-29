import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createToastEngine } from '../../src/core';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('toast variants', () => {
  it('each variant sets its type', () => {
    const { toast, store } = createToastEngine();
    const ids = [
      toast.success('a'),
      toast.error('b'),
      toast.info('c'),
      toast.warning('d'),
      toast.loading('e'),
      toast.message('f'),
      toast('g'),
    ];
    expect(ids.map((id) => store.getToasts().find((t) => t.id === id)?.type)).toEqual([
      'success',
      'error',
      'info',
      'warning',
      'loading',
      'message',
      'default',
    ]);
  });

  it('a toast without message and options still renders', () => {
    const { toast, store } = createToastEngine();
    toast();
    expect(store.getToasts()).toHaveLength(1);
  });

  it('exposes the type registry on the API', () => {
    const { toast, store } = createToastEngine();
    expect(toast.types).toBe(store.types);
  });
});

describe('toast.promise', () => {
  it('moves loading to success with a string message', async () => {
    const { toast, store } = createToastEngine();
    const { id, unwrap } = toast.promise(Promise.resolve(5), {
      loading: 'Working',
      success: 'Done',
    });
    expect(store.getToasts()[0]).toMatchObject({ id, type: 'loading', title: 'Working' });
    await expect(unwrap()).resolves.toBe(5);
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getToasts()[0]).toMatchObject({ type: 'success', title: 'Done', duration: 4000 });
  });

  it('success function receives the value and may return a patch', async () => {
    const { toast, store } = createToastEngine();
    toast.promise(Promise.resolve({ n: 3 }), {
      loading: 'Working',
      success: (v) => ({ title: `Got ${v.n}`, duration: 9000 }),
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getToasts()[0]).toMatchObject({ title: 'Got 3', duration: 9000 });
  });

  it('uses the error message by default and supports error overrides', async () => {
    const { toast, store } = createToastEngine();
    const first = toast.promise(Promise.reject(new Error('nope')), { loading: 'x' });
    await expect(first.unwrap()).rejects.toThrow('nope');
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getToasts()[0]).toMatchObject({ type: 'error', title: 'nope', role: 'alert' });
    const second = toast.promise(Promise.reject(new Error('bad')), {
      loading: 'y',
      error: (e) => `Failed: ${(e as Error).message}`,
    });
    await expect(second.unwrap()).rejects.toThrow();
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getToasts().find((t) => t.id === second.id)?.title).toBe('Failed: bad');
  });

  it('handles non-Error rejections', async () => {
    const { toast, store } = createToastEngine();
    toast
      .promise(Promise.reject('text'), { loading: 'x' })
      .unwrap()
      .catch(() => undefined);
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getToasts()[0]?.title).toBe('text');
  });

  it('accepts a function, runs it once and captures sync throws', async () => {
    const { toast, store } = createToastEngine();
    const fn = vi.fn(() => Promise.resolve(1));
    toast.promise(fn, { loading: 'x', success: 'y' });
    expect(fn).toHaveBeenCalledTimes(1);
    const thrower = toast.promise(
      () => {
        throw new Error('sync');
      },
      { loading: 'x' },
    );
    await expect(thrower.unwrap()).rejects.toThrow('sync');
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getToasts().find((t) => t.id === thrower.id)?.title).toBe('sync');
  });

  it('dismisses the toast when success is omitted', async () => {
    const { toast, store } = createToastEngine();
    toast.promise(Promise.resolve(1), { loading: 'x' });
    await vi.advanceTimersByTimeAsync(300);
    expect(store.getToasts()).toHaveLength(0);
  });

  it('applies description and runs finally for both outcomes', async () => {
    const { toast, store } = createToastEngine();
    const done = vi.fn();
    toast.promise(Promise.resolve(2), {
      loading: 'x',
      success: 'ok',
      description: (o) => (o.status === 'success' ? `value ${o.value}` : 'failed'),
      finally: done,
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getToasts()[0]?.description).toBe('value 2');
    toast.promise(Promise.reject(new Error('e')), {
      loading: 'x',
      description: 'static',
      finally: done,
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(done).toHaveBeenCalledTimes(2);
    expect(store.getToasts()[1]?.description).toBe('static');
  });

  it('a throwing finally does not break the toast', async () => {
    const { toast, store } = createToastEngine();
    toast.promise(Promise.resolve(1), {
      loading: 'x',
      success: 'ok',
      finally: () => {
        throw new Error('boom');
      },
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(store.getToasts()[0]?.type).toBe('success');
  });

  it('passes options and a custom id through and does not resurrect dismissed toasts', async () => {
    const { toast, store } = createToastEngine();
    let resolve: (v: number) => void = () => undefined;
    const pending = new Promise<number>((r) => {
      resolve = r;
    });
    const { id } = toast.promise(
      pending,
      { loading: 'x', success: 'ok' },
      { id: 'p', position: 'bottom-left' },
    );
    expect(id).toBe('p');
    expect(store.getToasts()[0]?.position).toBe('bottom-left');
    toast.dismiss('p');
    resolve(1);
    await vi.advanceTimersByTimeAsync(300);
    expect(store.getToasts()).toHaveLength(0);
  });
});

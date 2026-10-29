import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDialogController, runSteps } from '../../src/core';
import type { DialogOptions, DialogResult } from '../../src/core';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('dialog controller', () => {
  it('confirms with the input value', async () => {
    const c = createDialogController({ input: 'text' });
    c.setValueReader(() => 'hello');
    await c.submit('confirm');
    await expect(c.handle.result).resolves.toEqual({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: 'hello',
      dismiss: undefined,
    });
    expect(c.getState().open).toBe(false);
  });

  it('denies', async () => {
    const c = createDialogController({});
    await c.submit('deny');
    await expect(c.handle.result).resolves.toMatchObject({ isDenied: true, isConfirmed: false });
  });

  it('reports every dismiss reason', async () => {
    for (const reason of ['cancel', 'backdrop', 'close', 'esc', 'timer'] as const) {
      const c = createDialogController({});
      expect(c.dismiss(reason)).toBe(true);
      await expect(c.handle.result).resolves.toMatchObject({ isDismissed: true, dismiss: reason });
    }
  });

  it('respects allowOutsideClick and allowEscape', () => {
    const c = createDialogController({ allowOutsideClick: false, allowEscape: false });
    expect(c.dismiss('backdrop')).toBe(false);
    expect(c.dismiss('esc')).toBe(false);
    expect(c.getState().open).toBe(true);
    expect(c.dismiss('cancel')).toBe(true);
  });

  it('a second dismissal after close is ignored', () => {
    const c = createDialogController({});
    c.dismiss('cancel');
    expect(c.dismiss('cancel')).toBe(false);
  });

  it('sync and async validate block confirmation and show the message', async () => {
    const validate = vi
      .fn<NonNullable<DialogOptions['validate']>>()
      .mockReturnValueOnce('required')
      .mockResolvedValueOnce('still bad')
      .mockResolvedValueOnce(undefined);
    const c = createDialogController({ validate });
    c.setValueReader(() => 'x');
    await c.submit('confirm');
    expect(c.getState()).toMatchObject({ open: true, error: 'required' });
    await c.submit('confirm');
    expect(c.getState().error).toBe('still bad');
    await c.submit('confirm');
    expect(c.getState().open).toBe(false);
    await expect(c.handle.result).resolves.toMatchObject({ isConfirmed: true });
  });

  it('a throwing validate becomes an error message', async () => {
    const c = createDialogController({
      validate: () => {
        throw new Error('exploded');
      },
    });
    await c.submit('confirm');
    expect(c.getState().error).toBe('exploded');

    const c2 = createDialogController({
      validate: () => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw 'raw string error';
      },
    });
    await c2.submit('confirm');
    expect(c2.getState().error).toBe('raw string error');

    const c3 = createDialogController({
      validate: () => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw { code: 400 };
      },
    });
    await c3.submit('confirm');
    expect(c3.getState().error).toBe('[object Object]');
  });

  it('subscribes to controller state and unsubscribes cleanly', () => {
    const c = createDialogController({ title: 'Init' });
    const listener = vi.fn();
    const unsub = c.subscribe(listener);

    c.handle.update({ title: 'Next' });
    expect(listener).toHaveBeenCalled();

    unsub();
    listener.mockClear();
    c.handle.update({ title: 'After unsub' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('validate is skipped when denying', async () => {
    const validate = vi.fn(() => 'bad');
    const c = createDialogController({ validate });
    await c.submit('deny');
    expect(validate).not.toHaveBeenCalled();
    await expect(c.handle.result).resolves.toMatchObject({ isDenied: true });
  });

  it('preConfirm shows loading, can replace the value, and can abort with false', async () => {
    const states: (string | null)[] = [];
    const preConfirm = vi
      .fn<NonNullable<DialogOptions['preConfirm']>>()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce({ saved: true });
    const c = createDialogController({ preConfirm });
    c.subscribe(() => states.push(c.getState().loading));
    await c.submit('confirm');
    expect(states).toContain('confirm');
    expect(c.getState()).toMatchObject({ open: true, loading: null });
    await c.submit('confirm');
    await expect(c.handle.result).resolves.toMatchObject({
      isConfirmed: true,
      value: { saved: true },
    });
  });

  it('preConfirm rejection surfaces as an inline error', async () => {
    const c = createDialogController({
      preConfirm: () => Promise.reject(new Error('server down')),
    });
    await c.submit('confirm');
    expect(c.getState()).toMatchObject({ open: true, error: 'server down', loading: null });
  });

  it('preDeny shows deny loading', async () => {
    let seen: string | null = null;
    const c = createDialogController({
      preDeny: async () => {
        seen = c.getState().loading;
        return 'denied-value';
      },
    });
    await c.submit('deny');
    expect(seen).toBe('deny');
    await expect(c.handle.result).resolves.toMatchObject({ isDenied: true, value: 'denied-value' });
  });

  it('ignores submit while loading and dismissal while loading', async () => {
    let release: () => void = () => undefined;
    const preConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    const c = createDialogController({ preConfirm });
    const first = c.submit('confirm');
    await c.submit('confirm');
    expect(preConfirm).toHaveBeenCalledTimes(1);
    expect(c.dismiss('esc')).toBe(false);
    release();
    await first;
    expect(c.getState().open).toBe(false);
  });

  it('closing during an async hook drops the late result', async () => {
    let release: (v: unknown) => void = () => undefined;
    const c = createDialogController({
      preConfirm: () =>
        new Promise((resolve) => {
          release = resolve;
        }),
    });
    const pending = c.submit('confirm');
    c.handle.close();
    release('late');
    await pending;
    await expect(c.handle.result).resolves.toMatchObject({ isDismissed: true, dismiss: 'close' });
  });

  it('handle.close accepts an explicit result', async () => {
    const c = createDialogController({});
    c.handle.close({ isConfirmed: true, value: 7 });
    await expect(c.handle.result).resolves.toMatchObject({ isConfirmed: true, value: 7 });
  });

  it('handle.update merges options and notifies; showError and setLoading work', () => {
    const c = createDialogController({ title: 'a' });
    const listener = vi.fn();
    c.subscribe(listener);
    c.handle.update({ title: 'b' });
    expect(c.getState().options.title).toBe('b');
    c.handle.showError('oops');
    expect(c.getState().error).toBe('oops');
    c.handle.showError(undefined);
    expect(c.getState().error).toBeUndefined();
    c.handle.setLoading(true);
    expect(c.getState().loading).toBe('confirm');
    c.handle.setLoading('deny');
    expect(c.getState().loading).toBe('deny');
    c.handle.setLoading(false);
    expect(c.getState().loading).toBeNull();
    expect(listener).toHaveBeenCalled();
  });

  it('opened fires didOpen; close fires willClose with the result', async () => {
    const didOpen = vi.fn();
    const willClose = vi.fn();
    const c = createDialogController({ didOpen, willClose });
    c.opened();
    expect(didOpen).toHaveBeenCalledWith(c.handle);
    c.dismiss('cancel');
    expect(willClose).toHaveBeenCalledWith(
      c.handle,
      expect.objectContaining({ isDismissed: true, dismiss: 'cancel' }),
    );
  });

  it('timer dismisses with reason timer and supports pause, resume and add', async () => {
    const c = createDialogController({ timer: 1000 });
    c.opened();
    vi.advanceTimersByTime(500);
    c.handle.timer.pause();
    expect(c.handle.timer.remaining()).toBe(500);
    vi.advanceTimersByTime(5000);
    expect(c.getState().open).toBe(true);
    c.handle.timer.add(500);
    c.handle.timer.resume();
    vi.advanceTimersByTime(999);
    expect(c.getState().open).toBe(true);
    vi.advanceTimersByTime(1);
    await expect(c.handle.result).resolves.toMatchObject({ dismiss: 'timer' });
  });

  it('timer.add starts a timer when none exists and update can set one', () => {
    const c = createDialogController({});
    expect(c.handle.timer.remaining()).toBe(0);
    c.handle.timer.add(300);
    expect(c.handle.timer.remaining()).toBe(300);
    const d = createDialogController({});
    d.handle.update({ timer: 200 });
    vi.advanceTimersByTime(200);
    expect(d.getState().open).toBe(false);
  });

  it('operations after close are no-ops', async () => {
    const c = createDialogController({});
    c.dismiss('cancel');
    c.handle.update({ title: 'late' });
    c.handle.setLoading(true);
    c.handle.showError('late');
    await c.submit('confirm');
    expect(c.getState().options.title).toBeUndefined();
  });
});

describe('runSteps', () => {
  const confirmed = (value: unknown): DialogResult => ({
    isConfirmed: true,
    isDenied: false,
    isDismissed: false,
    value,
    dismiss: undefined,
  });

  it('collects values from every step', async () => {
    const open = vi.fn(async (o: DialogOptions) => confirmed(o.title));
    const result = await runSteps([{ title: 'a' }, { title: 'b' }], open);
    expect(result).toMatchObject({ isConfirmed: true, values: ['a', 'b'], step: 1 });
  });

  it('adds a back button from step two and navigates back on deny', async () => {
    const seen: (DialogOptions | undefined)[] = [];
    const script: DialogResult[] = [
      confirmed('one'),
      { ...confirmed(undefined), isConfirmed: false, isDenied: true },
      confirmed('one-again'),
      confirmed('two'),
    ];
    const open = vi.fn(async (o: DialogOptions) => {
      seen.push(o);
      return script.shift() as DialogResult;
    });
    const result = await runSteps([{ title: 'a' }, { title: 'b' }], open, 'Previous');
    expect(seen[1]?.denyButton).toMatchObject({ show: true, label: 'Previous' });
    expect(seen[0]?.denyButton).toBeUndefined();
    expect(seen[2]?.inputValue).toBe('one');
    expect(result.values).toEqual(['one-again', 'two']);
  });

  it('stops when a step is dismissed and reports completed values', async () => {
    const script: DialogResult[] = [
      confirmed('one'),
      { ...confirmed(undefined), isConfirmed: false, isDismissed: true, dismiss: 'esc' },
    ];
    const result = await runSteps([{}, {}, {}], async () => script.shift() as DialogResult);
    expect(result).toMatchObject({ isDismissed: true, dismiss: 'esc', values: ['one'], step: 1 });
  });

  it('handles an empty list as dismissed', async () => {
    const result = await runSteps([], async () => confirmed(1));
    expect(result).toMatchObject({ isDismissed: true, values: [] });
  });
});

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetEngine } from '../../src/web';
import { config, glazeToaster, toast, toasts, ui } from '../../src/svelte';
import type { ToastRecord } from '../../src/core';

beforeEach(() => {
  resetEngine();
  document.body.innerHTML = '<div id="app"></div>';
});

afterEach(() => {
  resetEngine();
  document.body.replaceChildren();
});

describe('toastory/svelte adapter', () => {
  it('toasts store adheres to Svelte store contract and updates reactively', () => {
    const values: (readonly ToastRecord[])[] = [];
    const unsubscribe = toasts.subscribe((list) => {
      values.push(list);
    });

    expect(values).toHaveLength(1);
    expect(values[0]).toEqual([]);

    toast.success('Svelte toast');
    expect(values).toHaveLength(2);
    expect(values[1]).toHaveLength(1);

    unsubscribe();

    toast.info('Ignored after unsub');
    expect(values).toHaveLength(2);
  });

  it('config store emits current configuration and updates on change', () => {
    const configValues: string[] = [];
    const unsubscribe = config.subscribe((c) => {
      configValues.push(c.position);
    });

    expect(configValues).toEqual(['top-right']);

    ui.configure({ position: 'bottom-left' });
    expect(configValues).toEqual(['top-right', 'bottom-left']);

    unsubscribe();
  });

  it('glazeToaster action configures options and cleans up', () => {
    const node = document.getElementById('app') as HTMLElement;
    const action = glazeToaster(node, { theme: 'brutal', gap: 24 });

    const cfg = ui.configure({});
    expect(cfg.theme).toBe('brutal');
    expect(cfg.gap).toBe(24);

    action.update?.({ gap: 32 });
    expect(ui.configure({}).gap).toBe(32);

    action.destroy?.();
  });
});

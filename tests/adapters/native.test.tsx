// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { configure, resetNativeEngine, toast, Toaster, ui, useNativeToast } from '../../src/native';

// Enable React act environment for jsdom
// @ts-expect-error React 18/19 act flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  resetNativeEngine();
  document.body.innerHTML = '<div id="root"></div>';
});

afterEach(() => {
  resetNativeEngine();
  document.body.replaceChildren();
});

describe('glazekit/native adapter', () => {
  it('toast creates and manages native toasts', () => {
    const id = toast.success('Native Success', { description: 'Running on mobile' });
    const list = toast.getToasts();
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe(id);
    expect(list[0]?.title).toBe('Native Success');
    expect(list[0]?.description).toBe('Running on mobile');
    expect(list[0]?.type).toBe('success');

    toast.dismiss(id);
    expect(toast.getToasts().find((t) => t.id === id)?.dismissed).toBe(true);
  });

  it('ui.configure updates native configuration', () => {
    const cfg = configure({ position: 'bottom-center', duration: 5000 });
    expect(cfg.position).toBe('bottom-center');
    expect(cfg.duration).toBe(5000);
    expect(ui.configure).toBe(configure);
  });

  it('Toaster component renders native toasts', async () => {
    const container = document.getElementById('root') as HTMLElement;
    const root = createRoot(container);

    await act(async () => {
      root.render(<Toaster offset={60} />);
    });

    expect(container.children).toHaveLength(0);

    await act(async () => {
      toast.info('Hello Mobile', { description: 'Rendered toast' });
    });

    expect(container.textContent).toContain('Hello Mobile');
    expect(container.textContent).toContain('Rendered toast');

    await act(async () => {
      root.unmount();
    });
  });

  it('useNativeToast hook provides reactive toast list', async () => {
    let capturedToasts: readonly unknown[] = [];

    function MobileComponent() {
      const { toasts } = useNativeToast();
      capturedToasts = toasts;
      return <div data-count={toasts.length}>Toasts: {toasts.length}</div>;
    }

    const container = document.getElementById('root') as HTMLElement;
    const root = createRoot(container);

    await act(async () => {
      root.render(<MobileComponent />);
    });

    expect(capturedToasts).toHaveLength(0);

    await act(async () => {
      toast('Test item');
    });

    expect(capturedToasts).toHaveLength(1);
    expect(container.textContent).toContain('Toasts: 1');

    await act(async () => {
      root.unmount();
    });
  });
});

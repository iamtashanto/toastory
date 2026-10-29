// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetEngine } from '../../src/web';
import { Toaster, ui, useGlazekit, useToast, useToastory } from '../../src/react';

// Enable React act environment for jsdom
// @ts-expect-error React 18/19 act flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  resetEngine();
  document.body.innerHTML = '<div id="root"></div>';
});

afterEach(() => {
  resetEngine();
  document.body.replaceChildren();
});

describe('toastory/react adapter', () => {
  it('renders Toaster component and applies props to configuration', async () => {
    const container = document.getElementById('root') as HTMLElement;
    const root = createRoot(container);

    await act(async () => {
      root.render(<Toaster position="bottom-left" theme="neon" />);
    });

    const config = ui.configure({});
    expect(config.position).toBe('bottom-left');
    expect(config.theme).toBe('neon');

    await act(async () => {
      root.unmount();
    });
  });

  it('useToast hook returns reactive toast list', async () => {
    let capturedToasts: readonly unknown[] = [];
    let toastApi: unknown;

    function TestComponent() {
      const { toast, toasts } = useToast();
      capturedToasts = toasts;
      toastApi = toast;
      return <div data-count={toasts.length}>Count: {toasts.length}</div>;
    }

    const container = document.getElementById('root') as HTMLElement;
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <>
          <Toaster />
          <TestComponent />
        </>,
      );
    });

    expect(capturedToasts).toHaveLength(0);
    expect(toastApi).toBeDefined();

    await act(async () => {
      (toastApi as { success: (msg: string) => void }).success('React Toast');
    });

    expect(capturedToasts).toHaveLength(1);
    expect(container.textContent).toContain('Count: 1');

    await act(async () => {
      root.unmount();
    });
  });

  it('useToastory hook provides ui toolkit, config and toast state (and useGlazekit is an alias)', async () => {
    expect(useGlazekit).toBe(useToastory);

    let currentConfig: unknown;
    let toastCount = 0;

    function ToastoryComponent() {
      const { ui: u, config, toasts } = useToastory();
      currentConfig = config;
      toastCount = toasts.length;
      return (
        <button
          type="button"
          onClick={() => {
            u.toast('Clicked');
          }}
        >
          Add Toast
        </button>
      );
    }

    const container = document.getElementById('root') as HTMLElement;
    const root = createRoot(container);

    await act(async () => {
      root.render(<ToastoryComponent />);
    });

    expect(currentConfig).toBeDefined();
    expect((currentConfig as { position: string }).position).toBe('top-right');
    expect(toastCount).toBe(0);

    const btn = container.querySelector('button');
    await act(async () => {
      btn?.click();
    });

    expect(toastCount).toBe(1);

    await act(async () => {
      root.unmount();
    });
  });
});

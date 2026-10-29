import { describe, expect, it, vi } from 'vitest';
import { createUI, resolvePrecedence } from '../../src/core';
import type { Renderer } from '../../src/core';

describe('headless node execution and renderer registration', () => {
  it('creates an isolated UI instance in pure Node without DOM', async () => {
    const ui1 = createUI();
    const ui2 = createUI();

    ui1.configure({ duration: 1500 });
    expect(ui1.getConfig().duration).toBe(1500);
    expect(ui2.getConfig().duration).toBe(4000); // ui2 isolated

    const id1 = ui1.toast.success('Saved in UI 1');
    expect(ui1.toastStore.getToasts().map((t) => t.id)).toContain(id1);
    expect(ui2.toastStore.getToasts()).toHaveLength(0);
  });

  it('queues dialogs and sheets before renderer registers, then replays upon registration', async () => {
    const ui = createUI();
    expect(ui.getRenderer()).toBeUndefined();

    // Fire dialog, prompt, alert and sheet before renderer exists (SSR scenario)
    const confirmPromise = ui.confirm({ title: 'SSR Confirm' });
    const alertPromise = ui.alert('SSR Alert String');
    const promptPromise = ui.prompt('SSR Prompt String');
    const sheetPromise = ui.sheet({
      title: 'SSR Sheet',
      actions: [{ label: 'Option 1', value: '1' }],
    });
    const bottomSheetHandle = ui.bottomSheet({ title: 'SSR BottomSheet' });

    const dialogTitles: string[] = [];
    const sheetOpened = vi.fn();
    const bottomSheetOpened = vi.fn();

    const fakeRenderer: Renderer = {
      openDialog(options, handle) {
        if (options.title) dialogTitles.push(options.title);
        handle.close({ isConfirmed: true, value: 'prompt-val' });
      },
      openSheet(options) {
        sheetOpened(options.title);
        return Promise.resolve({
          isConfirmed: true,
          isDenied: false,
          isDismissed: false,
          value: '1',
          dismiss: undefined,
        });
      },
      openBottomSheet(options) {
        bottomSheetOpened(options.title);
        return {
          body: null,
          close: vi.fn(),
          snapTo: vi.fn(),
          update: vi.fn(),
          result: Promise.resolve({
            isConfirmed: true,
            isDenied: false,
            isDismissed: false,
            value: 'snap',
            dismiss: undefined,
          }),
        };
      },
    };

    // Before registering renderer:
    expect(dialogTitles).toHaveLength(0);
    expect(sheetOpened).not.toHaveBeenCalled();

    // Hydration occurs:
    ui.registerRenderer(fakeRenderer);
    expect(ui.getRenderer()).toBe(fakeRenderer);

    const [dialogRes, alertRes, promptRes, sheetRes, bottomRes] = await Promise.all([
      confirmPromise,
      alertPromise,
      promptPromise,
      sheetPromise,
      bottomSheetHandle.result,
    ]);

    expect(dialogTitles).toContain('SSR Confirm');
    expect(dialogTitles).toContain('SSR Alert String');
    expect(dialogTitles).toContain('SSR Prompt String');
    expect(sheetOpened).toHaveBeenCalledWith('SSR Sheet');
    expect(bottomSheetOpened).toHaveBeenCalledWith('SSR BottomSheet');

    expect(dialogRes.isConfirmed).toBe(true);
    expect(alertRes.isConfirmed).toBe(true);
    expect(promptRes.isConfirmed).toBe(true);
    expect(promptRes.value).toBe('prompt-val');
    expect(sheetRes.isConfirmed).toBe(true);
    expect(bottomRes.isConfirmed).toBe(true);
  });

  it('runs directly against registered renderer and supports steps()', async () => {
    const ui = createUI();
    const fakeRenderer: Renderer = {
      openDialog(options, handle) {
        handle.close({ isConfirmed: true, value: `${options.title}-done` });
      },
    };
    ui.registerRenderer(fakeRenderer);

    const conf = await ui.confirm('Direct Confirm');
    expect(conf.isConfirmed).toBe(true);
    expect(conf.value).toBe('Direct Confirm-done');

    const alertRes = await ui.alert('Direct Alert');
    expect(alertRes.isConfirmed).toBe(true);
    expect(alertRes.value).toBe('Direct Alert-done');

    const promptRes = await ui.prompt('Direct Prompt');
    expect(promptRes.isConfirmed).toBe(true);
    expect(promptRes.value).toBe('Direct Prompt-done');

    const stepsRes = await ui.steps([
      { title: 'Step 1' },
      { title: 'Step 2' },
    ]);
    expect(stepsRes.isConfirmed).toBe(true);
    expect(stepsRes.values).toEqual(['Step 1-done', 'Step 2-done']);
  });

  it('handles loading overlay before and after renderer registration with string and object', async () => {
    const ui = createUI();
    const handle1 = ui.loading('String loading');

    const liveClose = vi.fn();
    const liveUpdate = vi.fn();
    const fakeRenderer: Renderer = {
      openLoading(options) {
        return {
          update: liveUpdate,
          close: liveClose,
          closed: Promise.resolve(),
        };
      },
    };

    ui.registerRenderer(fakeRenderer);
    handle1.update({ progress: 0.5 });
    expect(liveUpdate).toHaveBeenCalledWith({ progress: 0.5 });
    handle1.close();
    expect(liveClose).toHaveBeenCalled();
    await handle1.closed;

    // Direct after registration
    const handle2 = ui.loading({ text: 'Object loading' });
    handle2.close();
    expect(liveClose).toHaveBeenCalledTimes(2);
  });

  it('handles empty renderer fallback for sheet and bottomSheet', async () => {
    const ui = createUI();
    const sheetProm = ui.sheet({ title: 'No renderer sheet', actions: [] });
    const bSheetHandle = ui.bottomSheet({ title: 'No renderer bsheet' });
    const loadHandle = ui.loading('No renderer loading');

    // Register renderer with no sheet or loading support
    ui.registerRenderer({});

    const sRes = await sheetProm;
    expect(sRes.isDismissed).toBe(true);

    const bRes = await bSheetHandle.result;
    expect(bRes.isDismissed).toBe(true);

    await loadHandle.closed;

    bSheetHandle.close();
    bSheetHandle.snapTo(1);
    bSheetHandle.update({});
  });

  it('invokes renderer directly when openSheet and openBottomSheet are present', async () => {
    const ui = createUI();
    const fakeRenderer: Renderer = {
      openSheet: (opts) =>
        Promise.resolve({
          isConfirmed: true,
          isDenied: false,
          isDismissed: false,
          value: opts.title,
          dismiss: undefined,
        }),
      openBottomSheet: (opts) => ({
        body: null,
        close: vi.fn(),
        snapTo: vi.fn(),
        update: vi.fn(),
        result: Promise.resolve({
          isConfirmed: true,
          isDenied: false,
          isDismissed: false,
          value: opts.title,
          dismiss: undefined,
        }),
      }),
    };
    ui.registerRenderer(fakeRenderer);

    const sRes = await ui.sheet({ title: 'Direct Sheet', actions: [] });
    expect(sRes.isConfirmed).toBe(true);
    expect(sRes.value).toBe('Direct Sheet');

    const bRes = await ui.bottomSheet({ title: 'Direct BottomSheet' }).result;
    expect(bRes.isConfirmed).toBe(true);
    expect(bRes.value).toBe('Direct BottomSheet');
  });

  it('clears active toasts and dialogs on clear()', () => {
    const ui = createUI();
    ui.toast('Hello');
    ui.toast('World');
    expect(ui.toastStore.getToasts()).toHaveLength(2);

    ui.clear();
    expect(ui.toastStore.getToasts()).toHaveLength(0);
  });

  it('evaluates configuration precedence correctly: call > theme > global > library default', () => {
    // 1. Call option wins
    expect(resolvePrecedence('call-val', 'theme-val', 'global-val', 'default-val')).toBe('call-val');

    // 2. Theme default wins over global
    expect(resolvePrecedence(undefined, 'theme-val', 'global-val', 'default-val')).toBe('theme-val');

    // 3. Global config wins over default
    expect(resolvePrecedence(undefined, undefined, 'global-val', 'default-val')).toBe('global-val');

    // 4. Default applies when all are undefined
    expect(resolvePrecedence(undefined, undefined, undefined, 'default-val')).toBe('default-val');
  });
});

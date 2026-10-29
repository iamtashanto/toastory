import { describe, expect, it, vi } from 'vitest';
import { createDialogManager, runSteps } from '../../src/core/dialog-manager';

describe('headless dialog manager and state machine', () => {
  it('opens a dialog and resolves on confirm with input value', async () => {
    const manager = createDialogManager();
    const handle = manager.open({
      title: 'Question',
      input: 'text',
      inputValue: 'Initial',
    });

    const active = manager.getActive();
    expect(active).toBeDefined();
    expect(active?.getState().options.title).toBe('Question');

    // Simulate input modification
    active?.setValueReader(() => 'Modified Value');
    await active?.submit('confirm');

    const result = await handle.result;
    expect(result.isConfirmed).toBe(true);
    expect(result.value).toBe('Modified Value');
    expect(manager.getActive()).toBeUndefined();
  });

  it('queues dialogs so only one modal is active, prioritizing by priority option', async () => {
    const manager = createDialogManager();

    const first = manager.open({ title: 'First Dialog', priority: 1 });
    const lowPriority = manager.open({ title: 'Low Priority', priority: 0 });
    const highPriority = manager.open({ title: 'High Priority', priority: 10 });

    expect(manager.getActive()?.getState().options.title).toBe('First Dialog');
    expect(manager.getQueue()).toHaveLength(2);

    // Close first dialog
    first.close();
    await first.result;

    // High priority dialog was promoted next!
    expect(manager.getActive()?.getState().options.title).toBe('High Priority');
    highPriority.close();
    await highPriority.result;

    // Finally low priority
    expect(manager.getActive()?.getState().options.title).toBe('Low Priority');
    lowPriority.close();
    await lowPriority.result;
    expect(manager.getActive()).toBeUndefined();
  });

  it('handles validation failure and keeps dialog open', async () => {
    const manager = createDialogManager();
    const handle = manager.open({
      title: 'Prompt',
      validate: (val) => (!val ? 'Field is required' : undefined),
    });

    const active = manager.getActive()!;
    active.setValueReader(() => '');
    await active.submit('confirm');

    expect(active.getState().error).toBe('Field is required');
    expect(active.getState().open).toBe(true);

    // Fix value
    active.setValueReader(() => 'Valid');
    await active.submit('confirm');

    const result = await handle.result;
    expect(result.isConfirmed).toBe(true);

    // Validate throwing an error
    const hThrow = manager.open({
      title: 'Throwing Validate',
      validate: () => {
        throw new Error('Validate crash');
      },
    });
    const activeThrow = manager.getActive()!;
    await activeThrow.submit('confirm');
    expect(activeThrow.getState().error).toBe('Validate crash');
  });

  it('handles async preConfirm error without dismissing', async () => {
    const manager = createDialogManager();
    let attempt = 0;
    const handle = manager.open({
      title: 'Async Task',
      preConfirm: async () => {
        attempt += 1;
        if (attempt === 1) throw new Error('Network timeout');
        return 'Done';
      },
    });

    const active = manager.getActive()!;
    await active.submit('confirm');
    expect(active.getState().error).toBe('Network timeout');
    expect(active.getState().open).toBe(true);

    // Second try succeeds
    await active.submit('confirm');
    const result = await handle.result;
    expect(result.isConfirmed).toBe(true);
    expect(result.value).toBe('Done');
  });

  it('handles preDeny hook with error catching', async () => {
    const manager = createDialogManager();
    let errorOnce = true;
    const handle = manager.open({
      title: 'Deny Hook',
      preDeny: async () => {
        if (errorOnce) {
          errorOnce = false;
          throw new Error('Deny failed');
        }
        return 'Denied Value';
      },
    });

    const active = manager.getActive()!;
    await active.submit('deny');
    expect(active.getState().error).toBe('Deny failed');
    expect(active.getState().open).toBe(true);

    await active.submit('deny');
    const result = await handle.result;
    expect(result.isDenied).toBe(true);
    expect(result.value).toBe('Denied Value');
  });

  it('exercises handle API: update, setLoading, showError and timer controls', () => {
    const manager = createDialogManager();
    const handle = manager.open({ title: 'Test Handle', timer: 3000 });
    const active = manager.getActive()!;

    handle.update({ title: 'Updated Title' });
    expect(active.getState().options.title).toBe('Updated Title');

    handle.setLoading('confirm');
    expect(active.getState().loading).toBe('confirm');
    handle.setLoading(false);
    expect(active.getState().loading).toBeNull();

    handle.showError('Something broke');
    expect(active.getState().error).toBe('Something broke');
    handle.showError(null);
    expect(active.getState().error).toBeUndefined();

    // Timer controls
    expect(handle.timer.remaining()).toBeGreaterThan(0);
    handle.timer.pause();
    expect(handle.timer.paused()).toBe(true);
    handle.timer.add(1000);
    handle.timer.resume();
    expect(handle.timer.paused()).toBe(false);

    handle.close();
  });

  it('resolves dismiss reasons: cancel, backdrop, close, esc, timer', async () => {
    const manager = createDialogManager();

    // Cancel
    const h1 = manager.open({ title: 'D1' });
    await manager.getActive()?.dismiss('cancel');
    expect((await h1.result).dismiss).toBe('cancel');

    // Backdrop
    const h2 = manager.open({ title: 'D2' });
    await manager.getActive()?.dismiss('backdrop');
    expect((await h2.result).dismiss).toBe('backdrop');

    // Esc
    const h3 = manager.open({ title: 'D3' });
    await manager.getActive()?.dismiss('esc');
    expect((await h3.result).dismiss).toBe('esc');

    // Close
    const h4 = manager.open({ title: 'D4' });
    h4.close();
    expect((await h4.result).dismiss).toBe('close');
  });

  it('runs multi-step wizard sequentially and handles step cancel', async () => {
    const manager = createDialogManager();

    const sequencePromise = runSteps(
      [
        { title: 'Step 1', input: 'text', inputValue: 'Val 1' },
        { title: 'Step 2', input: 'text', inputValue: 'Val 2' },
      ],
      manager,
    );

    // Step 1
    const active1 = manager.getActive()!;
    expect(active1.getState().options.title).toBe('Step 1');
    await active1.submit('confirm');

    // Step 2
    const active2 = manager.getActive()!;
    expect(active2.getState().options.title).toBe('Step 2');
    await active2.submit('confirm');

    const result = await sequencePromise;
    expect(result.isConfirmed).toBe(true);
    expect(result.value).toEqual(['Val 1', 'Val 2']);

    // Cancel in step 1
    const cancelSeq = runSteps([{ title: 'Step A' }], manager);
    await manager.getActive()!.dismiss('cancel');
    const cancelRes = await cancelSeq;
    expect(cancelRes.isDismissed).toBe(true);
  });

  it('supports manager.clear() and clearing queued dialogs', async () => {
    const manager = createDialogManager();
    const h1 = manager.open({ title: 'Active' });
    const h2 = manager.open({ title: 'Queued' });

    manager.clear();
    const [r1, r2] = await Promise.all([h1.result, h2.result]);
    expect(r1.isDismissed).toBe(true);
    expect(r2.isDismissed).toBe(true);
    expect(manager.getActive()).toBeUndefined();
    expect(manager.getQueue()).toHaveLength(0);
  });

  it('subscribes to controller state changes and unsubscribes', () => {
    const manager = createDialogManager();
    manager.open({ title: 'Sub test' });
    const active = manager.getActive()!;
    const listener = vi.fn();
    const unsubscribe = active.subscribe(listener);

    active.handle.update({ title: 'New Sub' });
    expect(listener).toHaveBeenCalled();

    unsubscribe();
    listener.mockClear();
    active.handle.update({ title: 'Another' });
    expect(listener).not.toHaveBeenCalled();
    active.handle.close();
  });

  it('preConfirm returning false resets loading without confirming or closing', async () => {
    const manager = createDialogManager();
    let allow = false;
    const handle = manager.open({
      title: 'Guard',
      preConfirm: async () => {
        if (!allow) return false;
        return 'Allowed';
      },
    });

    const active = manager.getActive()!;
    await active.submit('confirm');
    expect(active.getState().loading).toBeNull();
    expect(active.getState().open).toBe(true);

    allow = true;
    await active.submit('confirm');
    const result = await handle.result;
    expect(result.isConfirmed).toBe(true);
    expect(result.value).toBe('Allowed');
  });

  it('preDeny returning false resets loading without closing', async () => {
    const manager = createDialogManager();
    let allowDeny = false;
    const handle = manager.open({
      title: 'Guard Deny',
      preDeny: async () => {
        if (!allowDeny) return false;
        return 'Denied';
      },
    });

    const active = manager.getActive()!;
    await active.submit('deny');
    expect(active.getState().loading).toBeNull();
    expect(active.getState().open).toBe(true);

    allowDeny = true;
    await active.submit('deny');
    const result = await handle.result;
    expect(result.isDenied).toBe(true);
    expect(result.value).toBe('Denied');
  });

  it('handles errors thrown in willClose and didOpen safely', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const manager = createDialogManager();
    const handle = manager.open({
      title: 'Error callbacks',
      didOpen: () => {
        throw new Error('didOpen crash');
      },
      willClose: () => {
        throw new Error('willClose crash');
      },
    });

    const active = manager.getActive()!;
    expect(errSpy).toHaveBeenCalledTimes(1);

    await active.submit('confirm');
    await handle.result;
    expect(errSpy).toHaveBeenCalledTimes(2);

    // willClose throwing on handle.close()
    const h2 = manager.open({
      title: 'Close with error',
      willClose: () => {
        throw new Error('close crash');
      },
    });
    h2.close();
    await h2.result;
    expect(errSpy).toHaveBeenCalledTimes(3);

    // willClose throwing on dismiss()
    const h3 = manager.open({
      title: 'Dismiss with error',
      willClose: () => {
        throw new Error('dismiss crash');
      },
    });
    await manager.getActive()!.dismiss('backdrop');
    await h3.result;
    expect(errSpy).toHaveBeenCalledTimes(4);

    errSpy.mockRestore();
  });

  it('ignores operations when settled or loading', async () => {
    const manager = createDialogManager();
    const handle = manager.open({ title: 'Settled test' });
    const active = manager.getActive()!;

    handle.close({ isConfirmed: true, value: 'Manual' });
    await handle.result;

    // After settled:
    handle.update({ title: 'Ignored' });
    await active.submit('confirm');
    await active.dismiss('esc');
    expect(active.getState().options.title).toBe('Settled test');
  });

  it('dismisses automatically when timer expires', async () => {
    vi.useFakeTimers();
    try {
      const manager = createDialogManager();
      const handle = manager.open({ title: 'Auto Timer', timer: 500 });
      const active = manager.getActive()!;
      active.opened();

      vi.advanceTimersByTime(500);
      const res = await handle.result;
      expect(res.dismiss).toBe('timer');
      expect(res.isDismissed).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});

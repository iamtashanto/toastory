import { describe, expect, it } from 'vitest';
import { createToastEngine } from '../../src/core';

describe('promise helper (runPromiseToast)', () => {
  it('handles synchronous throw from promise factory function', async () => {
    const { toast } = createToastEngine();
    const handle = toast.promise(
      () => {
        throw new Error('Sync explosion');
      },
      {
        loading: 'Starting...',
        error: (err) => `Caught: ${(err as Error).message}`,
      },
    );

    await expect(handle.unwrap()).rejects.toThrow('Sync explosion');
  });

  it('supports description functions and string descriptions', async () => {
    const { toast, store } = createToastEngine();

    const successTask = Promise.resolve({ count: 5 });
    const h1 = toast.promise(successTask, {
      loading: 'Counting...',
      success: 'Done',
      description: (outcome) =>
        outcome.status === 'success' ? `Found ${outcome.value.count}` : 'Failed',
    });
    await h1.unwrap();
    expect(store.getToasts()[0]?.description).toBe('Found 5');

    const successStaticTask = Promise.resolve('ok');
    const hStatic = toast.promise(successStaticTask, {
      loading: 'Loading...',
      success: 'Static Success',
      description: 'Static success description',
    });
    await hStatic.unwrap();
    expect(store.getToasts()[1]?.description).toBe('Static success description');

    const failFnTask = Promise.reject(new Error('Func error'));
    const hFailFn = toast.promise(failFnTask, {
      loading: 'Failing...',
      error: 'Failed',
      description: (outcome) => (outcome.status === 'error' ? 'Function error description' : ''),
    });
    await expect(hFailFn.unwrap()).rejects.toThrow('Func error');
    expect(store.getToasts()[2]?.description).toBe('Function error description');

    const failTask = Promise.reject(new Error('Network error'));
    const h2 = toast.promise(failTask, {
      loading: 'Failing...',
      error: 'Failed',
      description: 'Static error description',
    });
    await expect(h2.unwrap()).rejects.toThrow('Network error');
    expect(store.getToasts()[3]?.description).toBe('Static error description');
  });
});

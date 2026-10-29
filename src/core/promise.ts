import type { PromiseHandle, PromiseMessages, ToastId, ToastOptions, ToastPatch } from './types';
import type { ToastStore } from './toast-manager';

function toPatch(message: string | ToastPatch): ToastPatch {
  return typeof message === 'string' ? { title: message } : message;
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Handles async promise toasts: displays loading state, resolves to success or error,
 * calls lifecycle hooks, and provides `unwrap()` returning the raw promise result.
 */
export function runPromiseToast<T>(
  store: ToastStore,
  input: Promise<T> | (() => Promise<T>),
  messages: PromiseMessages<T>,
  options: ToastOptions = {},
): PromiseHandle<T> {
  let promise: Promise<T>;
  try {
    promise = typeof input === 'function' ? input() : input;
  } catch (error) {
    promise = Promise.reject(error);
  }

  const { id: requestedId, ...base } = options;
  const loadingPatch = toPatch(messages.loading);

  const id: ToastId = store.add({
    ...base,
    ...(requestedId === undefined ? {} : { id: requestedId }),
    ...loadingPatch,
    type: 'loading',
    duration: 0, // persistent while pending
  });

  const settle = (type: 'success' | 'error', raw: unknown, payload: unknown): void => {
    const desc =
      typeof messages.description === 'function'
        ? messages.description(
            type === 'success'
              ? { status: type, value: payload as T }
              : { status: type, error: payload },
          )
        : messages.description;
    store.update(id, {
      duration: base.duration ?? store.config.get().duration,
      ...toPatch(raw as string | ToastPatch),
      type,
      ...(desc !== undefined ? { description: desc } : {}),
      resetTimer: true,
    });
  };

  promise
    .then((value) => {
      if (messages.success === undefined) {
        store.dismiss(id);
      } else {
        settle(
          'success',
          typeof messages.success === 'function' ? messages.success(value) : messages.success,
          value,
        );
      }
    })
    .catch((error: unknown) => {
      settle(
        'error',
        messages.error === undefined
          ? errorText(error)
          : typeof messages.error === 'function'
            ? messages.error(error)
            : messages.error,
        error,
      );
    })
    .finally(() => {
      try {
        void messages.finally?.();
      } catch (err) {
        console.error(err);
      }
    });

  return {
    id,
    unwrap: () => promise,
  };
}

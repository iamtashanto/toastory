import type {
  PromiseHandle,
  PromiseMessages,
  ToastId,
  ToastOptions,
  ToastPatch,
} from './types';
import type { ToastStore } from './toast-manager';

function toPatch(message: string | ToastPatch): ToastPatch {
  return typeof message === 'string' ? { title: message } : message;
}

function errorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : String(error);
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

  promise
    .then((value) => {
      if (messages.success === undefined) {
        store.dismiss(id);
        return;
      }
      const raw =
        typeof messages.success === 'function' ? messages.success(value) : messages.success;
      const patch = toPatch(raw);
      let desc: string | undefined;
      if (typeof messages.description === 'function') {
        desc = messages.description({ status: 'success', value });
      } else if (messages.description !== undefined) {
        desc = messages.description;
      }
      store.update(id, {
        duration: base.duration ?? store.config.get().duration,
        ...patch,
        type: 'success',
        ...(desc !== undefined ? { description: desc } : {}),
        resetTimer: true,
      });
    })
    .catch((error: unknown) => {
      const raw =
        messages.error === undefined
          ? errorText(error)
          : typeof messages.error === 'function'
            ? messages.error(error)
            : messages.error;
      const patch = toPatch(raw);
      let desc: string | undefined;
      if (typeof messages.description === 'function') {
        desc = messages.description({ status: 'error', error });
      } else if (messages.description !== undefined) {
        desc = messages.description;
      }
      store.update(id, {
        duration: base.duration ?? store.config.get().duration,
        ...patch,
        type: 'error',
        ...(desc !== undefined ? { description: desc } : {}),
        resetTimer: true,
      });
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

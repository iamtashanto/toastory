import type { ToastStore } from './store';
import type {
  Renderable,
  ToastCustomRenderer,
  ToastId,
  ToastOptions,
  ToastPatch,
  ToastRecord,
} from './types';
import type { TypeRegistry } from './types-registry';

/** Outcome handed to promise description callbacks. */
export type PromiseOutcome<T> =
  { status: 'success'; value: T } | { status: 'error'; error: unknown };

/** A message for one promise phase: a title, a patch, or a function producing either. */
export type PromiseMessage<V> = string | ToastPatch | ((value: V) => string | ToastPatch);

/** Messages for `ui.toast.promise`. */
export interface PromiseMessages<T> {
  /** Shown while the promise is pending. */
  loading: string | ToastPatch;
  /** Shown on resolution. When omitted the toast is dismissed. */
  success?: PromiseMessage<T>;
  /** Shown on rejection. Defaults to the error message. */
  error?: PromiseMessage<unknown>;
  /** Description applied to the success and error phases. */
  description?: string | ((outcome: PromiseOutcome<T>) => string);
  /** Runs after settlement, whatever the outcome. */
  finally?: () => void | Promise<void>;
}

/** Result of `ui.toast.promise`. */
export interface PromiseHandle<T> {
  /** Id of the toast that tracks the promise. */
  id: ToastId;
  /** Returns the underlying promise: resolves with the value or rejects with the original error. */
  unwrap(): Promise<T>;
}

/** Callable toast function shape shared by all entry points. */
export type ToastFn = (message?: Renderable, options?: ToastOptions) => ToastId;

/** The `ui.toast` API. */
export interface ToastApi extends ToastFn {
  /** Success toast. */
  success: ToastFn;
  /** Error toast. Uses an assertive live region. */
  error: ToastFn;
  /** Informational toast. */
  info: ToastFn;
  /** Warning toast. */
  warning: ToastFn;
  /** Persistent loading toast until updated or dismissed. */
  loading: ToastFn;
  /** Plain message toast without an icon. */
  message: ToastFn;
  /** Tracks a promise with loading, success and error phases. */
  promise<T>(
    input: Promise<T> | (() => Promise<T>),
    messages: PromiseMessages<T>,
    options?: ToastOptions,
  ): PromiseHandle<T>;
  /** Renders a toast through a custom renderer. */
  custom(renderer: ToastCustomRenderer, options?: ToastOptions): ToastId;
  /** Patches an active toast. */
  update(id: ToastId, patch: ToastPatch): boolean;
  /** Dismisses one toast, or all when `id` is omitted. */
  dismiss(id?: ToastId): void;
  /** Dismisses every toast. */
  dismissAll(): void;
  /** Active toasts. */
  getToasts(): readonly ToastRecord[];
  /** Closed toasts, newest first. */
  getHistory(): readonly ToastRecord[];
  /** Custom type registry. */
  readonly types: TypeRegistry;
}

function toPatch(message: string | ToastPatch): ToastPatch {
  return typeof message === 'string' ? { title: message } : message;
}

function errorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : String(error);
}

/** Builds the `ui.toast` API on top of a store. */
export function createToastApi(store: ToastStore): ToastApi {
  const make =
    (type: ToastOptions['type']): ToastFn =>
    (message, options = {}) => {
      const input: ToastOptions = { ...options };
      if (type !== undefined && options.type === undefined) input.type = type;
      if (message !== undefined && options.title === undefined) input.title = message;
      return store.add(input);
    };

  const api = make(undefined) as ToastApi;
  api.success = make('success');
  api.error = make('error');
  api.info = make('info');
  api.warning = make('warning');
  api.loading = make('loading');
  api.message = make('message');

  api.custom = (renderer, options = {}) => store.add({ ...options, custom: renderer });
  api.update = (id, patch) => store.update(id, patch);
  api.dismiss = (id) => store.dismiss(id);
  api.dismissAll = () => store.dismissAll();
  api.getToasts = () => store.getToasts();
  api.getHistory = () => store.getHistory();
  Object.defineProperty(api, 'types', { value: store.types, enumerable: true });

  api.promise = <T>(
    input: Promise<T> | (() => Promise<T>),
    messages: PromiseMessages<T>,
    options: ToastOptions = {},
  ): PromiseHandle<T> => {
    let promise: Promise<T>;
    try {
      promise = typeof input === 'function' ? input() : input;
    } catch (error) {
      promise = Promise.reject(error);
    }
    const { id: requestedId, ...base } = options;
    const id = store.add({
      ...base,
      ...(requestedId === undefined ? {} : { id: requestedId }),
      type: 'loading',
      ...toPatch(messages.loading),
    });
    const describe = (outcome: PromiseOutcome<T>): ToastPatch =>
      messages.description === undefined
        ? {}
        : {
            description:
              typeof messages.description === 'function'
                ? messages.description(outcome)
                : messages.description,
          };
    const resolvePhase = <V>(message: PromiseMessage<V>, value: V): ToastPatch =>
      toPatch(typeof message === 'function' ? message(value) : message);
    const settle = async (): Promise<void> => {
      try {
        await messages.finally?.();
      } catch {
        // A failing finally callback must not mask the settled toast.
      }
    };

    void promise.then(
      async (value) => {
        if (messages.success === undefined) store.dismiss(id);
        else {
          store.update(id, {
            type: 'success',
            ...base,
            ...describe({ status: 'success', value }),
            ...resolvePhase(messages.success, value),
          });
        }
        await settle();
      },
      async (error: unknown) => {
        store.update(id, {
          type: 'error',
          ...base,
          title: errorText(error),
          ...describe({ status: 'error', error }),
          ...(messages.error === undefined ? {} : resolvePhase(messages.error, error)),
        });
        await settle();
      },
    );

    return { id, unwrap: () => promise };
  };

  return api;
}

import { createTimer } from './timer';
import type { PausableTimer } from './timer';
import type { Listener, Unsubscribe } from './types';

export type {
  DialogBackdrop,
  DialogButton,
  DialogChoice,
  DialogColumn,
  DialogHandle,
  DialogIcon,
  DialogInputType,
  DialogOptions,
  DialogPosition,
  DialogResult,
  DialogRow,
  DialogTone,
  DismissReason,
  ValidateResult,
} from './types';
import type {
  DialogHandle,
  DialogOptions,
  DialogResult,
  DismissReason,
  ValidateResult,
} from './types';

/** Observable view of a running dialog. */
export interface DialogState {
  /** Current merged options. */
  options: DialogOptions;
  /** Which button is busy. */
  loading: 'confirm' | 'deny' | null;
  /** Inline error. */
  error: string | undefined;
  /** `true` until the dialog resolves. */
  open: boolean;
  /** Increments on every change. */
  revision: number;
}

/** Drives validation, async hooks, timer and result of one dialog. No DOM. */
export interface DialogController {
  /** Control surface shared with user callbacks. */
  readonly handle: DialogHandle;
  /** Current state. */
  getState(): DialogState;
  /** Subscribes to state changes. */
  subscribe(listener: Listener): Unsubscribe;
  /** Renderer supplies the function that reads the current input value. */
  setValueReader(reader: () => unknown): void;
  /** Renderer calls this once mounted. Starts the timer and fires `didOpen`. */
  opened(): void;
  /** Runs confirm or deny. Resolves after hooks have run. */
  submit(kind: 'confirm' | 'deny'): Promise<void>;
  /** Dismisses when allowed. Returns whether the dialog closed. */
  dismiss(reason: DismissReason): boolean;
}

function messageOf(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : String(error);
}

/** Creates the controller for a dialog. */
export function createDialogController(initial: DialogOptions): DialogController {
  let options: DialogOptions = { ...initial };
  let loading: DialogState['loading'] = null;
  let error: string | undefined;
  let open = true;
  let revision = 0;
  let timer: PausableTimer | undefined;
  let readValue: () => unknown = () => options.inputValue;
  let resolveResult: (result: DialogResult) => void = () => undefined;
  const listeners = new Set<Listener>();
  const result = new Promise<DialogResult>((resolve) => {
    resolveResult = resolve;
  });
  let state: DialogState = { options, loading, error, open, revision };

  const emit = (): void => {
    revision += 1;
    state = { options, loading, error, open, revision };
    for (const listener of [...listeners]) listener();
  };

  const finish = (partial: Partial<DialogResult>): void => {
    if (!open) return;
    const final: DialogResult = {
      isConfirmed: false,
      isDenied: false,
      isDismissed: false,
      value: undefined,
      dismiss: undefined,
      ...partial,
    };
    options.willClose?.(handle, final);
    open = false;
    timer?.cancel();
    emit();
    resolveResult(final);
  };

  const startTimer = (ms: number): void => {
    timer?.cancel();
    timer = undefined;
    if (ms > 0 && Number.isFinite(ms)) {
      timer = createTimer(ms, () => {
        finish({ isDismissed: true, dismiss: 'timer' });
      });
      timer.start();
    }
  };

  const handle: DialogHandle = {
    result,
    close(partial) {
      finish(partial ?? { isDismissed: true, dismiss: 'close' });
    },
    update(patch) {
      if (!open) return;
      options = { ...options, ...patch };
      if (patch.timer !== undefined) startTimer(patch.timer);
      emit();
    },
    setLoading(value) {
      if (!open) return;
      loading = value === true ? 'confirm' : value === false ? null : value;
      emit();
    },
    showError(message) {
      if (!open) return;
      error = message ?? undefined;
      emit();
    },
    timer: {
      pause: () => {
        timer?.pause();
        emit();
      },
      resume: () => {
        timer?.resume();
        emit();
      },
      add: (ms) => {
        if (timer) timer.add(ms);
        else startTimer(Math.max(1, ms));
        emit();
      },
      remaining: () => timer?.remaining() ?? 0,
      paused: () => (timer ? !timer.isRunning() && timer.remaining() > 0 : false),
    },
  };

  const controller: DialogController = {
    handle,
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setValueReader(reader) {
      readValue = reader;
    },
    opened() {
      if (!open) return;
      if (options.timer !== undefined) startTimer(options.timer);
      emit();
      options.didOpen?.(handle);
    },
    async submit(kind) {
      if (!open || loading) return;
      let value = readValue();
      if (error !== undefined) {
        error = undefined;
        emit();
      }
      if (kind === 'confirm' && options.validate) {
        loading = 'confirm';
        emit();
        let message: ValidateResult;
        try {
          message = await options.validate(value, handle);
        } catch (thrown) {
          message = messageOf(thrown);
        }
        loading = null;
        if (!open) return;
        if (typeof message === 'string' && message !== '') {
          error = message;
          emit();
          return;
        }
        emit();
      }
      const hook = kind === 'confirm' ? options.preConfirm : options.preDeny;
      if (hook) {
        loading = kind;
        emit();
        let output: unknown;
        try {
          output = await hook(value, handle);
        } catch (thrown) {
          loading = null;
          if (!open) return;
          error = messageOf(thrown);
          emit();
          return;
        }
        loading = null;
        if (!open) return;
        if (output === false) {
          emit();
          return;
        }
        if (output !== undefined) value = output;
      }
      finish({ isConfirmed: kind === 'confirm', isDenied: kind === 'deny', value });
    },
    dismiss(reason) {
      if (!open) return false;
      if (loading && reason !== 'timer') return false;
      if (reason === 'backdrop' && options.allowOutsideClick === false) return false;
      if (reason === 'esc' && options.allowEscape === false) return false;
      finish({ isDismissed: true, dismiss: reason });
      return true;
    },
  };

  return controller;
}

/** Promise returned by dialog helpers, with the live handle attached. */
export type DialogPromise<R = DialogResult> = Promise<R> & { handle: DialogHandle };

/** Result of `ui.steps`. */
export interface StepsResult extends DialogResult {
  /** Confirmed values of every completed step. */
  values: unknown[];
  /** Zero based index of the step the flow ended on. */
  step: number;
}

/**
 * Runs dialogs one after another. From the second step on, the deny button becomes a "back"
 * button using `backLabel`, and activating it returns to the previous step.
 * @param steps Options of each step.
 * @param open Opens one dialog.
 * @param backLabel Label for the back button.
 */
export async function runSteps(
  steps: readonly DialogOptions[],
  open: (options: DialogOptions) => Promise<DialogResult>,
  backLabel = 'Back',
): Promise<StepsResult> {
  const values: unknown[] = [];
  let index = 0;
  let last: DialogResult = {
    isConfirmed: false,
    isDenied: false,
    isDismissed: true,
    value: undefined,
    dismiss: 'close',
  };
  while (index < steps.length) {
    const base = steps[index];
    if (!base) break;
    const options: DialogOptions =
      index > 0
        ? { ...base, denyButton: { show: true, label: backLabel, ...base.denyButton } }
        : base;
    const previous = values[index];
    const restored =
      typeof previous === 'string' || typeof previous === 'number' || typeof previous === 'boolean'
        ? previous
        : options.inputValue;
    last = await open({ ...options, inputValue: restored });
    if (last.isConfirmed) {
      values[index] = last.value;
      index += 1;
    } else if (last.isDenied && index > 0) {
      index -= 1;
    } else {
      return { ...last, values: values.slice(0, index), step: index };
    }
  }
  return { ...last, values, step: Math.max(0, steps.length - 1) };
}

import { createTimer } from './timer';
import type { PausableTimer } from './timer';
import type { Listener, Renderable, Unsubscribe } from './types';

/** Input kinds supported by prompts. */
export type DialogInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'range'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'week'
  | 'month'
  | 'file';

/** Icon preset shown at the top of a dialog. */
export type DialogIcon = 'success' | 'error' | 'warning' | 'info' | 'question' | 'custom';

/** Visual tone. Tints the confirm button and the icon. */
export type DialogTone = 'info' | 'warning' | 'danger';

/** Backdrop behaviour. A custom value is a CSS background string. */
export type DialogBackdrop = 'blur' | 'dim' | 'none' | (string & {});

/** The five rows of the placement grid. */
export type DialogRow = 'top' | 'upper' | 'center' | 'lower' | 'bottom';
/** The three columns of the placement grid. */
export type DialogColumn = 'start' | 'center' | 'end';
/** One of 15 placements, row first. `center-center` is the default. */
export type DialogPosition = `${DialogRow}-${DialogColumn}`;

/** Why a dialog closed without confirming or denying. */
export type DismissReason = 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer';

/** Outcome of every dialog. */
export interface DialogResult<V = unknown> {
  /** The confirm button (or Enter on an input) was used and hooks accepted. */
  isConfirmed: boolean;
  /** The deny button was used. */
  isDenied: boolean;
  /** The dialog closed without a decision. */
  isDismissed: boolean;
  /** Input value or the value returned from `preConfirm` / `preDeny`. */
  value: V | undefined;
  /** Present when `isDismissed` is true. */
  dismiss: DismissReason | undefined;
}

/** One choice of a select or radio input. */
export interface DialogChoice {
  /** Submitted value. */
  value: string;
  /** Visible label. */
  label: string;
  /** Disables the choice. */
  disabled?: boolean;
}

/** Configuration of one dialog button. */
export interface DialogButton {
  /** Whether to render the button. */
  show?: boolean;
  /** Visible label. */
  label?: string;
  /** CSS color applied as `--gk-button`. */
  color?: string;
  /** Accessible name when the label alone is ambiguous. */
  aria?: string;
}

/** Imperative control over an open dialog. */
export interface DialogHandle {
  /** Closes the dialog. Without an argument it resolves as dismissed with reason `close`. */
  close(result?: Partial<DialogResult>): void;
  /** Patches dialog options while it is open. */
  update(patch: Partial<DialogOptions>): void;
  /** Toggles the busy state of the confirm button (or the deny button when `'deny'`). */
  setLoading(loading: boolean | 'confirm' | 'deny'): void;
  /** Shows an inline error message, or clears it with `undefined`. */
  showError(message: string | undefined): void;
  /** Auto-close timer controls. */
  timer: {
    /** Pauses the countdown. */
    pause(): void;
    /** Resumes the countdown. */
    resume(): void;
    /** Adds milliseconds, or subtracts when negative. */
    add(ms: number): void;
    /** Milliseconds left, `0` when there is no timer. */
    remaining(): number;
    /** Whether a timer exists and is currently paused. */
    paused(): boolean;
  };
  /** Promise of the final result. */
  readonly result: Promise<DialogResult>;
}

/** Validation result: a non-empty string is the error message, anything else means valid. */
export type ValidateResult = string | undefined | void;

/** Options shared by `confirm`, `alert`, `prompt` and `steps`. */
export interface DialogOptions {
  /** Heading. Used as the accessible name of the dialog. */
  title?: string;
  /** Plain body text. */
  text?: string;
  /** Raw HTML body. Sanitized by the web renderer before insertion. */
  html?: string;
  /** Icon preset. */
  icon?: DialogIcon;
  /** Custom icon content when `icon` is `custom`. Meaning depends on the adapter. */
  iconContent?: Renderable;
  /** Tone of the dialog. */
  tone?: DialogTone;
  /** Confirm button settings. */
  confirmButton?: DialogButton;
  /** Deny button settings. Hidden unless `show` is true. */
  denyButton?: DialogButton;
  /** Cancel button settings. */
  cancelButton?: DialogButton;
  /** Swap the visual order of the buttons. */
  reverseButtons?: boolean;
  /** Which control receives focus on open. */
  focusOn?: 'confirm' | 'deny' | 'cancel' | 'input' | 'none';
  /** Input kind. Omit for no input. */
  input?: DialogInputType;
  /** Initial input value. Checkbox accepts a boolean. */
  inputValue?: string | number | boolean;
  /** Input placeholder. */
  placeholder?: string;
  /** Choices for `select` and `radio`. A record maps value to label. */
  options?: readonly DialogChoice[] | readonly string[] | Readonly<Record<string, string>>;
  /** Visible label of the input. */
  inputLabel?: string;
  /** Extra attributes for the input element, for example `min`, `max`, `step`, `accept`, `maxlength`. */
  inputAttributes?: Readonly<Record<string, string>>;
  /** Validates the value before confirming. Sync or async. */
  validate?: (value: unknown, handle: DialogHandle) => ValidateResult | Promise<ValidateResult>;
  /** Runs after validation. Return `false` to keep the dialog open, or a value to replace the result value. */
  preConfirm?: (value: unknown, handle: DialogHandle) => unknown | Promise<unknown>;
  /** Same as `preConfirm`, for the deny button. */
  preDeny?: (value: unknown, handle: DialogHandle) => unknown | Promise<unknown>;
  /** Backdrop click dismisses. Defaults to `true`. */
  allowOutsideClick?: boolean;
  /** Escape dismisses. Defaults to `true`. */
  allowEscape?: boolean;
  /** Backdrop style. */
  backdrop?: DialogBackdrop;
  /** Placement on the 5 by 3 grid. */
  position?: DialogPosition;
  /** Stretch to full width (`row`), full height (`column`) or the whole viewport (`fullscreen`). */
  grow?: 'row' | 'column' | 'fullscreen';
  /** Allow dragging the dialog by its header. */
  draggable?: boolean;
  /** CSS width of the dialog. */
  width?: string | number;
  /** CSS padding of the dialog. */
  padding?: string | number;
  /** Footer HTML (sanitized) or text. */
  footer?: string;
  /** Image displayed above the title. */
  image?: { src: string; alt: string; width?: number; height?: number };
  /** Auto-close timeout in milliseconds. */
  timer?: number;
  /** Show the countdown progress bar. */
  timerProgressBar?: boolean;
  /** Label of the close (x) button. Omit to hide the button. */
  closeButtonLabel?: string;
  /** Extra class name on the dialog element. */
  className?: string;
  /** Theme name override. */
  theme?: string;
  /** Called after the dialog is mounted and focus has moved. */
  didOpen?: (handle: DialogHandle) => void;
  /** Called right before the dialog closes. */
  willClose?: (handle: DialogHandle, result: DialogResult) => void;
}

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
      error = message;
      emit();
    },
    timer: {
      pause: () => {
        timer?.pause();
        emit();
      },
      resume: () => {
        timer?.start();
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

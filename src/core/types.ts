/**
 * Shared type definitions for the glazekit framework-agnostic core.
 * This module is 100% renderer-agnostic: no DOM, no framework imports.
 */

/** Identifier of a toast. Strings and numbers are supported. */
export type ToastId = string | number;

/**
 * Anything a renderer can display. The concrete meaning depends on the adapter:
 * a string for the web renderer, a React element for `glazekit/react`,
 * a VNode for `glazekit/vue`, etc.
 */
export type Renderable = unknown;

/** Built-in toast types. */
export type BuiltInToastType =
  'default' | 'message' | 'success' | 'error' | 'info' | 'warning' | 'loading';

/** Toast type name: a built-in type or custom registered type string. */
export type ToastType = BuiltInToastType | (string & {});

/** Placements supported by toast regions (6 positions). */
export type ToastPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/** The five rows of the dialog placement grid. */
export type DialogRow = 'top' | 'upper' | 'center' | 'lower' | 'bottom';

/** The three columns of the dialog placement grid. */
export type DialogColumn = 'start' | 'center' | 'end';

/** 15 dialog placements, row-column formatted. */
export type DialogPosition =
  | `${DialogRow}-${DialogColumn}`
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'center-start'
  | 'center-end'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/** Unified position type encompassing 6 toast positions and 15 dialog placements. */
export type Position = ToastPosition | DialogPosition;

/** Known theme presets. */
export type ThemeName =
  | 'ios-glass'
  | 'liquid-glass'
  | 'aurora'
  | 'classic-stack'
  | 'classic-bar'
  | 'pill'
  | 'ripple'
  | 'gradient-strip'
  | 'sweet'
  | 'material'
  | 'basic'
  | 'minimal'
  | 'flat'
  | 'outline'
  | 'neon'
  | 'gradient'
  | 'brutal'
  | 'pastel'
  | (string & {});

/** Color scheme selection. `auto` follows system preference. */
export type ColorMode = 'light' | 'dark' | 'auto';
export type Mode = ColorMode;

/** Text direction. `auto` inherits from root context. */
export type Direction = 'ltr' | 'rtl' | 'auto';

/** Events that pause a countdown timer. */
export type PauseOn = 'hover' | 'focus' | 'hidden' | 'manual' | (string & {});

/** Directions in which a toast can be swiped away. */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

/** Why a toast was removed. */
export type CloseReason =
  'auto' | 'user' | 'swipe' | 'click' | 'action' | 'cancel' | 'api' | 'overflow';

/** A clickable action or cancel button rendered inside a toast. */
export interface ToastAction {
  /** Visible button label. */
  label: string;
  /** Called when activated. Calling `preventDefault()` prevents automatic dismissal. */
  onClick?: (event: { preventDefault(): void; defaultPrevented: boolean }) => void;
  /** Optional accessible label when the text alone is ambiguous. */
  ariaLabel?: string;
}

/** Alias for ToastAction. */
export type ToastButton = ToastAction;

/** Slot class names a consumer can override. */
export interface ToastClassNames {
  toast?: string;
  title?: string;
  description?: string;
  icon?: string;
  avatar?: string;
  actionButton?: string;
  cancelButton?: string;
  closeButton?: string;
  progress?: string;
  content?: string;
  count?: string;
  link?: string;
  actions?: string;
  action?: string;
  cancel?: string;
}

/** Stacking mode for toasts. */
export type StackMode = boolean | 'stacked' | 'expanded' | 'list';

/** Built-in animation presets for toast enter/exit. */
export type AnimationType = 'slide' | 'bounce' | 'zoom' | 'flip' | 'spring' | 'fade' | 'none';

/** Region offset configuration. */
export type OffsetConfig =
  | number
  | string
  | {
      top?: number | string;
      bottom?: number | string;
      left?: number | string;
      right?: number | string;
    };

/** Context provided to `ui.toast.custom` renderers. */
export interface ToastRenderContext {
  id: ToastId;
  dismiss: () => void;
  update: (patch: ToastPatch) => void;
}

/** Custom renderer callback. */
export type ToastCustomRenderer = (context: ToastRenderContext) => Renderable;

/**
 * Options accepted by every toast creation call.
 */
export interface ToastOptions {
  /** Stable identifier. Reusing an active id updates in-place. */
  id?: ToastId;
  /** Toast type preset. */
  type?: ToastType;
  /** Heading text or renderable node. */
  title?: Renderable;
  /** Secondary subtitle or body text. */
  description?: Renderable;
  /** Icon: false disables, custom string or node replaces the built-in icon. */
  icon?: Renderable | false;
  /** Avatar URL or node shown before text. */
  avatar?: Renderable;
  /** Duration in ms. `0` or `Infinity` makes it persistent. */
  duration?: number;
  /** Screen region placement. */
  position?: ToastPosition;
  /** Primary action button. */
  action?: ToastAction;
  /** Secondary cancel button. */
  cancel?: ToastAction;
  /** Show explicit close button. */
  closeButton?: boolean;
  /** Accessible label for the close button. */
  closeButtonLabel?: string;
  /** Enter/exit animation preset. */
  animation?: AnimationType;
  /** Allow user dismissal. */
  dismissible?: boolean;
  /** Dismiss on body click. */
  closeOnClick?: boolean;
  /** Show timer progress bar. */
  progress?: boolean;
  /** Triggers that pause countdown. */
  pauseOn?: PauseOn[];
  /** Enable swipe dismissal. */
  swipe?: boolean;
  /** Directions allowed for swipe. */
  swipeDirections?: SwipeDirection[];
  /** Distance in pixels to trigger swipe dismiss. */
  dragThreshold?: number;
  /** Rich, saturated type backgrounds. */
  richColors?: boolean;
  /** Invert color scheme. */
  invert?: boolean;
  /** Theme preset override. */
  theme?: ThemeName;
  /** Additional CSS class. */
  className?: string;
  /** Granular slot CSS classes. */
  classNames?: ToastClassNames;
  /** Inline style overrides. */
  style?: Record<string, string | number>;
  /** Unstyled mode removing theme styles. */
  unstyled?: boolean;
  /** Sanitized HTML string for description. */
  html?: string;
  /** Hyperlink URL. */
  href?: string;
  /** Hyperlink target. */
  target?: '_self' | '_blank' | '_parent' | '_top';
  /** ARIA live level. */
  ariaLive?: 'polite' | 'assertive' | 'off';
  /** ARIA role. */
  role?: 'status' | 'alert' | 'log';
  /** Deduplication: boolean or custom string key. */
  dedupe?: boolean | string;
  /** High priority toast: bypasses maxVisible queue limit and uses assertive live region. */
  important?: boolean;
  /** Lifecycle hook: fired when toast mounts/opens. Exactly once. */
  onOpen?: (toast: ToastRecord) => void;
  /** Lifecycle hook: fired when toast closes/exits. Exactly once. */
  onClose?: (toast: ToastRecord, reason: CloseReason) => void;
  /** Lifecycle hook: fired on user dismissal. Exactly once. */
  onDismiss?: (toast: ToastRecord, reason: CloseReason) => void;
  /** Lifecycle hook: fired when auto-close timer elapses. Exactly once. */
  onAutoClose?: (toast: ToastRecord) => void;
  /** Container element id. */
  container?: string;
  /** Text direction. */
  dir?: Direction;
}

/** Fields that can be modified on an existing toast. */
export type ToastPatch = Omit<ToastOptions, 'id'> & {
  /** Resets the timer countdown after patching. Defaults to true. */
  resetTimer?: boolean;
};

/** Immutable snapshot record of an active toast. */
export interface ToastRecord extends ToastOptions {
  id: ToastId;
  type: ToastType;
  duration: number;
  position: ToastPosition;
  ariaLive: 'polite' | 'assertive' | 'off';
  role: 'status' | 'alert' | 'log';
  createdAt: number;
  updatedAt: number;
  revision: number;
  timerEpoch: number;
  count: number;
  visible: boolean;
  dismissed: boolean;
  pausedBy: string[];
  remaining: number;
  custom?: ToastCustomRenderer;
}

/** Definition for registering a custom toast type. */
export interface ToastTypeDefinition {
  defaults?: ToastOptions;
  icon?: Renderable;
  color?: string;
  duration?: number;
  ariaLive?: 'polite' | 'assertive' | 'off';
}

/** Global configuration for toasts and dialogs. */
export interface GlazeConfig {
  theme: ThemeName;
  mode: ColorMode;
  position: ToastPosition;
  duration: number;
  maxVisible: number;
  gap: number;
  stack: StackMode;
  dir: Direction;
  hotkey: string;
  pauseOn: PauseOn[];
  container: string | undefined;
  shadow: boolean;
  closeButton: boolean;
  richColors: boolean;
  invert: boolean;
  swipe: boolean;
  dragThreshold: number;
  progress: boolean;
  closeOnClick: boolean;
  exitDuration: number;
  historyLimit: number;
  regionLabel: string;
  closeLabel: string;
  startPaused: boolean;
  newestOnTop: boolean;
  dedupeWindow: number;
  animation?: AnimationType;
  offset?: OffsetConfig;
  mobileOffset?: number | string;
}

export type Config = GlazeConfig;
export type GlazeConfigPatch = Partial<GlazeConfig>;

/** Outcome delivered to promise descriptions. */
export type PromiseOutcome<T> =
  { status: 'success'; value: T } | { status: 'error'; error: unknown };

/** Message or patch for a promise state phase. */
export type PromiseMessage<V> = string | ToastPatch | ((value: V) => string | ToastPatch);

/** Options given to `ui.toast.promise`. */
export interface PromiseMessages<T> {
  loading: string | ToastPatch;
  success?: PromiseMessage<T>;
  error?: PromiseMessage<unknown>;
  description?: string | ((outcome: PromiseOutcome<T>) => string);
  finally?: () => void | Promise<void>;
}

export type PromiseData<T> = PromiseMessages<T>;

/** Return handle from `ui.toast.promise`. */
export interface PromiseHandle<T> {
  id: ToastId;
  unwrap(): Promise<T>;
}

/** Input kinds supported by dialog prompts. */
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

/** Icon preset for dialogs. */
export type DialogIcon = 'success' | 'error' | 'warning' | 'info' | 'question' | 'custom';

/** Tone preset for dialogs. */
export type DialogTone = 'info' | 'warning' | 'danger';

/** Backdrop visual style. */
export type DialogBackdrop = 'blur' | 'dim' | 'none' | (string & {});

/** Reason why a dialog was dismissed without confirm/deny. */
export type DismissReason = 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer';

/** Result resolved by a dialog promise. */
export interface DialogResult<V = unknown> {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  value: V | undefined;
  dismiss: DismissReason | undefined;
}

/** Choice item for select or radio inputs. */
export interface DialogChoice {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Configuration of a dialog action button. */
export interface DialogButton {
  show?: boolean;
  label?: string;
  color?: string;
  aria?: string;
}

/** Imperative handle over an open dialog. */
export interface DialogHandle<T = unknown> {
  close(result?: Partial<DialogResult<T>>): void;
  update(patch: Partial<DialogOptions>): void;
  setLoading(loading: boolean | 'confirm' | 'deny'): void;
  showError(message: string | undefined | null): void;
  timer: {
    pause(): void;
    resume(): void;
    add(ms: number): void;
    remaining(): number;
    paused(): boolean;
  };
  readonly result: Promise<DialogResult<T>>;
}

export type ValidateResult = string | undefined | null;

/** Options for dialogs (confirm, alert, prompt, steps). */
export interface DialogOptions {
  title?: string;
  text?: string;
  html?: string;
  icon?: DialogIcon;
  iconContent?: Renderable;
  tone?: DialogTone;
  confirmButton?: DialogButton;
  denyButton?: DialogButton;
  cancelButton?: DialogButton;
  reverseButtons?: boolean;
  focusOn?: 'confirm' | 'deny' | 'cancel' | 'input' | 'close' | 'none';
  input?: DialogInputType;
  inputValue?: string | number | boolean;
  placeholder?: string;
  options?: readonly DialogChoice[] | readonly string[] | Readonly<Record<string, string>>;
  inputLabel?: string;
  inputAttributes?: Readonly<Record<string, string>>;
  validate?: (value: unknown, handle: DialogHandle) => ValidateResult | Promise<ValidateResult>;
  preConfirm?: (value: unknown, handle: DialogHandle) => unknown | Promise<unknown>;
  preDeny?: (value: unknown, handle: DialogHandle) => unknown | Promise<unknown>;
  allowOutsideClick?: boolean;
  allowEscape?: boolean;
  backdrop?: DialogBackdrop;
  position?: DialogPosition;
  grow?: 'row' | 'column' | 'fullscreen';
  draggable?: boolean;
  width?: string | number;
  padding?: string | number;
  footer?: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  timer?: number;
  timerProgressBar?: boolean;
  closeButtonLabel?: string;
  className?: string;
  theme?: ThemeName;
  priority?: number;
  didOpen?: (handle: DialogHandle) => void;
  willClose?: (handle: DialogHandle, result: DialogResult) => void;
}

/** Discriminated union mapping input types to typed values. */
export type TypedDialogOptions<T = unknown> =
  | (Omit<DialogOptions, 'input' | 'inputValue' | 'validate' | 'preConfirm'> & {
      input?: undefined;
      inputValue?: undefined;
      validate?: (
        value: undefined,
        handle: DialogHandle<undefined>,
      ) => ValidateResult | Promise<ValidateResult>;
      preConfirm?: (value: undefined, handle: DialogHandle<undefined>) => T | Promise<T>;
    })
  | (Omit<DialogOptions, 'input' | 'inputValue' | 'validate' | 'preConfirm'> & {
      input: 'number' | 'range';
      inputValue?: number;
      validate?: (
        value: number,
        handle: DialogHandle<number>,
      ) => ValidateResult | Promise<ValidateResult>;
      preConfirm?: (value: number, handle: DialogHandle<number>) => T | Promise<T>;
    })
  | (Omit<DialogOptions, 'input' | 'inputValue' | 'validate' | 'preConfirm'> & {
      input: 'checkbox';
      inputValue?: boolean;
      validate?: (
        value: boolean,
        handle: DialogHandle<boolean>,
      ) => ValidateResult | Promise<ValidateResult>;
      preConfirm?: (value: boolean, handle: DialogHandle<boolean>) => T | Promise<T>;
    })
  | (Omit<DialogOptions, 'input' | 'inputValue' | 'validate' | 'preConfirm'> & {
      input:
        | 'text'
        | 'email'
        | 'password'
        | 'tel'
        | 'url'
        | 'search'
        | 'textarea'
        | 'select'
        | 'radio'
        | 'date'
        | 'time'
        | 'datetime-local'
        | 'week'
        | 'month'
        | 'file';
      inputValue?: string;
      validate?: (
        value: string,
        handle: DialogHandle<string>,
      ) => ValidateResult | Promise<ValidateResult>;
      preConfirm?: (value: string, handle: DialogHandle<string>) => T | Promise<T>;
    });

/** State of an active dialog. */
export interface DialogState {
  options: DialogOptions;
  loading: 'confirm' | 'deny' | null;
  error: string | undefined;
  open: boolean;
  revision: number;
}

/** Visual style of an action sheet entry. */
export type SheetActionStyle = 'default' | 'destructive' | 'cancel';

/** Action choice in an action sheet. */
export interface SheetAction {
  label: string;
  value?: unknown;
  style?: SheetActionStyle;
  tone?: DialogTone;
  icon?: string;
  disabled?: boolean;
  description?: string;
}

/** Options for action sheet modal. */
export interface SheetOptions {
  title?: string;
  text?: string;
  message?: string;
  html?: string;
  actions: readonly SheetAction[];
  cancel?: { label: string } | false;
  cancelLabel?: string;
  backdrop?: DialogBackdrop;
  allowOutsideClick?: boolean;
  allowEscape?: boolean;
  className?: string;
  theme?: ThemeName;
}

/** Options for bottom sheet modal. */
export interface BottomSheetOptions {
  title?: string;
  text?: string;
  html?: string;
  snapPoints?: readonly number[];
  initialSnap?: number;
  dismissible?: boolean;
  handle?: boolean;
  backdrop?: DialogBackdrop;
  allowOutsideClick?: boolean;
  allowEscape?: boolean;
  closeButtonLabel?: string;
  handleLabel?: string;
  className?: string;
  theme?: ThemeName;
  didOpen?: (handle: BottomSheetHandle) => void;
  willClose?: (handle: BottomSheetHandle) => void;
}

export interface BottomSheetHandle {
  close(reason?: DismissReason): void;
  snapTo(index: number): void;
  update(patch: Pick<BottomSheetOptions, 'title' | 'text' | 'html'>): void;
  readonly body: Renderable;
  readonly result: Promise<DialogResult>;
}

/** Options for loading overlay. */
export interface LoadingOptions {
  text?: string;
  title?: string;
  progress?: number;
  backdrop?: DialogBackdrop;
  allowEscape?: boolean;
  className?: string;
  theme?: ThemeName;
}

export interface LoadingHandle {
  update(patch: Pick<LoadingOptions, 'text' | 'progress'>): void;
  close(): void;
  readonly closed: Promise<void>;
}

/** Unsubscribe function. */
export type Unsubscribe = () => void;

/** Listener callback. */
export type Listener<T = void> = (state: T) => void;

/** Observable store interface matching React useSyncExternalStore and Svelte store contracts. */
export interface Store<T> {
  subscribe(listener: ((state: T) => void) | (() => void)): Unsubscribe;
  getSnapshot(): T;
  setState(updater: T | ((prev: T) => T), immediate?: boolean): void;
}

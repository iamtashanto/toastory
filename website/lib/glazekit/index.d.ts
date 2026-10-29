/**
 * glazekit - Complete UI feedback toolkit for modern web and mobile.
 */

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading' | 'message';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type PauseReason = 'hover' | 'focus' | 'hidden' | 'swipe' | 'manual';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export type DismissReason = 'user' | 'swipe' | 'click' | 'auto' | 'api';

export interface ToastAction {
  label: string;
  onClick?: (event: { preventDefault: () => void; readonly defaultPrevented: boolean }) => void;
  ariaLabel?: string;
}

export interface ToastAvatar {
  src?: string;
  alt?: string;
  initials?: string;
  name?: string;
  color?: string;
}

export interface ToastClassNames {
  toast?: string;
  content?: string;
  title?: string;
  description?: string;
  icon?: string;
  avatar?: string;
  badge?: string;
  actions?: string;
  actionButton?: string;
  cancelButton?: string;
  closeButton?: string;
  progress?: string;
  time?: string;
  kbd?: string;
  count?: string;
  link?: string;
}

export interface ToastOptions {
  id?: string | number;
  type?: ToastType;
  title?: string;
  description?: string;
  icon?: any;
  avatar?: ToastAvatar | string;
  duration?: number;
  position?: ToastPosition;
  action?: ToastAction;
  cancel?: ToastAction;
  closeButton?: boolean;
  closeButtonLabel?: string;
  dismissible?: boolean;
  closeOnClick?: boolean;
  progress?: boolean | 'bar' | 'ring' | 'none';
  progressValue?: number;
  progressLabel?: string;
  pauseOn?: PauseReason[];
  swipe?: boolean;
  swipeDirections?: SwipeDirection[];
  dragThreshold?: number;
  richColors?: boolean;
  invert?: boolean;
  theme?: string;
  variant?: string;
  className?: string;
  classNames?: ToastClassNames;
  style?: Record<string, string | number>;
  unstyled?: boolean;
  html?: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  ariaLive?: 'polite' | 'assertive' | 'off';
  role?: 'status' | 'alert';
  dedupe?: boolean | string;
  important?: boolean;
  timestamp?: boolean | string | number | Date;
  timestampLocale?: string;
  kbd?: string;
  shake?: boolean;
  glow?: boolean;
  gradientBorder?: boolean;
  island?: boolean;
  hud?: boolean;
  badge?: any;
  container?: string | HTMLElement;
  dir?: 'ltr' | 'rtl' | 'auto';
  onOpen?: (toast: any) => void;
  onClose?: (toast: any, reason: DismissReason) => void;
  onDismiss?: (toast: any, reason: DismissReason) => void;
  onAutoClose?: (toast: any) => void;
}

export interface PromiseToastOptions<T = any> {
  loading: string | Partial<ToastOptions>;
  success?: string | ((data: T) => string | Partial<ToastOptions>);
  error?: string | ((err: any) => string | Partial<ToastOptions>);
  description?: string | ((data: { status: 'success' | 'error'; value?: T; error?: any }) => string);
  finally?: () => void;
}

export interface PromiseHandle<T = any> {
  id: string | number;
  unwrap: () => Promise<T>;
}

export type DialogDismissReason = 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer';

export interface DialogResult<T = any> {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  value?: T;
  dismiss?: DialogDismissReason;
}

export interface DialogActionBtn {
  show?: boolean;
  label?: string;
  color?: string;
  aria?: string;
}

export interface DialogHandle {
  close: (result?: Partial<DialogResult>) => void;
  update: (opts: Partial<DialogOptions>) => void;
  setLoading: (state: boolean | 'confirm' | 'deny') => void;
  showError: (error?: string) => void;
  timer: {
    pause: () => void;
    resume: () => void;
    add: (ms: number) => void;
    remaining: () => number;
    paused: () => boolean;
  };
  result: Promise<DialogResult>;
}

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
  | 'file'
  | 'otp';

export interface DialogOptions {
  title?: string;
  text?: string;
  html?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'trash' | 'pencil' | 'custom' | any;
  tone?: 'info' | 'warning' | 'danger';
  confirmButton?: DialogActionBtn;
  denyButton?: DialogActionBtn;
  cancelButton?: DialogActionBtn;
  reverseButtons?: boolean;
  buttonLayout?: 'row' | 'stack' | 'divided';
  focusOn?: 'confirm' | 'deny' | 'cancel' | 'input' | 'close' | 'none';
  input?: DialogInputType;
  inputValue?: any;
  inputLabel?: string;
  placeholder?: string;
  options?: any[] | Record<string, string>;
  inputAttributes?: Record<string, string>;
  otpLength?: number;
  otpType?: 'numeric' | 'alphanumeric';
  onOtpComplete?: (code: string) => void;
  resendCooldown?: number;
  onResend?: () => void;
  validate?: (value: any, handle: DialogHandle) => string | boolean | void | Promise<string | boolean | void>;
  preConfirm?: (value: any, handle: DialogHandle) => any | Promise<any>;
  preDeny?: (value: any, handle: DialogHandle) => any | Promise<any>;
  confirmText?: string;
  caseSensitive?: boolean;
  allowOutsideClick?: boolean;
  allowEscape?: boolean;
  backdrop?: 'blur' | 'dim' | 'none' | string;
  position?: string;
  grow?: 'row' | 'column' | 'fullscreen';
  draggable?: boolean;
  width?: string | number;
  padding?: string | number;
  footer?: string;
  image?: { src: string; alt?: string; width?: number; height?: number };
  notice?: { text: string; tone?: 'info' | 'warning' | 'danger'; icon?: any };
  countdown?: number;
  timer?: number;
  timerProgressBar?: boolean;
  theme?: string;
  variant?: string;
  className?: string;
  closeButtonLabel?: string;
  didOpen?: (handle: DialogHandle) => void;
  willClose?: (handle: DialogHandle, result: DialogResult) => void;
}

export interface SheetAction {
  label: string;
  value?: any;
  style?: 'default' | 'destructive' | 'cancel';
  disabled?: boolean;
  icon?: string;
}

export interface SheetOptions {
  title?: string;
  message?: string;
  actions: SheetAction[];
  cancel?: boolean | { label: string };
  backdrop?: 'blur' | 'dim' | 'none' | string;
  allowOutsideClick?: boolean;
  allowEscape?: boolean;
  theme?: string;
  className?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
}

export interface BottomSheetOptions {
  title?: string;
  text?: string;
  html?: string;
  icon?: string;
  tone?: 'info' | 'warning' | 'danger';
  confirmButton?: { label?: string };
  cancelButton?: { label?: string };
  snapPoints?: number[];
  initialSnap?: number;
  handle?: boolean;
  handleLabel?: string;
  closeButtonLabel?: string;
  dismissible?: boolean;
  backdrop?: 'blur' | 'dim' | 'none' | string;
  allowOutsideClick?: boolean;
  allowEscape?: boolean;
  theme?: string;
  variant?: string;
  className?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  didOpen?: (sheet: any) => void;
  willClose?: (sheet: any) => void;
}

export interface LoadingOverlayOptions {
  text?: string;
  title?: string;
  progress?: number;
  backdrop?: 'blur' | 'dim' | 'none' | string;
  allowEscape?: boolean;
  theme?: string;
  className?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
}

export interface LoadingHandle {
  update: (opts: { text?: string; progress?: number }) => void;
  close: () => void;
  closed: Promise<void>;
}

export interface GlazeConfig {
  theme?: string;
  mode?: 'light' | 'dark' | 'auto';
  position?: ToastPosition;
  duration?: number;
  maxVisible?: number;
  gap?: number;
  stack?: boolean | 'stacked' | 'expanded' | 'list';
  dir?: 'ltr' | 'rtl' | 'auto';
  hotkey?: string;
  pauseOn?: PauseReason[];
  shadow?: boolean;
  closeButton?: boolean;
  richColors?: boolean;
  invert?: boolean;
  swipe?: boolean;
  dragThreshold?: number;
  progress?: boolean | 'bar' | 'ring' | 'none';
  closeOnClick?: boolean;
  exitDuration?: number;
  historyLimit?: number;
  regionLabel?: string;
  closeLabel?: string;
  container?: string | HTMLElement;
  newestOnTop?: boolean;
  dedupeWindow?: number;
}

export interface ToastFn {
  (message: string, opts?: Partial<ToastOptions>): string | number;
  (opts: ToastOptions): string | number;
  success: (message: string, opts?: Partial<ToastOptions>) => string | number;
  error: (message: string, opts?: Partial<ToastOptions>) => string | number;
  info: (message: string, opts?: Partial<ToastOptions>) => string | number;
  warning: (message: string, opts?: Partial<ToastOptions>) => string | number;
  loading: (message: string, opts?: Partial<ToastOptions>) => string | number;
  message: (message: string, opts?: Partial<ToastOptions>) => string | number;
  custom: (renderer: (props: { id: string | number; dismiss: () => void; update: (patch: Partial<ToastOptions>) => void }) => any, opts?: Partial<ToastOptions>) => string | number;
  promise: <T>(promiseOrFn: Promise<T> | (() => Promise<T>), msgs: PromiseToastOptions<T>, opts?: Partial<ToastOptions>) => PromiseHandle<T>;
  update: (id: string | number, patch: Partial<ToastOptions>) => boolean;
  dismiss: (id?: string | number) => void;
  dismissAll: () => void;
  getToasts: () => any[];
  getHistory: () => any[];
  types: {
    add: (name: string, def?: any) => void;
    remove: (name: string) => void;
    get: (name: string) => any;
    list: () => string[];
  };
}

export interface Ui {
  toast: ToastFn;
  confirm: (opts: DialogOptions | string) => Promise<DialogResult>;
  alert: (opts: DialogOptions | string) => Promise<DialogResult>;
  prompt: (opts: DialogOptions | string) => Promise<DialogResult>;
  steps: (steps: DialogOptions[], backLabel?: string) => Promise<DialogResult & { values: any[]; step: number }>;
  sheet: (opts: SheetOptions) => Promise<DialogResult>;
  bottomSheet: (opts: BottomSheetOptions) => { body?: HTMLElement; result: Promise<DialogResult>; close: (reason?: string) => void; snapTo: (snap: number) => void; update: (opts: Partial<BottomSheetOptions>) => void };
  loading: (opts?: LoadingOverlayOptions | string) => LoadingHandle;
  configure: (config: Partial<GlazeConfig>) => GlazeConfig;
  defineTheme: (name: string, def: any) => string;
  toastStore: any;
}

export const ui: Ui;
export const toast: ToastFn;
export const configure: (config: Partial<GlazeConfig>) => GlazeConfig;
export const defineTheme: (name: string, def: any) => string;
export const clearCustomThemes: () => void;
export const resetEngine: () => void;
export const DEFAULT_CONFIG: GlazeConfig;

export default ui;


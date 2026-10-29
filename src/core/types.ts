/**
 * Shared type definitions for the glazekit core. This module is renderer
 * agnostic: it never references the DOM or any UI framework.
 */

/** Identifier of a toast. Numbers are accepted for convenience and stored as given. */
export type ToastId = string | number;

/**
 * Anything a renderer can display. The concrete meaning depends on the
 * adapter: a string for the web renderer, a React element for `glazekit/react`,
 * a VNode for `glazekit/vue`, and so on.
 */
export type Renderable = unknown;

/** Built-in toast types. Custom types registered with `ui.toast.types.add` use any other string. */
export type BuiltInToastType =
  'default' | 'message' | 'success' | 'error' | 'info' | 'warning' | 'loading';

/** Toast type name: a built-in type or one registered through the type registry. */
export type ToastType = BuiltInToastType | (string & {});

/** Placements supported by the toast region. */
export type ToastPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/** Events that pause a toast timer. */
export type PauseOn = 'hover' | 'focus' | 'hidden';

/** Directions in which a toast can be swiped away. */
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

/** Color scheme selection. `auto` follows `prefers-color-scheme`. */
export type ColorMode = 'light' | 'dark' | 'auto';

/** Text direction. `auto` inherits from the document. */
export type Direction = 'ltr' | 'rtl' | 'auto';

/** Why a toast was removed. */
export type CloseReason =
  'auto' | 'user' | 'swipe' | 'click' | 'action' | 'cancel' | 'api' | 'overflow';

/** A clickable button rendered inside a toast. */
export interface ToastButton {
  /** Visible label. */
  label: string;
  /** Called when the button is activated. Calling `event.preventDefault()` keeps the toast open. */
  onClick?: (event: { preventDefault(): void; defaultPrevented: boolean }) => void;
  /** Optional accessible name when the label alone is ambiguous. */
  ariaLabel?: string;
}

/** Slot class names a consumer can override. */
export interface ToastClassNames {
  /** Outer element of each toast. */
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
}

/** Passed to `ui.toast.custom` renderers. */
export interface ToastRenderContext {
  /** Id of the toast being rendered. */
  id: ToastId;
  /** Dismisses the toast. */
  dismiss: () => void;
  /** Patches the toast. */
  update: (patch: ToastPatch) => void;
}

/** Custom renderer used by `ui.toast.custom`. The return type depends on the adapter. */
export type ToastCustomRenderer = (context: ToastRenderContext) => Renderable;

/**
 * Options accepted by every toast creation call.
 * Every option is optional; unspecified values fall back to `ui.configure`.
 */
export interface ToastOptions {
  /** Stable identifier. Reusing an id of an active toast updates it instead of adding a new one. */
  id?: ToastId;
  /** Toast type. Controls the icon, the color accent and the default ARIA semantics. */
  type?: ToastType;
  /** Main text. When the first argument of `ui.toast` is given it is used as the title. */
  title?: Renderable;
  /** Secondary text shown below the title. */
  description?: Renderable;
  /** Icon. `false` hides the icon, a string or adapter node replaces the built-in one. */
  icon?: Renderable | false;
  /** Avatar image URL or adapter node, shown before the text. */
  avatar?: Renderable;
  /** Visible time in milliseconds. `0` or `Infinity` makes the toast persistent. */
  duration?: number;
  /** Placement of the toast region this toast belongs to. */
  position?: ToastPosition;
  /** Primary action button. */
  action?: ToastButton;
  /** Secondary cancel button. */
  cancel?: ToastButton;
  /** Show an explicit close button. */
  closeButton?: boolean;
  /** When `false` the toast cannot be closed by swipe, click, close button or Escape. */
  dismissible?: boolean;
  /** Dismiss the toast when the user clicks its body. */
  closeOnClick?: boolean;
  /** Show the remaining-time progress bar. */
  progress?: boolean;
  /** Events that pause the timer. */
  pauseOn?: PauseOn[];
  /** Enable swipe to dismiss. */
  swipe?: boolean;
  /** Allowed swipe directions. Defaults depend on the position. */
  swipeDirections?: SwipeDirection[];
  /** Pointer travel in pixels required to commit a swipe. */
  dragThreshold?: number;
  /** Use saturated, type-colored backgrounds. */
  richColors?: boolean;
  /** Invert the color scheme for this toast. */
  invert?: boolean;
  /** Theme name override for this toast. */
  theme?: string;
  /** Extra class names for the toast element. */
  className?: string;
  /** Slot class names. */
  classNames?: ToastClassNames;
  /** Inline styles merged onto the toast element. Values are plain CSS strings. */
  style?: Record<string, string | number>;
  /** Drop all built-in classes so the toast can be styled from scratch. */
  unstyled?: boolean;
  /** Raw HTML for the description. It is sanitized by the web renderer before insertion. */
  html?: string;
  /** Makes the toast body a link. */
  href?: string;
  /** Link target when `href` is set. */
  target?: '_self' | '_blank' | '_parent' | '_top';
  /** `aria-live` politeness. Defaults to `assertive` for errors and important toasts, `polite` otherwise. */
  ariaLive?: 'polite' | 'assertive' | 'off';
  /** ARIA role. Defaults to `alert` for errors and important toasts, `status` otherwise. */
  role?: 'status' | 'alert' | 'log';
  /** Collapse identical toasts. `true` compares type, title and description; a string is a custom key. */
  dedupe?: boolean | string;
  /** Marks the toast as urgent: assertive live region, never auto-evicted when the queue overflows. */
  important?: boolean;
  /** Called after the toast becomes visible. */
  onOpen?: (toast: ToastRecord) => void;
  /** Called after the toast is removed, for any reason. */
  onClose?: (toast: ToastRecord, reason: CloseReason) => void;
  /** Called when the toast is dismissed by the user or by `dismiss()`. */
  onDismiss?: (toast: ToastRecord, reason: CloseReason) => void;
  /** Called when the toast closes because its timer ran out. */
  onAutoClose?: (toast: ToastRecord) => void;
  /** Id of the DOM container (or named region) that hosts the toast. */
  container?: string;
  /** Text direction override. */
  dir?: Direction;
}

/** Fields that can be changed after a toast was created. */
export type ToastPatch = Omit<ToastOptions, 'id'> & {
  /** Resets the timer after patching. Defaults to `true`. */
  resetTimer?: boolean;
};

/** Internal and public snapshot of a toast. Treat as read-only. */
export interface ToastRecord extends ToastOptions {
  id: ToastId;
  type: ToastType;
  /** Resolved duration in milliseconds, `0` means persistent. */
  duration: number;
  /** Resolved placement. */
  position: ToastPosition;
  /** Resolved politeness. */
  ariaLive: 'polite' | 'assertive' | 'off';
  /** Resolved role. */
  role: 'status' | 'alert' | 'log';
  /** Epoch millisecond of creation. */
  createdAt: number;
  /** Epoch millisecond of the last patch. */
  updatedAt: number;
  /** Incremented every time the toast is patched or deduplicated. Renderers use it as a change signal. */
  revision: number;
  /** Increments whenever the timer is restarted or extended. Renderers use it to restart progress animations. */
  timerEpoch: number;
  /** Number of times an identical toast was collapsed into this one. */
  count: number;
  /** `true` once the toast is on screen. Toasts beyond `maxVisible` wait in the queue. */
  visible: boolean;
  /** `true` after dismissal while the exit animation plays. */
  dismissed: boolean;
  /** Pause reasons currently holding the timer. */
  pausedBy: string[];
  /**
   * Milliseconds left on the timer as of the last state change (pause, resume, patch).
   * Use `store.getRemaining(id)` for the live value. `Infinity` for persistent toasts.
   */
  remaining: number;
  /** Custom renderer when created through `ui.toast.custom`. */
  custom?: ToastCustomRenderer;
}

/** Definition of a custom toast type. */
export interface ToastTypeDefinition {
  /** Default options merged into every toast of this type. */
  defaults?: ToastOptions;
  /** Icon used when the toast does not provide one. */
  icon?: Renderable;
  /** CSS color for the accent of this type. Exposed as `--gk-type`. */
  color?: string;
}

/** Global configuration shared by all toasts and dialogs. */
export interface GlazeConfig {
  /** Theme name. Must match the imported CSS file. */
  theme: string;
  /** Color mode. */
  mode: ColorMode;
  /** Default toast position. */
  position: ToastPosition;
  /** Default toast duration in milliseconds. */
  duration: number;
  /** Maximum simultaneously visible toasts per region. */
  maxVisible: number;
  /** Pixel gap between toasts. */
  gap: number;
  /** Stack toasts like a deck and expand on hover or focus. */
  stack: boolean;
  /** Text direction. */
  dir: Direction;
  /** Keyboard shortcut that moves focus into the toast region, for example `alt+t`. Empty string disables it. */
  hotkey: string;
  /** Default pause triggers. */
  pauseOn: PauseOn[];
  /** Id of the element that hosts the toast regions. Created on `document.body` when absent. */
  container: string | undefined;
  /** Render the drop shadow. */
  shadow: boolean;
  /** Default for the close button. */
  closeButton: boolean;
  /** Default for the saturated colors. */
  richColors: boolean;
  /** Default for inversion. */
  invert: boolean;
  /** Default for swipe to dismiss. */
  swipe: boolean;
  /** Default swipe distance in pixels. */
  dragThreshold: number;
  /** Default for the progress bar. */
  progress: boolean;
  /** Default for clicking the body to dismiss. */
  closeOnClick: boolean;
  /** Milliseconds a dismissed toast stays in the store while the exit animation runs. */
  exitDuration: number;
  /** Maximum number of entries kept by `getHistory`. */
  historyLimit: number;
  /** Message announced by the toast region landmark. */
  regionLabel: string;
  /** Label of the built-in close button. */
  closeLabel: string;
  /** Start timers paused until `resume` is called. Mostly useful for tests. */
  startPaused: boolean;
}

/** Subscriber callback. */
export type Listener = () => void;

/** Function that removes a subscription. */
export type Unsubscribe = () => void;

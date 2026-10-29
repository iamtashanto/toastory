import type { DialogBackdrop, DialogResult, DismissReason } from './dialog';
import type { Renderable } from './types';

/** Visual style of an action sheet entry. */
export type SheetActionStyle = 'default' | 'destructive' | 'cancel';

/** One entry of an action sheet. */
export interface SheetAction {
  /** Visible label. */
  label: string;
  /** Value returned in the result when chosen. Defaults to the label. */
  value?: unknown;
  /** Visual style. `destructive` is tinted red. */
  style?: SheetActionStyle;
  /** Optional icon: an inline SVG string or text. Sanitized by the web renderer. */
  icon?: string;
  /** Disables the entry. */
  disabled?: boolean;
}

/** Options for `ui.sheet`. */
export interface SheetOptions {
  /** Heading shown above the actions. */
  title?: string;
  /** Supporting message. */
  message?: string;
  /** Actions in display order. */
  actions: readonly SheetAction[];
  /** Cancel entry. `false` hides it. Defaults to a cancel entry using `cancelLabel`. */
  cancel?: { label: string } | false;
  /** Backdrop style. */
  backdrop?: DialogBackdrop;
  /** Backdrop click dismisses. Defaults to `true`. */
  allowOutsideClick?: boolean;
  /** Escape dismisses. Defaults to `true`. */
  allowEscape?: boolean;
  /** Extra class name. */
  className?: string;
  /** Theme override. */
  theme?: string;
}

/** Options for `ui.bottomSheet`. */
export interface BottomSheetOptions {
  /** Heading. Used as the accessible name. */
  title?: string;
  /** Plain text body. */
  text?: string;
  /** Raw HTML body, sanitized by the web renderer. */
  html?: string;
  /** Snap heights as fractions of the viewport height from 0 to 1, ascending. Defaults to `[0.5]`. */
  snapPoints?: readonly number[];
  /** Index of the initial snap point. */
  initialSnap?: number;
  /** Drag down past the lowest point to dismiss. Defaults to `true`. */
  dismissible?: boolean;
  /** Show a drag handle. Defaults to `true`. */
  handle?: boolean;
  /** Backdrop style. */
  backdrop?: DialogBackdrop;
  /** Backdrop click dismisses. Defaults to `true`. */
  allowOutsideClick?: boolean;
  /** Escape dismisses. Defaults to `true`. */
  allowEscape?: boolean;
  /** Label of the close button. Omit to hide it. */
  closeButtonLabel?: string;
  /** Accessible name of the drag handle. Defaults to `Resize sheet`. */
  handleLabel?: string;
  /** Extra class name. */
  className?: string;
  /** Theme override. */
  theme?: string;
  /** Called after open. */
  didOpen?: (handle: BottomSheetHandle) => void;
  /** Called before close. */
  willClose?: (handle: BottomSheetHandle) => void;
}

/** Control of an open bottom sheet. */
export interface BottomSheetHandle {
  /** Closes the sheet. */
  close(reason?: DismissReason): void;
  /** Moves to a snap index. */
  snapTo(index: number): void;
  /** Replaces the text or HTML body. */
  update(patch: Pick<BottomSheetOptions, 'title' | 'text' | 'html'>): void;
  /** The element that hosts the body, for mounting adapter content. `undefined` outside the DOM. */
  readonly body: Renderable;
  /** Resolves when the sheet closes. */
  readonly result: Promise<DialogResult>;
}

/** Options for `ui.loading`. */
export interface LoadingOptions {
  /** Text shown beside the spinner and announced to screen readers. */
  text?: string;
  /** Progress from 0 to 1. When set the overlay shows a determinate bar. */
  progress?: number;
  /** Backdrop style. */
  backdrop?: DialogBackdrop;
  /** Make the overlay dismissible with Escape. Defaults to `false`. */
  allowEscape?: boolean;
  /** Extra class name. */
  className?: string;
  /** Theme override. */
  theme?: string;
}

/** Control of a loading overlay. */
export interface LoadingHandle {
  /** Updates text or progress. */
  update(patch: Pick<LoadingOptions, 'text' | 'progress'>): void;
  /** Removes the overlay. */
  close(): void;
  /** Resolves when the overlay is gone. */
  readonly closed: Promise<void>;
}

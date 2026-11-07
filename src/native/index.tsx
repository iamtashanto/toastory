import React, { useEffect, useMemo, useState } from 'react';
import type {
  GlazeConfig,
  ToastApi,
  ToastOptions,
  ToastRecord,
  ToastStore,
  Unsubscribe,
} from '../core';
import { createToastEngine } from '../core';

/** Native engine holder for React Native environments. */
let nativeEngine: { store: ToastStore; toast: ToastApi } | undefined;

function getNativeEngine(): { store: ToastStore; toast: ToastApi } {
  if (!nativeEngine) {
    nativeEngine = createToastEngine();
  }
  return nativeEngine;
}

/** Triggers optional haptic feedback on supported Expo devices. */
async function triggerHaptic(type: string): Promise<void> {
  try {
    // Dynamic optional import for expo-haptics
    // @ts-expect-error expo-haptics is an optional peer dependency that may not be installed at compile time
    const Haptics = await import('expo-haptics');
    if (!Haptics) return;
    if (type === 'success') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (type === 'error') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (type === 'warning') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    // expo-haptics is an optional peer dependency, gracefully ignore when not installed
  }
}

/**
 * Creates the React Native `toast` API with haptics integration.
 */
function createNativeToastApi(): ToastApi {
  const engine = getNativeEngine();
  const baseToast = engine.toast;

  const wrap =
    (fn: (msg?: unknown, opts?: ToastOptions) => string | number) =>
    (msg?: unknown, opts: ToastOptions = {}) => {
      const type = opts.type ?? 'default';
      void triggerHaptic(type);
      return fn(msg, opts);
    };

  const nativeApi = wrap(baseToast) as ToastApi;
  nativeApi.success = wrap(baseToast.success);
  nativeApi.error = wrap(baseToast.error);
  nativeApi.info = wrap(baseToast.info);
  nativeApi.warning = wrap(baseToast.warning);
  nativeApi.loading = wrap(baseToast.loading);
  nativeApi.message = wrap(baseToast.message);

  nativeApi.promise = baseToast.promise;
  nativeApi.custom = baseToast.custom;
  nativeApi.update = baseToast.update;
  nativeApi.dismiss = baseToast.dismiss;
  nativeApi.dismissAll = baseToast.dismissAll;
  nativeApi.getToasts = baseToast.getToasts;
  nativeApi.getHistory = baseToast.getHistory;
  Object.defineProperty(nativeApi, 'types', { value: baseToast.types, enumerable: true });

  return nativeApi;
}

/** Native toast API. */
export const toast: ToastApi = createNativeToastApi();

export interface ToastShowParams {
  type?: 'success' | 'error' | 'info' | 'warning' | 'loading' | string;
  text1?: string | React.ReactNode;
  text2?: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'center' | string;
  autoHide?: boolean;
  visibilityTime?: number;
  topOffset?: number;
  bottomOffset?: number;
  keyboardOffset?: number;
  onShow?: () => void;
  onHide?: () => void;
  onPress?: () => void;
  props?: Record<string, unknown>;
  id?: string | number;
  swipeable?: boolean;
  image?: string;
  closeButton?: boolean;
  closeText?: string;
  discardText?: string;
  [key: string]: unknown;
}

let toastRef: unknown = null;

/**
 * Full react-native-toast-message v2.5.2 drop-in compatible interface.
 * Allows instant migration from react-native-toast-message with zero code changes.
 */
export const Toast = Object.assign(toast, {
  show(params: ToastShowParams | string): string | number {
    if (typeof params === 'string') {
      return toast(params);
    }
    const {
      type = 'success',
      text1,
      text2,
      position = 'top',
      autoHide = true,
      visibilityTime,
      topOffset,
      bottomOffset,
      keyboardOffset,
      onShow,
      onHide,
      onPress,
      ...rest
    } = params;

    const restOpts = rest as ToastOptions;
    const duration: number = autoHide === false ? 0 : (visibilityTime ?? restOpts.duration ?? 4000);
    const nativePos =
      position === 'top' ? 'top-center' : position === 'bottom' ? 'bottom-center' : position;

    return toast(text1 ?? (restOpts.title as string | undefined), {
      ...restOpts,
      type: type as ToastOptions['type'],
      title: text1 ?? restOpts.title,
      description: text2 ?? restOpts.description,
      duration,
      position: nativePos as ToastOptions['position'],
      topOffset,
      bottomOffset,
      keyboardOffset,
      onOpen: onShow ? () => onShow() : restOpts.onOpen,
      onClose: onHide ? () => onHide() : restOpts.onClose,
      onPress: onPress ? () => onPress() : restOpts.onPress,
    });
  },
  hide(id?: string | number): void {
    if (id !== undefined) toast.dismiss(id);
    else toast.dismissAll();
  },
  setRef(ref: unknown): void {
    toastRef = ref;
  },
  getRef(): unknown {
    return toastRef;
  },
});

export default Toast;

/** Configuration function for React Native. */
export function configure(patch: Partial<GlazeConfig>): Readonly<GlazeConfig> {
  return getNativeEngine().store.config.set(patch);
}

/** Resets the native engine for tests. */
export function resetNativeEngine(): void {
  if (nativeEngine) {
    nativeEngine.store.clear();
    nativeEngine.store.clearHistory();
    nativeEngine.store.config.reset();
  }
}

/** Native UI namespace. */
export const ui = {
  toast,
  configure,
  reset: resetNativeEngine,
};

/** Spring physics animation presets inspired by expo-dynamic-toast. */
export const nativeSpring = {
  glide: { damping: 32, stiffness: 170, mass: 1 },
  snappy: { damping: 24, stiffness: 280, mass: 0.8 },
} as const;

/** Native timing presets for animations. */
export const nativeTiming = {
  normal: { duration: 300 },
  exit: { duration: 200 },
} as const;

export interface NativeToasterProps {
  /** Toast placement across 7 positions (top-left, top-center, top-right, center, bottom-left, bottom-center, bottom-right). Defaults to 'top-center'. */
  position?:
    | 'top'
    | 'bottom'
    | 'center'
    | 'middle'
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  /** Optional top/bottom inset offset. */
  offset?: number;
  /** Distance in pixels from top screen boundary (react-native-toast-message compatible). */
  topOffset?: number;
  /** Distance in pixels from bottom screen boundary (react-native-toast-message compatible). */
  bottomOffset?: number;
  /** Distance in pixels above soft keyboard (react-native-toast-message compatible). */
  keyboardOffset?: number;
  /** Gap between stacked toasts in pixels. Defaults to 8. */
  gap?: number;
  /** Maximum number of visible toasts. Defaults to 4. */
  visibleToasts?: number;
  /** Whether stacked toasts expand on tap. */
  expand?: boolean;
  /** Whether close button is displayed. */
  closeButton?: boolean;
  /** Whether swipe to dismiss is enabled. Defaults to true. */
  swipeToDismiss?: boolean;
  /** Spring animation preset or configuration. */
  spring?: 'glide' | 'snappy' | { damping: number; stiffness: number; mass: number };
  /** Toast container style. */
  style?: Record<string, unknown>;
  /** Individual toast card style. */
  toastStyle?: Record<string, unknown>;
}

export interface GlazeProviderProps {
  children?: React.ReactNode;
}

/** Root provider for React Native toastory overlay hosting. */
export function GlazeProvider({ children }: GlazeProviderProps): React.JSX.Element {
  return <>{children}</>;
}

/**
 * React Native Toast Renderer component.
 * Renders glass toasts with optional Expo BlurView and gesture animations.
 */
export function Toaster(props: NativeToasterProps): React.JSX.Element | null {
  const [toastsList, setToastsList] = useState<readonly ToastRecord[]>([]);

  useEffect(() => {
    const engine = getNativeEngine();
    setToastsList(engine.store.getToasts());
    const unsub: Unsubscribe = engine.store.subscribe(() => {
      setToastsList(engine.store.getToasts());
    });
    return () => unsub();
  }, []);

  const visibleToasts = useMemo(() => toastsList.filter((t) => t.visible), [toastsList]);

  if (visibleToasts.length === 0) return null;

  const position = props.position ?? 'top-center';
  const isBottom = position.startsWith('bottom');
  const isCenter = position === 'center' || position === 'middle';
  const isLeft = position.endsWith('left');
  const isRight = position.endsWith('right');

  const topOffset = props.topOffset ?? props.offset ?? 50;
  const bottomOffset = props.bottomOffset ?? props.offset ?? 50;

  const posStyle: React.CSSProperties = isBottom
    ? { bottom: bottomOffset }
    : isCenter
      ? { top: '50%', transform: 'translateY(-50%)' }
      : { top: topOffset };

  const alignStyle: React.CSSProperties = isLeft
    ? { alignItems: 'flex-start' }
    : isRight
      ? { alignItems: 'flex-end' }
      : { alignItems: 'center' };

  const maxVisible = props.visibleToasts ?? 4;
  const displayed = visibleToasts.slice(0, maxVisible);

  return (
    <div
      style={
        {
          position: 'absolute',
          ...posStyle,
          ...alignStyle,
          left: 16,
          right: 16,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: props.gap ?? 8,
          ...props.style,
        } as React.CSSProperties
      }
    >
      {displayed.map((item) => (
        <div
          key={String(item.id)}
          onClick={() => {
            if (item.onPress) item.onPress(item);
          }}
          style={
            {
              backgroundColor: 'rgba(28, 28, 30, 0.88)',
              padding: 14,
              borderRadius: 16,
              minWidth: 200,
              maxWidth: '100%',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              position: 'relative',
              cursor: item.onPress ? 'pointer' : undefined,
              ...props.toastStyle,
            } as React.CSSProperties
          }
        >
          {item.image ? (
            <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 4 }}>
              <img
                src={typeof item.image === 'string' ? item.image : item.image.src}
                alt=""
                style={{ width: '100%', maxHeight: 120, objectFit: 'cover' }}
              />
            </div>
          ) : null}
          {props.closeButton || item.closeButton || item.closeText || item.discardText ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                getNativeEngine().toast.dismiss(item.id);
              }}
              aria-label={item.closeButtonLabel ?? 'Close notification'}
              style={
                {
                  position: 'absolute',
                  top: 8,
                  right: 10,
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontSize: item.closeText || item.discardText ? 12 : 16,
                  fontWeight: item.closeText || item.discardText ? '600' : 'normal',
                  padding: '2px 6px',
                  lineHeight: 1,
                } as React.CSSProperties
              }
            >
              {item.closeText ?? item.discardText ?? '×'}
            </button>
          ) : null}
          {item.character || item.robotVariant ? (
            <div style={{ fontSize: 18, lineHeight: 1, marginBottom: 2 }}>🤖</div>
          ) : null}
          {item.badge ? (
            <div
              style={
                {
                  fontSize: 11,
                  fontWeight: '600',
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                } as React.CSSProperties
              }
            >
              {typeof item.badge === 'string'
                ? item.badge
                : ((item.badge as { label?: string }).label ?? '')}
            </div>
          ) : null}
          {item.title ? (
            <div style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>
              {String(item.title)}
            </div>
          ) : null}
          {item.description ? (
            <div style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>
              {String(item.description)}
            </div>
          ) : null}
          {item.progressValue !== undefined ? (
            <div
              style={
                {
                  height: 3,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: 3,
                  marginTop: 6,
                  overflow: 'hidden',
                } as React.CSSProperties
              }
            >
              <div
                style={
                  {
                    height: '100%',
                    width: `${Math.round(item.progressValue * 100)}%`,
                    backgroundColor: '#38bdf8',
                  } as React.CSSProperties
                }
              />
            </div>
          ) : null}
          {item.actions && item.actions.length > 0 ? (
            <div
              style={
                {
                  display: 'flex',
                  gap: 8,
                  marginTop: 8,
                  justifyContent: 'flex-end',
                } as React.CSSProperties
              }
            >
              {item.actions.map((act, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={act.onClick ? (e) => act.onClick?.(e.nativeEvent) : undefined}
                  style={
                    {
                      fontSize: 12,
                      fontWeight: '600',
                      padding: '4px 10px',
                      borderRadius: 8,
                      border: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      cursor: 'pointer',
                    } as React.CSSProperties
                  }
                >
                  {act.label ?? act.text ?? 'Action'}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** React Native hook for reactive toast state. */
/** React Native hook for reactive toast state. */
export function useNativeToast(): {
  toast: ToastApi;
  toasts: readonly ToastRecord[];
} {
  const [toastsList, setToastsList] = useState<readonly ToastRecord[]>([]);

  useEffect(() => {
    const engine = getNativeEngine();
    setToastsList(engine.store.getToasts());
    return engine.store.subscribe(() => {
      setToastsList(engine.store.getToasts());
    });
  }, []);

  return { toast, toasts: toastsList };
}

export { playSound, chime } from '../web/sound';
export type { SoundNote } from '../web/sound';

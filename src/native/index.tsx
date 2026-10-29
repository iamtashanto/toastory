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

export interface NativeToasterProps {
  /** Optional top/bottom inset offset. */
  offset?: number;
  /** Toast container style. */
  style?: Record<string, unknown>;
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

  return (
    <div
      style={
        {
          position: 'absolute',
          top: props.offset ?? 50,
          left: 16,
          right: 16,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          ...props.style,
        } as React.CSSProperties
      }
    >
      {visibleToasts.map((item) => (
        <div
          key={String(item.id)}
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
            } as React.CSSProperties
          }
        >
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

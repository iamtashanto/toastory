import { defineComponent, onMounted, onUnmounted, shallowRef, type App, type PropType } from 'vue';
import type { GlazeConfig, ToastApi, ToastRecord, ToastoryConfig } from '../core';
import { canMountToaster, mountToaster } from '../web/toaster';
import { getEngine, setAutoMount } from '../web/engine';
import { toast, ui } from '../web/ui';

export { ui, toast };
export type { Ui } from '../web/ui';
export type { GlazeConfig, ToastoryConfig };

/** Vue component that manages the toastory Toaster lifecycle. */
export const ToastoryToaster = defineComponent({
  name: 'ToastoryToaster',
  props: {
    theme: { type: String, default: undefined },
    mode: { type: String as PropType<ToastoryConfig['mode']>, default: undefined },
    position: { type: String as PropType<ToastoryConfig['position']>, default: undefined },
    duration: { type: Number, default: undefined },
    maxVisible: { type: Number, default: undefined },
    gap: { type: Number, default: undefined },
    stack: { type: Boolean, default: undefined },
    dir: { type: String as PropType<ToastoryConfig['dir']>, default: undefined },
    hotkey: { type: String, default: undefined },
    richColors: { type: Boolean, default: undefined },
    closeButton: { type: Boolean, default: undefined },
    shadow: { type: Boolean, default: undefined },
  },
  setup(props) {
    const engine = getEngine();

    onMounted(() => {
      const patch: Partial<ToastoryConfig> = {};
      for (const [key, val] of Object.entries(props)) {
        if (val !== undefined) (patch as Record<string, unknown>)[key] = val;
      }
      if (Object.keys(patch).length > 0) {
        engine.store.config.set(patch);
      }

      setAutoMount(false);
      if (canMountToaster()) {
        const handle = mountToaster(engine.store);
        onUnmounted(() => {
          handle.destroy();
          setAutoMount(true);
        });
      }
    });

    return () => null;
  },
});

export const GlazeToaster = ToastoryToaster;

/** Composable returning toast actions and reactive active toasts array. */
export function useToast(): {
  toast: ToastApi;
  toasts: Readonly<ReturnType<typeof shallowRef<readonly ToastRecord[]>>>;
} {
  const engine = getEngine();
  const toasts = shallowRef<readonly ToastRecord[]>(engine.store.getToasts());

  const unsubscribe = engine.store.subscribe(() => {
    toasts.value = engine.store.getToasts();
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return { toast: engine.toast, toasts };
}

/** Composable returning complete ui feedback toolkit and state. */
export function useToastory(): {
  ui: typeof ui;
  toast: ToastApi;
  toasts: Readonly<ReturnType<typeof shallowRef<readonly ToastRecord[]>>>;
  config: Readonly<ReturnType<typeof shallowRef<Readonly<GlazeConfig>>>>;
} {
  const engine = getEngine();
  const toasts = shallowRef<readonly ToastRecord[]>(engine.store.getToasts());
  const config = shallowRef<Readonly<GlazeConfig>>(engine.store.config.get());

  const unsubToasts = engine.store.subscribe(() => {
    toasts.value = engine.store.getToasts();
  });
  const unsubConfig = engine.store.config.subscribe(() => {
    config.value = engine.store.config.get();
  });

  onUnmounted(() => {
    unsubToasts();
    unsubConfig();
  });

  return { ui, toast: engine.toast, toasts, config };
}

export const useGlazekit = useToastory;

/** Vue plugin installing toastory and registering Toaster globally. */
export const toastoryPlugin = {
  install(app: App, options?: Partial<GlazeConfig>): void {
    if (options) {
      ui.configure(options);
    }
    app.config.globalProperties.$toastory = ui;
    app.config.globalProperties.$glaze = ui;
    app.config.globalProperties.$toast = toast;
    app.provide('toastory', ui);
    app.provide('glaze', ui);
    app.provide('toast', toast);
    app.component('ToastoryToaster', GlazeToaster);
    app.component('GlazeToaster', GlazeToaster);
  },
};

export const glazekitPlugin = toastoryPlugin;

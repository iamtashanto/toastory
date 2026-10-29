// @vitest-environment jsdom
import { createApp, defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetEngine } from '../../src/web';
import { GlazeToaster, glazekitPlugin, toast, ui, useGlazekit, useToast } from '../../src/vue';

beforeEach(() => {
  resetEngine();
  document.body.innerHTML = '<div id="app"></div>';
});

afterEach(() => {
  resetEngine();
  document.body.replaceChildren();
});

describe('glazekit/vue adapter', () => {
  it('installs Vue plugin and configures globals', () => {
    const app = createApp({});
    app.use(glazekitPlugin, { theme: 'pastel', position: 'bottom-center' });

    expect(app.config.globalProperties.$glaze).toBe(ui);
    expect(app.config.globalProperties.$toast).toBe(toast);

    const cfg = ui.configure({});
    expect(cfg.theme).toBe('pastel');
    expect(cfg.position).toBe('bottom-center');
  });

  it('GlazeToaster mounts and configures props', async () => {
    const app = createApp(
      defineComponent({
        setup() {
          return () => h(GlazeToaster, { theme: 'neon', richColors: true });
        },
      }),
    );

    const container = document.getElementById('app') as HTMLElement;
    app.mount(container);
    await nextTick();

    const cfg = ui.configure({});
    expect(cfg.theme).toBe('neon');
    expect(cfg.richColors).toBe(true);

    app.unmount();
  });

  it('useToast composable returns reactive toasts array', async () => {
    const app = createApp(
      defineComponent({
        setup() {
          const { toast: t, toasts } = useToast();
          return { t, toasts };
        },
        template: '<div :data-count="toasts.length">{{ toasts.length }}</div>',
      }),
    );

    const container = document.getElementById('app') as HTMLElement;
    const vm = app.mount(container) as unknown as {
      t: typeof toast;
      toasts: readonly unknown[];
    };
    await nextTick();

    expect(vm.toasts).toHaveLength(0);

    vm.t.success('Vue toast message');
    await nextTick();

    expect(vm.toasts).toHaveLength(1);
    expect(container.textContent).toBe('1');

    app.unmount();
  });

  it('useGlazekit composable exposes ui toolkit and reactive config', async () => {
    const app = createApp(
      defineComponent({
        setup() {
          const { ui: u, config, toasts } = useGlazekit();
          return { u, config, toasts };
        },
        template: '<button @click="u.toast(\'Added\')">Add</button>',
      }),
    );

    const container = document.getElementById('app') as HTMLElement;
    const vm = app.mount(container) as unknown as { u: typeof ui; config: { theme: string } };
    await nextTick();

    expect(vm.config.theme).toBeDefined();

    container.querySelector('button')?.click();
    await nextTick();

    expect(ui.toast.getToasts()).toHaveLength(1);

    app.unmount();
  });
});

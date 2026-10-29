// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearCustomThemes, defineTheme, getCustomTheme } from '../../src/web/theme-engine';
import { resetEngine, ui } from '../../src/web';

describe('theme-engine in DOM environment', () => {
  beforeEach(() => {
    resetEngine();
    clearCustomThemes();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    resetEngine();
    clearCustomThemes();
    document.body.innerHTML = '';
  });

  it('defines custom theme, compiles CSS, and injects style element into document head', () => {
    const css = defineTheme('neon-cyber', {
      radius: '8px',
      blur: '24px',
      saturate: '220%',
      tokens: {
        light: { accent: '#00f0ff', fg: '#0a0a10', bg: '#ffffff' },
        dark: { accent: '#ff003c', fg: '#f0f0f5', bg: '#050508' },
      },
      css: '& { --cyber-glow: 0 0 20px #00f0ff; }',
    });

    expect(css).toContain('[data-gk-theme="neon-cyber"]');
    expect(css).toContain('--gk-accent:#00f0ff');
    expect(css).toContain('--gk-radius:8px');
    expect(css).toContain('--cyber-glow');

    const styleEl = document.querySelector<HTMLStyleElement>('style[data-gk-theme="neon-cyber"]');
    expect(styleEl).not.toBeNull();
    expect(styleEl?.textContent).toBe(css);

    const registered = getCustomTheme('neon-cyber');
    expect(registered?.name).toBe('neon-cyber');
    expect(registered?.light.accent).toBe('#00f0ff');
    expect(registered?.dark.accent).toBe('#ff003c');

    clearCustomThemes();
    expect(document.querySelector('style[data-gk-theme="neon-cyber"]')).toBeNull();
    expect(getCustomTheme('neon-cyber')).toBeUndefined();
  });

  it('updates existing injected style element when re-defining the same theme name', () => {
    defineTheme('re-defined', {
      radius: '10px',
      tokens: { light: { accent: '#111111' } },
    });
    let style = document.querySelectorAll('style[data-gk-theme="re-defined"]');
    expect(style.length).toBe(1);

    defineTheme('re-defined', {
      radius: '20px',
      tokens: { light: { accent: '#222222' } },
    });
    style = document.querySelectorAll('style[data-gk-theme="re-defined"]');
    expect(style.length).toBe(1);
    expect(style[0]?.textContent).toContain('--gk-radius:20px');
  });

  it('supports container theme inheritance via data-gk-theme attribute', () => {
    const container = document.createElement('div');
    container.id = 'custom-island';
    container.setAttribute('data-gk-theme', 'ios-glass');
    document.body.append(container);

    const toastId = ui.toast('Inside custom container', {
      container: 'custom-island',
    });
    const item = ui.toastStore.getToasts().find((t) => t.id === toastId);
    expect(item).toBeDefined();

    ui.toast.dismiss(toastId);
  });

  it('handles global configure theme setting', () => {
    ui.configure({ theme: 'liquid-glass', mode: 'dark' });
    const cfg = ui.toastStore.config.get();
    expect(cfg.theme).toBe('liquid-glass');
    expect(cfg.mode).toBe('dark');
  });
});

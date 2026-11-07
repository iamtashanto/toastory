// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetEngine } from '../../src/web';
import {
  GlazeModule,
  GlazeService,
  GlazeToasterComponent,
  provideToastory,
  toast,
  ui,
} from '../../src/angular';
import type { ToastRecord } from '../../src/core';

beforeEach(() => {
  resetEngine();
  document.body.innerHTML = '<div id="app"></div>';
});

afterEach(() => {
  resetEngine();
  document.body.replaceChildren();
});

describe('toastory/angular adapter', () => {
  it('GlazeService exposes observables and ui toolkit', () => {
    const service = new GlazeService();
    expect(service.ui).toBe(ui);
    expect(service.toast).toBe(toast);

    const captured: (readonly ToastRecord[])[] = [];
    const sub = service.toasts$.subscribe((list) => {
      captured.push(list);
    });

    expect(captured).toHaveLength(1);
    expect(captured[0]).toEqual([]);

    service.toast.success('Angular notification');
    expect(captured).toHaveLength(2);
    expect(captured[1]).toHaveLength(1);

    sub.unsubscribe();
  });

  it('GlazeService.config$ emits configuration updates', () => {
    const service = new GlazeService();
    const configEmissions: string[] = [];
    const sub = service.config$.subscribe((c) => {
      configEmissions.push(c.position);
    });

    expect(configEmissions).toEqual(['top-right']);

    service.configure({ position: 'bottom-right' });
    expect(configEmissions).toEqual(['top-right', 'bottom-right']);

    sub.unsubscribe();
  });

  it('GlazeToasterComponent configures inputs on init, changes and destroy', () => {
    const component = new GlazeToasterComponent();
    component.theme = 'aurora';
    component.richColors = true;

    component.ngOnInit();
    const cfg = ui.configure({});
    expect(cfg.theme).toBe('aurora');
    expect(cfg.richColors).toBe(true);

    component.theme = 'minimal';
    component.ngOnChanges();
    expect(ui.configure({}).theme).toBe('minimal');

    component.ngOnDestroy();
  });

  it('GlazeModule is defined', () => {
    expect(GlazeModule).toBeDefined();
  });

  it('provideToastory configures settings and returns service provider', () => {
    const providers = provideToastory({ position: 'center', sound: true, soundVolume: 0.6 });
    expect(providers).toEqual([GlazeService]);
    const cfg = ui.configure({});
    expect(cfg.position).toBe('center');
    expect(cfg.sound).toBe(true);
    expect(cfg.soundVolume).toBe(0.6);
  });

  it('GlazeToasterComponent applies center position and sound inputs', () => {
    const component = new GlazeToasterComponent();
    component.position = 'center';
    component.sound = 'ding';
    component.soundVolume = 0.9;

    component.ngOnInit();
    const cfg = ui.configure({});
    expect(cfg.position).toBe('center');
    expect(cfg.sound).toBe('ding');
    expect(cfg.soundVolume).toBe(0.9);

    component.ngOnDestroy();
  });
});

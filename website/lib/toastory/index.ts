import rawToastory from './index.js';
import type { Ui, ToastFn, GlazeConfig } from './types';

export * from './types';

const g = rawToastory as unknown as Record<string, unknown>;
export const ui = g.ui as Ui;
export const toast = g.toast as ToastFn;
export const configure = g.configure as (config: Partial<GlazeConfig>) => GlazeConfig;
export const defineTheme = g.defineTheme as (name: string, def: any) => string;
export const clearCustomThemes = g.clearCustomThemes as () => void;
export const resetEngine = g.resetEngine as () => void;
export const DEFAULT_CONFIG = g.DEFAULT_CONFIG as GlazeConfig;

export default ui;

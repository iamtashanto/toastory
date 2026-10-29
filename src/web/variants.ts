const IOS_VARIANTS =
  'banner-light,banner-dark,capsule-success,island-call,hud-silent,system-alert,device-popup,grouped-stack,progress-ring,shake-error,focus-toggle,compact-action'.split(
    ',',
  );

/** Supported variant lookup for runtime check and fallback warnings. */
export const THEME_VARIANTS: Record<string, readonly string[]> = {
  essentials:
    'minimal,success,error,warning,accent-bar,badge-title,progress-bar,pill,undo-bar,inline-confirm,loading-percent,avatar'.split(
      ',',
    ),
  showcase:
    'glass-gradient,emerald,neon-error,ios-banner,dev-dark,countdown-ring,stacked,upload-card,island,gradient-border,soft-light,message-actions'.split(
      ',',
    ),
  'ios-glass': IOS_VARIANTS,
  'liquid-glass': IOS_VARIANTS,
  dialogs:
    'warning-confirm,danger-confirm,type-to-confirm,rename-prompt,success,update-info,dark-logout,ios-glass-alert,bottom-sheet-confirm,reauth-password,otp-code,session-countdown'.split(
      ',',
    ),
};

export function resolveVariant(themeName: string, variant: string | undefined): string | undefined {
  if (!variant) return undefined;
  const supported = THEME_VARIANTS[themeName];
  if (supported && !supported.includes(variant)) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.warn(`[toastory] Unknown variant "${variant}" for "${themeName}".`);
    }
    return undefined;
  }
  return variant;
}

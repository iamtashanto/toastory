# Changelog

## 0.3.0

### Minor Changes

- **Unified Reference Feature Parity**:
  - Real damped harmonic oscillator spring physics (`springPosition`, `springEasing`, `Spring`, `runSpringTask`) with 4-way velocity-aware swipe-to-dismiss and fling inertia.
  - Web Audio acoustic mallet synthesis with 14 built-in sound cues (`success`, `error`, `warning`, `info`, `ding`, `pop`, `chime`, `bell`, `message`, `bubble`, `marimba`, `crystal`, `subtle`, `harp`), custom frequency partial registration (`registerSoundCue`), and audio URL playback.
  - Dynamic Island morphing (`island`), HUD mode (`hud`), animated SVG robot characters (`character` / `robotVariant`: `idle`, `wave`, `success`, `error`, `think`, `loading`, `sleep`, `shock`, `search`, `headPalm`), image banners, relative timestamps, keyboard badges (`kbd`), inline toggle switches, and custom close/discard text & icons (`closeText`, `discardText`, `closeIcon`, `discardIcon`).
  - Full `react-native-toast-message` v2.5.2 API compatibility (`Toast.show`, `Toast.hide`, `text1`, `text2`, `visibilityTime`, `autoHide`, `topOffset`, `bottomOffset`, `onShow`, `onHide`, `onPress`, `buttons`) across Web and React Native.
- **Memory & Lifecycle Hardening**:
  - Idempotent `config.set()` preventing redundant emissions and React/Vue render loops.
  - Cached SSR server snapshot in `toastory/react` (`useToast`, `useToastory`) for React 18/19 SSR hydration safety.
  - Proper top-level `onUnmounted` registration in `toastory/vue`.
  - Complete listener, timer, `inert`/`aria-hidden`, scroll-lock, OTP interval, and Web Audio node cleanup on teardown.

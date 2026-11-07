# Changelog

## 0.3.2

### Patch Changes

- **Micro-Animations & Icon Physics**:
  - Added micro-animation presets for toast icons (`animateIcon`, `iconAnimation`: `pop`, `spin`, `pulse`, `bounce`, `none`).
  - Added built-in pop micro-spring entrance for all status icons.
  - Enhanced enter/exit animation presets with `pop`, `fade`, `slide`, `zoom`, and `none`.
- **UI & Layout Refinement**:
  - Re-anchored deduplication counter badge inline inside the toast title (`.gk-title`) instead of trailing below descriptions.
  - Suppressed default type icon when custom `avatar` or `character` mascot is active.
  - Added automatic broken image hiding (`onerror`) to prevent broken image placeholders when image URLs fail.
  - Separated header timestamp, keyboard shortcuts (`kbd`), and discard button into dedicated, styled flex elements.
- **Gesture Fling Polish & Size Budget**:
  - Refined omnidirectional 2D momentum fling physics with velocity normalization.
  - Kept complete package within strict size budgets (< 6.00 KB Core+Toast+Theme, < 21.75 KB Full Web bundle).

## 0.3.1

### Patch Changes

- **Visual & Sanitization Fixes**:
  - Allowed `data:image/(?:png|jpe?g|webp|gif|svg\+xml)` URIs in `safeUrl()`, fixing broken `<img src="">` icons when passing SVG data-URIs or base64 avatars.
  - Grouped timestamp, keyboard badge (`kbd`), and close/discard text in `.gk-meta` container to prevent overlapping text collisions (`now ⌘BDiscard`).
  - Suppressed redundant type status icon when robot mascot / character avatar is active.
- **Ding-Style Physics & Fling Polish**:
  - Implemented 1:1 pointer gesture tracking with edge resistance and release vector momentum flinging.
  - Configured native spring curve `--gk-ease: cubic-bezier(0.18, 1.25, 0.35, 1)` and Ding-style entrance overshoot.
  - Added acoustic mallet 1300Hz lowpass filtering to Web Audio synthesizer.
- **Bundle Size Optimization**:
  - Shaved core and theme bytes to guarantee `< 6.00 KB` core+toast+theme budget and `< 22.00 KB` full web bundle budget.

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

# Changelog

## 0.3.5

### Patch Changes

- **Layout & Visual Collision Fixes**:
  - Decoupled text-based dismiss buttons (`.gk-close--text`) from absolute positioning, styled with frosted pill borders and padding so timestamp, keyboard shortcut badges (`kbd`), and discard actions never overlap.
  - Resolved toast stacking collision on dynamic updates: non-front toasts in collapsed mode prevent height corruption, updating natural heights smoothly when toasts transition states.
  - Implemented full-bleed header banner styling (`width: calc(100% + 2em); flex: 0 0 100%`) with automatic border clipping, preventing status icons from flexing onto the banner row.
  - Added clean OTP input styling with solid background, border, focus rings, and centered resend code timer.
  - Fixed dialog timer progress bar overflow by applying `overflow: hidden` to `.gk-dialog` and `.gk-loading`.

## 0.3.4

### Patch Changes

- **Layout & Visual Collision Fixes**:
  - Decoupled text-based dismiss buttons (`.gk-close--text`) from absolute positioning so timestamp, keyboard shortcut badges (`kbd`), and discard actions never overlap.
  - Implemented full-bleed header banner styling (`width: calc(100% + 2em)`) with automatic border clipping.
- **Robust Avatar Safety & Fallbacks**:
  - Image avatars now hide broken image placeholders during load (`opacity: 0`) and gracefully fall back to retina vector initials badges on fetch failure (`onerror`).
  - Plain string initials (e.g. `'ER'`, `'DS'`) render as styled vector badges immediately without initiating failing HTTP requests.
  - Automatically suppress redundant default status icons when an avatar or mascot character is present.
- **Deduplication Counter Badge**:
  - Clean inline pill badge styling inside `.gk-title` with proper directional start margin.
- **Terser Boolean Optimization Fix**:
  - Disabled `booleans_as_integers` to ensure strict boolean equality contracts (`res.isConfirmed === true`) and DOM dataset string serializations (`data-expanded="false"`).

## 0.3.3

### Patch Changes

- **Documentation Overhaul & Code Formatting**:
  - Implemented a robust block-level Markdown parser for documentation pages, preventing multi-line code snippets with empty lines from breaking.
  - Formatted one-click code copy buttons with exact whitespace preservation, language labels, and visual feedback.
  - Rendered GitHub-style frosted glass callout cards (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`).
- **SEO & AI Search Discoverability**:
  - Enhanced OpenGraph, Twitter cards, and Schema.org `SoftwareApplication` structured data.
  - Expanded search keywords for high-intent queries (React toast, Next.js toast, Sonner alternative, SweetAlert2 alternative, etc.).
  - Added SupportKori creator links and synced documentation endpoints (`/llms.txt`, `/llms-full.txt`) for ChatGPT, Claude, and Perplexity.
- **Stack Interaction & Visual Polish**:
  - Bridged pointer events across expanded toast gaps to ensure flicker-free Sonner-style hover expansion.
  - Automatic graceful fallback from broken avatar URLs to retina vector initials badges.

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

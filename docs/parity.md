# toastory Parity & Capability Matrix

Comprehensive parity matrix comparing `toastory` against existing market leaders: **Sonner**, **React-Toastify**, **react-hot-toast**, **Notyf**, and **SweetAlert2**.

---

## 1. Feature Parity Matrix

| Feature | `toastory` | Sonner | React-Toastify | react-hot-toast | Notyf | SweetAlert2 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Zero Runtime Dependencies** | **Yes (0 B)** | No | No | No | Yes | Yes |
| **Gzip Core + Toast Size** | **6.00 KB** | ~4.5 KB | ~14 KB | ~5.2 KB | ~3.8 KB | ~15 KB |
| **Framework Agnostic Core** | **Yes (Node-safe)** | React only | React only | React only | Vanilla only | Vanilla only |
| **Multi-Framework Adapters** | **React, Vue, Angular, Svelte, React Native** | React | React | React | Vanilla | Vanilla / Wrappers |
| **Apple-Style Glass Design** | **Native Tokens (21 Themes)** | Minimal flat | Flat | Minimal | Flat | Skewed / Flat |
| **Dialog Toolkit (Confirm, Prompt, Alert)** | **Built-in** | No | No | No | No | Yes |
| **Bottom Sheet Drawer** | **Built-in** | No | No | No | No | No |
| **Action Sheet** | **Built-in** | No | No | No | No | No |
| **Multi-Step Dialog Flow** | **Built-in** | No | No | No | No | Basic |
| **6-Box Discrete OTP Input** | **Built-in** | No | No | No | No | No |
| **Type-to-Confirm Guard** | **Built-in** | No | No | No | No | No |
| **Live Session Countdown Timer** | **Built-in** | No | No | No | No | Timer only |
| **Determinate Progress (Ring & Bar)** | **Built-in** | Bar only | Bar only | No | No | Progress steps |
| **Interactive Form Fields** | **Text, Radio, Checkbox, Select, File, Range, OTP** | No | No | No | No | Basic text |
| **Promise Toast (`unwrap()`)** | **Yes** | Yes | Yes | Yes | No | No |
| **Deduplication Window & Keys** | **Yes** | Basic | Basic | No | No | No |
| **Gesture Swipe Dismiss** | **4-Direction Velocity Snap** | 1-Direction | 2-Direction | Basic | No | No |
| **WCAG 2.2 AA (0 axe-core errors)** | **Verified (96 runs)** | Partial | Partial | Partial | Partial | Partial |

---

## 2. Supported Themes & Visual Design Variants

toastory ships with **21 themes** and **48 component variants** across Light and Dark modes (96 total permutations):

1. **`essentials`** (12 variants): Minimal, Success, Error, Warning, Accent Bar, Badge Title, Progress Bar, Capsule Pill, Undo Bar, Inline Confirm, Loading Percent, Initials Avatar.
2. **`showcase`** (12 variants): Glass Gradient, Emerald Glow, Neon Error, iOS App Banner, Developer Dark with Key-hint, Countdown Ring Timer, 3D Expanding Stack, File Upload Progress, Morphing Island, Gradient Border Promo, Soft Minimal Card, Social Message with Actions.
3. **`ios-glass` & `liquid-glass`** (12 variants): Frosted Glass Banner, Dark Glass Banner, Liquid Glass Capsule, Incoming Call Island, Floating Silent HUD, Hairline Divided Alert, Device Connected Popup, Grouped Thread Stack, Download Progress Ring, Shake Error Banner, Focus Mode Switch, Compact Banner Action.
4. **`dialogs`** (12 variants): Warning Confirm, Danger Destructive Confirm, Type-to-Confirm Guard, Rename Input Prompt, Success Verified Modal, Update Info Stacked, Dark Logout Modal, iOS Hairline Alert, Bottom Sheet Slide-Up Confirm, Re-enter Password with Shield Notice, OTP 6-Box Verification, Session Inactivity Live Countdown.
5. **Modern Look Presets**: `aurora`, `ocean`, `sunset`, `mesh`, `minimal`, `flat`, `outline`, `neon`, `gradient`, `brutal`, `pastel`, `sweet`, `material`, `basic`.

---

## 3. Strict Accessibility Compliance (WCAG 2.2 AA)

- **Live Regions**: Polite (`role="status"`, `aria-live="polite"`) for standard notifications; Assertive (`role="alert"`, `aria-live="assertive"`) for urgent errors and warnings.
- **Focus Management**: Active focus trapping, automatic restoration to previous active element on dialog dismiss, and visible outline focus rings (`:focus-visible`).
- **Screen Reader Announcements**: Live countdowns throttled to critical milestones (30s, 10s, 5s) to avoid screen reader flooding.
- **Motion Preferences**: Full respect for `prefers-reduced-motion` across all spring, shake, pulse, and progress animations.
- **Color Contrast**: Every background, border, text, muted, and accent token mathematically tested and verified ≥ 4.5:1 (or ≥ 3:1 for UI borders and large headings) over all translucent backdrops.


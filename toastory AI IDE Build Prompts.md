# toastory AI IDE Build Prompts

Oct 29, 2026 · @TA Shanto

## How to use this pack

Ei doc e 12 ta prompt ache (Prompt 0 theke 11) + ekta master context + final audit. AI IDE (Cursor, Claude Code, Windsurf, Copilot Agent, Cline, jai hok) e ekটা ekটা kore dite hobe. Prompt gulo English e, karon AI IDE English e best kaj kore. Assumption: language TypeScript, package naam `toastory`. Alada kichu hole Master context e change koro.

Niyom (eta na manle quality noshto hobe):

1. **Prothome Master context** ta repo te `AGENTS.md` (Cursor e `.cursor/rules`, Claude Code e `CLAUDE.md`) name save koro. Shob prompt eta pore kaj kore.
2. **Ek prompt = ek session = ek commit.** Prompt shesh hole `npm run check` chalao, pass hole commit koro, tarpor porer prompt. Fail hole fix prompt dao, porer step e jeo na.
3. **Order change korba na.** Core age, web renderer tarpor, theme, dialog, framework wrapper, shesh e React Native.
4. **Plan age.** Protita prompte AI ke bolbe: age plan koro, file list dao, tarpor code. Plan e kichu vul lagle code likhar age thamao.
5. **Output review koro.** Protita phase e diff dekho: `any`, copy-paste code, bhuye test, skipped test khujo.
6. **Model**: boro reasoning model use koro (Claude Opus/Sonnet, GPT-5 class). Auto/cheap mode e core ar a11y prompt chalio na.
7. Kono jaygay AI atke gele: prompt er "Acceptance criteria" ta abar paste kore bolo kon ta fail.

Prompt er structure sob jaygay ekই: **Goal, Read first, Tasks, Constraints, Acceptance criteria, When done**. Tumi nijer prompt likhle o ei format rakho.

## Master context (AGENTS.md)

Ei puro text ta repo root e `AGENTS.md` e rakho. Eta project er constitution.

```text
# toastory — project constitution

## What we are building
toastory is ONE npm package (name: `toastory`) that ships a complete UI feedback toolkit: toast notifications, confirm / prompt / alert dialogs, action sheet, bottom sheet, loading overlay and multi-step dialogs. Same API on every platform: plain JS, React, Next.js, Vue, Nuxt, Angular, Svelte, Electron, React Native (Expo + bare).
It must contain every feature of the market leaders (Sonner, React-Toastify, react-hot-toast, Toastify-js, Notyf, SweetAlert2) AND a premium Apple-style glass design. This is a full professional release, not an MVP. Quality bar: a popular open-source library with docs, tests and accessibility that other maintainers would respect.

## Hard rules
1. Language: TypeScript, strict mode, no `any`, no `@ts-ignore` (use `@ts-expect-error` with a reason only if unavoidable).
2. Zero runtime dependencies in the published package. Optional peer dependencies only (react, vue, @angular/core, svelte, react-native, react-native-reanimated, expo-blur, expo-haptics, dompurify). All peers are optional via `peerDependenciesMeta`.
3. Never copy code, CSS, SVG or text from other libraries. Study behaviour, then write our own implementation. Look presets recreate a visual style with our own CSS.
4. Core (src/core) must not import DOM, React, Vue, Angular, Svelte or React Native. It must run in Node.
5. Everything must be SSR-safe: no `window`/`document` access at import time. Guard every DOM access.
6. Accessibility is a headline feature (WCAG 2.2 AA minimum): live regions, keyboard reachable close/action buttons, focus trap + restore in dialogs, Esc handling, prefers-reduced-motion, contrast-checked themes.
7. Every public option is documented with TSDoc and covered by at least one test.
8. Tree-shakable: toast-only imports must not pull dialog code. Each theme is a separate CSS file.
9. Size budget (gzip): core + toast + one theme < 6 KB; full web bundle < 22 KB.
10. No emoji in code or comments. No placeholder / TODO / fake implementations. If something cannot be done, say so and stop.

## Public API contract (do not rename without asking)
import { ui } from 'toastory'
ui.toast(message, opts) and ui.toast.success|error|info|warning|loading|message(message, opts) -> id
ui.toast.promise(promiseOrFn, { loading, success, error, description, finally }) -> id + unwrap()
ui.toast.custom(renderer, opts), ui.toast.update(id, patch), ui.toast.dismiss(id?), ui.toast.dismissAll(), ui.toast.getToasts(), ui.toast.getHistory(), ui.toast.types.add(name, def)
ui.confirm(opts) / ui.alert(opts) / ui.prompt(opts) / ui.steps(steps) / ui.sheet(opts) / ui.bottomSheet(opts) / ui.loading(opts)
Dialog result: { isConfirmed, isDenied, isDismissed, value, dismiss }  where dismiss is 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer'
ui.configure({ theme, mode: 'light'|'dark'|'auto', position, duration, maxVisible, gap, stack, dir, hotkey, pauseOn, container, shadow, ... })
Subpaths: toastory (web + core), toastory/core, toastory/react, toastory/vue, toastory/angular, toastory/svelte, toastory/native, toastory/themes/<name>.css

## Toast options (must all exist)
id, type, title, description, icon, avatar, duration (0 = persistent), position, action {label,onClick}, cancel {label,onClick}, closeButton, dismissible, closeOnClick, progress (show/hide), pauseOn ['hover','focus','hidden'], swipe + swipeDirections, dragThreshold, richColors, invert, theme, className, classNames{}, style, unstyled, html (sanitised), href + target, ariaLive, role, dedupe, important, onOpen, onClose, onDismiss, onAutoClose, container id, dir.

## Dialog options (must all exist)
title, text, html, icon (success|error|warning|info|question|custom), tone (info|warning|danger), confirmButton/denyButton/cancelButton {show,label,color,aria}, reverseButtons, focusOn, input (text,email,password,number,tel,url,search,textarea,select,radio,checkbox,range,date,time,datetime-local,week,month,file), inputValue, placeholder, options, validate (sync+async), preConfirm, preDeny (async, button shows loading), allowOutsideClick, allowEscape, backdrop (blur|dim|none|custom), position (15 placements), grow, draggable, width, padding, footer, image, timer + timerProgressBar, handle {close,update,setLoading,showError,timer.pause|resume|add}, didOpen, willClose.

## Theme tokens (CSS variables, prefix --gk-)
--gk-bg --gk-fg --gk-muted --gk-border --gk-radius --gk-blur --gk-saturate --gk-shadow --gk-font --gk-success --gk-error --gk-warning --gk-info --gk-accent --gk-z --gk-gap --gk-width --gk-ease --gk-duration. Themes: ios-glass, liquid-glass, aurora, classic-stack, classic-bar, pill, ripple, gradient-strip, sweet, material, basic, minimal, flat, outline, neon, gradient, brutal, pastel. Each supports light, dark and auto. backdrop-filter fallback to solid colour via @supports.

## Repo layout
src/core  src/web  src/themes  src/react  src/vue  src/angular  src/svelte  src/native  tests  docs  examples
Build: tsup (ESM + CJS + d.ts). Tests: Vitest (unit), Playwright (browser), axe-core (a11y), Jest/RNTL (native). Lint: ESLint + Prettier. Release: Changesets, semver, npm provenance. License MIT.

## Commands that must exist and pass
npm run typecheck | lint | test | test:e2e | build | size | check (runs all of the above except e2e) | check:all

## Workflow for every task
1. Restate the task in at most 5 lines and list the files you will create or change. Then continue immediately, in the same turn, and implement everything. Never end your turn with only a plan, a restatement or a file list, and never wait for approval. Stop early only if a requirement is impossible or contradictory, and say exactly why.
2. Implement completely. No stubs.
3. Write or update tests in the same change.
4. Run `npm run check`. Fix until green. Never weaken a test to make it pass.
5. Finish with: what changed, commands run with results, anything left open, suggested commit message.
```

Ei file e kono option bad dewa jabe na. Jodi tumi aro feature chao, ekhane add korbe, tarpor AI ke bolbe "AGENTS.md updated, sync the code".

## Prompt 0: Scaffold, tooling, CI

```text
GOAL
Create the empty but fully working repository for the `toastory` npm package: tooling, build, test, lint, CI, release config. No product code yet except a trivial exported constant so the pipeline can be verified.

READ FIRST
AGENTS.md (the whole file).

TASKS
1. Initialise a git repo with a single package at the root (no monorepo tooling). Node 20+ engines. Use npm.
2. package.json: name `toastory`, version 0.0.0, license MIT, type module, sideEffects set so only CSS files count as side-effectful, files [dist, README.md, LICENSE], publishConfig {access: public, provenance: true}. Define the `exports` map for these subpaths with types/import/require conditions: `.`, `./core`, `./react`, `./vue`, `./angular`, `./svelte`, `./native`, and `./themes/*.css`. Each entry should map to dist output we will create later; create tiny placeholder source files in src/{core,web,react,vue,angular,svelte,native}/index.ts so the build succeeds.
3. peerDependencies for react, react-dom, vue, @angular/core, svelte, react-native, react-native-reanimated, expo-blur, expo-haptics, dompurify; ALL marked optional in peerDependenciesMeta. devDependencies for each of them (latest stable) so wrappers can be type-checked.
4. tsconfig.json: strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, verbatimModuleSyntax, target ES2020, moduleResolution bundler. Separate tsconfig for tests.
5. tsup config: one build per entry (core, web, react, vue, angular, svelte, native), formats esm + cjs, dts true, treeshake true, splitting for shared chunks, external for every peer, `use client` banner on the react entry via esbuild banner. CSS themes copied/processed to dist/themes/*.css (use a small build script, no heavy deps).
6. Lint/format: ESLint flat config with typescript-eslint strict + import rules + a rule forbidding imports of DOM/framework packages inside src/core. Prettier config. EditorConfig.
7. Tests: Vitest for unit tests (jsdom for web), a first test per entry. Playwright config with chromium, firefox, webkit and a tests/e2e folder with one smoke test against a static HTML fixture. axe-core available to Playwright tests.
8. Scripts: typecheck, lint, test, test:e2e, build, size (size-limit with budgets from AGENTS.md rules), check (typecheck + lint + test + build + size), check:all (check + test:e2e), clean.
9. Changesets initialised. CODE_OF_CONDUCT, CONTRIBUTING, SECURITY.md, issue and PR templates.
10. GitHub Actions: ci.yml (matrix Node 20 and 22, runs check; separate job for e2e), release.yml (changesets action, npm publish with provenance, triggered on main). Do not include any secrets; document the NPM_TOKEN secret in CONTRIBUTING.
11. README.md skeleton with name, one-line pitch, install, status badge placeholders, and a clear "Under construction" note.
12. .gitignore, .npmignore not needed (use files field), LICENSE (MIT, year 2026).

CONSTRAINTS
- Do not add any runtime dependency.
- Do not write product logic yet.
- Pin tool versions by caret ranges, run `npm install` and commit the lockfile.

ACCEPTANCE CRITERIA
- `npm run check` passes on a clean clone.
- `npm pack --dry-run` lists only dist, README and LICENSE and shows all subpath entries.
- A sample consumer test (tests/exports.test.ts) imports every subpath from the built dist in both ESM and CJS and succeeds.
- Lint fails if someone imports `react` inside src/core (prove it with a temporary test, then remove it).

WHEN DONE
Show the final tree, the output of `npm run check`, and a suggested commit message `chore: scaffold toastory repository`.
```

## Prompt 1: Core engine

```text
GOAL
Implement the framework-agnostic core in src/core: types, store, queue, timers, ids, dedupe, promise helper and the headless toast/dialog state machines. No DOM, no framework.

READ FIRST
AGENTS.md (API contract, toast options, dialog options, hard rules 4, 5, 7).

PLAN FIRST
List the modules and public types you will create, then implement.

TASKS
1. types.ts: full TypeScript types for ToastOptions, ToastType, ToastRecord, ToastAction, PromiseData<T>, DialogOptions (all options from AGENTS.md), DialogResult<T>, DialogHandle, Position (6 toast + 15 dialog placements), ThemeName, Mode, Config, Unsubscribe, Listener. Use discriminated unions where it makes types stricter (input type -> value type).
2. store.ts: a tiny observable store (subscribe, getSnapshot, setState with batching via microtask). Must work with React useSyncExternalStore, Vue refs, Angular signals/observables and Svelte stores without adapters being heavy.
3. clock.ts: injectable clock/scheduler (setTimeout wrapper) so tests can use fake timers deterministically.
4. timer.ts: pausable countdown with reasons set (hover, focus, hidden, manual), remaining-time tracking, add(ms), reset, onTick for progress. Pause reasons are reference counted by name, not booleans.
5. toast-manager.ts: create, update (merge patch, keep id and position in the stack), dismiss(id?), dismissAll, dedupe (same id replaces; same message+type within a window optionally merges and increments a count), maxVisible with a waiting queue, ordering (newest on top option), history (bounded, default 100), getToasts, getHistory, lifecycle callbacks exactly once each (onOpen, onClose, onDismiss for user dismissal, onAutoClose for timer). Persistent toast when duration is 0 or Infinity. `important: true` bypasses the queue limit.
6. promise.ts: toast.promise accepts a promise or a function returning one; shows loading, then success or error; success/error can be a string or a function receiving result/error; supports description functions and `finally`; returns the id plus `unwrap()` resolving to the original result; never swallows rejections for unwrap; handles synchronous throw from the function form.
7. types registry: built-in types success, error, info, warning, loading, message + `ui.toast.types.add(name, definition)` for custom types (icon, color tokens, default duration, ariaLive).
8. dialog-manager.ts: headless dialog state machine for confirm/alert/prompt/steps/sheets: open, resolve with DialogResult, close reasons, loading state, validation message state, async preConfirm/preDeny with error handling (a throw shows the error message and keeps the dialog open), timer integration, queue of dialogs (one modal at a time, others queued; priority option), `handle` API. Pure state + events, no DOM.
9. a11y-rules.ts: pure helpers that decide aria-live (assertive for error/warning/important, polite otherwise), role (status/alert/dialog/alertdialog), labels and default focus target for each dialog type.
10. ids.ts: collision-safe incremental ids, plus string ids provided by users.
11. config.ts: `configure()` merging with defaults, per-call override precedence (call > theme default > global config > library default). Immutable config snapshots.
12. index.ts exporting a clean, documented public surface. `ui` object assembled here with toast, confirm, alert, prompt, steps, sheet, bottomSheet, loading, configure. Methods that need a renderer must go through a registered renderer interface (`registerRenderer`) so core stays UI-free; if no renderer is registered, the call queues and replays when one registers (this is the SSR/hydration story).

CONSTRAINTS
- ESLint rule must prove nothing in src/core imports DOM or frameworks.
- All functions pure where possible; side effects only via the injected clock and store.
- No global mutable state except one default instance; support `createUI()` factories for isolated instances (needed for tests and multi-container apps).
- Memory safety: unsubscribe everything, clear timers on dismiss, bounded history.

TESTS (Vitest, fake clock)
Write thorough tests: timer pause/resume with multiple reasons, update merging, dedupe, queue/maxVisible/important, promise success/error/finally/unwrap/sync-throw, lifecycle callbacks fire exactly once, dialog resolve reasons (cancel, backdrop, close, esc, timer), async preConfirm error handling, queueing before a renderer registers then replay, config precedence, createUI isolation. Target >= 95% line and branch coverage for src/core.

ACCEPTANCE CRITERIA
- `npm run check` green, coverage threshold enforced in Vitest config.
- A Node script (no DOM) can create a UI instance, fire toasts and dialogs against a fake renderer and observe correct events.

WHEN DONE
Summarise the public types, show coverage numbers, suggested commit `feat(core): add headless engine`.
```

## Prompt 2: Web toast renderer

```text
GOAL
Build the DOM renderer for toasts in src/web: container, stacking, positioning, animations, swipe, pause, hotkey, accessibility. Use plain DOM APIs, no framework. Styling comes from CSS variables; this task ships only a minimal structural base stylesheet and the `basic` theme.

READ FIRST
AGENTS.md and src/core public types.

PLAN FIRST
Describe the DOM structure (container, region, toast, parts) and the class/attribute naming scheme (BEM-like `gk-toast`, `gk-toast__title`, data attributes for type, position, state, theme), then implement.

TASKS
1. Renderer registration: `registerWebRenderer()` auto-runs on first use of `ui.toast` in a browser, creates one portal container per configured container id, appended to document.body (or custom `container` selector/element; optional Shadow DOM mode that injects the theme CSS into the shadow root).
2. Accessible structure: each position region is `<section aria-label="Notifications" tabindex="-1">` with an ordered list; each toast is `<li>` with role `status` (polite types) or `alert` (error, warning, important), `aria-atomic`, `aria-live`. Title, description, icon (aria-hidden), actions, close button with accessible label and visible focus ring. Respect per-toast `ariaLive` and `role` overrides.
3. Positions: top-left/center/right, bottom-left/center/right, `offset` and `mobileOffset` (per-side or single value), safe-area insets, `dir` ltr/rtl/auto, mobile layout under 600px.
4. Stacking: three modes `stacked` (overlapping cards that expand on hover/focus), `expanded` (always full list), `list` (simple column). `gap`, `maxVisible`, `newestOnTop`. Heights measured with ResizeObserver; layout updated via CSS transforms and CSS variables, never by animating height/top.
5. Enter/exit animations via CSS classes + Web Animations API fallback: slide, bounce, zoom, flip, spring, fade, none. Exit uses animationend/transitionend with a timeout safety net. Reduced motion: replace movement with a short fade or none.
6. Interaction: swipe/drag to dismiss using Pointer Events (configurable `swipeDirections`, `dragThreshold` percent and velocity, snap back, no click after drag), close button, closeOnClick, `dismissible: false`, Esc closes the focused toast, action and cancel buttons call handlers then dismiss (unless handler calls preventDefault on the passed event).
7. Timers: bind core timers to DOM: pause on hover, on focus within, on window blur and on `document.hidden` (per `pauseOn`), resume correctly; progress bar driven by a CSS animation whose play-state follows the timer or by requestAnimationFrame with transform scaleX, hide-able and reversible.
8. Hotkey: configurable (default Alt+T) moves focus to the first toast region; roving Tab order inside it; Escape returns focus to the previously focused element.
9. Content: `title`, `description` (string or Node), `html: true` goes through a sanitiser interface (`setSanitizer(fn)`; default is a strict built-in escape-everything-but-safe-tags allowlist; use DOMPurify automatically if it is installed and passed), `node` / custom renderer returns an HTMLElement, `avatar`, `icon` (string svg, Node or false), `href` + `target`.
10. Built-in icons: write our own clean SVG icon set (success, error, warning, info, loading spinner, close) as tiny inline strings; theme tokens control stroke/fill.
11. `dismissAll`, `update` re-render in place without remounting (keep focus and animation state), dedupe count badge, history untouched by DOM.
12. SSR/Hydration: importing src/web in Node must not throw; all DOM access lazy.
13. Structural CSS file `themes/_base.css` (layout, stacking, animation keyframes, focus ring, reduced-motion) and `themes/basic.css` (solid card, 4 type colours, light/dark/auto). Everything via `--gk-*` variables.

CONSTRAINTS
- No innerHTML with user text (use textContent); innerHTML only for sanitised html option and our own static SVG.
- No layout thrash: batch reads then writes.
- Max one ResizeObserver and one global listener set per container.

TESTS
- Vitest + jsdom: structure, roles, aria, dismiss logic, sanitiser, update-in-place, SSR import.
- Playwright (chromium, firefox, webkit) on a fixture page: stacking expand, swipe dismissal, pause on hover/focus/hidden, hotkey focus, keyboard-only close and action, RTL, reduced-motion, 50 simultaneous toasts without main-thread long tasks > 50 ms.
- axe-core: zero violations in light and dark.

ACCEPTANCE CRITERIA
- A static HTML page loading the built ESM can show every toast type, promise toast, action/cancel, custom node, and works with mouse, touch and keyboard.
- `npm run check:all` green. Size of core+toast+basic theme < 6 KB gzip.

WHEN DONE
List accessibility behaviours implemented, perf numbers from the 50-toast test, commit `feat(web): toast renderer and basic theme`.
```

## Prompt D: Design reference import (Prompt 2 er por, Prompt 3 er age)

Ei prompt tomar screenshot ar HTML/CSS ke design er source of truth banay. Eta Prompt 3, 4 ar 6 er theme/dialog design ke **override** kore: oi prompt e AI jeta nijer moto design korte pare, ekhon tar jaygay tomar design follow korbe.

**Age folder ready koro.** Repo te `design-refs/` folder baniye ei naam e file rakho (screenshot + tomar HTML/CSS):

| File                                                | Ki ache                                                                                                                                                                             |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `design-refs/toasts-essentials.png`                 | 12 minimal dark toast: minimal, success, error, warning, left accent bar, icon badge, progress bar, pill, undo, confirm with two buttons, loading promise (64%), avatar             |
| `design-refs/toasts-showcase-1.png`                 | 1-8: glassmorphism, emerald gradient, neon error, iOS notification, developer dark with Esc key hint, countdown ring with Undo, stacked toasts (hover expand), upload progress card |
| `design-refs/toasts-showcase-2.png`                 | 9-12: dynamic island, gradient border promo, soft light, message with Reply/Dismiss actions                                                                                         |
| `design-refs/ios-glass-1.png`                       | 1-6: light glass banner, dark glass banner, liquid glass success capsule, island incoming call, silent mode HUD, system alert with two divided buttons                              |
| `design-refs/ios-glass-2.png`                       | 7-12: device connected popup, grouped stack, download with progress ring, error with shake, focus mode toggle, compact banner with action                                           |
| `design-refs/dialogs-1.png`                         | 1-4: warning confirm, danger delete, type-to-confirm, rename prompt                                                                                                                 |
| `design-refs/dialogs-2.png`                         | 5-8: success, info with stacked buttons, dark logout modal, iOS glass alert                                                                                                         |
| `design-refs/dialogs-3.png`                         | 9-12: bottom sheet confirm, re-enter password with notice box, OTP 6-digit input, session timeout live countdown                                                                    |
| `design-refs/npm-page-reference.png`                | Tomar `nagad-client` npm page (release quality reference, Prompt R e lagbe)                                                                                                         |
| `design-refs/html/*.html`, `design-refs/html/*.css` | Tomar original HTML/CSS (jevabe ache, rename korar dorkar nai)                                                                                                                      |

HTML/CSS ar screenshot e mile na gele **HTML/CSS ke truth dhore** AI ke kaj korte bolechi.

```text
GOAL
Import the approved design references in /design-refs and rebuild every design as a first-class toastory theme, variant or component. The screenshots and the original HTML/CSS are the design source of truth. The result must look the same as the references, be fully tokenised, accessible, framework-agnostic and tree-shakable.

READ FIRST
1. AGENTS.md (all of it).
2. Every image in design-refs/ (view each one). They are: toasts-essentials, toasts-showcase-1, toasts-showcase-2, ios-glass-1, ios-glass-2, dialogs-1, dialogs-2, dialogs-3 (design references) and npm-page-reference (ignore here, used later).
3. Every file in design-refs/html/. If an HTML/CSS file and a screenshot disagree, the HTML/CSS wins. If neither is clear, ask me one precise question and continue with the rest.

PLAN FIRST
Before writing code, produce docs/design-inventory.md. One row per design (96 items expected: 12 + 12 + 12 + 12 + 12 + 12 + 12 + 12 = 96 across the 8 images, count them and report the real number): id, source image and number, human name (neutral, no brand names), target component (toast, dialog, bottom sheet, HUD, island), theme group, required features, accessibility notes, status. Show me the table, then implement.

DESIGN GROUPS AND NEUTRAL NAMES
- Theme `essentials` (toasts-essentials, 12 variants): minimal, success, error, warning, accent-bar, badge-title, progress-bar, pill, undo-bar, inline-confirm (toast with two buttons), loading-percent, avatar.
- Theme `showcase` (toasts-showcase-1 and 2, 12 variants): glass-gradient, emerald, neon-error, ios-banner, dev-dark (with keyboard hint chip), countdown-ring, stacked, upload-card, island, gradient-border, soft-light, message-actions.
- Themes `ios-glass` and `liquid-glass` (ios-glass-1 and 2, 12 variants): banner-light, banner-dark, capsule-success, island-call, hud-silent, system-alert, device-popup, grouped-stack, progress-ring, shake-error, focus-toggle, compact-action. These replace the generic ios-glass design from Prompt 3: keep the token engine, take the visuals from the references.
- Dialog themes (dialogs-1, 2, 3, 12 variants x light/dark): warning-confirm, danger-confirm, type-to-confirm, rename-prompt, success, update-info (stacked buttons), dark-logout, ios-glass-alert (divided buttons), bottom-sheet-confirm, reauth-password (with notice box), otp-code, session-countdown.
Public preset names must be neutral (do not use brand names such as Sonner, Vercel, Apple, WhatsApp, iOS 26 in identifiers or CSS classes; internal comments in design-inventory.md may mention the inspiration).

TASKS
1. Token extraction. Parse the HTML/CSS and list every colour, radius, border, blur, saturate, shadow, font stack, spacing, z-index, easing and duration. Deduplicate into --gk-* tokens plus per-theme token maps in src/themes/<theme>/tokens.ts. Generate the CSS from the token maps (single source of truth). Anything that cannot be a token (a one-off gradient) becomes a documented theme-private variable.
2. Variant system. Add `variant` to toast and dialog options and to the theme API: a theme declares which variants it supports and their structural templates. Calling a variant that the active theme lacks falls back to the theme's default and logs a dev-only warning. Document a matrix of theme x variant.
3. New toast capabilities required by these designs (implement in core types, web renderer and docs):
   - `badge` (icon chip with tone), `kbd` (keyboard hint chip like Esc), `timestamp` ("now", "2m ago", auto-updating with relative time formatting through Intl.RelativeTimeFormat, localisable).
   - `progress`: 'bar' | 'ring' | 'none', plus determinate `progressValue` (0..1) and `progressLabel` ("64%", "4.2 MB of 6.8 MB"); the toast stays open while progress is determinate unless duration is set; `ui.toast.update(id, { progressValue })` animates smoothly.
   - `actions`: array of buttons with `kind` (primary, secondary, ghost, danger), `onClick`, `autoDismiss`; single `action` stays as shorthand.
   - `toggle`: switch control inside a toast (role=switch, aria-checked, onChange).
   - `group` key: toasts with the same group collapse into one grouped stack with a summary line and a count ("3 new messages from Family"), expand on hover/focus/click, collapse back.
   - `shake` for error entrance (disabled for reduced motion), `glow`, `gradientBorder`, `avatar` with initials fallback and a deterministic colour from the name.
   - `island` shape: pill that morphs width/height between compact and expanded states (spring), with leading/trailing slots (avatar, equaliser bars, call buttons). Pure CSS + Web Animations, no runtime dependency.
   - `hud`: centred transient overlay (silent mode style) that does not steal focus, announced politely.
   - `countdown ring`: SVG ring that shows time left, paused on hover/focus, never announced every tick (announce start only).
4. New dialog capabilities required by these designs:
   - `buttonLayout`: 'row' | 'stack' | 'divided' (hairline-separated equal-width buttons as in the system alert).
   - `confirmText`: type-to-confirm; confirm button disabled until the typed value matches (option for case sensitivity); the expected text rendered in a code chip inside the label; input has `aria-describedby`.
   - `notice`: inline callout (icon + text, tone info/warning/danger) inside a dialog.
   - `input: 'otp'`: configurable length, numeric/alphanumeric, auto-advance, backspace navigation, paste distribution, `autocomplete="one-time-code"`, each box labelled "Digit n of N", single combined value returned, `onComplete`, resend link with cooldown timer and announcement.
   - `countdown`: live seconds text + progress bar inside the dialog, ends with dismiss reason `timer`, announces at 30, 10 and 5 seconds and on end, not every second, "Stay signed in" extends the timer through `handle.timer.add()`.
   - `ui.bottomSheet()` confirm variant: drag handle, icon chip, full-width primary + secondary buttons, swipe down to cancel.
   - Icon chips per tone (warning, danger, success, info, lock, upload, pencil, clock, shield) as our own SVG icons, tone-aware backgrounds in light and dark.
5. Implement every item in the inventory so that, at the reference viewport size, spacing, radius, font size/weight, colours, blur and shadows match within 2 px / visually indistinguishable. Use system-ui font stacks only; do not embed or fetch fonts.
6. Visual verification, mandatory:
   a. Build examples/design-compare: a page that shows each reference image (from design-refs) next to the live toastory render of the same item, at the same scale, with a diff overlay slider.
   b. Where an original HTML file exists, add Playwright tests that render the original HTML and the toastory component in the same viewport and background and compare with pixelmatch; threshold 3 percent of differing pixels (document the exceptions and why).
   c. Run it, show me the results table (item, diff percent, pass/fail) and fix failures until all pass or are justified.
7. Galleries. Recreate the layout of the reference sheets as examples/themes-gallery: numbered cards, a Replay button per card, a Toggle page theme button, a busy gradient background selector. Stacked and grouped demos must really expand on hover/focus.
8. Accessibility pass on the designs (do not copy a11y weaknesses from the references): ensure text and icon contrast meets AA in light and dark for every variant, adjusting tokens if necessary and recording each deviation from the reference in docs/design-inventory.md; keyboard access for every button, switch, OTP box and sheet; sensible roles (status/alert/dialog/alertdialog/switch/progressbar with aria-valuenow); reduced-motion alternatives for shake, spring, island morph, countdown ring and gradient animations; forced-colors and reduced-transparency fallbacks to solid surfaces.
9. Brand and asset hygiene: no third-party logos, app icons, copyrighted avatars, proprietary fonts or screenshots in the shipped package. Demo apps in examples use generic SVG icons and invented names.
10. Budgets: each theme CSS < 4 KB gzip (dialog styles in a separate file); island, ring, OTP, countdown, grouping and sheet logic must be lazy chunks so a plain toast import stays within the size budget in AGENTS.md. Add size-limit entries.
11. Update AGENTS.md (new options, variants, theme names, budgets), docs/parity.md and the TypeScript types, TSDoc and tests for every new option. Mirror the new options in React, Vue, Angular, Svelte wrappers (they must only forward options, no logic) and implement the closest equivalents in toastory/native; list in docs what is web-only (backdrop-filter nuances, island morph) and what fallback native uses.

CONSTRAINTS
- No copying of code from any third-party library or website; we recreate the look from the provided HTML/CSS (which is ours) and screenshots.
- No runtime dependencies. No images in the package except none (use SVG/CSS).
- Core stays UI-free; all new rendering logic lives in src/web (and src/native).
- Do not skip an item because it is hard; if an item is impossible say why and propose the smallest alternative.

ACCEPTANCE CRITERIA
- docs/design-inventory.md lists every design with status `done`.
- examples/design-compare and examples/themes-gallery work, diffs pass.
- axe: zero violations on all variants in light and dark; keyboard-only walkthrough passes for dialogs, OTP and sheet.
- `npm run check:all` green; size budgets met.

WHEN DONE
Report: item count, diff table summary, a11y deviations from references, size numbers, list of new public options, suggested commits (one per group: `feat(themes): essentials`, `feat(themes): showcase`, `feat(themes): ios glass variants`, `feat(dialog): reference dialogs and OTP/countdown`).
```

Keno eta Prompt 3 er age: oi prompt e theme engine ar token system banano hoy, ar ei prompt tar opor visuals boshay. Jodi ei prompt age chalao, Prompt 3 te "ios-glass design" ongsho ta skip korte bolo (`Prompt 3 e shudhu theme engine, tokens, contrast script ar visual regression koro; ios-glass, liquid-glass, aurora er visual ei Prompt D theke ashbe`).

## Prompt 3: Theme system and ios-glass

```markdown
GOAL
Build the theme system and the signature `ios-glass` and `liquid-glass` themes with premium quality. This is the visual identity of toastory.

READ FIRST
AGENTS.md (theme tokens), src/web, themes/_base.css.

TASKS

1. Theme engine: `theme` can be set globally via configure(), per call (`ui.toast('x', { theme: 'neon' })`), or by data attribute on a container. `mode` light/dark/auto. Dark mode applies via `prefers-color-scheme` AND via an explicit `data-gk-mode` attribute or `.dark` class on the document so apps with their own toggle work. Provide `ui.defineTheme(name, { tokens, css })` for custom themes and document the token list.
2. Token contract: every theme file only sets `--gk-*` variables under `[data-gk-theme="<name>"]` plus a small number of theme-specific rules. Base CSS must never hard-code colours.
3. `ios-glass` theme, designed like Apple system notifications:
   - background: translucent white (light) / translucent near-black (dark) at around 60-72% alpha;
   - `backdrop-filter: blur(var(--gk-blur)) saturate(var(--gk-saturate))` with -webkit- prefix, blur around 22px, saturate around 180%;
   - 1px inner border using a light gradient (top-left brighter), soft multi-layer shadow (a tight dark layer + a wide diffuse layer), continuous-corner feel via generous radius (about 20px);
   - typography: system font stack (-apple-system, SF Pro, Inter fallback), title 600 weight, description muted, tight line-height;
   - type indication through a coloured icon chip, not a full coloured background; rich-colors variant tints the glass subtly;
   - spring animation (a CSS linear() easing or cubic-bezier overshoot) for enter, quick ease-in for exit; stack scales and blurs lower cards slightly;
   - `@supports not (backdrop-filter: blur(1px))` fallback to an opaque colour with the same contrast;
   - high-contrast mode (`forced-colors`) and `prefers-reduced-transparency` fall back to solid backgrounds.
4. `liquid-glass` theme (iOS 26 inspired): stronger blur, specular highlight along the top edge (inset box-shadow + gradient), subtle refraction illusion using layered radial gradients, slightly larger radius, lighter borders, floating pill shape option.
5. `aurora` theme: glass plus a soft animated gradient glow behind the card (paused under reduced motion).
6. Token documentation: generate `docs/tokens.md` automatically from a TypeScript token map so docs and code never drift.
7. Contrast tooling: a script `scripts/contrast.ts` that renders each theme x mode x type, computes WCAG contrast of text and icon against the effective background (account for translucency over both white and black page backgrounds) and fails the build below 4.5:1 for text and 3:1 for UI icons.
8. Visual regression: Playwright screenshot tests per theme x mode x type x position at fixed viewport; store baselines.

CONSTRAINTS

- Each theme is its own CSS file < 3 KB gzip.
- No images; gradients and SVG only.
- Backdrop blur is costly: limit blur radius on mobile via a media query and `will-change` only while animating.

ACCEPTANCE CRITERIA

- Playground fixture page with a theme switcher shows ios-glass over a busy colourful background in light and dark and looks premium (judge: crisp edges, no banding, readable text over any background).
- Contrast script passes for all shipped themes.
- `npm run check:all` green.

WHEN DONE
Include screenshots paths, contrast report summary, commit `feat(themes): theme engine, ios-glass, liquid-glass, aurora`.
```

## Prompt 4: Dialog engine, confirm, alert

```text
GOAL
Implement the modal dialog renderer in src/web for `ui.confirm()` and `ui.alert()` with full accessibility, backdrop, positions, timers and result semantics. Dialog code must be a separate chunk so toast-only users never download it.

READ FIRST
AGENTS.md (dialog options, result shape), src/core dialog-manager, existing web renderer and themes.

PLAN FIRST
Describe DOM structure and the focus/keyboard model, then implement.

TASKS
1. Structure: backdrop element + `<div role="alertdialog" or "dialog" aria-modal="true" aria-labelledby aria-describedby>` inside a portal. Prefer the native `<dialog>` element with showModal() when available for top-layer, inert background and built-in Esc; keep a manual fallback (inert attribute or aria-hidden on siblings) so behaviour is identical in Electron and older browsers.
2. Focus management: trap Tab/Shift+Tab inside, initial focus configurable (`focusOn`: confirm | cancel | deny | input | none), danger tone defaults to focusing Cancel, restore focus to the previously focused element on close even if it was re-rendered.
3. Close paths: Esc (`allowEscape`), backdrop click (`allowOutsideClick`, ignore drag-select that starts inside), close button, programmatic handle.close(), timer expiry. Each maps to the exact `dismiss` reason.
4. Buttons: confirm, deny (optional), cancel (optional), each with label, colour token, aria-label, loading spinner state. `reverseButtons`, button order follows platform conventions option (`buttonOrder: 'auto'`). Enter submits confirm (not when focus is on textarea or on another button), double-submit protection.
5. Async flow: `preConfirm` / `preDeny` run with the button in loading state, other controls disabled, errors shown via `handle.showError(message)` in an aria-live region, dialog stays open on throw or `false`, returned value becomes `result.value`.
6. Icons: success (animated check), error (animated cross), warning, info, question, custom svg/Node; animations disabled under reduced-motion; icon is decorative (aria-hidden) while the title carries meaning.
7. Content: `title`, `text`, `html` (sanitised), `image`, `footer`, `width`, `padding`, `grow` (row, column, fullscreen), `draggable` by title bar with keyboard-accessible alternative (none needed beyond not blocking), `position` with all 15 placements, custom classes, `didOpen`/`willClose` hooks.
8. Timer: `timer` ms with optional `timerProgressBar`; pause on hover/focus; `handle.timer.pause|resume|add(ms)|remaining()`; auto-close reports dismiss reason `timer`.
9. Backdrop modes: blur (uses --gk-blur), dim, none, custom colour; scroll lock without layout shift (compensate scrollbar width, restore on close, nested-safe), iOS Safari scroll lock quirks handled.
10. Queue: only one modal at a time; later calls wait in the core queue; `priority` and `ui.dialog.closeAll()`. Toasts remain interactive above/below correctly (z-index layers via tokens).
11. Theming: add dialog styles to `basic`, `ios-glass`, `liquid-glass` (sheet-like rounded glass panel with vibrancy, grouped full-width buttons separated by hairlines like iOS alerts on small screens, side-by-side on wide). Dialog CSS in separate `dialog.css` per theme to stay tree-shakable.
12. Return value: promise resolving `{ isConfirmed, isDenied, isDismissed, value, dismiss }`; promise never rejects for user actions; programmatic errors reject.

CONSTRAINTS
- No inline event handler attributes, no innerHTML for user text.
- Must work in Shadow DOM mode.
- Dialog chunk < 6 KB gzip excluding theme CSS.

TESTS
Vitest + Playwright (3 browsers): focus trap with Tab loops, focus restore, Esc, backdrop click, Enter handling, async preConfirm success/failure/loading, double submit, timer pause/resume, nested/queued dialogs, scroll lock restore, screen-reader roles and labels via axe, forced-colors, RTL, mobile viewport.

ACCEPTANCE CRITERIA
- Keyboard-only walkthrough of confirm and alert passes without mouse.
- Zero axe violations in all shipped themes x modes.
- `npm run check:all` green; dialog chunk not included when only toast is imported (assert via a bundle-analysis test).

WHEN DONE
Report the dismiss-reason matrix tested, bundle sizes, commit `feat(web): confirm and alert dialogs`.
```

## Prompt 5: Prompt inputs, steps, sheets, overlay

```text
GOAL
Add `ui.prompt()`, `ui.steps()`, `ui.sheet()` (iOS action sheet), `ui.bottomSheet()` and `ui.loading()` on top of the dialog engine.

READ FIRST
AGENTS.md, src/core dialog-manager, src/web dialog renderer.

PLAN FIRST
List each input type with its DOM element, value type, validation hooks and a11y attributes.

TASKS
1. `ui.prompt()` input types: text, email, password (with show/hide toggle button, labelled), number (min, max, step), tel, url, search, textarea (rows, maxLength, live counter), select (options, optgroups, placeholder), radio group (fieldset + legend), checkbox (single and group), range (live value output), date, time, datetime-local, week, month, file (accept, multiple, size limit, drag-drop zone with keyboard activation). Typed values: return `string | number | boolean | string[] | File[]` according to input type via overloads/generics so `await ui.prompt({input:'number'})` gives `number`.
2. Labels and descriptions: every input has a real `<label>`, optional hint text linked with aria-describedby, required marking, autocomplete attribute option, `inputAttributes` passthrough allowlist, `inputValue`, `placeholder`.
3. Validation: sync or async `validate(value)` returning true | false | string message; native constraint validation integrated; validation runs on submit and optionally on input/blur (`validateOn`); error shown below the field with `aria-invalid`, `aria-errormessage` and an aria-live announcement; focus moves to the invalid field; `handle.showError()` for server errors; debounce for async validation with cancellation of stale results.
4. `ui.steps([...])`: sequence of prompts/dialogs with progress indicator (dots or `n of m` text, announced to screen readers), back button, per-step validation, shared state object, early exit, returns `{ completed, values[], dismiss }`. Keyboard: Enter next, Esc cancel.
5. `ui.sheet()` (iOS action sheet): title/message, list of actions (default, destructive in red, disabled), separated Cancel button, selection returns the chosen action id; arrow-key navigation (roving tabindex) and type-ahead; on desktop render as a compact popover-style sheet centred, on mobile anchored to the bottom.
6. `ui.bottomSheet()`: draggable panel with handle, snap points (percentages or px), velocity-based settle, overscroll containment, content slot (Node / html / render fn), close on drag-down, keyboard accessible (handle is a button: Enter toggles snap points; Esc closes), `aria-modal` when it covers content, focus trap only in modal mode.
7. `ui.loading()`: blocking overlay with spinner, optional text and determinate progress (`handle.setProgress(0..1)`), optional cancel button, `aria-busy`, announces start and completion politely; prevents background interaction; returns handle with `close()` and `update()`.
8. Add styles for all of these to `basic`, `ios-glass`, `liquid-glass`.
9. Update `AGENTS.md` only if a public name changed, and tell me.

CONSTRAINTS
- File inputs never read file contents; only expose File objects.
- Password field value must not be logged or kept after resolve.
- Each component lives in its own lazy chunk.

TESTS
Per input type: render, labels, typed value, validation sync/async, stale async cancel, keyboard use, axe. Steps: back/next/skip, state sharing, abort. Sheet: arrow keys, destructive, cancel. Bottom sheet: drag, snap, keyboard. Loading: progress and a11y announcements.

ACCEPTANCE CRITERIA
- A demo page exercises every input type and every sheet with mouse, touch and keyboard.
- `npm run check:all` green, zero axe violations.

WHEN DONE
List the exact TypeScript overload signatures of prompt(), commit `feat(web): prompt, steps, sheets, loading overlay`.
```

## Prompt 6: Remaining themes and parity audit

```text
GOAL
Implement all remaining themes so users can recreate the look of the market leaders and more, then audit the whole library against the parity list.

READ FIRST
AGENTS.md, existing themes (basic, ios-glass, liquid-glass, aurora), token docs.

TASKS
1. Implement these themes as separate CSS files, each supporting toast and dialog parts, light/dark/auto, tokens only, each < 3 KB gzip:
   - `classic-stack`: clean white/black rounded card, soft shadow, stacked-cards animation, optional rich-colours variant. Style goal: minimal modern card like popular React stack-style toasts.
   - `classic-bar`: solid coloured card with left icon, bottom progress line, Slide/Bounce/Zoom/Flip transitions, light, dark and colored variants. Style goal: the familiar progress-bar toast.
   - `pill`: small centred rounded pill with icon, pop animation, minimal text.
   - `ripple`: thin coloured bar with a ripple reveal animation and dismiss button.
   - `gradient-strip`: gradient background strip with optional avatar and close icon.
   - `sweet`: centred modal dialog with large round animated icon (check, cross, exclamation, question), large buttons, timer progress bar; also a `toast` variant in a corner.
   - `material`: snackbar at the bottom with text action button, elevation shadow, Material 3 colours.
   - `minimal`, `flat`, `outline`: restrained designs for dense UIs.
   - `neon` (dark base + glow border), `gradient` (bold per-type gradient), `brutal` (thick border + hard offset shadow), `pastel` (soft colours).
   Original designs only: recreate the visual style from your own CSS and tokens; do not reproduce any third-party stylesheet, icon set, class names or text.
2. Add a themes gallery page (examples/themes) showing every theme x mode x toast type x dialog type, plus a token inspector panel that edits `--gk-*` live.
3. Parity audit: create `docs/parity.md` listing every feature from the AGENTS.md toast and dialog option lists plus these competitor features: type shortcuts, promise toast with unwrap, update by id, custom body (JSX/DOM), rich colours, invert, stacking and expand, visible-toasts limit, swipe and drag-percent, progress bar toggle, pause on hover/focus-loss/hidden, hotkey focus, close button and dismissible, lifecycle callbacks, custom icons and avatar, RTL, multiple containers, classNames/unstyled/headless, href/destination, HTML escaping and sanitising, ariaLive/role/labels, custom types, dismissAll, confirm/deny/cancel with result flags, dialog icons, 18 input types, validation and preConfirm/preDeny, timer controls, steps, 15 positions, backdrop options, draggable, grow, footer, image, themes. For each: status (implemented / partial / missing), file and test that proves it. Then fix every missing or partial item in this same task.
4. Add a `ui.toast.types.add()` example theme-aware custom type in docs.

ACCEPTANCE CRITERIA
- Visual regression baselines exist for every theme x mode.
- Contrast script passes for all themes.
- docs/parity.md has zero `missing` or `partial` rows.
- `npm run check:all` green. Size budget still met (each theme < 3 KB gzip).

WHEN DONE
Paste the parity table summary and commit `feat(themes): complete theme catalog and parity audit`.
```

## Prompt 7: React and Next.js

```text
GOAL
Build `toastory/react`: a thin, idiomatic React 18/19 binding that works in Vite, Create React App-style setups, Next.js App Router, Next.js Pages Router and Remix.

READ FIRST
AGENTS.md, src/core, src/web.

TASKS
1. Components and hooks in src/react:
   - `<Toaster />` renders the web renderer's container through a portal; props mirror ui.configure (theme, mode, position, duration, maxVisible, gap, stack, closeButton, richColors, dir, hotkey, offset, toastOptions, icons, containerAriaLabel, id for multiple containers). It must be safe to render once at the app root.
   - `<GlazeProvider>` optional wrapper for scoped instances (`createUI()`), plus `useUI()` returning the instance.
   - `useToasts()` built on `useSyncExternalStore` returning the live list (headless use) and `useToast()` returning stable bound methods.
   - Render-prop / JSX support: `ui.toast.custom((t) => <MyToast {...t} />)`, JSX in title/description/icon/action label. JSX is rendered into the toast DOM via createRoot/portals without leaking roots (unmount on dismiss).
   - `useConfirm()`, `usePrompt()` helpers returning promise functions; `<ConfirmDialog>` declarative variant controlled by `open` for people who prefer state-driven UI.
2. Entry file begins with the `'use client'` directive (via build banner) and each component file that needs it is client-only. Provide `toastory/react/server` safe exports (types and `ui` stub) so Server Components can import types without errors.
3. Next.js specifics: SSR renders nothing for toasts; no hydration mismatch (verify by running Next with strict mode); toasts triggered in Server Actions: provide a documented pattern (return a serialisable `{ toast: {...} }` object or use a small `<ToastFromServer>` component / `useActionState` helper that fires on the client). Works with Turbopack and webpack, with React Compiler on, and with StrictMode double mounting.
4. Theme CSS import strategy documented: `import 'toastory/themes/ios-glass.css'` in layout.tsx; also support auto-injected CSS option (`injectStyles: true`) for users who cannot import CSS.
5. Types: ensure generics flow (prompt input types), `ui.toast.promise` infers result type, JSX content typed as ReactNode.
6. Examples: examples/vite-react, examples/next-app-router, examples/next-pages with a page demonstrating every feature (toast types, promise, confirm, prompt, steps, sheets, theme switcher, RTL).

CONSTRAINTS
- No react-dom/client import in code paths that run on the server.
- No re-render storms: toast list updates must not re-render unrelated components (selector-based hooks).
- React is an optional peer; support react >= 18.

TESTS
React Testing Library for hooks and components; Playwright e2e on both Next.js examples (build + start): no hydration warnings in console, toasts work after client navigation, Server Action pattern works; axe.

ACCEPTANCE CRITERIA
- Both Next examples build with `next build` and pass e2e. Zero console errors or hydration warnings.
- `npm run check:all` green.

WHEN DONE
Show the minimal usage snippet for Vite, Next App Router and Pages Router, commit `feat(react): React and Next.js bindings`.
```

## Prompt 8: Vue, Nuxt, Angular, Svelte

```text
GOAL
Build the Vue 3, Nuxt, Angular and Svelte bindings. They must stay thin (target < 150 lines each of binding logic) because the web renderer does the real work.

READ FIRST
AGENTS.md, src/core, src/web, src/react (for naming parity).

Do these four as four separate sub-tasks in order, running `npm run check:all` and committing after each.

A. VUE 3 + NUXT (`toastory/vue`)
1. `GlazePlugin` (app.use) installing the instance via provide/inject, optional global `$glaze`. Component `<GlazeToaster>` with the same props as the React Toaster. Composables: `useUI()`, `useToasts()` (shallowRef bound to the store, unsubscribed on scope dispose), `useConfirm()`, `usePrompt()`.
2. Custom content via slots and render functions (`h()`), rendered into toast DOM with `render()`/Teleport without leaking app instances.
3. Nuxt: a small module `toastory/nuxt` (entry in package exports) that registers the plugin client-only, auto-imports composables, injects chosen theme CSS from module options. SSR safe.
4. Example: examples/vite-vue and examples/nuxt.

B. ANGULAR (`toastory/angular`) for Angular 16+ (standalone first)
1. `provideToastory(config)` environment providers, `GlazeService` (injectable) wrapping the `ui` API with NgZone-aware callbacks (run user callbacks inside the zone, run renderer animation work outside it for performance), `GlazeToasterComponent` (standalone, OnPush) for scoped containers, signals API (`toasts = signal<...>`) plus RxJS Observable `toasts$`.
2. Support custom content via `TemplateRef` and component classes (create components dynamically with `createComponent` and attach to the toast DOM; destroy on dismiss).
3. Packaging: must be consumable without ng-packagr partial-Ivy issues; verify by building an Angular 16, 17, 18, 19 and 20 example app (use a script that matrix-installs) in both SSR (Angular Universal/SSR) and CSR mode. No `window` access on server.
4. Example: examples/angular (standalone) and note NgModule compatibility with `ToastoryModule.forRoot()`.

C. SVELTE (`toastory/svelte`) for Svelte 4 and 5
1. `<Toaster />` component, a `toasts` readable store (Svelte 4 store contract works in Svelte 5), `getUI()`, helpers for confirm/prompt. For Svelte 5 also export rune-friendly `useToasts()` returning reactive state.
2. Custom content via snippets (Svelte 5) and component constructors (Svelte 4/5) mounted/unmounted correctly.
3. SvelteKit SSR safe. Example: examples/sveltekit.

CONSTRAINTS
- All four wrappers expose identical option names and results as the core; do not invent framework-specific variants.
- Each wrapper's types must be tested with `tsd`/`expectTypeOf`.

TESTS
Per framework: component test (Vue Test Utils, Angular TestBed, Svelte Testing Library), SSR render test (no errors, no toast markup), and a Playwright smoke test on each example.

ACCEPTANCE CRITERIA
- All examples build and pass e2e; `npm run check:all` green; wrapper sizes reported by `npm run size`.

WHEN DONE
Give a table: framework, entry, bytes gzip, supported versions tested, plus four commit messages `feat(vue): ...`, `feat(nuxt): ...`, `feat(angular): ...`, `feat(svelte): ...`.
```

## Prompt 9: React Native

```text
GOAL
Build `toastory/native`: a React Native (Expo and bare, New Architecture compatible, iOS + Android) renderer that shares src/core with the web build but has its own native UI, including an iOS glass look.

READ FIRST
AGENTS.md, src/core, src/react (hooks naming), and the API contract. The native entry may only import from src/core and React Native, never from src/web.

PLAN FIRST
Decide and document: how toasts and dialogs are hosted (a root `<GlazeProvider>` rendering an overlay host above the app, using a `Modal`-free layered View with `pointerEvents="box-none"` for toasts and `Modal` or a full-screen overlay for dialogs), animation strategy, optional-peer detection.

TASKS
1. `<GlazeProvider>` + `<Toaster />`: safe-area aware (react-native-safe-area-context if present, else built-in fallback), keyboard-aware, works inside native modals via a second host option (`<GlazeHost />` placeable inside a Modal).
2. Toasts: same options as web where meaningful (type, title, description, icon, action, cancel, duration, position top/bottom/center, promise, update, dismiss, dedupe, progress, swipe to dismiss, stacking). Animations: Reanimated if installed (optional peer) else built-in `Animated` with native driver. Gestures: PanResponder fallback, react-native-gesture-handler when present.
3. Dialogs: confirm, alert, prompt (text, number, password, email, textarea, select via action list), steps, action sheet, bottom sheet (drag, snap points), loading overlay. Return the same `DialogResult` shape.
4. Glass: `ios-glass` and `liquid-glass` themes use `expo-blur` BlurView (or `@react-native-community/blur`) when installed, with tint/intensity from tokens; on Android where real blur is limited, fall back to a translucent surface with the same contrast; detect via Platform and feature check. `solid` fallback when blur missing. Provide the same token names as CSS (`--gk-*` map to a JS theme object) and the same theme names; native-specific `ios-native` (system-like) and `android-native` (Material 3 snackbar) themes.
5. Haptics: optional `expo-haptics` (or `react-native-haptic-feedback`): success/warning/error notification haptics, selection haptic on sheet item, configurable `haptics: true|false|'auto'`.
6. Accessibility: `accessibilityLiveRegion` (Android), `AccessibilityInfo.announceForAccessibility` (iOS) for toasts, `accessibilityRole`, `accessibilityViewIsModal`, focus handling for dialogs, respect `AccessibilityInfo.isReduceMotionEnabled` and `isReduceTransparencyEnabled`, Dynamic Type / font scaling with max multiplier, dark mode from `useColorScheme`, RTL via I18nManager, hit slop >= 44pt for buttons.
7. Hardware back button on Android closes the top dialog (respecting allowEscape). Status bar / navigation bar overlap handled.
8. No native module of our own: the package stays pure JS so it works in Expo Go when optional peers are Expo-Go-compatible; document which optional peers require a development build.
9. Examples: examples/expo (Expo SDK latest, Expo Router) and examples/bare-rn with a demo screen for every feature and theme switcher.

CONSTRAINTS
- No imports from DOM or `src/web`. No deprecated RN APIs (no `findNodeHandle`, no legacy `Animated` events that break on New Architecture).
- Optional peers resolved with guarded `require` in try/catch so Metro does not fail when they are absent; document metro config if needed.
- Keep JS thread work minimal; animations on the UI thread when possible.

TESTS
Jest + React Native Testing Library: provider mounting, toast lifecycle, dialog results, prompt validation, steps, sheet, back-button, reduced-motion path, fallback paths with each optional peer mocked absent. Detox or Maestro flow for the Expo example on iOS simulator and Android emulator (script + CI job definition, may run manually).

ACCEPTANCE CRITERIA
- Expo example runs on iOS simulator and Android emulator showing all components; screenshots attached to docs.
- `npm run check` green including native unit tests; bundle size for toastory/native reported.

WHEN DONE
List each optional peer, what degrades without it, and commit `feat(native): React Native renderer`.
```

## Prompt 10: Electron, tests, accessibility, performance

```text
GOAL
Harden the whole library: Electron support, cross-browser tests, real accessibility verification, performance and bundle budgets, security review. Fix everything you find in this same task.

READ FIRST
AGENTS.md and docs/parity.md.

TASKS
1. ELECTRON: create examples/electron (main + preload + renderer, contextIsolation on, sandbox on, no nodeIntegration). Show toasts and dialogs in the renderer. Verify `backdrop-filter` glass works, Esc/focus behaviour matches the browser, hotkey does not collide with Electron menu accelerators, and notifications stay inside the renderer window. Add an optional helper `toastory/electron` exposing a typed `bridge` that lets the main process request a toast/dialog via IPC (`ipcMain` side helper + preload exposure), with strict channel allowlists and input validation. Document native vibrancy/mica as an optional window-level enhancement in docs (we do not ship native code).
2. CROSS-BROWSER: Playwright projects chromium, firefox, webkit, plus mobile emulation (iPhone, Pixel). Fix browser-specific issues (Safari backdrop-filter prefix, Firefox scroll lock, iOS viewport units, `<dialog>` quirks).
3. ACCESSIBILITY AUDIT: automated axe on every theme x mode x component state. Then write a manual test script `docs/a11y-checklist.md` (NVDA + Firefox/Chrome, JAWS note, VoiceOver macOS Safari, VoiceOver iOS, TalkBack) with expected announcements for toast types, dialogs, validation errors, steps, sheets. Implement any fixes revealed by automated tests: names, roles, focus order, live-region timing (insert container before content), contrast, target size >= 24x24 CSS px (44 on touch), zoom to 400% without loss, text spacing override, forced-colors support, reduced-motion and reduced-transparency.
4. PERFORMANCE: benchmark suite (tests/perf) that creates 1, 10, 50 and 200 toasts and opens/closes dialogs 100 times, measuring scripting time, long tasks, layout count and heap growth with Playwright tracing. Fix leaks (listeners, timers, ResizeObserver, detached nodes). Budgets: no long task > 50 ms for 50 toasts, zero detached DOM nodes after dismissAll, heap stable after 1000 create/dismiss cycles. Publish results into docs/benchmarks.md.
5. BUNDLE: run size-limit for every entry; verify tree-shaking with a test that bundles `import { ui } from 'toastory'; ui.toast('x')` using esbuild/rollup and asserts dialog and sheet code absent. Check ESM/CJS dual-package hazards (single store instance across formats), verify `publint` and `@arethetypeswrong/cli` pass for every subpath.
6. SECURITY: review all places that touch HTML (sanitiser defaults, `html` option, attribute allowlist for `inputAttributes`, `href` protocol allowlist: http, https, mailto, tel; block javascript:), Shadow DOM CSS injection with CSP nonce support (`cspNonce` option), no eval, no inline scripts, Trusted Types compatible. Add tests with XSS payload corpus.
7. COMPAT MATRIX: document and test supported browsers (last 2 versions of evergreen browsers, Safari 15.4+), React 18/19, Vue 3.3+, Angular 16-20, Svelte 4/5, Node LTS, Expo SDK latest.

ACCEPTANCE CRITERIA
- `npm run check:all` green on CI matrix; publint and attw clean; perf budgets met; a11y automated suite zero violations; docs/a11y-checklist.md, docs/benchmarks.md, docs/security.md written.

WHEN DONE
Summarise each defect found and fixed, show the perf table, commit `chore: hardening, electron, a11y, perf, security`.
```

## Prompt 11: Docs site, playground, release

```text
GOAL
Ship the documentation website with a live playground, write the README, and prepare the first public release (beta then 1.0). Marketing assets matter: for a design-focused library the demo is most of the pitch.

READ FIRST
AGENTS.md, docs/*.md, examples/*.

TASKS
1. DOCS SITE in /docs-site using Astro Starlight (or VitePress if you justify it). Sections: Introduction, Installation per platform (plain JS/CDN, React, Next.js, Vue, Nuxt, Angular, Svelte, Electron, React Native), Quick start, Toast guide, Dialog guide (confirm, alert, prompt, steps, sheets, loading), Theming (token reference generated from code, how to define a theme, dark mode, custom CSS, Shadow DOM), Accessibility, SSR and Server Actions, Migration guides (from Sonner, React-Toastify, react-hot-toast, Toastify-js, Notyf, SweetAlert2 with side-by-side code and an option mapping table), FAQ, API reference generated from TSDoc (TypeDoc) so it cannot drift, Changelog, Contributing.
2. PLAYGROUND page: live, in-browser, no build step. Left controls (theme, mode, position, stack mode, duration, rich colours, RTL, toast type, title, description, action, promise simulation, dialog type, input type), right preview over a selectable busy background, plus a live code panel that outputs the exact snippet for the chosen framework (tabs: JS, React, Vue, Angular, Svelte, React Native) with copy button. Shareable URL state.
3. THEME GALLERY page generated from the same registry, with a screenshot grid and "copy theme config".
4. COMPARISON page: honest table vs Sonner, React-Toastify, react-hot-toast, Toastify-js, Notyf, SweetAlert2 (frameworks supported, dialogs included, accessibility results, bundle size measured by us with the script and date). Only state facts we verified; link sources.
5. README: hero GIF/video placeholder generated from Playwright (script `npm run record:demo` produces mp4/gif), badges (npm, bundle size, CI, license, types), 30-second quick start per framework, feature list, themes preview strip, accessibility statement, comparison summary, links to docs and playground, sponsor/contributing notes.
6. RELEASE PREP: finalise Changesets config, version 1.0.0-beta.0 on the npm `next` tag, `npm publish --provenance` workflow dry-run, `npm pack` inspection, license headers check, CITATION and SECURITY files, GitHub topics list and repo description, Open Graph image, a `CHANGELOG.md`, `docs/release-checklist.md` (reserve name, 2FA, tokens, tags, rollback with `npm deprecate`, announcement draft for X, Reddit r/javascript r/reactjs, Dev.to, Hacker News Show HN).
7. Deploy: GitHub Pages or Cloudflare Pages workflow for docs-site; preview deploys on PRs.

CONSTRAINTS
- Playground and docs must consume the built package (workspace link or packed tarball), not source files, so we test what users get.
- Lighthouse >= 95 for performance, accessibility, best-practices, SEO on docs home and playground.
- Every code sample in docs is type-checked in CI (extract with a script) so samples never rot.

ACCEPTANCE CRITERIA
- `npm run docs:build` passes, link checker finds no broken links, Lighthouse thresholds met, samples compile.
- A fresh clone can follow the README quick start for each framework and it works.

WHEN DONE
Give the docs URL structure, Lighthouse scores, release checklist status, commit `docs: site, playground, release preparation`.
```

## Prompt R: npm page and README quality (Prompt 11 er sathe)

Tomar `nagad-client` npm page reference: TypeScript badge, 0 dependencies, badges (CI passing, npm version, license), provenance ("Built and signed on GitHub Actions"), repository + homepage (docs site) link, ekta "Why" section, install section. Toastory er page o ei standard e, ar tar theke ektu beshi hobe.

```text
GOAL
Make the toastory npm page and GitHub repository look and verify like a trusted professional package, matching the quality shown in design-refs/npm-page-reference.png (view it first).

READ FIRST
AGENTS.md, README.md, package.json, .github/workflows/*, design-refs/npm-page-reference.png.

TASKS
1. package.json metadata: `description` (one sentence, includes toast, confirm, prompt, glass), `keywords` (max 20, relevant: toast, notification, snackbar, dialog, modal, confirm, prompt, alert, sweetalert, glassmorphism, ios, liquid-glass, react, nextjs, vue, nuxt, angular, svelte, react-native, electron, accessible, typescript), `homepage` (docs site URL), `repository` {type, url, directory?}, `bugs`, `author`, `funding` (if I provide one), `license` MIT, `engines`, `types` plus `exports` conditions so npm shows the TypeScript badge and the Types tab resolves for every subpath, `sideEffects`, zero `dependencies`.
2. Provenance: finalise `.github/workflows/release.yml` with `permissions: id-token: write, contents: write`, `npm publish --provenance --access public` on tag/Changesets release, so the npm page shows "Built and signed on GitHub Actions". Document in CONTRIBUTING how to set NPM_TOKEN (automation token) and enable 2FA. Never print secrets.
3. README for the npm page (npm renders GitHub-flavoured Markdown, strips most HTML, and needs absolute URLs for images): structure exactly as below.
   - Title and one-line description with links.
   - Badge row: CI passing, npm version, license MIT, bundle size, types included, provenance (all via shields.io with absolute URLs, no more than 7).
   - Short "Unofficial and independent" style note only if we mention third-party names in comparisons (not affiliated with Sonner, React-Toastify, SweetAlert2 and others), in a blockquote.
   - Line: Documentation, Playground, Issues links.
   - `## Why` section with 4 to 6 bullets, each starting with a bold claim then one plain sentence (examples: one API for every platform; accessible by default with keyboard-reachable close buttons; glass themes included; zero dependencies and tree-shakable; promise-based dialogs; honest, typed results).
   - `## Install` with npm, pnpm, yarn, bun tabs as separate code blocks.
   - `## Quick start` per platform: plain JS, React, Next.js, Vue, Nuxt, Angular, Svelte, Electron, React Native. Each under 12 lines and tested.
   - `## Themes` with an image strip (absolute URL to files on the default branch served by raw/CDN or GitHub Pages) and a link to the gallery.
   - `## Features` compact table, `## Accessibility`, `## Browser and framework support`, `## Comparison` (verified facts only), `## Migrating`, `## Contributing`, `## License`.
   - Keep the README under about 350 lines; deep content goes to the docs site.
4. README verification script `npm run readme:check`: validates that all links are absolute and reachable (except localhost), all code blocks compile or are marked `text`, images exist, and badge URLs resolve.
5. Repo polish: description and topics (npm package topics, frameworks), social preview image (1280x640 generated from the theme gallery), `FUNDING.yml` only if applicable, issue forms (bug, feature, question), PR template, SECURITY.md with a contact, CODEOWNERS, release notes template, `docs/` deployed and set as `homepage`.
6. First publish procedure `docs/release-checklist.md`: reserve the name with a 0.0.1 placeholder only if the name is free (`npm view toastory` returns 404), then `1.0.0-beta.0` on the `next` tag, verify the npm page (badges, README render, provenance, files list, types), then promote to `latest` for 1.0.0. Include rollback (`npm deprecate`), unpublish window rules and how to verify `npm pack` contents.
7. Adoption signals the page can show honestly: provenance, 0 dependencies, types, size badge, CI, license, docs link, changelog link. Do not fake downloads, stars, testimonials or statistics.

ACCEPTANCE CRITERIA
- `npm pack` and `npm publish --dry-run --provenance` succeed in CI dry-run mode.
- A preview of the README rendered with a GitHub-flavoured Markdown renderer has no broken images/links.
- `npm run readme:check` passes. Package page checklist (badges, types, 0 deps, homepage, repo, provenance) is ticked in docs/release-checklist.md.

WHEN DONE
Show the final package.json metadata block, the README outline, and commit `docs: npm page, README and release metadata`.
```

## Prompt W: Professional website and full docs

Ei prompt ta Prompt 11 er docs site ongsho (item 1 theke 4) ke **replace** kore, karon eta beshi detail e. Prompt 11 er baki ongsho (README, release prep) ar Prompt R agey moto thakbe. Chalanor shomoy: Prompt 10 er por (jokhon package, theme, dialog, framework wrapper shob ready), Prompt D ar Prompt R er por. Karon website nijei toastory use kore baniye dekhabe, tai package ready na hole website banano jabe na.

**Age tomar kache theke ja lagbe (prompt er shurute AI ke bole dao ba prompt e boshiye dao):**

| Jinish                   | Example                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| Domain / site URL        | `toastory.tashanto.com` (na thakle placeholder, AI `SITE_URL` env variable rakhbe) |
| GitHub repo URL          | `github.com/<username>/toastory`                                                   |
| Logo                     | SVG file (na thakle AI ekta simple wordmark baniye dibe, `design-refs/logo/`)      |
| Author / maintainer naam | tomar naam                                                                         |
| Brand colour             | ekta accent colour (na thakle AI glass-friendly blue-violet nibe)                  |
| Language                 | English (recommended); Bangla pore add korte paro                                  |

```text
GOAL
Build the official toastory website: a premium marketing site plus complete documentation, plus a live playground, all in one deployable project. The site must show every feature of the package properly, with real working demos powered by the built toastory package itself (dogfooding). It must feel like the website of a serious, popular open-source library: fast, beautiful, accessible, searchable, and trustworthy.

READ FIRST
1. AGENTS.md (all of it), docs/parity.md, docs/design-inventory.md, docs/a11y-checklist.md, docs/benchmarks.md, docs/security.md.
2. design-refs/ images and design-refs/html/ (visual language to reuse in demos), and design-refs/logo/ if present.
3. The public API in src/ (types and TSDoc) and examples/*. The docs must match the code exactly.

PLAN FIRST
Before code, write website/PLAN.md with: chosen stack and why, sitemap, page-by-page content outline, component list, design tokens, content-source map (what is generated from code vs hand-written), performance and accessibility budgets, deployment plan. Show it, then implement.

STACK (decide and justify, default below)
- Astro + Starlight for docs (static output, fast, built-in search via Pagefind, i18n-ready, dark/light, MDX). Custom Astro pages and islands for the marketing home, playground and gallery. Framework islands (React for the playground UI) are allowed only where interactivity needs them and must be lazy (client:visible / client:idle).
- API reference generated by TypeDoc (typedoc-plugin-markdown) from TSDoc into the docs on every build, so the reference cannot drift.
- The site installs toastory from the packed tarball (`npm pack`) or workspace link, never from source paths, so we test what users get.
- Node 20+, TypeScript strict, ESLint, Prettier, the same `npm run` conventions as the package. Website lives in /website with its own package.json; root scripts: `website:dev`, `website:build`, `website:check`.

DESIGN DIRECTION
- Visual identity: the site itself uses the glass look. Soft mesh-gradient backgrounds, frosted cards, thin luminous borders, generous whitespace, large confident type, subtle depth. Dark mode is the hero look; light mode must be equally polished. Respect `prefers-color-scheme` with a manual toggle (system / light / dark) that persists.
- Tokens: reuse --gk-* tokens where relevant and define --site-* tokens for layout, type scale (fluid clamp), spacing scale, radii, shadows, motion. One accent colour plus semantic colours. No more than two font families; use system-ui stacks or self-hosted open-licence fonts (e.g., Inter) with `font-display: swap` and subsetting; never load fonts from a third-party CDN at runtime.
- Motion: purposeful, 150-400 ms, spring or ease-out, never blocks reading; everything disabled or simplified under `prefers-reduced-motion`.
- Responsive from 320 px to 2560 px; touch targets >= 44 px; no horizontal scroll; navigation collapses cleanly on mobile.
- Accessibility: WCAG 2.2 AA. Skip link, landmarks, visible focus rings, logical heading order, keyboard-operable everything (including the playground and theme switcher), accessible names for icon buttons, colour contrast verified in both modes, no information by colour alone, alt text for images, captions/transcripts if any video.
- No stock photos. Use generated gradients, SVG illustrations and real library demos. No fake logos, no fake testimonials, no invented statistics or download counts.

SITEMAP AND PAGE CONTENT
1. Home `/`
   - Hero: headline stating the promise (all feedback UI in one package, premium glass, every framework), short subline, primary CTA (Get started), secondary CTA (Open playground), copyable install command with package-manager tabs (npm, pnpm, yarn, bun), small badge row (npm version, bundle size, types, zero dependencies, license, CI, provenance).
   - Live hero demo: a real toastory toast and dialog stack running on an animated mesh background; buttons that fire different toast types, a dialog and a promise toast; theme switcher chips that restyle everything instantly (ios-glass, liquid-glass, essentials, showcase, neon, sweet...). Works with keyboard and touch.
   - "Every platform" section: framework tabs (JavaScript, React, Next.js, Vue, Nuxt, Angular, Svelte, Electron, React Native) showing the same 8-line quick start for each, with copy buttons, and a statement that API and options are identical everywhere.
   - Feature sections with live, interactive mini demos (not screenshots): toasts (types, promise, update, actions, progress, stacking and hover expand, swipe), dialogs (confirm, danger, type-to-confirm, prompt with all input types, OTP, countdown, bottom sheet, action sheet, steps), themes gallery strip with live theme switching, accessibility (keyboard-only demo, screen reader live-region explanation, reduced motion toggle), performance and size (measured numbers imported from docs/benchmarks.md and size-limit output at build time, with the date), TypeScript (typed prompt results with an editor-style snippet), customisation (token editor that changes a toast live and outputs the CSS).
   - Comparison section: an honest table versus Sonner, React-Toastify, react-hot-toast, Toastify-js, Notyf and SweetAlert2: frameworks, dialogs included, accessibility test results we ran, bundle size we measured (script, method and date shown), licence. Facts must be verified and sourced; unknown cells say `not verified` rather than guessing. Add a not-affiliated notice.
   - Migration teaser linking to guides for each library.
   - Trust section: provenance badge note, zero dependencies, tests and CI, changelog, open source licence, security policy. Only real signals.
   - Final CTA and footer (docs, playground, GitHub, npm, changelog, security, licence, sitemap, privacy note).
2. Features `/features` : a full catalogue page, each feature with a short description, a live demo, the API snippet and a link to its docs page. Group: Toasts, Dialogs, Inputs, Sheets and overlay, Themes and tokens, Accessibility, Frameworks, Performance, Security.
3. Themes `/themes` : gallery of every theme x variant x light/dark generated from the theme registry, numbered cards with Replay, filters (toast, dialog, glass, minimal, fancy), per-item `Copy config` and `Open in playground`, background selector, a11y contrast badge from the contrast report.
4. Playground `/playground` : controls panel (theme, variant, mode, position, stack mode, duration, rich colours, RTL, toast type, title, description, actions, progress, promise simulation, dialog type, input type, OTP length, countdown, etc.), live preview over selectable backgrounds, live code panel with tabs JS, React, Vue, Angular, Svelte, React Native generating the exact snippet, copy button, share URL (state in the URL hash, versioned), reset, export JSON config. Keyboard accessible and mobile friendly. Includes an `Open in StackBlitz` link per framework using ready example projects if feasible.
5. Docs `/docs/*` (Starlight):
   - Getting started: Introduction, Why toastory, Installation per platform (CDN, JavaScript, React, Next.js App Router and Pages, Vue, Nuxt, Angular, Svelte and SvelteKit, Electron, React Native Expo and bare), Quick start, Project setup checklist, Playground link.
   - Guides: Toasts (all options with live examples), Promise toasts, Updating and dismissing, Custom content (HTML, DOM, JSX, Vue, Angular templates, Svelte), Stacking and positioning, Swipe and gestures, Progress and countdown, Grouping, Dialogs (confirm, alert), Prompt and all input types, Validation and async confirm, Steps, Action sheet and bottom sheet, Loading overlay, Island and HUD, Timers, Queueing and multiple containers, Server Actions and SSR, Shadow DOM and CSP, Haptics and React Native specifics, Electron integration.
   - Theming: Theme overview, Token reference (generated), Creating a theme with `defineTheme`, Dark mode and `mode`, Variants, Overriding with CSS, Unstyled and headless usage, Fonts and icons, Glass effect and fallbacks.
   - Accessibility: Principles, Live regions and roles, Keyboard map (table), Focus management, Reduced motion and transparency, Forced colors, Screen reader testing notes, Known limitations (honest).
   - Recipes: Form submit feedback, Optimistic UI with undo, File upload progress, Delete with type-to-confirm, Session timeout, OTP verification, Offline banner, Notification centre from `getHistory`, Global error handler (Axios/fetch interceptors, React error boundary, Angular ErrorHandler, Vue errorHandler), Next.js Server Action toast pattern.
   - Migration: from Sonner, React-Toastify, react-hot-toast, Toastify-js, Notyf, SweetAlert2, each with side-by-side code and an option mapping table. Facts must be checked against those libraries' current docs and linked; mark anything unverified.
   - API reference: generated from TSDoc for every export and subpath; each option has type, default, description, example, since-version; search works inside it.
   - Frameworks reference pages, Browser and framework support matrix (tested versions), FAQ, Troubleshooting (hydration, CSS not loading, z-index, CSP, Shadow DOM, Metro), Performance, Security, Versioning and release policy, Changelog (generated from Changesets), Contributing, Roadmap.
   - Every doc page: title, description (SEO), `Edit this page` link, last-updated date, previous/next, table of contents, copy buttons on code, `Open in playground` button where relevant, and code tabs for framework variants.
6. Changelog `/changelog`, Roadmap `/roadmap`, Security `/security`, Privacy `/privacy` (state exactly what the site collects; default none), 404 page, `/llms.txt` and `/llms-full.txt` generated from docs for AI assistants, `/sitemap.xml`, `/robots.txt`, `/humans.txt` optional.

CODE SAMPLES ARE TRUTH
- Every code sample in docs is extracted at build time and type-checked against the packed toastory types (per framework where applicable); build fails on error. Runnable demos import the real package.
- Single source for option tables: generated from TypeScript types/TSDoc, never copied by hand.
- Version switcher scaffold: docs are versioned by major (`/docs/v1`), current default, banner on old versions.

SEARCH, SEO, SOCIAL
- Pagefind search with keyboard shortcut (/ or Ctrl/Cmd+K), result highlighting, filters by section.
- Per-page title, meta description, canonical URL, Open Graph and Twitter images generated at build time (satori or Astro OG plugin) with the page title on a glass card, JSON-LD (SoftwareSourceCode / SoftwareApplication, BreadcrumbList), sitemap, robots, RSS for the changelog.
- Clean URLs, no duplicate content, proper heading hierarchy, descriptive link text.

PERFORMANCE AND PRIVACY
- Lighthouse >= 95 (performance, accessibility, best practices, SEO) on Home, Playground, one doc page, Themes, on mobile throttling. LCP < 2.0 s, CLS < 0.05, INP < 200 ms. Ship minimal JS: static HTML by default, islands lazy, demos load toastory chunks on interaction or visibility, background gradients in CSS (no heavy images), images AVIF/WebP with dimensions, fonts preloaded and subset.
- No third-party scripts by default. If analytics is wanted, add an opt-in, privacy-friendly option (Plausible or Umami) behind an env variable, no cookies, no consent banner needed; document it.
- Content Security Policy headers file, security headers (Cloudflare `_headers`): CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

QUALITY GATES (website:check must run all)
- Type check, lint, build, link checker (internal and external, allow-list for flaky hosts), spellcheck for docs (cspell with a project dictionary), Lighthouse CI thresholds, axe on every page type in light and dark, Playwright e2e: home demo buttons, theme switcher, install tabs copy, framework tabs, playground state share URL round trip, search opens and finds a known term, mobile navigation, keyboard-only navigation of the home page, reduced-motion mode. Visual regression screenshots for home, themes, playground at 3 widths.
- Docs sample type-check and the generated-reference diff check (fails if the API changed and docs were not regenerated).

DEPLOYMENT
- GitHub Actions workflow: on PR build + checks + preview deploy; on main deploy to Cloudflare Pages (or GitHub Pages, justify). Environment variables documented: SITE_URL, optional analytics id. Redirect rules file, custom domain instructions in website/DEPLOY.md. No secrets committed.

CONTENT RULES
- Plain, confident, specific copy. No hype words without proof, no emojis in headings, no lorem ipsum, no placeholder `TODO` text left in production pages.
- Every claim on the site (size, speed, accessibility, comparison) is backed by a script output or a linked source and shows the date or version it was measured. If you cannot verify a claim, leave it out.
- Do not use third-party logos, trademarks or brand imagery; refer to other libraries by name in text only, with a not-affiliated note.
- Write docs for beginners first (copy-paste quick start), then depth. Each guide: what it is, minimal example, all options, accessibility notes, framework variants, common mistakes.

CONSTRAINTS
- The package itself must not gain any dependency because of the website; website dependencies live only in /website.
- Do not copy text or designs from other libraries' sites. Layout inspiration is fine, content and visuals are ours.
- Respect the budgets in AGENTS.md for the package; the website budgets are above.

ACCEPTANCE CRITERIA
- `npm run website:build` and `npm run website:check` pass; every page in the sitemap exists and renders.
- Home page demo, themes gallery and playground work with mouse, touch and keyboard, and use the real built package.
- Docs cover every public export, option, theme, variant, input type and platform; the parity checklist in docs/parity.md maps each feature to a docs page (write docs/docs-coverage.md showing the mapping, with zero uncovered features).
- Lighthouse and axe thresholds met; all samples compile; no broken links.
- A new developer can go from the home page to a working toast in React, Vue, Angular, Svelte and plain JS in under two minutes by following the docs exactly (verify each with a script that scaffolds a fresh app and runs the quick start).

WHEN DONE
Report: sitemap with page count, Lighthouse scores per page type, axe results, bundle sizes of the heaviest pages, docs coverage table summary, list of claims shown on the site with their measurement source and date, anything left open, and suggested commits: `feat(website): foundation and design system`, `feat(website): home and features`, `feat(website): playground and themes gallery`, `feat(website): documentation and generated reference`, `chore(website): seo, search, deploy`.
```

**Kivabe chalabe (karon eta boro):** ekbare puro prompt dile AI kata-kata kaj korbe. Tai ei 5 ta sub-step e vag kore, protita alada session e dao, protita shesh e `npm run website:check` chalao:

1. `PLAN FIRST` + foundation, design system, layout, navigation, dark/light, search, deploy skeleton.
2. Home page + Features page (live demos shoho).
3. Playground + Themes gallery.
4. Docs: content structure, generated API reference, guides, recipes, migration, a11y, FAQ (ekটা ekটা group kore).
5. SEO, OG image, `llms.txt`, quality gates, Lighthouse tuning, final audit.

Session shuru korar line: `Follow the website prompt, do only sub-step N now, then stop and report.`

Sitewide review prompt (website shesh hole, notun session e):

```text
You are a strict reviewer, not the author. Open the built website and review as a first-time visitor and as a maintainer. Check: (1) every claim on the site against its source, (2) every code sample by copying it into a fresh project of that framework, (3) keyboard-only and screen-reader flow of Home, Playground and one docs page, (4) mobile layouts at 320, 375, 768 px, (5) broken, vague or missing docs for any feature in docs/parity.md, (6) copy that sounds like hype or filler, (7) performance and Lighthouse results. Rank findings blocker / major / minor with page and element. Do not fix yet.
```

## Final audit and fix-it prompts

Protita prompt er por ekta review session chalao, ar sob shesh hole final audit. AI nijer kaj nijei review korle kom dhore; tai notun, clean session e ei prompt gulo dao.

**Per-phase review (protita prompt er por)**

```text
You are a strict senior reviewer, not the author. Review the last commit of toastory against AGENTS.md.
List, with file and line: (1) violations of hard rules, (2) missing or weak tests, (3) accessibility defects, (4) public API deviations, (5) bundle-size or SSR risks, (6) code that looks copied or suspicious, (7) TODOs, stubs, dead code.
Rank findings blocker / major / minor. Do not fix anything yet. Do not praise. If you find no blockers, explain which checks you actually ran to be confident.
```

**Fix prompt (review er por)**

```text
Fix every blocker and major finding from the review above. For each fix add or strengthen a test that would have caught it. Do not touch unrelated code. Run `npm run check:all`. Report each finding with the commit message you suggest.
```

**When the AI gets stuck or produces junk**

```text
Stop. Do not write more code. State what the failing check or error is, what you tried, and your top 3 hypotheses. Then pick one, test it with the smallest experiment, and show the result before changing anything else. If the requirement in AGENTS.md is impossible or contradictory, say so and propose the smallest change to it.
```

**Final pre-release audit (Prompt 11 er por, notun session)**

```text
Audit the entire toastory repository as if you were deciding whether to adopt it in a production app of a large company.
1. Re-run `npm ci && npm run check:all` from a clean clone; report results.
2. Verify docs/parity.md against the code: spot check 15 random features by reading the implementation and its test.
3. Install the packed tarball (`npm pack`) into fresh projects: plain HTML via CDN, Vite React, Next.js App Router, Next.js Pages, Vue, Nuxt, Angular, SvelteKit, Electron, Expo. Run the quick start for each from README exactly as written; report any step that fails or is unclear.
4. Run publint, attw, size-limit, axe, Lighthouse on docs, and the perf suite; compare with the budgets in AGENTS.md.
5. Check licenses of devDependencies that end up in docs/examples, confirm zero runtime dependencies, verify provenance workflow, confirm package.json exports resolve for types, ESM, CJS and bundlers (Vite, webpack, esbuild, Metro).
6. Read the public API surface once as a new user and list confusing names, inconsistent options or missing docs.
7. Produce a go / no-go for publishing 1.0.0 with a prioritised list of remaining issues.
```

**Notun feature pore add korte**

```text
Update AGENTS.md first with the new feature (options, API, tests required). Show me the diff of AGENTS.md. Then implement across core, web, every framework wrapper and native, add docs and parity.md entries, add tests, run `npm run check:all`, and report.
```

Shesh kotha: prompt gulo ekই order e chalao, protita gate pass koro, ar je prompt e AI "done" bole kintu `npm run check` fail kore, tokhon taake "done" mene niyo na. Tomar kaj hocche gate guloi enforce kora.

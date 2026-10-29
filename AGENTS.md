# glazekit — project constitution

## What we are building
glazekit is ONE npm package (name: `glazekit`) that ships a complete UI feedback toolkit: toast notifications, confirm / prompt / alert dialogs, action sheet, bottom sheet, loading overlay and multi-step dialogs. Same API on every platform: plain JS, React, Next.js, Vue, Nuxt, Angular, Svelte, Electron, React Native (Expo + bare).
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
import { ui } from 'glazekit'
ui.toast(message, opts) and ui.toast.success|error|info|warning|loading|message(message, opts) -> id
ui.toast.promise(promiseOrFn, { loading, success, error, description, finally }) -> id + unwrap()
ui.toast.custom(renderer, opts), ui.toast.update(id, patch), ui.toast.dismiss(id?), ui.toast.dismissAll(), ui.toast.getToasts(), ui.toast.getHistory(), ui.toast.types.add(name, def)
ui.confirm(opts) / ui.alert(opts) / ui.prompt(opts) / ui.steps(steps) / ui.sheet(opts) / ui.bottomSheet(opts) / ui.loading(opts)
Dialog result: { isConfirmed, isDenied, isDismissed, value, dismiss }  where dismiss is 'cancel' | 'backdrop' | 'close' | 'esc' | 'timer'
ui.configure({ theme, mode: 'light'|'dark'|'auto', position, duration, maxVisible, gap, stack, dir, hotkey, pauseOn, container, shadow, ... })
Subpaths: glazekit (web + core), glazekit/core, glazekit/react, glazekit/vue, glazekit/angular, glazekit/svelte, glazekit/native, glazekit/themes/<name>.css

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
1. Restate the task in 3 lines and list the files you will create or change. Wait for no approval, but do not deviate from the list without saying why.
2. Implement completely. No stubs.
3. Write or update tests in the same change.
4. Run `npm run check`. Fix until green. Never weaken a test to make it pass.
5. Finish with: what changed, commands run with results, anything left open, suggested commit message.

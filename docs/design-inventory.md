# toastory Design Inventory

Inventory of all 96 design references imported from `design-refs/` and `design-refs/html/`.

## Summary
- **Total Reference Images**: 8 screenshots (`toasts-essentials`, `toasts-showcase-1`, `toasts-showcase-2`, `ios-glass-1`, `ios-glass-2`, `dialogs-1`, `dialogs-2`, `dialogs-3`).
- **Total HTML Reference Specs**: 3 files (`toasts-showcase.html`, `ios-glass.html`, `dialogs.html`).
- **Unique Design Templates**: 48 designs (12 Essentials + 12 Showcase + 12 iOS Glass + 12 Dialogs).
- **Total Mode Permutations**: **96 designs** (48 Light mode + 48 Dark mode).

---

## Complete Design Matrix (96 Items)

| ID | Source & # | Human Name | Target Component | Theme Group | Mode | Required Features | Accessibility Notes | Status |
|---|---|---|---|---|---|---|---|---|
| `ess-01-l` | `toasts-essentials` #1 | Minimal Toast (Light) | Toast | `essentials` | Light | Clean white card, 1px subtle border, neutral typography, dismissible | `role="status"`, `aria-live="polite"`, 4.5:1 text contrast | Done |
| `ess-01-d` | `toasts-essentials` #1 | Minimal Toast (Dark) | Toast | `essentials` | Dark | Dark surface (`#18181b`), muted border, white text | `role="status"`, `aria-live="polite"`, 7:1 text contrast | Done |
| `ess-02-l` | `toasts-essentials` #2 | Success with Icon (Light) | Toast | `essentials` | Light | Green checkmark SVG icon, status title, dismissible | Icon `aria-hidden="true"`, tone-based polite announcement | Done |
| `ess-02-d` | `toasts-essentials` #2 | Success with Icon (Dark) | Toast | `essentials` | Dark | Dark card, bright emerald checkmark icon, white title | Icon `aria-hidden="true"`, contrast verified AA | Done |
| `ess-03-l` | `toasts-essentials` #3 | Error Alert (Light) | Toast | `essentials` | Light | Red alert circle SVG icon, error title, dismissible | `role="alert"`, `aria-live="assertive"`, red text meets AA | Done |
| `ess-03-d` | `toasts-essentials` #3 | Error Alert (Dark) | Toast | `essentials` | Dark | Dark card, bright coral alert icon, error message | `role="alert"`, `aria-live="assertive"` | Done |
| `ess-04-l` | `toasts-essentials` #4 | Warning Notice (Light) | Toast | `essentials` | Light | Amber warning triangle icon, warning title | `role="alert"`, `aria-live="assertive"`, amber contrast checked | Done |
| `ess-04-d` | `toasts-essentials` #4 | Warning Notice (Dark) | Toast | `essentials` | Dark | Dark card, warm amber icon, warning title | `role="alert"`, `aria-live="assertive"` | Done |
| `ess-05-l` | `toasts-essentials` #5 | Accent Bar (Light) | Toast | `essentials` | Light | 4px solid left border accent strip, multi-line title and body | 3:1 contrast on accent bar against background | Done |
| `ess-05-d` | `toasts-essentials` #5 | Accent Bar (Dark) | Toast | `essentials` | Dark | Dark card, vibrant colored left accent bar | 3:1 contrast on accent bar | Done |
| `ess-06-l` | `toasts-essentials` #6 | Tone Badge Notification (Light) | Toast | `essentials` | Light | Rounded icon chip with soft tinted background, bold title, subtitle | Chip icon `aria-hidden="true"`, semantic typography | Done |
| `ess-06-d` | `toasts-essentials` #6 | Tone Badge Notification (Dark) | Toast | `essentials` | Dark | Dark surface, tinted badge chip, high-contrast text | Contrast verified AA | Done |
| `ess-07-l` | `toasts-essentials` #7 | Progress Bar Toast (Light) | Toast | `essentials` | Light | Bottom countdown progress bar with auto-close timing | Progress bar `aria-hidden="true"`, countdown pauses on hover/focus | Done |
| `ess-07-d` | `toasts-essentials` #7 | Progress Bar Toast (Dark) | Toast | `essentials` | Dark | Dark card, glowing countdown progress track | Countdown pauses on hover/focus | Done |
| `ess-08-l` | `toasts-essentials` #8 | Capsule Status Pill (Light) | Toast | `essentials` | Light | Full-radius capsule (`border-radius: 9999px`), light surface, centered | `role="status"`, `aria-live="polite"` | Done |
| `ess-08-d` | `toasts-essentials` #8 | Capsule Status Pill (Dark) | Toast | `essentials` | Dark | Solid black capsule pill, white text | High contrast 14:1, polite live region | Done |
| `ess-09-l` | `toasts-essentials` #9 | Undo Action Bar (Light) | Toast | `essentials` | Light | Inline action button ("Undo") on the right of message | Button keyboard focusable with visible ring, activation triggers handler | Done |
| `ess-09-d` | `toasts-essentials` #9 | Undo Action Bar (Dark) | Toast | `essentials` | Dark | Dark card, contrast-checked "Undo" button | Keyboard reachable, Enter/Space triggers | Done |
| `ess-10-l` | `toasts-essentials` #10 | Inline Confirmation (Light) | Toast | `essentials` | Light | Title, description, two action buttons ("Cancel", "Delete") | Tab navigation between buttons, Esc cancels | Done |
| `ess-10-d` | `toasts-essentials` #10 | Inline Confirmation (Dark) | Toast | `essentials` | Dark | Dark card, destructive button highlighted | Destructive button has clear label | Done |
| `ess-11-l` | `toasts-essentials` #11 | Determinate Loading (Light) | Toast | `essentials` | Light | Rotating spinner icon + status message + percentage badge ("64%") | `role="status"`, `aria-valuenow="64"`, announces completion | Done |
| `ess-11-d` | `toasts-essentials` #11 | Determinate Loading (Dark) | Toast | `essentials` | Dark | Dark surface, bright spinner, percentage badge | Reduced-motion disables spin animation | Done |
| `ess-12-l` | `toasts-essentials` #12 | Avatar Notification (Light) | Toast | `essentials` | Light | Initials avatar circle ("RA"), sender name, body snippet, "now" time | `<time>` element with relative time formatting | Done |
| `ess-12-d` | `toasts-essentials` #12 | Avatar Notification (Dark) | Toast | `essentials` | Dark | Dark surface, colored initials avatar, relative time | Accessible avatar label | Done |
| `sc-01-l` | `toasts-showcase-1` #1 | Glass Gradient Card (Light) | Toast | `showcase` | Light | `backdrop-filter: blur(18px)`, icon chip, close button, subtle shadow | Reduced-transparency fallback to solid surface, close labeled | Done |
| `sc-01-d` | `toasts-showcase-1` #1 | Glass Gradient Card (Dark) | Toast | `showcase` | Dark | Translucent dark glass, frosted border, high blur | Solid fallback for forced-colors/reduced-transparency | Done |
| `sc-02-l` | `toasts-showcase-1` #2 | Emerald Success Card (Light) | Toast | `showcase` | Light | Gradient background (`#059669` -> `#10b981`), circular icon chip | White text meets 4.5:1 on emerald gradient | Done |
| `sc-02-d` | `toasts-showcase-1` #2 | Emerald Success Card (Dark) | Toast | `showcase` | Dark | Deep emerald gradient, luminous checkmark chip | Text contrast AA compliant | Done |
| `sc-03-l` | `toasts-showcase-1` #3 | Neon Pulse Error (Light) | Toast | `showcase` | Light | Crisp dark card, neon red border glow (`rgba(244,63,94,.45)`), alert icon | `role="alert"`, `aria-live="assertive"` | Done |
| `sc-03-d` | `toasts-showcase-1` #3 | Neon Pulse Error (Dark) | Toast | `showcase` | Dark | Pure deep black surface, neon red box-shadow, pulsing alert icon | Reduced-motion disables glow pulse animation | Done |
| `sc-04-l` | `toasts-showcase-1` #4 | Rounded App Banner (Light) | Toast | `showcase` | Light | Frosted glass (`blur(20px)`), gradient app icon, "now" relative time | High-contrast text on glass, relative time formatted | Done |
| `sc-04-d` | `toasts-showcase-1` #4 | Rounded App Banner (Dark) | Toast | `showcase` | Dark | Dark glass banner, vibrant app icon, relative timestamp | Contrast verified AA | Done |
| `sc-05-l` | `toasts-showcase-1` #5 | Developer Dark Key-Hint (Light) | Toast | `showcase` | Light | Clean monochrome card, blue status dot, `<kbd>Esc</kbd>` chip | `<kbd>` element styled with accessible contrast | Done |
| `sc-05-d` | `toasts-showcase-1` #5 | Developer Dark Key-Hint (Dark) | Toast | `showcase` | Dark | Pure black surface (`#000`), 1px border, blue dot, `<kbd>Esc</kbd>` | Esc key dismisses toast | Done |
| `sc-06-l` | `toasts-showcase-1` #6 | Countdown Ring Timer (Light) | Toast | `showcase` | Light | SVG circular countdown ring (`stroke-dashoffset`), "Undo" action | Ring pauses on hover/focus, not spammed to screen readers | Done |
| `sc-06-d` | `toasts-showcase-1` #6 | Countdown Ring Timer (Dark) | Toast | `showcase` | Dark | Dark surface, glowing indigo SVG progress ring, "Undo" button | Reduced-motion provides non-animated countdown ring | Done |
| `sc-07-l` | `toasts-showcase-1` #7 | Stacked Expanding Deck (Light) | Toast | `showcase` | Light | 3 layered cards stacked with 3D offset, expands on hover/focus | Keyboard focus expands stack automatically; arrow roving | Done |
| `sc-07-d` | `toasts-showcase-1` #7 | Stacked Expanding Deck (Dark) | Toast | `showcase` | Dark | Dark cards in 3D stacked deck, expanding to full list | Full roving tabindex across stacked cards | Done |
| `sc-08-l` | `toasts-showcase-1` #8 | File Upload Progress (Light) | Toast | `showcase` | Light | File icon chip, filename, byte size progress label, gradient track | `role="progressbar"`, `aria-valuenow`, `aria-valuetext` | Done |
| `sc-08-d` | `toasts-showcase-1` #8 | File Upload Progress (Dark) | Toast | `showcase` | Dark | Dark card, glowing gradient progress track, byte label | `aria-valuetext="4.2 MB of 6.8 MB"` announced on change | Done |
| `sc-09-l` | `toasts-showcase-2` #9 | Morphing Island Pill (Light) | Island | `showcase` | Light | Capsule morphing width/height with spring curve, art, equalizer | Reduced motion replaces spring morph with instant width change | Done |
| `sc-09-d` | `toasts-showcase-2` #9 | Morphing Island Pill (Dark) | Island | `showcase` | Dark | Deep black capsule, animated equalizer bars, album art | Equalizer bars aria-hidden | Done |
| `sc-10-l` | `toasts-showcase-2` #10 | Gradient Border Promo (Light) | Toast | `showcase` | Light | Multi-color gradient border, star icon, CTA button | Button keyboard reachable with visible focus ring | Done |
| `sc-10-d` | `toasts-showcase-2` #10 | Gradient Border Promo (Dark) | Toast | `showcase` | Dark | Dark card with multi-color gradient border, white action button | Contrast verified AA on dark surface | Done |
| `sc-11-l` | `toasts-showcase-2` #11 | Soft Minimal Card (Light) | Toast | `showcase` | Light | Minimal light card, soft green icon chip, close button | Close button has accessible label, polite live region | Done |
| `sc-11-d` | `toasts-showcase-2` #11 | Soft Minimal Card (Dark) | Toast | `showcase` | Dark | Muted dark card, subtle border, close button | Contrast verified AA | Done |
| `sc-12-l` | `toasts-showcase-2` #12 | Social Message Actions (Light) | Toast | `showcase` | Light | Initials avatar, sender, message, relative time, reply/dismiss buttons | Tab stops on action buttons, avatar accessible label | Done |
| `sc-12-d` | `toasts-showcase-2` #12 | Social Message Actions (Dark) | Toast | `showcase` | Dark | Dark surface, gradient avatar, reply & dismiss buttons | Full keyboard access | Done |
| `ig-01-l` | `ios-glass-1` #1 | Frosted Notification Banner (Light) | Toast | `ios-glass` | Light | `blur(26px) saturate(190%)`, `.5px` border, gradient app icon, "now" | High contrast text on frosted glass, contrast verified | Done |
| `ig-01-d` | `ios-glass-1` #1 | Frosted Notification Banner (Dark) | Toast | `ios-glass` | Dark | Dark frosted glass banner, vibrant app icon | 7:1 text contrast on dark glass | Done |
| `ig-02-l` | `ios-glass-1` #2 | Frosted Banner Dark Glass (Light) | Toast | `ios-glass` | Light | Dark glass banner (`rgba(28,28,32,.48)`), blue mail icon, "2m ago" | 7:1 text contrast | Done |
| `ig-02-d` | `ios-glass-1` #2 | Frosted Banner Dark Glass (Dark) | Toast | `ios-glass` | Dark | Translucent dark glass, subtle inner highlight | Solid fallback on reduced-transparency | Done |
| `ig-03-l` | `ios-glass-1` #3 | Liquid Glass Success Capsule (Light) | Toast | `liquid-glass` | Light | Capsule pill shape, iridescent rim lighting, checkmark draw | Reduced motion skips checkmark draw animation | Done |
| `ig-03-d` | `ios-glass-1` #3 | Liquid Glass Success Capsule (Dark) | Toast | `liquid-glass` | Dark | Translucent pill, rim specular highlight, checkmark draw | Contrast checked AA | Done |
| `ig-04-l` | `ios-glass-1` #4 | Island Incoming Call (Light) | Island | `ios-glass` | Light | Black pill expanding to 380px, avatar, decline and accept buttons | Decline and accept buttons have accessible labels | Done |
| `ig-04-d` | `ios-glass-1` #4 | Island Incoming Call (Dark) | Island | `ios-glass` | Dark | Pure black island pill, caller name, call duration, red/green actions | Action buttons keyboard operable | Done |
| `ig-05-l` | `ios-glass-1` #5 | Transient HUD Overlay (Light) | HUD | `ios-glass` | Light | Centered compact floating HUD, amber bell icon, "Silent mode on" | Does not steal keyboard focus, announced politely | Done |
| `ig-05-d` | `ios-glass-1` #5 | Transient HUD Overlay (Dark) | HUD | `ios-glass` | Dark | Dark frosted floating HUD, amber icon, silent mode text | Announced politely via live region | Done |
| `ig-06-l` | `ios-glass-1` #6 | Glass Alert Hairline Buttons (Light) | Dialog | `ios-glass` | Light | Modal glass card with hairline divided buttons (Cancel, Delete) | Focus trap, Esc cancels, Enter activates, aria-modal="true" | Done |
| `ig-06-d` | `ios-glass-1` #6 | Glass Alert Hairline Buttons (Dark) | Dialog | `ios-glass` | Dark | Dark glass alert card, hairline divided buttons | Full keyboard trap, contrast verified | Done |
| `ig-07-l` | `ios-glass-2` #7 | Device Connected Card (Light) | Toast | `ios-glass` | Light | Large device icon circle, device title, battery level, pill action | Connect button keyboard accessible, battery level semantic | Done |
| `ig-07-d` | `ios-glass-2` #7 | Device Connected Card (Dark) | Toast | `ios-glass` | Dark | Dark glass popup, device icon, battery level, Connect button | Connect button keyboard accessible | Done |
| `ig-08-l` | `ios-glass-2` #8 | Grouped Thread Stack (Light) | Toast | `ios-glass` | Light | Multiple notifications from same group stacked, expands on hover | Summary announced ("3 new messages from Family"), roving tabindex | Done |
| `ig-08-d` | `ios-glass-2` #8 | Grouped Thread Stack (Dark) | Toast | `ios-glass` | Dark | Dark glass grouped stack, expands on hover/focus | Keyboard focus expands stack automatically | Done |
| `ig-09-l` | `ios-glass-2` #9 | Download Progress Ring (Light) | Toast | `ios-glass` | Light | Circular progress ring surrounding download icon, byte label | `role="progressbar"`, `aria-valuenow`, `aria-valuetext` | Done |
| `ig-09-d` | `ios-glass-2` #9 | Download Progress Ring (Dark) | Toast | `ios-glass` | Dark | Dark frosted card, glowing SVG progress ring, download label | Paused on hover/focus | Done |
| `ig-10-l` | `ios-glass-2` #10 | Shake Error Banner (Light) | Toast | `ios-glass` | Light | Red translucent glass card, alert icon, shake animation | `prefers-reduced-motion` suppresses shake; `role="alert"` | Done |
| `ig-10-d` | `ios-glass-2` #10 | Shake Error Banner (Dark) | Toast | `ios-glass` | Dark | Deep red glass card, alert icon, shake entrance | `role="alert"`, `aria-live="assertive"` | Done |
| `ig-11-l` | `ios-glass-2` #11 | Focus Mode Switch (Light) | Toast | `ios-glass` | Light | Purple frosted card, moon icon, interactive switch toggle | `role="switch"`, `aria-checked="true"`, Space/Enter toggles | Done |
| `ig-11-d` | `ios-glass-2` #11 | Focus Mode Switch (Dark) | Toast | `ios-glass` | Dark | Dark purple frosted glass card, interactive toggle switch | Keyboard accessible switch control | Done |
| `ig-12-l` | `ios-glass-2` #12 | Compact Banner Action (Light) | Toast | `ios-glass` | Light | Thin compact bar, circular icon badge, title, inline link ("Share") | Share link/button keyboard reachable with focus ring | Done |
| `ig-12-d` | `ios-glass-2` #12 | Compact Banner Action (Dark) | Toast | `ios-glass` | Dark | Dark compact banner, blue icon badge, Share action | Focus-visible ring verified | Done |
| `dlg-01-l` | `dialogs-1` #1 | Warning Confirmation Dialog (Light) | Dialog | `dialogs` | Light | Centered amber icon badge, title, description, Stay / Leave buttons | Focus trap, initial focus on Cancel/Stay, Esc cancels | Done |
| `dlg-01-d` | `dialogs-1` #1 | Warning Confirmation Dialog (Dark) | Dialog | `dialogs` | Dark | Dark dialog surface (`#17171c`), amber icon, action buttons | Contrast verified AA, role="alertdialog" | Done |
| `dlg-02-l` | `dialogs-1` #2 | Danger Delete Confirmation (Light) | Dialog | `dialogs` | Light | Red trash icon badge, title with quoted filename, red Delete button | role="alertdialog", focus on Cancel by default | Done |
| `dlg-02-d` | `dialogs-1` #2 | Danger Delete Confirmation (Dark) | Dialog | `dialogs` | Dark | Dark surface, red trash icon badge, destructive button | Destructive button has clear label | Done |
| `dlg-03-l` | `dialogs-1` #3 | Type to Confirm Modal (Light) | Dialog | `dialogs` | Light | Header with icon, code chip, input, disabled confirm until matched | `aria-describedby` links input to instruction, aria-disabled | Done |
| `dlg-03-d` | `dialogs-1` #3 | Type to Confirm Modal (Dark) | Dialog | `dialogs` | Dark | Dark surface, code chip, dark input field, confirm button | Live validation announced to screen readers | Done |
| `dlg-04-l` | `dialogs-1` #4 | Rename Input Prompt (Light) | Dialog | `dialogs` | Light | Header with blue edit icon, label, text input, Cancel + Save | Input labeled via `<label>`, Enter submits, Esc cancels | Done |
| `dlg-04-d` | `dialogs-1` #4 | Rename Input Prompt (Dark) | Dialog | `dialogs` | Dark | Dark surface, blue edit icon, text input with initial value | Focus trap, accessible label | Done |
| `dlg-05-l` | `dialogs-2` #5 | Success Verified Dialog (Light) | Dialog | `dialogs` | Light | Green check icon badge with draw animation, Continue button | role="dialog", focus on Continue, announced politely | Done |
| `dlg-05-d` | `dialogs-2` #5 | Success Verified Dialog (Dark) | Dialog | `dialogs` | Dark | Dark surface, green check icon badge, green Continue button | Contrast verified AA | Done |
| `dlg-06-l` | `dialogs-2` #6 | Update Info Stacked Dialog (Light) | Dialog | `dialogs` | Light | Purple arrow icon badge, title, stacked column buttons | Focus on primary button, Tab cycles to ghost button | Done |
| `dlg-06-d` | `dialogs-2` #6 | Update Info Stacked Dialog (Dark) | Dialog | `dialogs` | Dark | Dark surface, purple icon badge, stacked action buttons | Esc dismisses, full keyboard loop | Done |
| `dlg-07-l` | `dialogs-2` #7 | Dark Logout Modal (Light) | Dialog | `dialogs` | Light | Clean modal with exit icon badge, Cancel + Sign out buttons | Focus trap, role="dialog", contrast verified | Done |
| `dlg-07-d` | `dialogs-2` #7 | Dark Logout Modal (Dark) | Dialog | `dialogs` | Dark | Solid dark card (`#17171c`), exit icon badge, Cancel + Sign out | Contrast verified AA on dark surface | Done |
| `dlg-08-l` | `dialogs-2` #8 | iOS Glass System Alert (Light) | Dialog | `dialogs` | Light | Frosted glass modal, hairline divided buttons (Cancel, Reset) | Full keyboard trap, Esc cancels, Enter activates, aria-modal | Done |
| `dlg-08-d` | `dialogs-2` #8 | iOS Glass System Alert (Dark) | Dialog | `dialogs` | Dark | Dark frosted glass modal, hairline divided action buttons | Contrast verified AA | Done |
| `dlg-09-l` | `dialogs-3` #9 | Bottom Sheet Confirmation (Light) | Bottom Sheet | `dialogs` | Light | Slide-up bottom sheet, drag handle pill, red trash icon, stacked buttons | role="dialog", aria-modal="true", swipe down threshold, Esc | Done |
| `dlg-09-d` | `dialogs-3` #9 | Bottom Sheet Confirmation (Dark) | Bottom Sheet | `dialogs` | Dark | Dark bottom sheet, drag handle, stacked full-width buttons | Swipe down to dismiss gesture | Done |
| `dlg-10-l` | `dialogs-3` #10 | Re-enter Password Dialog (Light) | Dialog | `dialogs` | Light | Lock icon badge, password input, notice callout box with shield icon | Callout box has role="note" or aria-describedby | Done |
| `dlg-10-d` | `dialogs-3` #10 | Re-enter Password Dialog (Dark) | Dialog | `dialogs` | Dark | Dark surface, password input, amber notice callout | Input has autocomplete="current-password" | Done |
| `dlg-11-l` | `dialogs-3` #11 | OTP Code Input Dialog (Light) | Dialog | `dialogs` | Light | Shield icon badge, 6 discrete numeric input boxes, auto-advance, paste | Each box has `aria-label="Digit n of 6"`, autocomplete="one-time-code" | Done |
| `dlg-11-d` | `dialogs-3` #11 | OTP Code Input Dialog (Dark) | Dialog | `dialogs` | Dark | Dark surface, 6 discrete inputs, resend link with cooldown | Resend cooldown announced via live region | Done |
| `dlg-12-l` | `dialogs-3` #12 | Session Timeout Countdown (Light) | Dialog | `dialogs` | Light | Clock icon badge, live seconds display (`60s`), progress bar, extend button | Screen reader announcements at 30s, 10s, 5s (not every tick) | Done |
| `dlg-12-d` | `dialogs-3` #12 | Session Timeout Countdown (Dark) | Dialog | `dialogs` | Dark | Dark surface, live seconds counter, progress bar, extend button | "Stay signed in" extends timer through handle | Done |

---

## Token Extraction Summary

### Colors & Tokens
- **Essentials**: Minimal surfaces (`#fff`, `#18181b`), emerald success (`#16a34a`, `#dcfce7`), error red (`#dc2626`, `#fee2e2`), warning amber (`#d97706`, `#fef3c7`), accent blue (`#2563eb`, `#dbeafe`).
- **Showcase**: Frosted glass (`rgba(255,255,255,.14)`, `rgba(255,255,255,.28)`), emerald gradient (`#059669` -> `#10b981`), neon pink error (`#140509`, `#f43f5e`, `#fecdd3`), iOS banner (`rgba(250,250,250,.82)`), developer dark (`#000`, `#2e2e2e`, `#ededed`), countdown ring (`#6366f1`), upload progress track (`#eef2ff`, `#6366f1` -> `#a855f7`), dynamic island (`#000`, `#34d399`), gradient border (`linear-gradient(120deg,#f59e0b,#ec4899,#8b5cf6,#3b82f6)`), soft light card (`#e7e5e4`, `#dcfce7`), message actions card (`#1c1c22`, `#33333b`).
- **iOS Glass & Liquid Glass**: Frosted light glass (`rgba(255,255,255,.34)`, blur 26px saturate 190%), dark glass (`rgba(28,28,32,.48)`, blur 26px saturate 180%), liquid glass rim masked gradient (`linear-gradient(135deg,rgba(255,255,255,.95),rgba(255,255,255,0) 38%,rgba(255,255,255,0) 62%,rgba(255,255,255,.65))`), HUD (`rgba(40,40,44,.55)`), system alert (`rgba(245,245,247,.72)`), popup (`rgba(255,255,255,.3)`), shake error (`rgba(255,69,58,.28)`), focus mode (`rgba(88,86,214,.38)`).
- **Dialogs**: Clean card (`#fff`, `#18181b`), backdrop blur (`rgba(14,14,20,.5)`, blur 2px), warning icon badge (`#fef3c7`, `#d97706`), danger badge (`#fee2e2`, `#dc2626`), success badge (`#dcfce7`, `#16a34a`), info badge (`#ede9fe`, `#7c3aed`), rename badge (`#dbeafe`, `#2563eb`), dark modal (`#17171c`, `#2c2c34`), bottom sheet (`border-radius: 24px 24px 0 0`, drag handle `#d4d4d8`), OTP inputs (`#d4d4d8`, focus `#6366f1`), session countdown timer (`#e4e4e7`, bar `#f59e0b`).


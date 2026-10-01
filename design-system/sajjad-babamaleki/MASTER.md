# Sajjad Babamaleki: Design System

Built with the UI/UX Pro Max (Lite) workflow, combining three profiles: Spatial / 3D product, Banking / fintech (founder and investor), and Portfolio.

## Pattern
Hero with one primary action, then Reach, Ventures (work-first), Principles, Contact.
- Primary action: "Get in touch", in the header and the hero, ending in the Contact card.
- Secondary action: "View ventures".
- The approved WebGL particle scene sits fixed behind everything and re-forms per chapter (galaxy, globe, skyline, helix, signature).

## Style
Restrained spatial: precise, dark, trustworthy, bold asymmetric type.
Why: a founder site needs the trust of finance UI, with the 3D scene doing the emotional work and the interface staying out of its way.

## Colors
| Token | Hex | Use | Contrast |
|---|---|---|---|
| bg | #0A0B0E | page background | |
| surface | #14161C | cards and panels (86% over the scene) | |
| surface-2 | #1B1E26 | icon wells, hover | |
| text | #EEF0F5 | headings, body | 17.3:1 on bg, 15.9:1 on surface |
| muted | #A1A7B6 | secondary text | 8.2:1 on bg, 7.5:1 on surface |
| border | #262A34 | decorative dividers | |
| control | #737A8A | secondary button outline | ≥3:1 |
| primary | #9BB0FF | primary buttons, active nav, focus | 9.4:1 on bg |
| on-primary | #0A0B0E | text on primary | 9.4:1 |
| success | #6FD3A5 | copy confirmation, with a check icon | 9.9:1 |
Dark only, by design.

## Typography
Display: Space Grotesk (600/700) · Text: Inter (400/500)
Scale (1.25): 12 / 14 / 16 / 20 / 25 / 31 / 39 / 49 / 61 / 76 / 95, hero up to 152
Line-height: body 1.5, headings 1.1 to 1.25

## Spacing and shape
Spacing: 4 8 12 16 24 32 48 64 96 128
Radius: 12px for buttons, cards and controls (one shape language)
Shadow: two soft levels

## Key effects
- Hover and color changes: 180ms ease-out. Press: scale .98 in 120ms.
- Entrances: 400ms ease-out, 16px travel, 60ms stagger.
- Icons: Lucide, 1.75 stroke, one family.

## Avoid
- Glass everywhere, pill buttons, glow effects, slow two-second entrances.
- More than one accent colour.

## Checklist
Contrast checked, focus visible, 44px touch targets, keyboard-operable mobile menu with focus trap and Esc, copy success and failure states announced via aria-live, reduced motion respected, no horizontal scroll at 375 / 768 / 1440.

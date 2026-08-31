# Card template contract

This document separates reusable visual structure from recipient content so future templates can be generated without hard-coded edits scattered through HTML and CSS.

## Personalization data

Keep these values in one serializable configuration object:

- recipient name and optional nickname/emoji;
- occasion and date label;
- headline, short CTA, letter title, and long message;
- portrait, supporting images/GIF, and optional music;
- palette overrides constrained by the template;
- sender name;
- public slug, custom URL status, and branding visibility.

Content changes must not require editing selectors, keyframes, or layout markup.

## Template-owned decisions

Each template owns:

- typography roles and font loading;
- color tokens and contrast-safe combinations;
- composition and supported breakpoints;
- decorative asset slots;
- entrance timeline and ambient motion;
- letter/payload presentation;
- text-length limits and overflow behavior.

Templates may share primitives, but they should not all look like recolored copies of one component tree.

## Surface boundary

`Card Experience` is recipient-facing and art-directed. `Card Builder` is creator-facing and optimized for clear editing. Conventional component libraries are appropriate for the builder; they must not dictate the visual style of the rendered card.

## Current template anatomy

- Stage: pink grid background and clipped full-viewport wrapper.
- Banner: mirrored birthday flags.
- Greeting cluster: outlined two-line headline, falling hat, date pill, letter CTA.
- Recipient cluster: circular portrait, handwritten name pill, balloons, rotating seal.
- Atmosphere: stars, flowers, bottom decoration, smiley sticker.
- Payload: modal overlay containing a two-panel 3D folding letter.

## Responsive behavior

- Desktop baseline: 40/60 horizontal composition.
- Mobile baseline (`<=658px`): stacked content, 200px portrait, compact typography and a viewport-relative letter.
- Add a tablet/intermediate layout before production; current code jumps directly between two modes.
- Test at minimum 360×800, 390×844, 768×1024, 1366×768, and 1440×900.

## Definition of done for UI changes

- Matches `DESIGN.md` rather than generic generator defaults.
- Works with realistic short and long Vietnamese content.
- Primary flow works with mouse, keyboard, and touch.
- No clipping or horizontal overflow at target widths.
- Reduced-motion mode exposes all content.
- No blocking console errors or missing assets.
- Visual review compares the result with the current `index.html` baseline at both mobile and desktop sizes.


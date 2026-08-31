# Basic Card Builder Design

## Goal

Turn the current hard-coded birthday card into a minimal creator-facing editor without changing the recipient-facing visual baseline. The editor exposes only recipient name, birthday date, and message, while the right side renders an isolated live preview in desktop or mobile mode.

## Scope

The first milestone includes:

- a desktop-oriented builder shell;
- a fixed left editing toolbar;
- a right preview workspace;
- three editable values: name, date label, and message;
- live updates without page reload;
- desktop, mobile, and fit-to-screen preview controls;
- the current birthday card rendered from one serializable configuration object;
- preservation of the existing animation sequence and 3D letter interaction.

The milestone excludes accounts, database persistence, uploads, theme editing, template selection, public links, payments, custom URLs, analytics, and a mobile-optimized builder.

## Experience architecture

The builder is a separate creator-facing surface. It must not place editing controls inside the birthday card.

The desktop layout has a 320–360px left toolbar and a preview workspace that occupies the remaining width. The preview toolbar contains Desktop, Mobile, and Fit controls. Desktop mode uses the card's normal wide viewport. Mobile mode uses a phone-sized viewport centered in the workspace. Fit scales the selected viewport visually without changing the viewport dimensions used by the card's responsive CSS.

The recipient-facing card runs inside an `iframe`. This isolates its global CSS, fonts, full-viewport sizing, animation, and modal layers from the builder. The builder and preview communicate only through a small configuration message contract.

## Configuration contract

The internal configuration is intentionally broader than the first toolbar so later fields can be added without restructuring the renderer:

```js
const cardConfig = {
  recipient: {
    name: "Hi Beo",
    emoji: "🐷",
    portraitUrl: "images/unnamed.png"
  },
  occasion: {
    type: "birthday",
    dateLabel: "07 August",
    headlineTop: "Happy",
    headlineBottom: "Birthday"
  },
  letter: {
    buttonLabel: "Click Here",
    coverTitle: "Happy Birthday",
    greeting: "To You!",
    message: "Happy birthday..."
  },
  theme: {
    palette: "pink-birthday"
  },
  motion: {
    preset: "full"
  }
};
```

Only `recipient.name`, `occasion.dateLabel`, and `letter.message` are editable in this milestone. The remaining values preserve the current design and provide stable extension points.

## Data flow

1. The builder loads the default configuration matching the existing Hi Beo card.
2. The iframe loads the recipient-facing card renderer.
3. When the iframe reports readiness, the builder sends the full configuration.
4. Input changes update builder state and send the latest full configuration to the iframe.
5. The preview validates the message origin/source and applies text changes to named DOM targets.
6. Switching viewport mode changes only the iframe container dimensions; it does not mutate card content.

Sending the full small configuration avoids partial-update drift and keeps preview refresh deterministic.

## Content mapping

`recipient.name` updates:

- the document title;
- the primary CTA text;
- the name pill below the portrait;
- the letter cover recipient line.

`occasion.dateLabel` updates the typed date content. When configuration changes after the initial reveal, the displayed date updates immediately rather than replaying the full entrance timeline.

`letter.message` updates the long wish inside the opened letter. The letter panel must support realistic Vietnamese text without clipping.

The currently unused JavaScript variables `datatxtletter` and `titleLetter` are removed unless they become real render targets during implementation.

## Validation

- Recipient name: trimmed, 2–24 characters.
- Date label: trimmed, 1–24 characters.
- Message: trimmed, 20–500 characters.
- Invalid content remains in the input so it is not lost, but the toolbar displays an inline warning.
- Preview receives the current text during editing. Validation blocks later save/share actions, which are outside this milestone.
- Text is assigned with `textContent`, never injected as HTML.

## Visual requirements

The birthday card must continue to follow `DESIGN.md` and `docs/ui/MOTION.md`. The editor uses quiet neutral styling so it frames rather than competes with the card. It may use conventional form controls, but no builder style may leak into the iframe.

The current card remains the comparison baseline at 1366×768 and 390×844. The milestone is not a redesign of the card.

## Responsive boundary

The builder is supported on desktop only in this milestone. At narrow browser widths it may show a clear message asking the creator to use a larger screen. The card preview itself must continue to support desktop and mobile viewports.

## Accessibility

- Every field has a visible label and associated description/error text.
- Preview controls use real buttons with pressed-state semantics.
- Keyboard focus is visible.
- The iframe has a descriptive title.
- The card's letter opener and closer work with keyboard and touch.
- A reduced-motion preference reveals content without waiting for the staged timeline.

## Error behavior

- If the preview fails to load, the workspace displays a retry action without losing input state.
- Unknown configuration fields are ignored by the preview.
- Missing values fall back to template defaults.
- The builder never replaces the preview document with error markup that could obscure the real failure.

## Verification

- Unit-level checks cover configuration validation and content mapping.
- Browser checks cover initial load, live updates for all three fields, desktop/mobile switching, letter open/close, keyboard operation, and long Vietnamese text.
- Screenshots at desktop and mobile preview sizes are compared with the current visual baseline.
- The static production build must complete successfully and contain no missing local assets.

## Future extension points

Later milestones can expose portrait upload, constrained palette presets, motion presets, sender name, draft persistence, public slug, branding, and custom URL status. None of these should be implemented speculatively in this milestone.

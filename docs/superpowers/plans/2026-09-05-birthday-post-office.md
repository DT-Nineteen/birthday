# Birthday Post Office Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete portrait-first Birthday Post Office card template and expose it in the existing builder.

**Architecture:** The template owns its HTML, CSS, inline SVG decoration, responsive composition, and motion while consuming the shared `CardConfig` through `connectTemplatePreview()`. The existing registry remains the single builder integration point, and the static-site build automatically packages the new template directory.

**Tech Stack:** Semantic HTML, CSS animations and 3D transforms, ES modules, Node test runner.

**Spec:** Approved in chat on 2026-09-05 from the Birthday Post Office concept in `docs/HANDOFF.md` context.

## Global Constraints

- Preserve portrait focus, tactile ink outlines, editorial asymmetry, staged reveal, and a physical letter interaction.
- Use project-authored CSS and inline SVG assets only.
- Mobile is separately art-directed and must not inherit a settled desktop transform.
- Reduced motion reveals all content immediately and removes ambient loops.
- Keep personalization data in shared `CardConfig`; do not hard-code editable content into selectors or keyframes.
- Do not commit before user review.

---

### Task 1: Registry and regression contract

**Files:**
- Modify: `scripts/template-registry.js`
- Modify: `tests/card-config.test.js`

**Interfaces:**
- Consumes: `TEMPLATE_IDS`, `TEMPLATES`, and `normalizeCardConfig()`.
- Produces: `TEMPLATE_IDS.POST_OFFICE` with route `templates/birthday-post-office/index.html`.

- [ ] Add a failing registry/build test for the seventh template and its production route.
- [ ] Run `npm test` and confirm the new assertions fail.
- [ ] Register Birthday Post Office with the shared content limits.
- [ ] Add template-specific assertions for mobile motion, reduced motion, letter markup, and safe decoration zones.

### Task 2: Recipient-facing template

**Files:**
- Create: `templates/birthday-post-office/index.html`
- Create: `templates/birthday-post-office/style.css`
- Create: `templates/birthday-post-office/preview.js`

**Interfaces:**
- Consumes: `connectTemplatePreview()` and the existing `birthday-card:replay` message.
- Produces: semantic stage, portrait bindings, editable text bindings, deterministic replay, keyboard-accessible letter dialog.

- [ ] Build the airmail stage with shipping-label headline and portrait postage stamp.
- [ ] Draw the route, postmarks, stamps, and envelope details with CSS/inline SVG.
- [ ] Implement the narrative sequence: stage, labels, headline, portrait stamp, route/postmark, personal data, CTA, ambient.
- [ ] Implement the envelope-to-letter 3D reveal using the shared dialog controls.
- [ ] Add a dedicated `<=658px` portrait keyframe and mobile decoration safety band.
- [ ] Add reduced-motion behavior that exposes the settled composition.

### Task 3: Documentation and verification

**Files:**
- Modify: `docs/ui/TEMPLATE-MOODBOARDS.md`
- Modify: `ASSET-SOURCES.md`
- Modify: `docs/HANDOFF.md`

**Interfaces:**
- Consumes: completed template behavior.
- Produces: durable design, asset-provenance, and handoff notes.

- [ ] Document palette, typography, layout, motion, signature element, and code-native asset provenance.
- [ ] Run `npm test` and `npm run build`.
- [ ] Start the no-cache dev server and capture settled desktop and mobile screenshots.
- [ ] Inspect both screenshots for clipping, overlap, portrait priority, and CTA legibility; revise and repeat if needed.
- [ ] Inspect `git diff` and leave every change uncommitted for user review.

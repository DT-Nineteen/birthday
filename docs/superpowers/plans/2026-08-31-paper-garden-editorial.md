# Paper Garden Editorial Botanical Implementation Plan

**Goal:** Replace Paper Garden’s clipped sprite composition with a premium editorial botanical template and a deterministic 16-second reveal.

**Architecture:** The template owns semantic HTML, isolated CSS and a small replay controller. Shared CardConfig and iframe messaging remain unchanged; the builder adds one replay message without replaying on normal content edits.

**Tech Stack:** HTML, CSS keyframes, ES modules and browser postMessage.

**Spec:** docs/ui/PAPER-GARDEN-DESIGN-SPEC.md

## Tasks

- [x] Generate and inspect a self-contained transparent hero botanical.
- [x] Replace decorative sprite nodes with semantic folio, portrait and specimen layers.
- [x] Implement desktop and mobile compositions.
- [x] Preserve letter interaction and CardConfig hooks.
- [x] Implement the 16-second sequence defined in the motion spec.
- [x] Add the birthday-card:replay message and builder control.
- [x] Run tests, build and visual review at builder desktop and mobile viewports.
- [x] Check console, replay and letter interaction.
- [ ] Complete a dedicated 768×1024 screenshot review before production release.

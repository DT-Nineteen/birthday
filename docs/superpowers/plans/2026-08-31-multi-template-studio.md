# Multi-template Birthday Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current single birthday card builder into a three-template studio with local portrait upload, positioning, and zoom.

**Architecture:** Keep the creator surface as static ES modules and each recipient-facing template as an isolated iframe route. A shared configuration module and template registry are the only cross-template contracts; each template owns its markup, CSS, assets, and motion while sharing a small preview runtime.

**Tech Stack:** Static HTML/CSS, browser ES modules, Node built-in tests, existing Sites worker build, Playwright CLI.

**Spec:** User-approved plan in the 2026-08-31 Codex task and `docs/ui/TEMPLATE-CONTRACT.md`.

## Global Constraints

- Templates: `pink-celebration`, `midnight-disco`, `paper-garden`.
- All three templates are free and birthday-only.
- Portraits stay local via object URLs; no persistence, accounts, payments, or publishing.
- Each new template needs a distinct art direction, motion system, responsive layout, and reduced-motion mode.
- User content is assigned with `textContent`; unknown configuration fields are ignored.
- All generated or third-party assets must be recorded in `ASSET-SOURCES.md`.

---

### Task 1: Shared template and portrait contract

**Files:** Modify `scripts/card-config.js`; create `scripts/template-registry.js`; modify `tests/card-config.test.js`.

**Interfaces:** Produce `TEMPLATE_IDS`, `TEMPLATES`, `getTemplate(id)`, and normalized `templateId`, `portraitUrl`, `portraitPosition`, `portraitScale` fields.

- [ ] Add tests for template fallback, registry uniqueness, portrait position clamping to 0–100, and scale clamping to 1–2.5.
- [ ] Implement the registry with routes and metadata for all three templates.
- [ ] Run `npm test` and confirm the contract tests pass.

### Task 2: Shared preview runtime and original template compatibility

**Files:** Modify `index.html`, `style.css`, `scripts/card-preview.js`; create `scripts/template-preview.js`.

**Interfaces:** `connectTemplatePreview({ applyConfig, openLetter, closeLetter })` handles ready/config messages; every template exposes `[data-card-portrait]` plus existing text targets.

- [ ] Add portrait targets and apply object position/scale with CSS custom properties.
- [ ] Preserve the original staged motion, letter behavior, standalone defaults, and current `/` route.
- [ ] Verify the original card still renders with its default content.

### Task 3: Builder template chooser and local portrait controls

**Files:** Modify `builder.html`, `builder.css`, `scripts/builder.js`.

**Interfaces:** Builder owns one full config snapshot, changes iframe `src` from the registry, and revokes only the previous user-created object URL.

- [ ] Add three visual template buttons with names and short art-direction descriptions.
- [ ] Add image input accepting PNG/JPEG/WebP/GIF, a replace action, image error state, X/Y range controls, and zoom range 1–2.5.
- [ ] Preserve all text and portrait settings across template switches; resend the full config after iframe readiness.
- [ ] Keep keyboard focus, live validation, Desktop/Mobile/Fit controls, and the desktop-only builder boundary.

### Task 4: Midnight Disco template

**Files:** Create `templates/midnight-disco/index.html`, `templates/midnight-disco/style.css`, `templates/midnight-disco/preview.js`; add project-owned raster assets under `images/templates/midnight-disco/`.

**Interfaces:** Consume the common CardConfig and preview message contract.

- [ ] Build a club-poster composition with midnight navy, ultraviolet, hot coral, mirror silver, and electric cyan.
- [ ] Use portrait-as-disco-record as the focal point, with a light sweep, orbiting glints, equalizer accents, and a ticket-style letter reveal.
- [ ] Add responsive and reduced-motion states without copying the Pink Celebration layout.

### Task 5: Paper Garden template

**Files:** Create `templates/paper-garden/index.html`, `templates/paper-garden/style.css`, `templates/paper-garden/preview.js`; add project-owned raster assets under `images/templates/paper-garden/`.

**Interfaces:** Consume the common CardConfig and preview message contract.

- [ ] Build a scrapbook composition with cotton paper, leaf green, marigold, dusty rose, and ink brown.
- [ ] Use a portrait inside a botanical pressed-paper frame, drifting petals, stitched labels, and an unfolding note interaction.
- [ ] Add responsive and reduced-motion states without copying either earlier template.

### Task 6: Asset provenance, build, and browser verification

**Files:** Create `ASSET-SOURCES.md`; modify build tests and generated `dist/server/index.js`.

- [ ] Record every reused and generated asset, source, license/status, prompt, and intended template.
- [ ] Assert production routes for both template pages, styles, scripts, and template registry.
- [ ] Run `npm test`, `npm run build`, and `git diff --check`.
- [ ] Use Playwright at 390×844, 768×1024, 1366×768, and 1440×900 to verify template switching, content retention, upload, position, zoom, invalid image fallback, letter controls, console output, and reduced motion.
- [ ] Commit the exact validated source.

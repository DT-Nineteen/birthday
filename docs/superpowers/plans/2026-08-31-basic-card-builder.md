# Basic Card Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a desktop-only editor with a left toolbar and isolated live desktop/mobile preview for the existing birthday card.

**Architecture:** Keep `index.html` as the recipient-facing card and render it inside an iframe from a new `builder.html` surface. A shared serializable configuration module defines defaults and validation; the builder sends full configuration snapshots with `postMessage`, and the card preview applies them only from its parent window.

**Tech Stack:** Static HTML, CSS, browser ES modules, Node.js built-in test runner, existing Sites static worker build, Playwright for browser verification.

**Spec:** `docs/superpowers/specs/2026-08-31-basic-card-builder-design.md`

## Global Constraints

- Preserve the current birthday card art direction and staged animation.
- Builder editing is desktop-only in this milestone; card preview remains responsive.
- Expose only recipient name, date label, and message in the first toolbar.
- Keep builder CSS isolated from card CSS through an iframe.
- Assign user content with `textContent`, never `innerHTML`.
- Do not add accounts, persistence, uploads, themes, templates, public links, payments, analytics, or custom URLs.

---

### Task 1: Shared configuration and validation

**Files:**
- Create: `scripts/card-config.js`
- Create: `tests/card-config.test.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `DEFAULT_CARD_CONFIG`, `normalizeCardConfig(value)`, and `validateEditableFields(value)`.
- `validateEditableFields` returns `{ name?: string, dateLabel?: string, message?: string }` containing only current errors.

- [ ] **Step 1: Write failing configuration tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CARD_CONFIG,
  normalizeCardConfig,
  validateEditableFields
} from "../scripts/card-config.js";

test("normalizes missing fields to template defaults", () => {
  const result = normalizeCardConfig({ recipient: { name: " Lan " } });
  assert.equal(result.recipient.name, "Lan");
  assert.equal(result.occasion.dateLabel, DEFAULT_CARD_CONFIG.occasion.dateLabel);
  assert.equal(result.letter.message, DEFAULT_CARD_CONFIG.letter.message);
});

test("reports editable length errors", () => {
  const errors = validateEditableFields({
    recipient: { name: "A" },
    occasion: { dateLabel: "" },
    letter: { message: "short" }
  });
  assert.deepEqual(Object.keys(errors).sort(), ["dateLabel", "message", "name"]);
});

test("accepts realistic Vietnamese content", () => {
  const errors = validateEditableFields({
    recipient: { name: "Bảo Ngọc" },
    occasion: { dateLabel: "07 tháng 8" },
    letter: { message: "Chúc bạn một tuổi mới thật nhiều niềm vui và những điều dịu dàng." }
  });
  assert.deepEqual(errors, {});
});
```

- [ ] **Step 2: Add the test script and verify failure**

Update `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "build": "node scripts/build-static-site.mjs",
    "test": "node --test"
  }
}
```

Run: `npm test`

Expected: FAIL because `scripts/card-config.js` does not exist.

- [ ] **Step 3: Implement defaults, normalization, and validation**

Create a deeply frozen default configuration matching the current Hi Beo card. Normalize strings with `trim()`, preserve only supported fields, and validate name 2–24 characters, date 1–24 characters, and message 20–500 characters.

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add package.json scripts/card-config.js tests/card-config.test.js
git commit -m "feat: add card configuration contract"
```

### Task 2: Make the existing card config-driven

**Files:**
- Create: `scripts/card-preview.js`
- Modify: `index.html`
- Modify: `style.css`

**Interfaces:**
- Consumes: `normalizeCardConfig(value)` from `scripts/card-config.js`.
- Consumes message: `{ type: "birthday-card:config", config: CardConfig }` from `window.parent`.
- Produces message: `{ type: "birthday-card:ready" }` to `window.parent`.

- [ ] **Step 1: Add stable DOM targets to the card**

Use `data-card-field` attributes for `recipient-name`, `date-label`, `cta-label`, `cover-recipient`, and `message`. Keep the letter-by-letter headline markup and all decorative markup unchanged. Replace the inline script with:

```html
<script type="module" src="scripts/card-preview.js"></script>
```

- [ ] **Step 2: Implement preview configuration application**

In `scripts/card-preview.js`, export `applyCardConfig(config)`. Update all matching DOM targets with `textContent`; compute document title and CTA/cover labels from the normalized recipient name. On initial standalone load, apply `DEFAULT_CARD_CONFIG`. Accept configuration messages only when `event.source === window.parent`.

- [ ] **Step 3: Preserve the existing entrance and letter behavior**

Move the date typing and letter open/close behavior from the inline script into `card-preview.js`. Configuration updates after initial reveal update the date immediately rather than replaying the timeline. Make the letter button and close control keyboard-operable and restore focus on close.

- [ ] **Step 4: Add reduced-motion and long-message safeguards**

Add CSS under `@media (prefers-reduced-motion: reduce)` that reveals primary content immediately, cancels infinite decoration loops, and uses a short letter opacity transition. Allow the message area to scroll or reflow without clipping.

- [ ] **Step 5: Run static tests and build**

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: build succeeds and includes the card page and local assets.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css scripts/card-preview.js
git commit -m "refactor: render birthday card from configuration"
```

### Task 3: Build the minimal editor shell

**Files:**
- Create: `builder.html`
- Create: `builder.css`
- Create: `scripts/builder.js`

**Interfaces:**
- Consumes: defaults and validation from `scripts/card-config.js`.
- Sends: `{ type: "birthday-card:config", config }` to the card iframe.
- Receives: `{ type: "birthday-card:ready" }` from the card iframe.

- [ ] **Step 1: Create semantic builder markup**

Create a two-column desktop shell with:

```html
<aside class="editor-panel" aria-label="Chỉnh sửa thiệp">
  <form id="card-editor" novalidate>
    <label for="recipient-name">Tên người nhận</label>
    <input id="recipient-name" name="recipientName" maxlength="24">
    <p id="recipient-name-error" class="field-error"></p>

    <label for="birthday-date">Ngày sinh</label>
    <input id="birthday-date" name="birthdayDate" maxlength="24">
    <p id="birthday-date-error" class="field-error"></p>

    <label for="birthday-message">Lời chúc</label>
    <textarea id="birthday-message" name="message" maxlength="500"></textarea>
    <p id="birthday-message-error" class="field-error"></p>
  </form>
</aside>
```

Add a preview toolbar with three real buttons and an iframe titled `Xem trước thiệp sinh nhật` loading `index.html`.

- [ ] **Step 2: Style a quiet editor around the expressive card**

Use a neutral warm workspace, 340px sidebar, compact form hierarchy, visible focus, and a centered preview stage. Keep builder styling out of `style.css`. At builder widths below 900px, show a message that editing requires a larger screen.

- [ ] **Step 3: Implement live state and validation**

Initialize fields from `DEFAULT_CARD_CONFIG`. On `input`, create a new full config snapshot, render inline errors from `validateEditableFields`, and send the snapshot to the ready iframe. Do not debounce the three text fields unless browser profiling shows a real issue.

- [ ] **Step 4: Implement viewport controls**

Desktop sets a logical preview size of 1366×768. Mobile sets 390×844. Fit computes a CSS scale from available workspace dimensions while preserving the selected logical iframe viewport. Set `aria-pressed` on the selected mode.

- [ ] **Step 5: Commit**

```bash
git add builder.html builder.css scripts/builder.js
git commit -m "feat: add live birthday card editor"
```

### Task 4: Include the builder and scripts in the Sites build

**Files:**
- Modify: `scripts/build-static-site.mjs`
- Modify: `tests/card-config.test.js`

**Interfaces:**
- Produces static routes `/builder`, `/builder.html`, `/scripts/builder.js`, `/scripts/card-config.js`, and `/scripts/card-preview.js`.

- [ ] **Step 1: Add a failing build-output assertion**

Extend the Node test to run the build and assert the generated worker source contains `"/builder"`, `"/builder.css"`, and `"/scripts/card-config.js"`.

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test`

Expected: FAIL because the current source filter excludes builder CSS and browser scripts.

- [ ] **Step 3: Expand the source-file filter**

Include all root-level `.html` and `.css` files plus browser `.js` files under `scripts/`, while excluding `build-static-site.mjs`. Preserve images and existing clean HTML routes.

- [ ] **Step 4: Run tests and production build**

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: output reports builder and script routes and exits successfully.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-static-site.mjs tests/card-config.test.js dist/server/index.js
git commit -m "build: publish birthday card editor assets"
```

### Task 5: Browser verification and first visual handoff

**Files:**
- Modify only if verification exposes a concrete defect.

**Interfaces:**
- Verifies the complete builder → iframe → card flow.

- [ ] **Step 1: Start the local static preview**

Run the built worker or a local static server using the repository's supported flow. Keep one retained server session.

- [ ] **Step 2: Verify the builder flow with Playwright**

Check:

- `/builder` loads without console errors;
- changing each field updates every mapped card target;
- invalid lengths show inline warnings without discarding input;
- Desktop and Mobile set logical viewport sizes correctly;
- Fit scales without changing the iframe's responsive breakpoint;
- letter opens and closes with pointer and keyboard;
- long Vietnamese text remains readable;
- reduced-motion content is immediately visible.

- [ ] **Step 3: Capture baseline screenshots**

Capture builder desktop mode, builder mobile mode, opened desktop letter, and opened mobile letter. Compare the card portion against the original baseline for art-direction regressions.

- [ ] **Step 4: Run final evidence checks**

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: build exits 0 with no missing routes.

- [ ] **Step 5: Commit verified fixes, if any**

```bash
git add <only-files-changed-by-verification>
git commit -m "fix: polish birthday builder preview"
```

Skip this commit when verification required no source changes.

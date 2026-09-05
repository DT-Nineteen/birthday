import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  DEFAULT_CARD_CONFIG,
  normalizeCardConfig,
  validateEditableFields
} from "../scripts/card-config.js";
import { TEMPLATES, getTemplate } from "../scripts/template-registry.js";

const execFileAsync = promisify(execFile);

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

test("keeps an intentionally cleared editable field for live preview", () => {
  const result = normalizeCardConfig({ occasion: { dateLabel: "   " } });
  assert.equal(result.occasion.dateLabel, "");
});

test("normalizes template and portrait transform values", () => {
  const result = normalizeCardConfig({
    templateId: "midnight-disco",
    recipient: { portraitPosition: { x: -20, y: 140 }, portraitScale: 9 }
  });
  assert.equal(result.templateId, "midnight-disco");
  assert.deepEqual(result.recipient.portraitPosition, { x: 0, y: 100 });
  assert.equal(result.recipient.portraitScale, 2.5);
});

test("normalizes every registered template without falling back", () => {
  for (const { id } of TEMPLATES) assert.equal(normalizeCardConfig({ templateId: id }).templateId, id);
});

test("template registry has unique ids and safe fallback", () => {
  assert.equal(new Set(TEMPLATES.map(({ id }) => id)).size, 7);
  assert.equal(getTemplate("birthday-post-office").route, "templates/birthday-post-office/index.html");
  assert.equal(getTemplate("missing").id, "pink-celebration");
});

test("birthday post office owns its delivery story and responsive motion", async () => {
  const html = await readFile(new URL("../templates/birthday-post-office/index.html", import.meta.url), "utf8");
  const css = await readFile(new URL("../templates/birthday-post-office/style.css", import.meta.url), "utf8");

  assert.match(html, /data-card-portrait/);
  assert.match(html, /data-letter-dialog/);
  assert.match(html, /class="delivery-route"/);
  assert.match(css, /@keyframes stamp-arrival-mobile[\s\S]*?translate3d\(0,0,0\)/);
  assert.match(css, /@media\(max-width:658px\)[\s\S]*?animation-name:stamp-arrival-mobile/);
  assert.match(css, /\.mobile-mail-band\{display:block/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});

test("paper garden protects display type, portrait caption, and ambient motion", async () => {
  const html = await readFile(new URL("../templates/paper-garden/index.html", import.meta.url), "utf8");
  const css = await readFile(new URL("../templates/paper-garden/style.css", import.meta.url), "utf8");
  const leafMarkup = html.match(/<div class="drifting-petals"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
  const leafCount = (leafMarkup.match(/<i><\/i>/g) ?? []).length;

  assert.equal(leafCount, 12);
  assert.match(css, /\.garden-copy h1\{width:max-content;max-width:none;overflow:visible\}/);
  assert.match(css, /\.botanical-frame figcaption\{z-index:6;right:24%;gap:12px\}/);
  assert.match(css, /paper-garden-leaf-fall var\(--duration\) var\(--delay\) linear infinite/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\).*\.drifting-petals\{display:none\}/);
});

test("sticker book resets portrait motion and keeps mobile stickers out of copy", async () => {
  const css = await readFile(new URL("../templates/sticker-book/style.css", import.meta.url), "utf8");

  assert.match(css, /@keyframes photo-stick-mobile\{[^}]*transform:translateY\(-42px\)[\s\S]*?translate3d\(0,0,0\)/);
  assert.match(css, /@media\(max-width:658px\)\{\s*\.is-playing \.photo-booth\{animation-name:photo-stick-mobile\}/);
  assert.match(css, /\.sticker-gift\{left:2%;top:44%;bottom:auto;width:13%\}/);
  assert.match(css, /\.sticker-cake\{right:2%;top:43%;bottom:auto;width:14%\}/);
});

test("doodle party owns a mobile portrait keyframe and safe decoration band", async () => {
  const css = await readFile(new URL("../templates/doodle-party/style.css", import.meta.url), "utf8");

  assert.match(css, /@keyframes doodle-photo-mobile[\s\S]*?translate3d\(0,0,0\)/);
  assert.match(css, /@media\(max-width:658px\)[\s\S]*?animation-name:doodle-photo-mobile/);
  assert.match(css, /\.mobile-doodle-band\{display:block/);
  assert.match(css, /@media\(max-width:658px\)\{\.pin-two\{display:none\}\}/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});

test("production build contains builder routes and browser scripts", async () => {
  await execFileAsync(process.execPath, ["scripts/build-static-site.mjs"], {
    cwd: new URL("..", import.meta.url)
  });
  const worker = await readFile(new URL("../dist/server/index.js", import.meta.url), "utf8");
  assert.match(worker, /"\/builder"/);
  assert.match(worker, /"\/builder\.css"/);
  assert.match(worker, /"\/scripts\/card-config\.js"/);
  assert.match(worker, /"\/scripts\/card-preview\.js"/);
  assert.match(worker, /"\/templates\/midnight-disco\/index\.html"/);
  assert.match(worker, /"\/templates\/paper-garden\/index\.html"/);
  assert.match(worker, /"\/templates\/soft-film\/index\.html"/);
  assert.match(worker, /"\/templates\/sticker-book\/index\.html"/);
  assert.match(worker, /"\/templates\/doodle-party\/index\.html"/);
  assert.match(worker, /"\/templates\/birthday-post-office\/index\.html"/);
});

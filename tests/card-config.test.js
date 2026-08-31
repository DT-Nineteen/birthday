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

test("production build contains builder routes and browser scripts", async () => {
  await execFileAsync(process.execPath, ["scripts/build-static-site.mjs"], {
    cwd: new URL("..", import.meta.url)
  });
  const worker = await readFile(new URL("../dist/server/index.js", import.meta.url), "utf8");
  assert.match(worker, /"\/builder"/);
  assert.match(worker, /"\/builder\.css"/);
  assert.match(worker, /"\/scripts\/card-config\.js"/);
  assert.match(worker, /"\/scripts\/card-preview\.js"/);
});

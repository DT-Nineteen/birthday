import { DEFAULT_CARD_CONFIG, normalizeCardConfig, validateEditableFields } from "./card-config.js";
import { TEMPLATES, getTemplate } from "./template-registry.js";

const CONFIG_MESSAGE = "birthday-card:config";
const READY_MESSAGE = "birthday-card:ready";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const fieldMap = {
  name: { input: document.querySelector("#recipient-name"), error: document.querySelector("#recipient-name-error"), count: document.querySelector("#recipient-name-count") },
  dateLabel: { input: document.querySelector("#birthday-date"), error: document.querySelector("#birthday-date-error"), count: document.querySelector("#birthday-date-count") },
  message: { input: document.querySelector("#birthday-message"), error: document.querySelector("#birthday-message-error"), count: document.querySelector("#birthday-message-count") }
};
const templateList = document.querySelector("#template-list");
const canvas = document.querySelector("#preview-canvas");
const frame = document.querySelector("#preview-frame");
const iframe = document.querySelector("#card-preview");
const sizeLabel = document.querySelector("#preview-size");
const status = document.querySelector("#preview-status");
const retryButton = document.querySelector("#retry-preview");
const replayButton = document.querySelector("#replay-preview");
const modeButtons = [...document.querySelectorAll("[data-mode]")];
const portraitUpload = document.querySelector("#portrait-upload");
const portraitReset = document.querySelector("#portrait-reset");
const portraitImage = document.querySelector("#portrait-editor-image");
const portraitCrop = document.querySelector("#portrait-crop");
const portraitError = document.querySelector("#portrait-error");
const sliders = { x: document.querySelector("#portrait-x"), y: document.querySelector("#portrait-y"), scale: document.querySelector("#portrait-zoom") };
const sliderOutputs = { x: document.querySelector("#portrait-x-output"), y: document.querySelector("#portrait-y-output"), scale: document.querySelector("#portrait-zoom-output") };
const viewports = { desktop: { width: 1366, height: 768 }, mobile: { width: 390, height: 844 } };

let state = normalizeCardConfig(DEFAULT_CARD_CONFIG);
let iframeReady = false;
let activeMode = "desktop";
let logicalMode = "desktop";
let loadFailureTimer;
let uploadedObjectUrl = null;
let dragStart = null;
let previewRevision = 0;

function buildPreviewUrl(templateId) {
  const route = getTemplate(templateId).route;
  const separator = route.includes("?") ? "&" : "?";
  previewRevision += 1;
  return `${route}${separator}preview=${Date.now()}-${previewRevision}`;
}

function renderTemplatePicker() {
  templateList.replaceChildren(...TEMPLATES.map((template) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "template-card";
    button.dataset.template = template.id;
    button.setAttribute("aria-pressed", String(template.id === state.templateId));
    const name = document.createElement("strong");
    name.textContent = template.name;
    const description = document.createElement("span");
    description.textContent = template.description;
    button.append(name, description);
    button.addEventListener("click", () => selectTemplate(template.id));
    return button;
  }));
}

function syncStateFromFields() {
  state = normalizeCardConfig({
    ...state,
    recipient: { ...state.recipient, name: fieldMap.name.input.value, portraitPosition: { x: sliders.x.value, y: sliders.y.value }, portraitScale: sliders.scale.value },
    occasion: { ...state.occasion, dateLabel: fieldMap.dateLabel.input.value },
    letter: { ...state.letter, message: fieldMap.message.input.value }
  });
}

function renderPortraitControls() {
  const { x, y } = state.recipient.portraitPosition;
  if (portraitImage.src !== new URL(state.recipient.portraitUrl, window.location.href).href) portraitImage.src = state.recipient.portraitUrl;
  portraitImage.style.setProperty("--portrait-x", `${x}%`);
  portraitImage.style.setProperty("--portrait-y", `${y}%`);
  portraitImage.style.setProperty("--portrait-scale", state.recipient.portraitScale);
  sliders.x.value = x;
  sliders.y.value = y;
  sliders.scale.value = state.recipient.portraitScale;
  sliderOutputs.x.value = Math.round(x);
  sliderOutputs.y.value = Math.round(y);
  sliderOutputs.scale.value = `${Number(state.recipient.portraitScale).toFixed(1)}×`;
}

function postConfig() {
  if (iframeReady) iframe.contentWindow.postMessage({ type: CONFIG_MESSAGE, config: state }, window.location.origin);
}

function renderValidation() {
  const errors = validateEditableFields(state);
  Object.entries(fieldMap).forEach(([key, field]) => {
    field.error.textContent = errors[key] ?? "";
    field.input.setAttribute("aria-invalid", errors[key] ? "true" : "false");
    field.count.textContent = `${field.input.value.length}/${field.input.maxLength}`;
  });
}

function updateAll() {
  syncStateFromFields();
  renderPortraitControls();
  renderValidation();
  postConfig();
}

function selectTemplate(id) {
  const template = getTemplate(id);
  if (template.id !== state.templateId) {
    state = normalizeCardConfig({ ...state, templateId: template.id });
  }
  iframeReady = false;
  status.hidden = true;
  iframe.src = buildPreviewUrl(template.id);
  renderTemplatePicker();
  watchPreviewLoad();
}

function availableScale(viewport) {
  const styles = window.getComputedStyle(canvas);
  const width = canvas.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
  const height = canvas.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
  return Math.min(1, width / viewport.width, height / viewport.height);
}

function renderViewport() {
  const viewport = viewports[logicalMode];
  frame.style.width = `${viewport.width}px`;
  frame.style.height = `${viewport.height}px`;
  const scale = availableScale(viewport);
  frame.style.transform = `scale(${scale})`;
  frame.style.marginInline = `${(viewport.width * scale - viewport.width) / 2}px`;
  frame.style.marginBlock = `${(viewport.height * scale - viewport.height) / 2}px`;
  sizeLabel.textContent = `${viewport.width} × ${viewport.height} · ${Math.round(scale * 100)}%`;
  modeButtons.forEach((button) => {
    const selected = button.dataset.mode === activeMode;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function selectMode(mode) {
  activeMode = mode;
  if (mode !== "fit") logicalMode = mode;
  renderViewport();
}

function setPortraitUrl(url, objectUrl = null) {
  if (uploadedObjectUrl && uploadedObjectUrl !== objectUrl) URL.revokeObjectURL(uploadedObjectUrl);
  uploadedObjectUrl = objectUrl;
  state = normalizeCardConfig({ ...state, recipient: { ...state.recipient, portraitUrl: url } });
  portraitError.textContent = "";
  renderPortraitControls();
  postConfig();
}

function handlePortraitFile(file) {
  if (!file) return;
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    portraitError.textContent = "Chọn ảnh PNG, JPG, WebP hoặc GIF.";
    portraitUpload.value = "";
    return;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    portraitError.textContent = "Ảnh cần nhỏ hơn 8MB.";
    portraitUpload.value = "";
    return;
  }
  const objectUrl = URL.createObjectURL(file);
  const probe = new Image();
  probe.onload = () => setPortraitUrl(objectUrl, objectUrl);
  probe.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    portraitError.textContent = "Không đọc được ảnh này. Hãy thử ảnh khác.";
  };
  probe.src = objectUrl;
}

function applyDrag(event) {
  if (!dragStart) return;
  const dx = (event.clientX - dragStart.pointerX) / portraitCrop.clientWidth * 100;
  const dy = (event.clientY - dragStart.pointerY) / portraitCrop.clientHeight * 100;
  sliders.x.value = Math.max(0, Math.min(100, dragStart.x - dx));
  sliders.y.value = Math.max(0, Math.min(100, dragStart.y - dy));
  updateAll();
}

fieldMap.name.input.value = state.recipient.name;
fieldMap.dateLabel.input.value = state.occasion.dateLabel;
fieldMap.message.input.value = state.letter.message;
Object.values(fieldMap).forEach((field) => field.input.addEventListener("input", updateAll));
Object.values(sliders).forEach((slider) => slider.addEventListener("input", updateAll));
modeButtons.forEach((button) => button.addEventListener("click", () => selectMode(button.dataset.mode)));
portraitUpload.addEventListener("change", () => handlePortraitFile(portraitUpload.files?.[0]));
portraitReset.addEventListener("click", () => setPortraitUrl(DEFAULT_CARD_CONFIG.recipient.portraitUrl));
portraitImage.addEventListener("error", () => {
  portraitError.textContent = "Ảnh không còn khả dụng. Đã trở về ảnh mặc định.";
  setPortraitUrl(DEFAULT_CARD_CONFIG.recipient.portraitUrl);
});
portraitCrop.addEventListener("pointerdown", (event) => {
  dragStart = { pointerX: event.clientX, pointerY: event.clientY, x: state.recipient.portraitPosition.x, y: state.recipient.portraitPosition.y };
  portraitCrop.setPointerCapture(event.pointerId);
});
portraitCrop.addEventListener("pointermove", applyDrag);
portraitCrop.addEventListener("pointerup", () => { dragStart = null; });
portraitCrop.addEventListener("pointercancel", () => { dragStart = null; });
window.addEventListener("resize", renderViewport);
window.addEventListener("beforeunload", () => { if (uploadedObjectUrl) URL.revokeObjectURL(uploadedObjectUrl); });
window.addEventListener("message", (event) => {
  if (event.source !== iframe.contentWindow) return;
  if (event.data?.type === READY_MESSAGE) {
    iframeReady = true;
    window.clearTimeout(loadFailureTimer);
    status.hidden = true;
    postConfig();
  }
  if (event.data?.type === "birthday-card:portrait-error") portraitError.textContent = "Template không đọc được ảnh. Hãy chọn lại ảnh.";
});

function watchPreviewLoad() {
  window.clearTimeout(loadFailureTimer);
  loadFailureTimer = window.setTimeout(() => { if (!iframeReady) status.hidden = false; }, 6000);
}

iframe.addEventListener("load", watchPreviewLoad);
retryButton.addEventListener("click", () => {
  iframeReady = false;
  status.hidden = true;
  iframe.src = buildPreviewUrl(state.templateId);
  watchPreviewLoad();
});
replayButton.addEventListener("click", () => {
  if (iframeReady) iframe.contentWindow.postMessage({ type: "birthday-card:replay" }, window.location.origin);
});

renderTemplatePicker();
renderPortraitControls();
renderValidation();
renderViewport();
iframe.src = buildPreviewUrl(state.templateId);
watchPreviewLoad();

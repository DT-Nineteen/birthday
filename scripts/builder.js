import { DEFAULT_CARD_CONFIG, validateEditableFields } from "./card-config.js";

const CONFIG_MESSAGE = "birthday-card:config";
const READY_MESSAGE = "birthday-card:ready";
const fieldMap = {
  name: {
    input: document.querySelector("#recipient-name"),
    error: document.querySelector("#recipient-name-error"),
    count: document.querySelector("#recipient-name-count")
  },
  dateLabel: {
    input: document.querySelector("#birthday-date"),
    error: document.querySelector("#birthday-date-error"),
    count: document.querySelector("#birthday-date-count")
  },
  message: {
    input: document.querySelector("#birthday-message"),
    error: document.querySelector("#birthday-message-error"),
    count: document.querySelector("#birthday-message-count")
  }
};

const canvas = document.querySelector("#preview-canvas");
const frame = document.querySelector("#preview-frame");
const iframe = document.querySelector("#card-preview");
const sizeLabel = document.querySelector("#preview-size");
const status = document.querySelector("#preview-status");
const retryButton = document.querySelector("#retry-preview");
const modeButtons = [...document.querySelectorAll("[data-mode]")];
const viewports = {
  desktop: { width: 1366, height: 768 },
  mobile: { width: 390, height: 844 }
};

let iframeReady = false;
let activeMode = "desktop";
let logicalMode = "desktop";
let loadFailureTimer;

fieldMap.name.input.value = DEFAULT_CARD_CONFIG.recipient.name;
fieldMap.dateLabel.input.value = DEFAULT_CARD_CONFIG.occasion.dateLabel;
fieldMap.message.input.value = DEFAULT_CARD_CONFIG.letter.message;

function currentConfig() {
  return {
    ...DEFAULT_CARD_CONFIG,
    recipient: { ...DEFAULT_CARD_CONFIG.recipient, name: fieldMap.name.input.value },
    occasion: { ...DEFAULT_CARD_CONFIG.occasion, dateLabel: fieldMap.dateLabel.input.value },
    letter: { ...DEFAULT_CARD_CONFIG.letter, message: fieldMap.message.input.value }
  };
}

function postConfig() {
  if (!iframeReady) return;
  iframe.contentWindow.postMessage({ type: CONFIG_MESSAGE, config: currentConfig() }, window.location.origin);
}

function renderValidation() {
  const config = currentConfig();
  const errors = validateEditableFields(config);
  Object.entries(fieldMap).forEach(([key, field]) => {
    const value = field.input.value;
    field.error.textContent = errors[key] ?? "";
    field.input.setAttribute("aria-invalid", errors[key] ? "true" : "false");
    field.count.textContent = `${value.length}/${field.input.maxLength}`;
  });
}

function availableScale(viewport) {
  const styles = window.getComputedStyle(canvas);
  const availableWidth = canvas.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
  const availableHeight = canvas.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
  return Math.min(1, availableWidth / viewport.width, availableHeight / viewport.height);
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
  if (mode === "desktop" || mode === "mobile") logicalMode = mode;
  renderViewport();
}

Object.values(fieldMap).forEach((field) => {
  field.input.addEventListener("input", () => {
    renderValidation();
    postConfig();
  });
});

modeButtons.forEach((button) => button.addEventListener("click", () => selectMode(button.dataset.mode)));
window.addEventListener("resize", renderViewport);

window.addEventListener("message", (event) => {
  if (event.source !== iframe.contentWindow || event.data?.type !== READY_MESSAGE) return;
  iframeReady = true;
  window.clearTimeout(loadFailureTimer);
  status.hidden = true;
  postConfig();
});

function watchPreviewLoad() {
  window.clearTimeout(loadFailureTimer);
  loadFailureTimer = window.setTimeout(() => {
    if (!iframeReady) status.hidden = false;
  }, 6000);
}

iframe.addEventListener("load", watchPreviewLoad);
retryButton.addEventListener("click", () => {
  iframeReady = false;
  status.hidden = true;
  iframe.src = `index.html?retry=${Date.now()}`;
  watchPreviewLoad();
});

renderValidation();
renderViewport();
watchPreviewLoad();

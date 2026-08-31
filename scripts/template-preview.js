import { DEFAULT_CARD_CONFIG, normalizeCardConfig } from "./card-config.js";

const CONFIG_MESSAGE = "birthday-card:config";
const READY_MESSAGE = "birthday-card:ready";

function setField(field, value) {
  document.querySelectorAll(`[data-card-field="${field}"]`).forEach((node) => { node.textContent = value; });
}

function resolvePortraitUrl(url) {
  if (/^(blob:|data:|https?:|\/)/.test(url)) return url;
  return new URL(`../${url}`, import.meta.url).href;
}

export function applyTemplateConfig(value) {
  const config = normalizeCardConfig(value);
  const recipientLabel = `${config.recipient.name} ${config.recipient.emoji}`.trim();
  document.title = `${config.recipient.name} · Birthday`;
  setField("recipient-name", config.recipient.name);
  setField("date-label", config.occasion.dateLabel);
  setField("cta-label", `${config.letter.buttonLabel} ${config.recipient.name}`);
  setField("cover-recipient", `To: ${recipientLabel}`);
  setField("message", config.letter.message);
  document.querySelectorAll("[data-card-portrait]").forEach((image) => {
    image.style.setProperty("--portrait-x", `${config.recipient.portraitPosition.x}%`);
    image.style.setProperty("--portrait-y", `${config.recipient.portraitPosition.y}%`);
    image.style.setProperty("--portrait-scale", config.recipient.portraitScale);
    image.src = resolvePortraitUrl(config.recipient.portraitUrl);
    image.onerror = () => {
      image.onerror = null;
      image.src = new URL("../images/unnamed.png", import.meta.url).href;
      window.parent?.postMessage({ type: "birthday-card:portrait-error" }, window.location.origin);
    };
  });
  return config;
}

export function connectTemplatePreview() {
  const opener = document.querySelector("[data-letter-open]");
  const dialog = document.querySelector("[data-letter-dialog]");
  const closer = document.querySelector("[data-letter-close]");

  const open = () => {
    dialog.removeAttribute("inert");
    dialog.classList.add("is-open");
    dialog.setAttribute("aria-hidden", "false");
    closer.focus();
  };
  const close = () => {
    dialog.classList.remove("is-open");
    dialog.setAttribute("aria-hidden", "true");
    dialog.setAttribute("inert", "");
    opener.focus();
  };

  opener?.addEventListener("click", open);
  closer?.addEventListener("click", close);
  dialog?.addEventListener("click", (event) => { if (event.target === dialog) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && dialog?.classList.contains("is-open")) close(); });
  applyTemplateConfig(DEFAULT_CARD_CONFIG);
  window.addEventListener("message", (event) => {
    if (event.source === window.parent && event.data?.type === CONFIG_MESSAGE) applyTemplateConfig(event.data.config);
  });
  if (window.parent !== window) window.parent.postMessage({ type: READY_MESSAGE }, window.location.origin);
}

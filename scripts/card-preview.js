import { DEFAULT_CARD_CONFIG, normalizeCardConfig } from "./card-config.js";

const CONFIG_MESSAGE = "birthday-card:config";
const READY_MESSAGE = "birthday-card:ready";
const dateTarget = document.querySelector('[data-card-field="date-label"]');
const dateContainer = document.querySelector(".date__of__birth");
const letterButton = document.querySelector("#btn__letter");
const letterDialog = document.querySelector(".boxMail");
const closeButton = document.querySelector(".letter-close");
let dateTimer;
let dateHasRevealed = false;

function setField(field, value) {
  document.querySelectorAll(`[data-card-field="${field}"]`).forEach((node) => {
    node.textContent = value;
  });
}

function addDateStars() {
  if (!dateContainer || dateContainer.querySelector("i")) return;
  const star = document.createElement("i");
  star.className = "fa-solid fa-star";
  star.setAttribute("aria-hidden", "true");
  dateContainer.prepend(star);
  dateContainer.append(star.cloneNode(true));
}

function renderDate(value, animate = false) {
  window.clearTimeout(dateTimer);
  window.clearInterval(dateTimer);
  if (!dateTarget) return;
  dateTarget.textContent = "";

  if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    dateTarget.textContent = value;
    addDateStars();
    dateHasRevealed = true;
    return;
  }

  dateTimer = window.setTimeout(() => {
    let index = 0;
    dateTimer = window.setInterval(() => {
      dateTarget.textContent += value[index] ?? "";
      index += 1;
      if (index >= value.length) {
        window.clearInterval(dateTimer);
        addDateStars();
        dateHasRevealed = true;
      }
    }, 100);
  }, 12000);
}

export function applyCardConfig(value, options = {}) {
  const config = normalizeCardConfig(value);
  const recipientLabel = `${config.recipient.name} ${config.recipient.emoji}`.trim();
  document.title = `${config.recipient.name} Birthday`;
  setField("recipient-name", config.recipient.name);
  setField("cta-label", `${config.letter.buttonLabel} ${config.recipient.name}`);
  setField("cover-recipient", `To: ${recipientLabel}`);
  setField("message", config.letter.message);
  renderDate(config.occasion.dateLabel, options.animateDate === true && !dateHasRevealed);
  return config;
}

function openLetter() {
  letterDialog.removeAttribute("inert");
  letterDialog.classList.add("active");
  letterDialog.setAttribute("aria-hidden", "false");
  document.body.classList.add("letter-is-open");
  closeButton.focus();
}

function closeLetter() {
  letterDialog.classList.remove("active");
  letterDialog.setAttribute("aria-hidden", "true");
  letterDialog.setAttribute("inert", "");
  document.body.classList.remove("letter-is-open");
  letterButton.focus();
}

letterButton?.addEventListener("click", openLetter);
closeButton?.addEventListener("click", closeLetter);
letterDialog?.addEventListener("click", (event) => {
  if (event.target === letterDialog) closeLetter();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && letterDialog?.classList.contains("active")) closeLetter();
});

applyCardConfig(DEFAULT_CARD_CONFIG, { animateDate: true });

window.addEventListener("message", (event) => {
  if (event.source !== window.parent || event.data?.type !== CONFIG_MESSAGE) return;
  applyCardConfig(event.data.config);
});

if (window.parent !== window) {
  window.parent.postMessage({ type: READY_MESSAGE }, window.location.origin);
}

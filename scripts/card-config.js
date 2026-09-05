import { TEMPLATES } from "./template-registry.js";

const rawDefaults = {
  templateId: "pink-celebration",
  recipient: {
    name: "Hi Beo",
    emoji: "🐷",
    portraitUrl: "images/unnamed.png",
    portraitPosition: { x: 50, y: 50 },
    portraitScale: 1
  },
  occasion: {
    type: "birthday",
    dateLabel: "07 August",
    headlineTop: "Happy",
    headlineBottom: "Birthday"
  },
  letter: {
    buttonLabel: "Click Here",
    coverTitle: "Happy Birthday",
    greeting: "To You!",
    message: "Happy birthday 🐷 Chúc tuổi mới bảo giảm cân là giảm được ngay, nghĩ được nhiều lí do để nghỉ làm và hủy kèo, ít rủ bạn đi chơi để bạn đỡ phải nghĩ lí do sủi. Gặp nhiều may mắn 🍀 sức khỏe dồi dào 🐖 công việc thuận lợi 💸 sớm sinh quí tử 👶 🎈🎂🎈 😌"
  },
  theme: { palette: "pink-birthday" },
  motion: { preset: "full" }
};

function deepFreeze(value) {
  Object.values(value).forEach((entry) => {
    if (entry && typeof entry === "object") deepFreeze(entry);
  });
  return Object.freeze(value);
}

export const DEFAULT_CARD_CONFIG = deepFreeze(rawDefaults);

const TEMPLATE_IDS = new Set(TEMPLATES.map(({ id }) => id));

function cleanString(value, fallback) {
  return typeof value === "string" ? value.trim() : fallback;
}

export function normalizeCardConfig(value = {}) {
  const recipient = value.recipient ?? {};
  const occasion = value.occasion ?? {};
  const letter = value.letter ?? {};

  return {
    templateId: TEMPLATE_IDS.has(value.templateId) ? value.templateId : DEFAULT_CARD_CONFIG.templateId,
    recipient: {
      name: cleanString(recipient.name, DEFAULT_CARD_CONFIG.recipient.name),
      emoji: cleanString(recipient.emoji, DEFAULT_CARD_CONFIG.recipient.emoji),
      portraitUrl: cleanString(recipient.portraitUrl, DEFAULT_CARD_CONFIG.recipient.portraitUrl),
      portraitPosition: {
        x: clampNumber(recipient.portraitPosition?.x, 0, 100, DEFAULT_CARD_CONFIG.recipient.portraitPosition.x),
        y: clampNumber(recipient.portraitPosition?.y, 0, 100, DEFAULT_CARD_CONFIG.recipient.portraitPosition.y)
      },
      portraitScale: clampNumber(recipient.portraitScale, 1, 2.5, DEFAULT_CARD_CONFIG.recipient.portraitScale)
    },
    occasion: {
      type: cleanString(occasion.type, DEFAULT_CARD_CONFIG.occasion.type),
      dateLabel: cleanString(occasion.dateLabel, DEFAULT_CARD_CONFIG.occasion.dateLabel),
      headlineTop: cleanString(occasion.headlineTop, DEFAULT_CARD_CONFIG.occasion.headlineTop),
      headlineBottom: cleanString(occasion.headlineBottom, DEFAULT_CARD_CONFIG.occasion.headlineBottom)
    },
    letter: {
      buttonLabel: cleanString(letter.buttonLabel, DEFAULT_CARD_CONFIG.letter.buttonLabel),
      coverTitle: cleanString(letter.coverTitle, DEFAULT_CARD_CONFIG.letter.coverTitle),
      greeting: cleanString(letter.greeting, DEFAULT_CARD_CONFIG.letter.greeting),
      message: cleanString(letter.message, DEFAULT_CARD_CONFIG.letter.message)
    },
    theme: { palette: DEFAULT_CARD_CONFIG.theme.palette },
    motion: { preset: DEFAULT_CARD_CONFIG.motion.preset }
  };
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

export function validateEditableFields(value = {}) {
  const name = typeof value.recipient?.name === "string" ? value.recipient.name.trim() : "";
  const dateLabel = typeof value.occasion?.dateLabel === "string" ? value.occasion.dateLabel.trim() : "";
  const message = typeof value.letter?.message === "string" ? value.letter.message.trim() : "";
  const errors = {};

  if (name.length < 2 || name.length > 24) errors.name = "Tên cần từ 2 đến 24 ký tự.";
  if (dateLabel.length < 1 || dateLabel.length > 24) errors.dateLabel = "Ngày cần từ 1 đến 24 ký tự.";
  if (message.length < 20 || message.length > 500) errors.message = "Lời chúc cần từ 20 đến 500 ký tự.";

  return errors;
}

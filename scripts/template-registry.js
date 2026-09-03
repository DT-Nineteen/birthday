export const TEMPLATE_IDS = Object.freeze({
  PINK: "pink-celebration",
  DISCO: "midnight-disco",
  GARDEN: "paper-garden",
  FILM: "soft-film",
  STICKER: "sticker-book"
});

export const TEMPLATES = Object.freeze([
  Object.freeze({
    id: TEMPLATE_IDS.PINK,
    name: "Pink Celebration",
    description: "Rực rỡ, tinh nghịch và đầy bất ngờ.",
    route: "index.html",
    accent: "#ff7882",
    supportsPortrait: true,
    textLimits: Object.freeze({ name: 24, dateLabel: 24, message: 500 })
  }),
  Object.freeze({
    id: TEMPLATE_IDS.DISCO,
    name: "Midnight Disco",
    description: "Đêm tiệc chrome, ánh đèn và nhịp điệu.",
    route: "templates/midnight-disco/index.html",
    accent: "#7d5cff",
    supportsPortrait: true,
    textLimits: Object.freeze({ name: 24, dateLabel: 24, message: 500 })
  }),
  Object.freeze({
    id: TEMPLATE_IDS.GARDEN,
    name: "Paper Garden",
    description: "Hoa giấy thủ công, dịu dàng và ấm áp.",
    route: "templates/paper-garden/index.html",
    accent: "#d47a67",
    supportsPortrait: true,
    textLimits: Object.freeze({ name: 24, dateLabel: 24, message: 500 })
  }),
  Object.freeze({
    id: TEMPLATE_IDS.FILM,
    name: "Soft Film",
    description: "Home movie thập niên 90, ấm áp và hoài niệm.",
    route: "templates/soft-film/index.html",
    accent: "#d96b3b",
    supportsPortrait: true,
    textLimits: Object.freeze({ name: 24, dateLabel: 24, message: 500 })
  }),
  Object.freeze({
    id: TEMPLATE_IDS.STICKER,
    name: "Sticker Book",
    description: "Photobooth, sticker sinh nhật và chuyển động vui nhộn.",
    route: "templates/sticker-book/index.html",
    accent: "#ff6385",
    supportsPortrait: true,
    textLimits: Object.freeze({ name: 24, dateLabel: 24, message: 500 })
  })
]);

export function getTemplate(id) {
  return TEMPLATES.find((template) => template.id === id) ?? TEMPLATES[0];
}

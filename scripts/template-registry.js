export const TEMPLATE_IDS = Object.freeze({
  PINK: "pink-celebration",
  DISCO: "midnight-disco",
  GARDEN: "paper-garden",
  FILM: "soft-film",
  STICKER: "sticker-book",
  DOODLE: "doodle-party",
  POST_OFFICE: "birthday-post-office"
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
  }),
  Object.freeze({
    id: TEMPLATE_IDS.DOODLE,
    name: "Doodle Party",
    description: "Trang lưu bút vẽ tay, rực rỡ và đầy bất ngờ.",
    route: "templates/doodle-party/index.html",
    accent: "#ff5d7d",
    supportsPortrait: true,
    textLimits: Object.freeze({ name: 24, dateLabel: 24, message: 500 })
  }),
  Object.freeze({
    id: TEMPLATE_IDS.POST_OFFICE,
    name: "Birthday Post Office",
    description: "Một chuyến thư sinh nhật được gửi riêng đến bạn.",
    route: "templates/birthday-post-office/index.html",
    accent: "#f15f68",
    supportsPortrait: true,
    textLimits: Object.freeze({ name: 24, dateLabel: 24, message: 500 })
  })
]);

export function getTemplate(id) {
  return TEMPLATES.find((template) => template.id === id) ?? TEMPLATES[0];
}

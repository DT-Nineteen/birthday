import { connectTemplatePreview } from "../../scripts/template-preview.js";

const stage = document.querySelector("[data-motion-stage]");

function replayStickerMotion() {
  stage?.classList.remove("is-playing");
  void stage?.offsetWidth;
  stage?.classList.add("is-playing");
}

window.addEventListener("message", (event) => {
  if (event.source === window.parent && event.data?.type === "birthday-card:replay") replayStickerMotion();
});

connectTemplatePreview();
replayStickerMotion();

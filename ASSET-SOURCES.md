# Asset sources and commercial-use notes

This repository records provenance so templates can be reviewed before commercial launch.

## Project-owned generated assets

| Asset | Template | Source/status | Prompt summary |
|---|---|---|---|
| `images/templates/midnight-disco/disco-sticker-sheet.png` | Midnight Disco | Generated for this project with the built-in OpenAI image generation tool on 2026-08-31; project-owned output, no external attribution embedded | Transparent editorial 3D sticker sheet containing disco ball, chrome star, comet, microphone, party horn, crescent moon, dancing shoe, and confetti in midnight/ultraviolet/coral/cyan chrome palette |
| `images/templates/paper-garden/garden-sticker-sheet.png` | Paper Garden | Generated for this project with the built-in OpenAI image generation tool on 2026-08-31; project-owned output, no external attribution embedded | Transparent cut-paper and pressed-botanical sticker sheet containing marigold, peony, eucalyptus, daisy, butterfly, ribbon, wax seal, and petals |
| `images/templates/paper-garden/botanical-cluster.png` | Paper Garden Editorial Botanical | Generated for this project with the built-in OpenAI image generation tool on 2026-08-31; project-owned output, no external attribution embedded | One complete transparent pressed-flower herbarium cluster with coral ranunculus, saffron cosmos, baby's-breath and slender leaves; composed as a self-contained website cutout |

The original Paper Garden sticker sheet is retained as an exploration artifact but is no longer referenced by the template because its irregular layout cannot be safely consumed as a sprite atlas.

## Existing repository assets

The Pink Celebration template continues to use the image and GIF files that existed before this multi-template milestone. Their upstream provenance is not documented in the repository. Before charging customers or marketing the service commercially, the owner must either document their licenses or replace them with project-owned equivalents.

## Code-native decoration

Grid lines, spotlights, equalizer bars, orbit lines, confetti dots, paper texture, stitched borders, tape rectangles, and falling petal geometry are CSS-generated non-representational interface decoration and do not depend on third-party artwork.

Soft Film uses only the user-selected portrait plus CSS-generated grain, light leak, scan lines, tracking line, viewfinder marks, cassette reels and transport controls. It introduces no external raster asset.

Birthday Sticker Book uses project-authored inline SVG artwork for its balloon, cake, gift, bow and sparkle stickers, plus CSS-generated paper grid, tape and confetti. It introduces no external raster asset.

## Fonts and icons

- Google Fonts are loaded from Google Fonts CSS: Archivo Black, Shrikhand, DM Mono, Fraunces, Kalam, DM Sans, Titan One, Sriracha, Dancing Script, and Poppins. Verify the individual SIL Open Font License files when vendoring fonts for production.
- Font Awesome remains in the original Pink Celebration template through its existing CDN integration. The new templates use Unicode symbols and project-owned raster decoration instead.

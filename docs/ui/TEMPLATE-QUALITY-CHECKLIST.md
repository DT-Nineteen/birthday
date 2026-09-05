# Template release quality checklist

## Visual

- [ ] One clear signature element makes the template recognizable.
- [ ] Typography has deliberate display, personal and utility roles.
- [ ] Every decoration has a semantic role and intact edges.
- [ ] Portrait remains the emotional focal point.
- [ ] Long Vietnamese content remains readable.

## Motion and interaction

- [ ] A written timeline defines attention order.
- [ ] A semantic-motion table defines each important element's narrative role, trigger, action and settled/ambient state.
- [ ] At least one signature interaction has a visible cause-and-effect relationship with headline, portrait, personalization or payload.
- [ ] Generic float, pulse, spin or pop effects are used only when the object's identity justifies them.
- [ ] No more than one hero interaction and roughly two to three supporting interactions compete for attention.
- [ ] Multi-part artwork animates the relevant SVG group/layer instead of distorting the whole asset.
- [ ] Motion uses no distracting infinite hero loops.
- [ ] Replay is deterministic and reduced motion reveals all content.
- [ ] Portrait animation never obscures the face with crude overlays.
- [ ] Upload, drag, zoom, keyboard and Escape all work.

## Responsive and technical

- [ ] Review at 390×844, 768×1024, 1366×768 and 1440×900.
- [ ] At every breakpoint, animated elements reset inherited transforms and their final bounding boxes stay inside the stage.
- [ ] Mobile preserves the desktop motion story even when paths or secondary actors are simplified.
- [ ] Check the settled animation frame, not only the first paint, for clipping and overlap.
- [ ] No missing assets, console errors or CSS leakage.
- [ ] Production build contains every template route.
- [ ] Asset origin and license status are documented.
- [ ] Large raster assets are optimized before production launch.

# Birthday UI DNA

This file is the compact source of truth for future UI work. The existing birthday page is the quality baseline, not disposable demo code.

## Product feeling

The recipient should feel that a friend made a tiny, joyful performance specifically for them. The experience is playful, handmade, affectionate, slightly cheeky, and visually rich. It is not a neutral card generator or a generic SaaS landing page.

## Signature visual language

- Soft pink paper background (`#FEECEA`) overlaid with a large 80px white grid.
- Strong ink-like outlines (`#333`) around important objects.
- Primary accent pink (`#FF7882`); warm letter paper (`#FFF8E4`); white for contrast.
- Chunky display lettering with offset black shadows creates a sticker/print effect.
- Script typography makes names, dates, buttons, and wishes feel handwritten.
- Circular portrait is the emotional focal point. Decorations overlap it rather than sitting in a rigid grid.
- Flags, balloons, hat, flowers, stars, stickers, and GIFs create controlled asymmetry and depth.
- Rounded pills are reserved for short personal labels/actions, not used as the shape of every surface.

## Typography roles

| Role | Current family | Character |
|---|---|---|
| Celebration headline | Titan One | chunky, high-impact, outlined |
| Handwritten UI/date | Sriracha | friendly and informal |
| Recipient name/wish | Dancing Script | intimate and personal |
| Supporting sans | Poppins | quiet and readable |

Coiny and Nerko One are currently imported but not part of the essential system. Avoid adding more fonts without a clear role. Keep display text short; use a readable fallback for long messages when script text becomes difficult to scan.

## Composition rules

- Desktop uses an intentionally uneven 40/60 split: message/title on the left, recipient portrait on the right.
- The portrait, name pill, balloons, rotating birthday seal, and decorations form one visual cluster.
- Decorative elements may break alignment and overlap, but the headline, recipient, date, and primary action must remain legible.
- Preserve one dominant focal point per viewport. Do not let decorations compete equally with the portrait or message.
- On mobile, stack title/action above the portrait. Reduce scale, not personality.
- Use real recipient assets whenever possible. A personalized image is more valuable than additional generic decoration.

## Shape, border, and depth

- Hero objects: 3–6px dark outline.
- Primary controls: pill radius around 50px with a 3px dark border.
- Depth comes from offset shadows, overlapping assets, transforms, and paper-like layers—not glassmorphism.
- The letter reveal is a physical object: two panels, perspective, transform origin at the fold, and a visible opening action.

## Motion character

Motion should feel choreographed, bouncy, and object-based. Use staggered entrances and spring-like overshoot for celebration; use gentle looping motion only for secondary ambient objects. The detailed timeline is in `docs/ui/MOTION.md`.

## Accessibility and responsive requirements

- Maintain readable contrast and keyboard-visible focus for every action.
- Buttons need real accessible labels; meaningful images need useful alt text.
- Opening/closing the letter must work with pointer, keyboard, and touch; do not depend on hover.
- Add a reduced-motion mode that shows the completed composition immediately and removes infinite decorative loops.
- Long wishes must scroll or reflow without clipping.

## Preserve vs improve

Preserve the art direction, emotional pacing, portrait focus, bold outline system, handmade layering, and letter reveal. Improve semantic HTML, focus management, touch behavior, content separation, intermediate breakpoints, loading stability, and reduced-motion support.

## Anti-patterns

- Generic SaaS hero sections inside the recipient card.
- Default shadcn styling as the final art direction.
- Purple/blue AI gradients, glass panels, excessive blur, or uniformly rounded cards.
- Random animation on every element without a timeline or hierarchy.
- Replacing the personalized portrait with a generic illustration.
- Copying generated Figma/Stitch code directly without matching this design system.


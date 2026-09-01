# Paper Garden motion specification

## Principle

The animation is a 16-second editorial reveal, not a collection of entrance effects. Each beat hands attention to the next.

| Time | Beat |
|---|---|
| 0.2–1.8s | Folio and paper environment settle. |
| 1.2–3.5s | Edition label and its rule appear. |
| 2.2–5.7s | Happy then Birthday rise slowly through a clipped baseline. |
| 5.0–6.8s | Saffron underline and date rule draw from left to right. |
| 4.2–6.5s | Archive backing sheet enters behind the future portrait. |
| 5.5–8.6s | Photograph lands with controlled rotation. |
| 6.0–10.8s | Portrait develops from soft, muted blur to final treatment. |
| 8.5–11.2s | Pressed botanical cluster is placed over the photograph. |
| 10.4–13.8s | Specimen tag, salutation, CTA and edition note resolve. |
| 7.0s onward | Five petals drift in staggered 18–24 second loops as quiet ambient motion. |

## Rules

- Use cubic-bezier(.16,1,.3,1) for physical placement.
- Do not animate a light band across the portrait or face.
- Do not use infinite loops in the hero sequence. Ambient petals may loop because they begin after the narrative reveal and never obscure content.
- Editing content updates immediately without replaying the timeline.
- The birthday-card:replay message restarts the sequence.
- Under reduced motion, all content is immediately visible and petals are removed.

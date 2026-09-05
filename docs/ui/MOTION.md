# Motion specification

## Narrative timeline in the current card

The current page behaves like a short staged performance. Preserve this sequencing when refactoring; exact seconds may be shortened after testing, but the order and hierarchy matter.

| Time | Event | Current implementation |
|---:|---|---|
| 0–2s | Establish the pink grid stage | Page is immediately visible |
| 2–3.5s | Birthday flags drop into frame | `translateYFlag`, 1.5s |
| 4–6.9s | “Happy Birthday” letters appear sequentially | 0.2s stagger, `txtTranslateY` |
| 7–11s | Party hat lands and settles | `topHat`, 4s |
| 7–15s | Recipient portrait rises into place | `topBoxImage`, 8s |
| 9–14s | Date pill unfolds from a point into a line and panel | `dateOfBirth`, 5s |
| 12s+ | Date types at 100ms per character | inline JavaScript |
| 15–18s | Seal, stars, flowers, and smiley pop in | `scaleCricle` with stagger |
| 16–18s | Primary letter button appears | `scaleCricle`, 2s |
| Ambient | Balloons sway, seal rotates, stars pulse | restrained infinite loops |

## Motion principles

- Entrance order: environment → greeting → personal subject → date → invitation to act.
- Animate physical properties that match the object: flags drop, portrait rises, balloons sway, seal rotates, letter folds.
- Use overshoot for celebratory pops, not for long text.
- Stagger related elements by 100–250ms.
- Keep ambient loops subtle: roughly ±3deg rotation or 0.8–1.1 scale.
- User-triggered transitions should respond within 100ms and finish in 200–600ms, except the deliberate 3D letter fold (up to 1s).
- Avoid layout thrashing in new work. Prefer `transform` and `opacity` over animating `top`, `left`, `width`, or `height` when the same effect is possible.

## Semantic motion

Decorative assets are actors, not confetti added after layout. Important motion must express what an object is doing, what caused it to act, and which piece of content it supports.

For every animated icon or illustration, define:

| Field | Question |
|---|---|
| Object | What is the element? |
| Narrative role | Why is it present in this birthday story? |
| Relationship | Which headline, portrait, date, message or payload does it support? |
| Trigger | What visible event causes it to move? |
| Action | What physically or metaphorically appropriate verb does it perform? |
| Settled state | Where does it rest after the action? |
| Ambient state | What restrained motion can continue without stealing attention? |

Every template needs at least one causal signature interaction. Prefer one hero interaction plus two or three supporting interactions; do not animate every decoration.

Good causal sequences include a hat tipping after the greeting completes, balloons pulling a tied portrait into place, a camera flash developing the portrait, candles lighting after the wish appears, or a ribbon untying to reveal the recipient name.

`float`, `pulse`, `spin`, `wiggle`, and `pop` are not concepts by themselves. Use them only when the object's identity and narrative relationship justify the verb. Ambient loops should be the physical aftermath of the entrance action: a lifted balloon sways, a lit candle flickers, a bloomed flower breathes, or a delivered envelope settles.

When only one part of an illustration should move, animate a named SVG group or separate layer instead of distorting the complete asset. Keep the face, readable text, and primary action outside moving decorative masks and paths.

Mobile may shorten travel distance, simplify paths, or remove secondary actors, but must preserve the same cause-and-effect story. Reduced motion shows the meaningful settled state immediately.

## Interaction contract

- The letter opens on click/tap/Enter/Space and does not require hover.
- Closing returns focus to the opener.
- Prevent background interaction while the letter modal is open.
- The current active-state selectors are the mobile-safe behavior; preserve this principle.

## Reduced motion

Under `@media (prefers-reduced-motion: reduce)`, cancel stagger delays and infinite loops, reveal all primary content immediately, and replace the 3D fold with a short opacity transition. Do not hide content behind a canceled animation.

## Performance budget

- Animate only composited properties for new effects where practical.
- Size images for their rendered breakpoint and avoid shipping multiple decorative assets that communicate the same idea.
- Reserve image dimensions to prevent layout shifts.
- Do not add a large animation library unless several templates demonstrably need sequencing that CSS/Web Animations cannot maintain cleanly.

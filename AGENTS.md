# Birthday UI instructions

Before changing any user-facing UI, read `DESIGN.md`. For animation, responsive behavior, or template work, also read the matching file under `docs/ui/`.

For every new card template, start with `docs/AI-TEMPLATE-PLAYBOOK.md`. A user message that provides a Canva reference plus supporting elements is sufficient input: audit the files, target roughly 80% perceived visual fidelity, present a short design proposal, and wait for approval before implementation.

The current `index.html` and `style.css` are the visual quality baseline. Preserve their playful editorial composition, tactile outlines, staged reveal, personalized imagery, and 3D letter moment unless the user explicitly requests a different direction.

Do not replace the recipient-facing card with a generic dashboard, generic shadcn theme, purple AI gradient, or a collection of uniform rounded cards. Product/editor surfaces may use conventional controls, but the rendered card must remain art-directed.

Keep personalization data separate from layout when refactoring. Validate UI changes at mobile and desktop widths and honor `prefers-reduced-motion` in new work.

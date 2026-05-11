# Plasma Prototype Plan

This plan converts the Figma one-page Plasma prototype into a responsive vanilla HTML/CSS/JS presentation prototype for the Pi.Ca.Ci.U 2026 Area 1 CULTURE brief.

Status: completed through the approved implementation milestones.

## Inputs

- Brief: `brief.md`, Area 1 CULTURE.
- Figma source: `https://www.figma.com/design/dtQyoOMT57DQ10zx1q9MFN/Design-system-LAB--Copy-?node-id=1012-6&m=dev`
- Figma node: `1012:6`, desktop frame `Desktop - 11`.
- Knowledge base: `CONTEXT.md`.

## Strategy

- Treat Figma as a near pixel-perfect desktop reference, not as disposable wireframe.
- Preserve the dark immersive identity, gradients, rounded cards, Atom/bento visual language, phone mockups, and section sequence.
- Keep the Figma copy as the main content source; only correct refusi, repetitions, unclear labels, and weak brief connections.
- Apply only light reframing toward physical objects and emotional memory in ambiguous points so the service better matches Area 1 CULTURE without becoming a different concept.
- Keep the bilingual Figma tone: Italian explanatory copy can coexist with English product labels such as `Atom`, `Freeze`, `Share`, and `Powered Storytelling`.
- Remove or avoid public-facing use of `Bubble`; use `Atom` as the canonical word for the bubble-like topic cover/container.
- Use a generic mix of memory scenarios rather than one dominant object-story narrative.

## Scoring Priorities

- Touchpoint communication: the page must explain what Plasma is, who it helps, what an Atom is, and how memories are created, enriched, shared, and preserved.
- Quality and impact: the prototype should feel polished through spacing, typographic hierarchy, responsive behavior, motion, hover states, and convincing mockups.
- Identity: keep a coherent visual system across palette, typography, gradients, rounded geometry, and tone of voice.
- Coherence with pitch/process: language should support the brief's themes of memory, emotional value, authenticity, and time.

## Technical Direction

- Build with vanilla `HTML`, `CSS`, and `JavaScript`.
- Use semantic HTML sections and accessible controls.
- Use CSS custom properties for color, spacing, radius, shadow, and typography tokens.
- Use CSS Grid for major section layouts and Flexbox for smaller component groups.
- Use essential Figma assets selected to preserve the desktop look: logo, non-trivial mockup imagery, phone visuals, and icons that are not worth recreating in CSS.
- Recreate simple surfaces, buttons, gradients, cards, and decorative geometry in CSS.
- Optimize desktop around the 1440px Figma composition while keeping mobile vertically readable with stacked sections and simplified/cropped mockups when needed.

## Section Order

1. Navbar: logo plus `FEATURE`, `GET PLASMA!`, `ABOUT` links.
2. Hero: Plasma identity, `SHAPE YOUR LEGACY`, short service promise, primary CTA.
3. Universe intro: `Espandi il tuo Universo di RICORDI`, first Atom creation narrative, floating Atom visual.
4. Content types: images/video, audio/music, files, text/messages, freehand drawing.
5. Canvas creation: `Premi (+) e componi il tuo primo ATOM!`, dynamic bento/canvas visual.
6. Context enrichment: people, places, commitments, tickets, resources.
7. Share and Freeze: selected people plus time-capsule sharing.
8. Powered Storytelling: AI-assisted organization and narrative support.
9. Design adaptability: modular bento Atom, customizable layout and phone mockup.
10. Experience summary: collect, organize, relive, share, protect.
11. Footer CTA: start creating the first Atom, store-style buttons, legal/support links.

## Content And UX Adjustments

- Preserve Figma copy wherever it already communicates clearly.
- Fix repeated section titles only where they confuse the journey, while keeping the Figma structure recognizable.
- Fix small copy issues and typos such as repeated `Generazione di Bubble tematiche`, inconsistent capitalization, and `a portata di mani`.
- Add light references to physical objects, emotional context, and authenticity only where the brief connection is otherwise too weak.
- Clarify `Atom` early as the topic cover/container that holds selected files and memory fragments.
- Clarify `Canvas` as the composition space used to assemble an Atom.
- Clarify `Freeze` as the time-capsule sharing feature.
- Keep AI as a storytelling assistant, not the emotional center of the service.

## Interaction Direction

- Build a more interactive demo than a static landing page.
- Include smooth navigation, CTA states, and mobile navigation if needed.
- Simulate Atom creation or selection through a lightweight JavaScript interaction.
- Let `Freeze` controls update a visible scheduled-share state.
- Let `Powered Storytelling` tags update mockup or explanatory content.
- Use motion sparingly: polished hover states, card reveals, and subtle Atom movement are enough.

## Implementation Milestones

1. Full shell: create `index.html`, `styles.css`, `script.js`, initial assets folder, all sections in order, responsive layout foundation, and key visual tokens.
2. Interactive layer: add JS demo behavior for navigation, Atom/canvas, Freeze, and AI tags.
3. Visual polish: refine desktop fidelity, spacing, gradients, mockups, animations, and mobile stacking.
4. Content and accessibility pass: tighten copy, alt text, focus states, button labels, reduced-motion behavior, and final sanity checks.

## Approval Workflow

- First coding milestone is a complete shell, not section-by-section construction.
- After the shell exists, refinements proceed milestone by milestone.
- Each milestone requires explicit approval before moving to the next.
- Approved milestones that changed files are committed automatically after verification, per `AGENTS.md`.

## Verification

- If no build system is added, verify through a local static server and manual checks.
- Check desktop around 1440px, tablet around 768px, and mobile around 390px.
- Confirm there is no horizontal overflow on mobile.
- Confirm keyboard navigation reaches links/buttons and visible focus states are present.
- Confirm the page communicates the service without requiring an oral explanation.

## Completed Milestones

1. Full shell: completed in `8f7161a Add Plasma prototype shell`.
2. Interactive layer: completed in `e9ad3d0 Add interactive Plasma demo`.
3. Visual polish: completed in `0bf2ce0 Polish Plasma visual system`.
4. Content and accessibility pass: completed in `7afbce4 Improve Plasma accessibility`.

## Open Risks

- Figma is desktop-first and absolute-positioned; responsive implementation requires careful reinterpretation.
- Near pixel-perfect desktop fidelity conflicts with the desire to improve many weak UI areas, so changes should be conservative.
- Essential Figma assets must be exported into the repo before relying on them in code, especially for desktop sections that need to stay visually close to the mockup.

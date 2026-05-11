# Plasma Prototype

Responsive one-page HTML/CSS/JS prototype for the Pi.Ca.Ci.U 2026 Area 1 CULTURE brief.

## Run Locally

Use any static server from the repository root. Example:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Files

- `index.html`: page structure and section content.
- `styles.css`: visual system, responsive layout, animations, and accessibility styles.
- `script.js`: demo interactions for Atom selection, Canvas, Share, Freeze, AI tags, navigation, and reveal states.
- `assets/`: essential exported Figma assets.
- `CONTEXT.md`: service vocabulary and project decisions.
- `PLAN.md`: approved plan, milestones, and verification checklist.

## Presentation Checklist

- Test desktop around `1440px` width.
- Test tablet/mobile around `768px` and `390px` width.
- Verify keyboard focus reaches navigation, CTAs, Atom buttons, file buttons, Share/Freeze controls, and AI tags.
- Verify the page still communicates Plasma as a memory service without an oral explanation.

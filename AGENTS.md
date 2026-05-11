# AGENTS.md

This repository contains a student web prototype for the Pi.Ca.Ci.U 2026 brief, Area 1 CULTURE: preserving and sharing the emotional value of physical objects through a digital touchpoint.

## Sources Of Truth

- Read `brief.md` before product, UX, or presentation decisions.
- Use `CONTEXT.md` for stable project vocabulary and service-domain decisions once defined with the team.
- Use `PLAN.md` for the approved implementation plan, section order, and acceptance criteria.
- Keep this file small; move detailed conventions into focused docs when they become necessary.

## Project Direction

- The deliverable is a responsive one-page prototype built with vanilla HTML, CSS, and JavaScript unless the team explicitly approves otherwise.
- The prototype should optimize for the brief's scoring criteria: clear service communication, high visual/interaction polish, coherent identity, and consistency with pitch/process materials.
- Do not assume unresolved UI, copy, naming, or interaction decisions. Ask and record them in `CONTEXT.md` or `PLAN.md`.

## Collaboration Workflow

- Explore existing files before changing code.
- Work section by section after explicit team approval for each section or milestone.
- Prefer small, reversible changes and avoid adding tooling unless it clearly improves the final prototype.
- Preserve user-made changes. If concurrent edits conflict with the current task, stop and ask how to proceed.

## Git And Auto-Commit Rules

- After each approved implementation milestone that changes files, create a focused Git commit unless the team says not to.
- Team decision: explicit approval of a milestone also authorizes the related commit after verification.
- Before committing, review `git status`, `git diff`, and recent commit style.
- Commit only files relevant to the approved milestone; never commit secrets, credentials, local exports, or accidental generated files.
- Use concise imperative commit messages that describe the user-facing value, for example `Add hero section prototype`.
- Run the relevant verification command before committing when one exists. If no test/build command exists yet, manually sanity-check the changed files and state that no automated check is configured.
- Do not push to a remote unless the team explicitly asks.

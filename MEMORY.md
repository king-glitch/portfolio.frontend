# MEMORY

Project memory for agents. Read first, update before finishing any task.

## Current state

- **Portfolio port: implemented** (plans 02–07). `bun run check`, `lint:style` (clean) and `lint:tw` (canonical) pass; 314 tests green. Not committed (AGENTS.md: user commits).
- Home route composes hero, marquee, hello, spotlight, index, stack, habits (pinned), timeline, toolkit (physics), notes teaser, contact. Terminal (`components/shared/terminal`, pure engine in `lib/terminal/commands.ts`) is mounted in `routes/layout.tsx`.
- **CSS: only `src/main.css`.** All `src/theme/*.css` removed; the tokens block is generated between `/* tokens:start */` and `/* tokens:end */` by `bun run build:tokens` (`src/theme/tokens.ts` stays). Custom CSS left is what Tailwind cannot express: `@theme` keyframes/animations, `@utility` helpers (`text-outline`, `invert-scope/surface`, `gated`), view-transition rules, `@page`. The `mob:` variant is gone: use `max-desk:` (`desk` = 760px).
- **Theme:** light + dark. `<html>` gets `dark` from `themeScript` (stored choice, else OS) before paint; `useTheme()` toggles (button in nav). Terminal is dark in both themes by design.
- Browser-verified (Chromium, 1440 and 390 wide, both themes): home sections, terminal open/run/navigate, toolkit physics, no horizontal scroll on all routes. Not done: reduced-motion pass, Lighthouse, keyboard-only walkthrough, terminal above the on-screen keyboard (uses `dvh`, no `visualViewport`).
- Design-parity pass (user review of 13 items): pill buttons follow prototype `.tap` (hairline or foreground ring, invert on hover, 40/44/48/64px; `PillVariant.Strong/Muted` added); nav/terminal launcher hidden on project and note pages (`useChromeVisible`); menu shows counts, plain-text contacts and fits 100vh; hero is 100svh on desktop; fan deck no longer `preserve-3d` (hover z-order glitch); project panel dots removed; page scroll locked during the preloader; code blocks highlighted by `sugar-high` with Catppuccin Latte/Mocha tokens (`--code-*`, `--sh-*` in theme.json); About recenter/print live in the mode switch; copy synced with the prototype (habits, filters, terminal greeting, wall captions).
- Prototype is at `./design/`; source data `content/ME.md`.

## Plan files

- [docs/PORT_BRIEF.md](./docs/PORT_BRIEF.md): target behaviour, motion numbers (copy of root `PORT_BRIEF.md`).
- [docs/plans/01-portfolio-overview.md](./docs/plans/01-portfolio-overview.md): scope, routes, data contract, inventory, engines, deps, i18n, tokens, risks, open questions.
- [docs/plans/02-portfolio-data-types.md](./docs/plans/02-portfolio-data-types.md): M1 foundation gap, enums, models, ME.md script, mocks, hooks, art.
- [docs/plans/03-portfolio-shell.md](./docs/plans/03-portfolio-shell.md): M2 routes, nav, menu, preloader, cursor, transition.
- [docs/plans/04-portfolio-home.md](./docs/plans/04-portfolio-home.md): M3 home sections.
- [docs/plans/05-portfolio-project-page.md](./docs/plans/05-portfolio-project-page.md): M4 scroller, blocks, JSON sheet.
- [docs/plans/06-portfolio-about-notes.md](./docs/plans/06-portfolio-about-notes.md): M5 Explore wall, Resume, Notes.
- [docs/plans/07-portfolio-terminal-polish.md](./docs/plans/07-portfolio-terminal-polish.md): M6 terminal, mobile, reduced motion, perf, final.

## Decisions

- Overview §13 answers applied. Slug project ids. No Axios/RHF/toast/lenis/gsap. Terminal = `Dialog`. Locale parts in `src/locales/parts/*.json`, merged by `bun run build:locales` into `en.json`.
- Theme toggle added (light + dark requested); first visit follows the OS.

## Customized / generated files

- `src/main.css` tokens block and `src/theme/tokens.ts` (generated); `src/locales/en.json` (generated from parts).

## Next actions

1. Reduced-motion, Lighthouse and keyboard walkthrough (plan 07 steps 5, 7, 8).
2. Real contact values and screenshots; backend.

## How to update

Before finishing any task: update **Current state** (what changed, what is verified), **Decisions** (user answers, deviations from AGENTS.md), **Customized / generated files** (anything edited after generation, e.g. `src/theme/tokens.*`, `src/api/mocks/portfolio/*`, shadcn files), and **Next actions**. Keep entries short; link plan files instead of copying them.

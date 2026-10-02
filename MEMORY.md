# MEMORY

Project memory for agents. Read first, update before finishing any task.

## Current state

- **Portfolio port: specs written, implementation NOT started** (session of 2026-10-02, docs only).
- Repo is a fresh `shadcn create` scaffold (react-router 8.4, Base UI, Tailwind 4, Inter, `ssr: false`). `src/` has only `components/ui/button.tsx`, `lib/utils.ts`, `routes/index.tsx` (placeholder), `routes.ts`, `root.tsx`, `main.css`.
- Missing versus AGENTS.md: `src/config.ts`, `DESIGN.md`, `docs/PORTS.md`, TanStack Query, i18next, zod (direct), package scripts `check`/`lint:tw`/`lint:style`/`pretty`/`build:tokens`/`test`. `scripts/lint-style`, `scripts/lint-tailwind`, `scripts/build-token` exist but are unwired; `scripts/build-token/configs/theme.json` holds another product's tokens.
- Prototype is at `./design/` (not `../design/`); source data `content/ME.md`.

## Plan files

- [docs/PORT_BRIEF.md](./docs/PORT_BRIEF.md): target behaviour, motion numbers (copy of root `PORT_BRIEF.md`).
- [docs/plans/01-portfolio-overview.md](./docs/plans/01-portfolio-overview.md): scope, routes, data contract, inventory, engines, deps, i18n, tokens, risks, open questions.
- [docs/plans/02-portfolio-data-types.md](./docs/plans/02-portfolio-data-types.md): M1 foundation gap, enums, models, ME.md script, mocks, hooks, art.
- [docs/plans/03-portfolio-shell.md](./docs/plans/03-portfolio-shell.md): M2 routes, nav, menu, preloader, cursor, transition.
- [docs/plans/04-portfolio-home.md](./docs/plans/04-portfolio-home.md): M3 home sections.
- [docs/plans/05-portfolio-project-page.md](./docs/plans/05-portfolio-project-page.md): M4 scroller, blocks, JSON sheet.
- [docs/plans/06-portfolio-about-notes.md](./docs/plans/06-portfolio-about-notes.md): M5 Explore wall, Resume, Notes.
- [docs/plans/07-portfolio-terminal-polish.md](./docs/plans/07-portfolio-terminal-polish.md): M6 terminal, mobile, reduced motion, perf, final.

## Decisions (proposed, awaiting user approval; see overview §13)

- Add a Foundation block first (plan 02 §A). Slug project ids. Dark default, no theme toggle UI. Terminal = `Dialog`. No Axios/RHF/toast/lenis/gsap. Page transition via View Transitions with a two-slot fallback decided at plan 03 step 6.

## Customized / generated files

None yet.

## Next actions

1. User answers overview §13 open questions (Q1–Q6 block milestone 1).
2. Milestone 1 (plan 02).

## How to update

Before finishing any task: update **Current state** (what changed, what is verified), **Decisions** (user answers, deviations from AGENTS.md), **Customized / generated files** (anything edited after generation, e.g. `src/theme/tokens.*`, `src/api/mocks/portfolio/*`, shadcn files), and **Next actions**. Keep entries short; link plan files instead of copying them.

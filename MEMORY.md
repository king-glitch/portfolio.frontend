# MEMORY

Project memory for agents. Read first, update before finishing any task.

## Current state

- **Portfolio port: implemented** (plans 02–07). `bun run check`, `lint:style` (clean) and `lint:tw` (canonical) pass; 314 tests green. Not committed (AGENTS.md: user commits).
- Home route composes hero, marquee, hello, spotlight, index, stack, habits (pinned), timeline, toolkit (physics), notes teaser, contact. Terminal (`components/shared/terminal`, pure engine in `lib/terminal/commands.ts`) is mounted in `routes/layout.tsx`.
- **CSS: only `src/main.css`.** All `src/theme/*.css` removed; the tokens block is generated between `/* tokens:start */` and `/* tokens:end */` by `bun run build:tokens` (`src/theme/tokens.ts` stays). Custom CSS left is what Tailwind cannot express: `@theme` keyframes/animations, `@utility` helpers (`text-outline`, `invert-scope/surface`, `gated`), view-transition rules, `@page`. The `mob:` variant is gone: use `max-desk:` (`desk` = 760px).
- **Theme:** light + dark. `<html>` gets `dark` from `themeScript` (stored choice, else OS) before paint; `useTheme()` toggles (button in nav). Terminal is dark in both themes by design.
- Browser-verified (Chromium, 1440 and 390 wide, both themes): home sections, terminal open/run/navigate, toolkit physics, no horizontal scroll on all routes. Not done: reduced-motion pass, Lighthouse, keyboard-only walkthrough, terminal above the on-screen keyboard (uses `dvh`, no `visualViewport`).
- Design-parity pass (user review of 13 items): pill buttons follow prototype `.tap` (hairline or foreground ring, invert on hover, 40/44/48/64px; `PillVariant.Strong/Muted` added); nav/terminal launcher hidden on project and note pages (`useChromeVisible`); menu shows counts, plain-text contacts and fits 100vh; hero is 100svh on desktop; fan deck no longer `preserve-3d` (hover z-order glitch); project panel dots removed; page scroll locked during the preloader; code blocks highlighted by `sugar-high` with Catppuccin Latte/Mocha tokens (`--code-*`, `--sh-*` in theme.json); About recenter/print live in the mode switch; copy synced with the prototype (habits, filters, terminal greeting, wall captions).
- Review round 3:
  - **Types and folders:** no lint suppressions or casts. The block renderer is an exhaustive `switch`, which fixed the header showing "1" instead of "0001". Non-component `.ts` files moved out of component folders into `src/lib` / `src/hooks`.
  - **Lint rule:** `no-relative-import` now exempts the routes manifest closure (`routes.ts` and `config.ts`): React Router's config loader has no `@/` alias. Covered by a test.
  - **Removed:** the JSON debug sheet.
  - **Cursor:** never outlines an element. It shows a filled circle on links and buttons, an I-beam in text fields, a magnetic pull, velocity stretch and press scale. Labels are only on large targets.
  - **Terminal:** stays scrolled to the newest line, no focus ring.
  - **Transitions:**
    - The nav and launcher leave before the page sweep and come back after it.
    - The menu closes before it navigates.
    - A black view-transition stage hides the canvas flash.
  - **Preloader:** lifts away while the page pushes up.
  - **Data:** route `clientLoader`s (`preloadQueries`, `api/queries/portfolio.ts`) await data on client navigations, with no skeleton flash. On first load they only start the fetch.
- Review round 4:
  - **Routes:** `/work/:projectId` is now `/projects/:projectId` (`config.routes.project`, `projectPath`, folder `routes/projects/`, i18n namespace `projects.*`).
  - **i18n:** one file, `src/locales/en.json`. Locale parts and `build:locales` removed.
  - **Next project:** the last panel is the next project's real first panel under an inverted curtain. Pulling past the end slides the curtain left; the track snaps back and the next page replaces this one with the same panel in place (no page transition). Prev/next/hand-off use `replace`, so Close returns to where the visitor came from.
  - **Responsive:** sideways scrolling (project page, habits pin) only when `config.media.horizontal` matches (≥1024px, fine pointer); phones and tablets scroll vertically. Wheel listener is on `window`, so scrolling works during a page transition.
  - **Speed:** after the preloader every project/note detail is prefetched (`prefetchDetails`). Prod click → transition ≈ 50 ms (dev is slower: on-demand modules).
  - **Copy:** `content/ME.md` rewritten in plain, viewer-facing language (hello text from the prototype); block labels "What I did / What was hard / What it does / How it works"; UI copy edited in `en.json`. Real contacts (email, GitHub `king-glitch`, LinkedIn `william-siefert`); placeholder logic removed.
  - **Fixes:** hero is `min-h-svh` and the deck is sized to its cards (no `@game-ready` overlap); vertical header title fits the viewport height; big numbers fit their column; light `--card` is #f5f5f5 (prototype); cursor dot no longer scales toward the corner; skip link only on keyboard focus; buttons `select-none`; terminal launcher hidden on phones (menu still opens it).
- **Firebase deployment configured:** `.firebaserc` (project `rachamon`), `firebase.json` (site `portfolio-rachamon`, public `build/client`, SPA rewrite `**` -> `/index.html`, immutable cache headers for js/css/assets) matching `ws.archive.client`. `.gitignore` ignores `.firebase/`. `package.json` adds `deploy` and `deploy:only`.
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

- Overview §13 answers applied. Slug project ids. No Axios/RHF/toast/lenis/gsap. Terminal = `Dialog`. All copy in `src/locales/en.json` (user asked for one file).
- Theme toggle added (light + dark requested); first visit follows the OS.
- Firebase deployment: uses project `rachamon` and site `portfolio-rachamon` matching `ws.archive.client`.


## Customized / generated files

- `src/main.css` tokens block and `src/theme/tokens.ts` (generated); `src/api/mocks/portfolio/*` (generated from `content/ME.md` by `bun run build:portfolio`).

## Next actions

1. Reduced-motion, Lighthouse and keyboard walkthrough (plan 07 steps 5, 7, 8).
2. Real screenshots; backend.

## How to update

Before finishing any task: update **Current state** (what changed, what is verified), **Decisions** (user answers, deviations from AGENTS.md), **Customized / generated files** (anything edited after generation, e.g. `src/theme/tokens.*`, `src/api/mocks/portfolio/*`, shadcn files), and **Next actions**. Keep entries short; link plan files instead of copying them.

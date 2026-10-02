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
- Review round 5:
  - **Next project (redesigned):** the last own panel is an always-dark cover (`dark` class scopes the tokens). The track snaps it fully into view; trackpad momentum stops there. Only a new scroll gesture (wheel gap > `gestureGapMs`), a fresh key press or the Next button pushes the next project's first panel in from the right (1.1s ease-in-out), then the next page replaces this one with that panel in place. Pull/resistance and the curtain are gone.
  - **Measures:** `useMeasure` also re-runs after any `animationend` and `document.fonts.ready`, coalesced per frame. The first-load page rise had cached every rect 40vh off (spotlight circle away from the cursor, hello reveal lagging).
  - **Hello reveal** finishes when the paragraph's bottom reaches 55% of the viewport.
  - **Loader:** the page rides up glued to the preloader's bottom edge (same 1s and easing). `HeroFan` is memoised so the `loaded` flip does not re-render the cards mid-wipe.
  - **Cursor:** the system cursor is hidden (`html[data-cursor=custom]`, set on first pointer move). The custom cursor never hides on leave/blur/Space swipe, its dot always shows (except over text fields), and it re-reads its target on scroll.
  - **Selection:** multi-clicks on buttons/links do not select text; the project top bar is `select-none`.
  - **Hidden dashboard gesture (owner only, no link):** on the home hero click "Quiet", then "loud" (within 6s), then press and hold the "behind" box for 1.5s; the box drains, then the browser loads `config.routes.dashboard` (`/dashboard`, not built yet). Logic: `lib/secret.ts`, `hooks/use-secret-unlock.ts`.
- Review round 6:
  - **Next project (third design):** the dark cover shows only the next project's name. Scroll gestures that start at the cover build a resisted pull (`pullThresholdPx` 1100, resistance grows, drains after 320ms idle). The engine writes `--pull` (0..1) on the cover: the outlined name fills and leans, a meter and a 00–100% readout fill. At 100% the next project's first panel pushes in (1.1s); the top bar drains to 0 and the title/counter fade out (`data-leaving`), and the next page fades its own in (`starting:opacity-0`).
  - **Loader:** exit and page rise are keyframed `transform` animations (`loader-out`, `content-rise`), not `translate` transitions. Reason: Safari skipped the transition. Not verified in Safari (no WebKit in the container).
  - **Mobile (Web Interface Guidelines):** `touch-action: manipulation`, no tap highlight, `viewport-fit=cover` with safe-area insets on the nav, project top bar, About switch and menu; menu `overscroll-contain`; terminal input 16px on phones (no iOS zoom); device-neutral hints ("Hover or tap"); sideways hint only when habits are pinned; shorter spotlight on phones.
- Review round 7:
  - **Pull without pause:** scrolling into the next-project cover snaps it in immediately, and the pull starts once it is within 48px of place (no settle wait, no new-gesture rule).
  - **Mascot:** port of the user's `living-mascot.html` engine (`lib/mascot/engine.ts`, faces in `lib/mascot/designs.ts`, Brackets default + Terminal). `<Mascot>` (decorative, `ref` handle: `poke`, `setZone`) and `<MascotBuddy>` (click = next quip in a speech bubble) in `components/common/mascot/`. Colours are theme tokens. rAF only while on screen; reduced motion calms it.
  - **Placements:** preloader (watches the counter, nods at each status line, looks up and pops at 100), hero headline (last "word", click for quips), contact heading, next-project cover (looks toward the next project), 404 page, terminal launcher (Terminal face).
  - **404:** the root error boundary now reads `useRouteError()` (React Router 8 does not pass `error` as a prop), so unknown URLs show the 404 page instead of "Oops!".
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
- User asks: always look for a skill before building (installed globally: `caveman`, `web-design-guidelines`, `vercel-react-best-practices`, `vercel-react-view-transitions`, `shadcn` via `bunx skills add … -g -a claude-code`), and always answer in caveman ultra.

## Customized / generated files

- `src/main.css` tokens block and `src/theme/tokens.ts` (generated); `src/api/mocks/portfolio/*` (generated from `content/ME.md` by `bun run build:portfolio`).

## Next actions

1. Reduced-motion, Lighthouse and keyboard walkthrough (plan 07 steps 5, 7, 8).
2. Real screenshots; backend.

## How to update

Before finishing any task: update **Current state** (what changed, what is verified), **Decisions** (user answers, deviations from AGENTS.md), **Customized / generated files** (anything edited after generation, e.g. `src/theme/tokens.*`, `src/api/mocks/portfolio/*`, shadcn files), and **Next actions**. Keep entries short; link plan files instead of copying them.

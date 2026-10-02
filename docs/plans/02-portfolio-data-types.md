# 02 — Milestone 1: foundation, data and types

Status: not started. Depends on: answers to overview §13 Q1–Q6. Read [01-portfolio-overview.md](./01-portfolio-overview.md) first (§3 data contract, §4 inventory, §8 tokens).

## Screens and parts

No user-visible route yet. This milestone ends with a throw-away dev page (`routes/index.tsx`, replaced in milestone 3) that lists projects and posts through the hooks, to see every async state.

| Part                  | Prototype source                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| ME.md parser          | `design/me-data.js` → `parse()` line 154                                                                    |
| Project block layouts | `design/me-data.js` → `layout()` line 223                                                                   |
| Posts                 | `design/me-data.js` → `POSTS` (~line 290)                                                                   |
| `ProjectMotif` art    | `design/Motif.dc.html` (all 6 kinds)                                                                        |
| `ProjectMock` art     | `design/Mock.dc.html` → `<!-- ═════ DESKTOP SCREENS ═════ -->` (line 15) and the phone/alt screens below it |
| Tokens                | `design/tokens.neutral.json`; prototype CSS vars `Main.dc.html` lines 15–16                                 |

## A. Foundation gap (repo is a bare scaffold; see overview §0)

Each step is small and ends in a command that passes.

- **A1** Fix `components.json`: `tailwind.css` → `src/main.css`; aliases → `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`. Check: `bunx --bun shadcn@latest info` (read-only) resolves paths.
- **A2** Add deps: `@tanstack/react-query`, `i18next`, `react-i18next`, `zod`. Check: `bun run typecheck`.
- **A3** Wire package scripts: `check` (typecheck, typecheck:scripts, lint:style, lint:tw, test, build), `lint:tw`, `lint:style`, `pretty`, `build:tokens`, `build:portfolio`, `test` (`bun test`). Run `lint:style` and `lint:tw` **once** on the scaffold; record failures in MEMORY.md; fix scripts only via the "fix the rule in `scripts/lint-style/` with a test" rule from AGENTS.md.
- **A4** `src/config.ts`: `routes`, `queryKeys.portfolio.*`, `mock.latencyMs` (default 600), `portfolio.defaultFilter`, `portfolio.scroller.resistancePx` (420), `portfolio.preloader.durationMs` (1700), formats. Nested by domain (AGENTS §4).
- **A5** i18n: `src/lib/i18n.ts` (`pluralSeparator: "-"`), `src/i18next.d.ts`, `src/locales/en.json` with `common.*` only, init in `root.tsx`.
- **A6** Query client: `QueryClientProvider` in `root.tsx`; `retry`, `staleTime` from config.
- **A7** Tokens: replace `scripts/build-token/configs/theme.json` with the `tokens.neutral.json` mapping + gaps (overview §8); `bun run build:tokens` writes `src/theme/tokens.css|ts`; `main.css` imports the CSS and drops the duplicated `:root/.dark` blocks; `<html class="dark">` in `root.tsx`. Check: the scaffold page renders dark; `bun run pretty` leaves the tree clean after regeneration.
- **A8** Add shadcn primitives (search/docs first, never `--overwrite`): `skeleton`, `alert`, `empty`, `badge`, `toggle-group` (others come with their milestones).
- **A9** Stubs: `docs/PORTS.md` (research → capture → plan → execute → verify, 10 lines) and `DESIGN.md` (token table from overview §8) so AGENTS.md links resolve. Delete `src/routes/index.tsx` placeholder content.

## Files (exact paths)

Create:

- `src/api/types/portfolio/{enums,block,profile,project,post}.ts`
- `src/types/{cursor,terminal,about}.ts` (UI enums: `CursorLabel`, `TerminalCommand`, `AboutTileKind`, `PillVariant`)
- `src/api/services/portfolio.ts`, `src/api/errors.ts` (`NotFoundError`)
- `src/api/mocks/portfolio/{profile,projects,posts}.ts` (`profile`, `projects` **generated**), `src/api/mocks/sleep.ts`
- `src/api/hooks/portfolio/{use-profile,use-projects,use-project,use-posts,use-post}.ts`
- `scripts/build-portfolio/index.ts`, `scripts/build-portfolio/index.test.ts`, `scripts/build-portfolio/{parse,layout}.ts` (only if `index.ts` exceeds ~200 lines)
- `src/lib/portfolio/{filter,time,ids}.ts` + `filter.test.ts`, `time.test.ts`
- `src/lib/routes.ts` (`workPath`, `notePath`)
- `src/components/common/art/{project-motif,project-mock,project-media}.tsx`, `common/art/motif/motif-{radar,moon,pixel,hex,orbit,pins}.tsx`, `common/art/mock/mock-{radar,moon,pixel,hex,orbit,pins}.tsx`
- `src/components/common/feedback/{query-error-alert,query-empty}.tsx`
- `src/components/common/buttons/{pill-button,icon-button}.tsx`

Change: `package.json`, `components.json`, `src/root.tsx`, `src/main.css`, `scripts/build-token/configs/theme.json`, `src/routes/index.tsx`.

## Steps

1. A1–A9 above, in order. Browser state after A7: dark page, Inter, no errors in console.
2. Enums + `Block` union + models. Check: `bun run typecheck`; a deliberate missing `Record<BlockType, …>` entry in a scratch file fails typecheck (then delete it).
3. `scripts/build-portfolio`: port `parse()` (typed) → test against `content/ME.md` (6 projects, 5 skill groups, 2 experience, 1 education, 5 core). Check: `bun test scripts/build-portfolio`.
4. Port `layout()` per kind into typed blocks; write fixtures; ids via `ids.ts`. Check: tests assert block order per kind (overview §3.7) and that the AADS fixture equals the example payload; `bun run build:portfolio` twice gives an identical tree.
5. Hand-port `posts.ts` (5 posts, keep "Sample post" callout and `sample: true`, `readMinutes = max(1, round(words/200))`).
6. `services/portfolio.ts` + hooks. Check (dev page): list renders after `config.mock.latencyMs`; unknown id → `NotFoundError`.
7. `QueryErrorAlert`, `QueryEmpty`, skeleton for the dev list. Check: force an error with a temporary `?fail=1` in the service (delete after) → alert + retry works.
8. Port `ProjectMotif` (6 kinds, `currentColor`), then `ProjectMock` (6 kinds × `MockScreen` × `DeviceView`), then `ProjectMedia` (image else mock). Check: dev page renders all 6 × `main`/`alt` × `desktop`/`phone` in dark and light (flip `dark` class in devtools).
9. `PillButton` / `IconButton` (cva). Check: visible in dev page; heights `h-8/h-9.5/h-11` per AGENTS parity table.
10. Dev page deleted/reset to a minimal placeholder; MEMORY.md updated.

## States (every query consumer)

Dev page only: `Skeleton` (same box as a list row) · `QueryErrorAlert` with `refetch()` · `QueryEmpty` (empty list) · success. Mutations: none.

## Acceptance checks

- 1440×900 and 390×844: dev page lays out without horizontal scroll; art scales via `viewBox`.
- Reduced motion: no motion exists yet; confirm no CSS animation on art components.
- Keyboard only: `PillButton`/`IconButton` reachable, visible focus ring, `Enter`/`Space` activate.
- Numbers: `config.mock.latencyMs` = 600 (skeleton visible ≥ 500ms); button heights 32/38/44px.
- `bun run build:portfolio` is idempotent; `git`-free check: run twice, compare `src/api/mocks/portfolio/*.ts` checksums.
- Project count = 6, posts = 5, ids unique, every project's `kind` is a `MotifKind`.

## Done gate

`bun run check` · `bun run lint:tw` (prints `Tailwind classes are canonical.`) · `bun run lint:style` (prints `Code style is clean.`) · `bun run pretty` · `graphify update .` · MEMORY.md updated (state, decisions, generated files). No commits.

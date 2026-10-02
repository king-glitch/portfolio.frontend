# 05 — Milestone 4: project page

Status: not started. Depends on: plans `02`, `03`, `04`. Overview refs: §2 (`/work/:projectId`), §3.2 (blocks), §5 (`use-horizontal-scroller`).

Route `routes/work/[project-id]/index.tsx` reads `useProject(projectId)` and `useProjects()` (for prev/next/counter). Navigation to the next project is a route change (`workPath(nextId)` with `viewTransition`), not an in-page slot swap, so refresh, back/forward and shared links work. The scroller state is keyed by `projectId` (remount resets position, `pull`, active dot).

## Screens and parts (`design/Main.dc.html`)

| Part                                                                                      | Prototype source                                                                                                                                          | Component (`routes/work/[project-id]/components/…`)                                                                                                                                      |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page shell (fixed viewport, `overflow: hidden`)                                           | `<!-- PROJECT PAGES -->` line 470                                                                                                                         | `project-page.tsx`, `project-page-skeleton.tsx`                                                                                                                                          |
| Top bar: Close, `{ } JSON`, title `0001 — AADS`, rolling counter, prev/next, progress bar | lines 474–492 (`closeProject`, `toggleJson`, `digits`, `s.prev`, `s.next`, `setBar`)                                                                      | `topbar/project-topbar.tsx`, `topbar/rolling-counter.tsx`, `topbar/progress-bar.tsx`                                                                                                     |
| JSON sheet                                                                                | `<aside aria-label="Block JSON for this page">` line 493 (`GET /projects/<num>`, `<n> blocks`, `jsonOf` line 867: strings truncated at 64 chars with `…`) | `json/project-json-sheet.tsx` (`ui/sheet` side right, width `min(520px,100vw)`)                                                                                                          |
| Viewport + track                                                                          | line 500 (`tabIndex=0`, `onKeyDown`, `aria-label="Project <name>, scroll horizontally"`)                                                                  | `scroller/project-viewport.tsx`                                                                                                                                                          |
| End-cap (next title fills left→right)                                                     | meter/fill logic in `tick()` (`E.meter`, `E.fill`, `clip-path: inset(0 X% 0 0)`) and the last panel, line ~674                                            | `scroller/end-cap.tsx`, `scroller/end-cap-title.tsx`                                                                                                                                     |
| Dots                                                                                      | `data-dot` handling in `tick()` (active 22px/opacity 1, others 6px/.35)                                                                                   | `scroller/panel-dots.tsx`                                                                                                                                                                |
| Block renderer                                                                            | `Record<BlockType, FC>`                                                                                                                                   | `blocks/block-renderer.tsx`                                                                                                                                                              |
| `project-header` ×5 variants                                                              | lines 506–540 (split 506, center 524, outline/vertical 533 and others by `b.v.*`)                                                                         | `blocks/header/{block-project-header,header-split,header-center,header-outline,header-vertical}.tsx` (`split-rev` reuses split with a `reverse` class lookup `Record<HeaderVariant, …>`) |
| `quote`                                                                                   | line 548 (tone `invert` = inverted background panel)                                                                                                      | `blocks/text/block-quote.tsx`                                                                                                                                                            |
| `big-number`                                                                              | line 556 (`data-speed=.88`, `clamp(140px, 24vw, 440px)`, weight 900)                                                                                      | `blocks/text/block-big-number.tsx`                                                                                                                                                       |
| `about-split`                                                                             | line 563                                                                                                                                                  | `blocks/text/block-about-split.tsx`                                                                                                                                                      |
| `numbered-list` / `stack-cards` / `feature-grid`                                          | lines 571 / 578 / 585                                                                                                                                     | `blocks/lists/{block-numbered-list,block-stack-cards,block-feature-grid}.tsx`                                                                                                            |
| `timeline` / `zigzag`                                                                     | lines 592 / 602                                                                                                                                           | `blocks/lists/{block-timeline,block-zigzag}.tsx`                                                                                                                                         |
| `motif-full`                                                                              | line 609                                                                                                                                                  | `blocks/media/block-motif-full.tsx`                                                                                                                                                      |
| `chips`                                                                                   | line 616 (inverted panel)                                                                                                                                 | `blocks/text/block-chips.tsx`                                                                                                                                                            |
| `mock` / `gallery`                                                                        | lines 624 / 633                                                                                                                                           | `blocks/media/{block-mock,block-gallery}.tsx` (use `ProjectMedia`)                                                                                                                       |
| `architecture`                                                                            | line 647                                                                                                                                                  | `blocks/diagram/block-architecture.tsx`, `architecture-node.tsx`                                                                                                                         |
| `lineage`                                                                                 | line 660                                                                                                                                                  | `blocks/diagram/block-lineage.tsx`                                                                                                                                                       |
| Keyboard                                                                                  | `onKey` (arrows, PageUp/PageDown, Space, Esc)                                                                                                             | in `use-horizontal-scroller`                                                                                                                                                             |

Folder rule: `blocks/` has ≤ 6 files per folder, so groups are `header/`, `text/`, `lists/`, `media/`, `diagram/`; `block-renderer.tsx` sits in `blocks/`.

Panel widths (from the markup): `100vw` default, `120vw` for the wide centered header (line 533), `min(82vw, 1240px)` for inverted `quote`/`chips` panels (549, 617 use full width), min `70vw`/`80vw` for list panels; height 100%; padding `120px clamp(16px,5vw,80px) 72px`; separators `border-right: 1px solid var(--line)`. These live in block-file `cva` variants or a shared `common/layout/panel.tsx` (`Panel` with `width` variant: `full | wide | card | auto`), not as call-site strings.

## Files (exact paths)

Create: all files in the table above under `src/routes/work/[project-id]/components/`; `src/components/common/layout/panel.tsx`; `src/hooks/scroll/use-horizontal-scroller.ts`; `src/lib/motion/scroller.ts` + `scroller.test.ts`; `src/lib/portfolio/project-nav.ts` (`nextId`, `prevId`, `counterDigits`) + test; `src/types/work.ts` (`ScrollerState`, `PanelMeta`); `src/components/ui/sheet.tsx` (shadcn add).

Change: `src/routes/work/[project-id]/index.tsx`, `src/config.ts` (`portfolio.scroller.*`), `src/locales/en.json` (`work.*`), `src/main.css`.

## Steps

1. **Page shell + data.** Load `useProject`; render top bar with static counter, Close (history-aware, overview §2), prev/next links (`NavLink`, `viewTransition`). Check: `/work/aads` loads, Close returns to the referrer, direct entry closes to `/`.
2. **Block renderer.** `Record<BlockType, React.FC<…>>` in `block-renderer.tsx`; start with `project-header` and `quote`; add one block at a time in the order of each project's layout, checking all 6 projects after each pair of blocks. Each block uses `data-panel`; parallax layers carry `data-speed`.
3. **Scroller engine (`use-horizontal-scroller`)** per overview §5: wheel/trackpad → `target += delta`, `current += (target−current)*0.085`, track `translate3d(−x)`, parallax per `data-speed` `(panelLeft − x)*(1−speed)*0.35`; progress bar `scaleX(current/max)`; dots. Pure maths in `lib/motion/scroller.ts`. Check: smooth inertia, no vertical page scroll, `max = trackWidth − viewportWidth` re-measured on `ResizeObserver` (not per frame).
4. **End resistance + loop.** At the end (`target ≥ max−1`), positive deltas feed `pull += d*max(.12, .5*(1−.55*pull/th))`; `th = 420px`; reverse delta unwinds; after **160ms** idle `pull*=0.9` (zero under 0.5); `q = min(1, pull/th)` drives meter `scaleX(q)` and the next title `clip-path: inset(0 (100−q*100)% 0 0)`; at `pull ≥ th` navigate to `(index+1) % n`. Check: the next-project title fills left→right; release before 420px relaxes back; last project loops to the first.
5. **Keyboard.** (`onKey`, Main line 752) →/↓/PageDown/Space = `+0.4 × innerWidth`; ←/↑/PageUp = `−0.4 × innerWidth`; each feeds the same `feed()` path as the wheel (so keys at the end also build resistance); Esc = Close. Wheel: `deltaX` if larger than `deltaY` else `deltaY`; `deltaMode` 1 ×32, 2 × `innerHeight`; listener `{ passive: false }` with `preventDefault`. The viewport (`tabIndex=0`) takes focus on mount (`preventScroll`). Check: all keys work, no page scroll leakage.
6. **Touch.** Under `(pointer: coarse)` the engine is off: viewport uses native horizontal `overflow-x: auto` + `scroll-snap-type: x mandatory`, progress and dots from `scrollLeft`; end-cap shows a "Next" button instead of resistance. Check on 390×844.
7. **Rolling counter.** Two digit reels translating on `transform` (`/ 06`); updates when `projectId` changes; accessible label `Project 2 of 6`.
8. **JSON sheet.** `Sheet` (side right), always mounted; content from the same `Project.blocks` (`jsonOf`: strings > 64 chars cut to 62 + `…`); header `GET /projects/<num>` and `<n> blocks` (plural key). Overlay lifecycle: closes on route change; state resets in `onOpenChangeComplete(false)`.
9. **Remaining blocks** and `ProjectMedia`/`ProjectMock` usage; verify all 6 projects page by page against the prototype.
10. **States + not-found.** Skeleton, error, empty. MEMORY.md update.

## States (every query consumer)

| Consumer                           | Loading (same box)                                                                                                     | Error                                                | Empty                                   | Success      |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------- | ------------ |
| `useProject`                       | page shell: top bar skeleton + 3 full-height panel skeletons (header split shape, a quote, a mock) at `100vw` × `100%` | `Alert` + retry (`refetch`) centred in viewport      | `Empty` for unknown id with a link home | block panels |
| `useProjects` (counter, prev/next) | counter `—/—`, prev/next disabled                                                                                      | counter hidden; prev/next disabled; page still works | n/a                                     | enabled      |

Mutations: none.

## Acceptance checks

1440×900:

- Lerp 0.085 (target-to-current half-life ≈ 8 frames); parallax: element with `data-speed=1.22` moves faster than the track; `0.88` slower; offset formula verified in devtools for one panel.
- Resistance threshold 420px (`config`); at 160ms idle the pull decays ×0.9/frame; crossing 420px navigates; navigation to `/work/<next-id>` plays the 0.95s transition; Back returns to the previous project at x = 0.
- Loop: AADS → … → Estic AI → AADS.
- Counter reels animate on `transform`; progress bar = `current/max`.
- JSON sheet shows 7 blocks for AADS, 6 for Estic AI; truncation `…` present.

390×844:

- Native scroll-snap per panel; no vertical scroll trap; end "Next" button works; top bar fits (JSON button hidden: `mob-hide`); panels single-column (`mob-1`) or scrollable (`mob-scroll`).

Reduced motion:

- No lerp (immediate jump), no parallax, no clip-path animation: end-cap becomes a plain "Next project" button (and the resistance gesture still works without animation); counter changes instantly; page transition is an instant swap.

Keyboard only:

- Tab: Close → JSON → prev → next → viewport; arrows/PgUp/PgDn/Space scroll by 0.4 × viewport width; Esc closes; JSON sheet traps focus and restores it; `aria-label` on viewport; end-cap button reachable.

## Done gate

`bun run check` · `bun run lint:tw` · `bun run lint:style` · `bun run pretty` · `graphify update .` · MEMORY.md updated. No commits.

# 06 — Milestone 5: About (Explore + Resume) and Notes

Status: not started. Depends on: plans `02`–`05` (shell, `ProjectMotif`/`Mock`, hooks). Overview refs: §2, §3.3, §5 (`use-pan-wall`), §7 (`about.*`, `notes.*`).

## Part A — About

`routes/about/layout.tsx` owns the Explore/Resume toggle (two `NavLink`s, `aria-current`; prototype `<!-- MODE SWITCH -->`, About.dc.html line 229; `role="group" aria-label="View"`), reads `useProfile` and `useProjects` once (children read the same cached queries), and renders `<Outlet/>`. `/about` redirects to `/about/explore` (plan 03).

### Screens and parts (`design/About.dc.html`)

| Part                                             | Prototype source                                                                                                                                                                                                         | Component (`routes/about/…`)                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wall viewport, drag/wheel/touch pan, tiles, hero | `<!-- EXPLORE -->` line 19; engine `tick()` line 314, `size()` 282, `collect()` 287, `recenterNow()` 292                                                                                                                 | `explore/index.tsx`, `components/wall/{explore-wall,wall-tile,wall-minimap,wall-recenter}.tsx`                                                                                                                                                                                                                                                          |
| Layout table `L` (27 tiles, 10×7 grid)           | `renderVals()` lines 351–400 (`L`)                                                                                                                                                                                       | `components/wall/wall-layout.ts` (typed `{ col, row, w, h, kind, … }[]`, derived data injected)                                                                                                                                                                                                                                                         |
| Tile contents                                    | lines 27–185 (hero 27, big stat 37, tall stat 46, mock 55, motif 61, text effects 67, chat bubbles 76, icon 85, monogram 100, timeline 108, donut 121, habits 132, chips 140, soft skills 148, word bars 155, hello 163) | `components/tiles/` groups: `stat/` (`tile-stat`, `tile-tall`, `tile-donut`, `tile-bars`), `media/` (`tile-mock`, `tile-motif`, `tile-hero`), `text/` (`tile-words`, `tile-chat`, `tile-hello`, `tile-soft`, `tile-habits`), `misc/` (`tile-icon`, `tile-mono`, `tile-chips`, `tile-timeline`), registry `Record<AboutTileKind, FC>` in `wall-tile.tsx` |
| Resume sheet                                     | `<!-- RESUME -->` line 187 (`.print-sheet`; header name + `Software developer — <employer>` + contacts; two columns: Summary, Experience, Selected projects with "My part:"; aside: skills ×5, Education)                | `resume/index.tsx`, `components/resume/{resume-sheet,resume-header,resume-experience,resume-projects,resume-aside,resume-skeleton}.tsx`, print button `resume-print-button.tsx`                                                                                                                                                                         |

Tile data are derived at render from `Profile` + `ProjectSummary[]` (counts, `behind`, `chain`, `games`, languages/tools, years): **no numbers baked into fixtures**. The word-frequency bars ("Words my notes use most") derive from the projects' `about/role` text (stop-word list in `src/lib/portfolio/word-freq.ts` + test).

### Explore wall numbers

- Grid 10 columns × 7 rows; unit `U` = 200 (vw ≥ 1100), 176 (≥ 760), 148 (below); gap `G = round(U*0.08)`; `W = 10U + 9G`, `H = 7U + 6G`; hero tile at col 3 row 2, 3×2.
- Per-tile effect, `d = distance(tile centre, viewport centre) / (0.62 × max(vw, vh))`: `scale = 1 − 0.2·clamp(d − 0.3)`, `opacity = clamp(1.5 − 1.05·d)`, 7% pull toward the centre.
- Inertia `v *= 0.93`; rubber-band beyond the edges up to **30%** of the viewport; wheel and touch pan the wall; click ignored when drag > **6px**; tiles ripple in from the hero on load (stagger by distance to hero); minimap 168px wide with the viewport rectangle; recenter control jumps/animates to the hero. Tiles with `proj()` open `workPath(id)`; the notes tile opens `config.routes.notes`.
- Fixed viewport page (`overflow: hidden`); the shell nav stays visible.

### Files (exact paths)

Create: `src/routes/about/layout.tsx` (replaces placeholder), `src/routes/about/explore/index.tsx`, `src/routes/about/resume/index.tsx`, `src/routes/about/components/mode-switch.tsx`, the `wall/`, `tiles/`, `resume/` components above (each tile with its skeleton only where it shows data), `src/hooks/pointer/use-pan-wall.ts`, `src/lib/motion/wall.ts` + `wall.test.ts` (tile transform, rubber band, inertia), `src/lib/portfolio/{word-freq,about-stats}.ts` + tests, `src/types/about.ts` (`AboutTileKind`, `WallTile`), `src/theme/print.css` (print stylesheet).

Change: `src/config.ts` (`about.wall.*`), `src/locales/en.json` (`about.*`), `src/main.css` (import print css).

### Steps (Part A)

1. `about/layout.tsx` + mode switch + redirect. Check: URL toggles between `/about/explore` and `/about/resume` by link, back/forward and refresh work.
2. Resume first (simpler): white `ResumeSheet` from `useProfile` + `useProjects` (`about/role` per project, `side` as meta). Check: matches prototype copy; placeholders `[YOUR EMAIL]`, `[GITHUB]`, `[LINKEDIN]` visible.
3. Print: `@media print` hides shell (nav, menu, cursor, terminal button, mode switch, print button), page margins, sheet always white/black (token-independent), no box shadows, `break-inside: avoid` on entries. Print button calls `window.print()`. Check: Print preview shows only the sheet, one A4/Letter page-set without clipped text, in dark theme too.
4. Wall layout: `wall-layout.ts` + static tiles (no motion) in the grid, correct positions. Check: 27 tiles, no overlap, hero centred.
5. `use-pan-wall` + `lib/motion/wall.ts`: pointer drag, wheel, touch, inertia, rubber band, tile scale/opacity/pull. Cache tile centres on resize (`collect(recenter)`); rAF only while the wall is mounted and visible. Check: numbers above.
6. Ripple-in, minimap, recenter, drag-click guard.
7. Tile contents one group at a time (stat, media, text, misc), checking each against the prototype at both viewports; skeleton grid while queries load.
8. MEMORY.md update.

## Part B — Notes

### Screens and parts (`design/Blog.dc.html`)

| Part                      | Prototype source                                                                                                                                 | Component (`routes/notes/…`)                                                                                                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List header + tag filters | `<!-- LIST -->` line 19; tags built at line 147                                                                                                  | `components/tag-filter.tsx` (`ToggleGroup`/links, bound to `?tag=`), `index.tsx`                                                                                                                                                                                              |
| Featured post             | line 35 (`data-cursor="Read"`, `ProjectMotif`, `num · date · read`, title `clamp(36px, 4.4vw, 72px)` weight 800 tracking −0.055em, excerpt 18px) | `components/featured-post.tsx`, `featured-post-skeleton.tsx`                                                                                                                                                                                                                  |
| Staggered grid            | line ~50 (`mt: i%2 ? 120px : 0`), cards `{num} · {tagLine}` + `{read}`                                                                           | `components/post-grid.tsx` (+ shared `PostCard`)                                                                                                                                                                                                                              |
| Post page                 | `<!-- POST -->` line 65: tags, title, sticky progress bar, blocks, "next note"                                                                   | `[slug]/index.tsx`, `[slug]/components/{post-header,post-progress,post-body,next-note,post-skeleton}.tsx`, `[slug]/components/blocks/{post-paragraph,post-heading,post-list,post-code,post-quote,post-callout}.tsx`, registry `Record<PostBlockType, FC>` in `post-block.tsx` |

Code block: monospace, **line numbers** (CSS counters), language label, horizontal scroll, no syntax highlighting (`// ponytail: no highlighter; add shiki-light if posts grow`). Callout carries the "Sample post" text from data plus a visible `Sample` label per brief. Reading time: `t("notes.card.read-time", { count })`. Progress bar: `scaleX` from `scrollY/(docHeight − vh)`, passive scroll listener + rAF, `position: sticky; top: 0`, `role="progressbar"`.

### Files (exact paths)

Create: the files above, `src/hooks/scroll/use-read-progress.ts`, `src/lib/portfolio/tags.ts` (unique tags, filter predicate) + test, `src/components/shared/posts/{post-card,post-card-skeleton}.tsx` (already used by Home).
Change: `src/routes/notes/index.tsx`, `src/routes/notes/[slug]/index.tsx`, `src/locales/en.json` (`notes.*`), `src/config.ts` (`notes.*`).

### Steps (Part B)

1. List route: `usePosts`, `?tag=` zod param (absent = all); tags derived from the **unfiltered** list; featured = first of the filtered list; grid = rest, staggered 120px on odd indices (desktop only). Check: `?tag=Go` shows Go posts; unknown tag shows `Empty`; reload/back keep the filter.
2. Post route: `usePost(slug)`; header, blocks, progress bar, next note = next post in list order (loops). Check: all 5 posts render every block type present.
3. Code block with line numbers; long lines scroll horizontally, page never does.
4. Transitions to a post use `viewTransition`; next-note navigates the same way. MEMORY.md update.

## States (every query consumer, both parts)

| Consumer                                   | Loading (same box)                                                                                        | Error                                                                    | Empty                                                              | Success         |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ | --------------- |
| About layout (`useProfile`, `useProjects`) | wall: skeleton tiles on the same 10×7 grid; resume: sheet-sized skeleton (A4 ratio, same two columns)     | `Alert` + retry inside the viewport/sheet area; mode switch stays usable | `Empty` ("nothing to show")                                        | wall / sheet    |
| Notes list (`usePosts`)                    | featured skeleton (same height as featured) + 4 card skeletons in the staggered grid + tag chip skeletons | `Alert` + retry                                                          | `Empty`: no posts; filtered-empty variant with "clear filter" link | featured + grid |
| Post (`usePost`)                           | header + 8 text-line skeletons + code-block skeleton                                                      | `Alert` + retry                                                          | `Empty` for unknown slug with link to `/notes`                     | post            |

Mutations: none.

## Acceptance checks

1440×900:

- Wall: unit 200, gap 16; tile at the viewport centre has scale 1/opacity 1, a tile at `d ≥ 0.9` has opacity ≈ 0.55–0 and scale 0.88; inertia visibly decays (×0.93/frame, stops < 0.1px/frame); rubber band maxes at 30% viewport and springs back; drag > 6px does not open a project; minimap viewport rect tracks pan; recenter returns to the hero.
- Resume prints to a white sheet only (preview in dark theme); two columns on screen; text not clipped.
- Notes: staggered grid offset 120px on odd cards; progress bar 0 → 100% across the post; featured title uses the specified clamp.

390×844:

- Wall unit 148; touch pan works, page does not scroll or bounce; tiles tappable; minimap hidden or ≤ 120px (`mob-hide` decision recorded); Resume collapses to a single column and still prints correctly.
- Notes grid 1 column with no stagger; tag chips scroll horizontally; code blocks scroll inside the block.

Reduced motion:

- Wall: no ripple-in, no inertia (pan stops on release), tiles at full opacity/scale (no distance falloff animation; static falloff allowed), recenter instant; notes: progress bar updates without smoothing; view transitions off.

Keyboard only:

- Mode switch reachable and `aria-current` correct; project/notes tiles are real buttons/links in DOM order; arrow keys pan the wall by one `U` (add; the prototype has none) and Home recenters; `Esc` nothing; tag filter and post cards reachable; Print button reachable; focus visible.

## Done gate

`bun run check` · `bun run lint:tw` · `bun run lint:style` · `bun run pretty` · `graphify update .` · MEMORY.md updated. No commits.

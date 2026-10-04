# 11 — Dashboard redesign: Void in the shell, bouncy motion, theme switch

Status: Parts A–E implemented (2026-10-04), not browser-verified. Skipped: sidebar active-pill slide, row reorder glide, Void head in the sidebar brand, recent-edits list (no updated timestamps), ⌘K search, form mini TOC, ⌘S, status URL filter, list empty-state Void line. Part F open.
Read with `AGENTS.md`, `src/config.ts`, `MEMORY.md`, `DESIGN.md` and plan 10.

Goal: `/dashboard/*` stops feeling like a stock shadcn admin and starts feeling like the portfolio's
back office. Void (the site companion, `src/components/shared/shell/companion.tsx`) lives in the
dashboard too, reacts to what the owner does, and owns the theme switch. Motion gets one shared
spring/bounce vocabulary instead of per-component easings.

Order: A (done) → B (motion tokens) → C (Void in the dashboard) → D (theme switch from Void) →
E (shell + page redesign) → F (verification). Each part ships alone and passes `bun run check`,
`bun run lint:tw`, `bun run lint:style`, `bun run pretty`.

---

## Part A — Bugs (fixed)

### A1. Home stat cells blink on hover

- Where: `src/routes/components/home/hello/hello-stat.tsx`.
- Cause: the hover flood (`scale-y-0` → `scale-y-100`) is promoted to its own compositor layer only
  while its transform transitions, and the text above it uses `mix-blend-difference` against an
  un-isolated, transparent cell. Each layer promote/demote re-rasterizes the blend group against the
  page, so the cell flashes at hover start and end.
- Fix: the cell is its own blend group with an opaque background (`isolate bg-background`) and the
  flood keeps a permanent layer (`will-change-transform`). Visual result is identical; the blend
  only ever sees the cell.

### A2. Theme switch is laggy (site and dashboard)

- Where: `src/hooks/use-theme.ts` (both toggles route through it).
- Cause: toggling `.dark` restyles the whole tree, then every element with `transition-colors` /
  `transition-all` fades to its new colour on its own 150–700 ms clock. Inside the View Transition
  the new snapshot is live, so the circle reveals half-faded colours; without it (dashboard) the
  page visibly smears.
- Fix: `apply()` injects `*{transition:none!important}`, toggles the class, forces a reflow, and
  removes the style on the next frame (same trick as next-themes `disableTransitionOnChange`).

### A3. Dashboard toggle had no animation

- `shell-topbar.tsx` called `toggle()` with no origin, so it skipped the View Transition. It now
  passes the button centre, like `site-nav.tsx`. Part D moves the origin to Void.

---

## Part B — Motion tokens (spring / bounce)

One vocabulary, defined once in `src/main.css` `@theme`, used everywhere in the dashboard.

- Add easing tokens built with CSS `linear()` (native, no dependency):
    - `--ease-spring`: soft overshoot (~6 %), settles in one bounce. Buttons, popovers, rows.
    - `--ease-bounce`: two visible bounces. Void arrivals, success moments, theme reveal edge.
    - Generate the `linear()` stops once (e.g. from a damped spring, 40–60 stops) and paste them;
      keep `--ease-out-expo` / `--ease-wipe` for the public site.
- Add durations to `@theme`: `--duration-spring: 520ms`, `--duration-bounce: 900ms`.
- Utilities: `ease-spring`, `ease-bounce` fall out of the `--ease-*` theme namespace automatically.
- Reduced motion: every new animation sits behind `motion-safe:` or the existing
  `prefers-reduced-motion` block; bounce becomes an instant state change.
- Do not add `motion` / framer: `linear()` + View Transitions + the existing mascot physics engine
  cover every case below.

Where the spring goes (call sites pass layout only; motion lives in wrappers/variants per AGENTS.md):

| Element                           | Motion                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Sidebar active indicator          | pill slides between items with `ease-spring` (one absolutely positioned element, `view-transition-name: dash-nav-active`) |
| Sidebar collapse                  | width transition `ease-spring` instead of `ease-linear` (in a wrapper, not `ui/sidebar.tsx`)                              |
| Dialog / Sheet / Popover open     | `zoom-in-95` + `ease-spring` via a `common/` wrapper class                                                                |
| Table rows after create / reorder | moved row gets `view-transition-name: row-<id>` for the reorder, so up/down moves glide instead of jump                   |
| Save buttons                      | on success the check icon pops with `ease-bounce`                                                                         |
| Route change inside `/dashboard`  | content fades/rises 8 px with `ease-spring` (`viewTransition` on sidebar links, scoped `html[data-vt="dash"]` rules)      |

---

## Part C — Void in the dashboard

Today `<Companion />` mounts only in `src/routes/layout.tsx` (public site).

1. Mount it in `src/routes/dashboard/layout.tsx` too, inside `SidebarInset`, bottom-right.
   It depends on `usePreloader().loaded`; the dashboard has no preloader, so either provide the
   context as `loaded: true` in the dashboard layout or give `Companion` a `loaded` override prop.
   Pick the context route (no new prop) if the provider is cheap to mount.
2. `CompanionPlace.Dashboard` + `companionPlace()` match on `config.routes.dashboard` (`end: false`).
   Lines in `en.json` under `shell.companion.places.dashboard.{1..4}` (greeting, tip about
   reordering, tip about the file library, a joke). Per-section variants are optional; skip unless
   copy exists.
3. Event reactions (events, not derived state — use mutation callbacks, not effects):
    - mutation success (save, publish, upload, reorder): `poke(6)` + short line
      (`shell.companion.events.saved`, `…published`, `…uploaded`).
    - mutation error: `poke(9)` + `shell.companion.events.error`.
    - Expose this through a tiny context in `src/contexts/companion-context.tsx`
      (`useCompanion().react(CompanionEvent.Saved)`), with `CompanionEvent` as an enum in
      `src/types/ui.ts` and a `Record<CompanionEvent, { strength: number; key: ParseKeys }>`.
      Call it from the existing `onSuccess` / `onError` handlers that already fire toasts.
4. Dock: on mobile it must not cover the sticky form footers. Add a
   `CompanionPlace.Dashboard` dock variant with extra bottom offset; hide the bubble below `sm`.
5. Click on Void in the dashboard opens nothing new; it cycles lines like on the site.

---

## Part D — Theme switch driven by Void (bounce)

The theme toggle becomes a Void moment instead of a plain circle wipe.

1. Origin: the reveal starts from Void, not from the button. `useTheme().toggle(origin)` already
   takes a point. The topbar button reads Void's box through the companion context
   (`useCompanion().origin()` returns the mascot centre, or `undefined` if not mounted, which
   falls back to the button centre).
2. Sequence (total ≈ 1 s):
    1. Void squashes (`poke(9)`), 120 ms anticipation.
    2. `startViewTransition(apply)`; `::view-transition-new(root)` animates
       `clip-path: circle()` from 0 to 150vmax with `--ease-bounce` — the edge overshoots and
       settles, reading as a bounce outward from Void.
    3. `::view-transition-group(void)`: give the dock `view-transition-name: void` so Void is its
       own layer above the wipe; animate it with a `void-hop` keyframe (translateY −24 px, land,
       small second hop) on `--ease-bounce`.
    4. After `finished`, Void says the existing `shell.companion.theme.{dark,light}` line.
3. Keep the public site on the same code path (it already mounts Void); `site-nav.tsx` switches
   its origin to Void the same way.
4. Reduced motion or no `startViewTransition`: instant swap (today's fallback), Void still talks.
5. All CSS lives next to the existing `html[data-vt="theme"]` block in `main.css`.

---

## Part E — Shell and page redesign

Keep shadcn primitives; restyle through tokens and `common/` wrappers only.

1. **Sidebar**
    - Brand block: small Void head (static `Mascot` at 28 px) instead of the letter logo.
    - Section counts as `SidebarMenuBadge` (projects, notes, frames, files) from the existing list
      queries (cached, no new requests).
    - Wrap the app in `TooltipProvider` (dashboard layout) so collapsed-sidebar tooltips open
      instantly and hand off between items without the close/open flicker.
2. **Top bar**
    - Breadcrumbs left; right side: command search (`CommandDialog`, ⌘K) for jumping to any
      project/note/section, theme toggle, "View site".
    - ⌘K is new scope; ship it last and only if wanted.
3. **Overview page** (`/dashboard` currently redirects to projects)
    - New `routes/dashboard/overview/index.tsx` as the default view: stat cards (projects
      published/draft, notes, frames, storage used) reusing the home stat odometer look in a compact
      `common/cards/stat-card.tsx`, recent edits list, Void greeting.
    - Each card has loading (`Skeleton`), error (`Alert` + retry), empty (`Empty`) states.
    - Keep `config.routes.dashboard` redirecting to the overview instead of projects.
4. **Lists** (projects, notes, files, gallery)
    - Row hover reveals actions on desktop (`opacity-0 group-hover:opacity-100`, always visible on
      touch and on focus-within) to reduce noise.
    - Status as a filter `ToggleGroup` in the page header, stored in a URL search param.
    - Empty states get a Void illustration line instead of plain text.
5. **Forms**
    - Sticky footer with Save/Cancel (same heights, per Overlay Button Sizing Parity), dirty
      indicator, `⌘S` to save.
    - Section cards with anchors in a right-side mini TOC on wide screens for long project forms.
6. **Density and type**: page padding `p-4 md:p-8`, max content width `max-w-6xl`, page title
   `text-3xl font-semibold tracking-tight`, consistent `gap-6` between page sections.

---

## Part F — Verification

- Browser, both themes, desktop + 390 px:
    - Home stats: hover in/out repeatedly, fast and slow — no flash (A1).
    - Theme toggle on home, about, dashboard pages — no colour smear, wipe from Void, Void hops (A2, D).
    - Sidebar collapsed: sweep the cursor over the icons — tooltips hand off without flicker (E1).
    - Every async state of the overview cards seen (mock latency).
    - Reduced motion on: no bounce, instant theme swap, Void still speaks.
- Performance: Chrome performance panel during theme toggle on home — no long style-recalc task
  after the swap, no frames over 16 ms in the wipe.
- Gates: `bun run check`, `bun run lint:tw`, `bun run lint:style`, `bun run pretty`,
  `graphify update .`, update `MEMORY.md`.

# 03 — Milestone 2: shell (routes, nav, menu, preloader, cursor, transition)

Status: not started. Depends on: plan `02` done. Overview refs: §2 routes, §4.3 shared components, §5 engines, §5.1 transition.

## Screens and parts

| Part                | Prototype source (`design/Main.dc.html`)                                                                                                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preloader           | `<!-- PRELOADER -->` line 140; logic `runLoader()` line 1027 (1700ms count, 180ms hold, wipe 1s `cubic-bezier(.76,0,.24,1)`, unmount +1050ms)                                                                                |
| Nav pill            | `<!-- NAV PILL -->` line 152 (64px high, max-width 900px, `top: 20px`, radius 999, grid `1fr auto 1fr`; items MENU · W—SIEFERT · About · Notes · Get in touch; opacity delayed until loaded)                                 |
| Menu                | `<!-- MENU -->` line 418 (`role="dialog"`, `.mlink` list with dimming siblings, preview card, project list, jump chips, contacts, terminal shortcut); data `menuPages`/`menuJumps`/`menuMeta` in `renderVals()` (line 1215+) |
| Index hover preview | `<!-- INDEX HOVER PREVIEW -->` line 411 (follow-the-cursor card: lerp 0.14, offset +28px/−120px, rotate `clamp((mx−px)*0.08, ±8)`); built here, used by Home milestone                                                       |
| Cursor              | `<!-- CURSOR -->` line 712; engine `tick()` cursor block (lines ~1190–1214) and pointer handlers lines 774–795 (`[data-cursor]`, `[data-magnetic]`, `a, button, [data-snap]` snapping)                                       |
| Page transition     | CSS `.pg-enter`/`.pg-leave` lines 65–68, keyframes `pgEnter`/`pgLeave` (26 linear frames); `go()` line 903 (950ms)                                                                                                           |
| Terminal button     | `<!-- TERMINAL -->` line 694 (button only here; dialog in plan `07`)                                                                                                                                                         |
| Global CSS          | lines 15–100 (`.theme-*`, `[data-magnetic]` transition `.5s cubic-bezier(.16,1,.3,1)`, `.tap`, `.mob-hide`)                                                                                                                  |

## Files (exact paths)

Create:

- `src/routes/layout.tsx` (shell: providers' consumers, `Preloader`, `SiteNav`, `SiteMenu`, `StickyCursor`, terminal button, `<PageTransitionStyles/>` not needed since CSS-only, `<Outlet/>`)
- `src/routes/work/[project-id]/index.tsx`, `src/routes/about/layout.tsx`, `src/routes/about/explore/index.tsx`, `src/routes/about/resume/index.tsx`, `src/routes/notes/index.tsx`, `src/routes/notes/[slug]/index.tsx` (each a titled placeholder with `meta()`; real content in plans 05–06)
- `src/contexts/preloader-context.tsx`, `src/contexts/shell-context.tsx`
- `src/components/shared/shell/{preloader,site-nav,site-menu,sticky-cursor,page-transition-link}.tsx` (`page-transition-link` only if a single wrapper is needed for `viewTransition`; otherwise skip, `NavLink viewTransition` is enough, YAGNI)
- `src/components/shared/shell/menu/{menu-page-link,menu-preview,menu-projects,menu-jumps,menu-contacts}.tsx`
- `src/components/shared/projects/project-preview-card.tsx` (menu preview + index hover)
- `src/components/shared/contact/contact-links.tsx`
- `src/hooks/motion/{use-raf,use-reduced-motion,use-preloader,use-scramble}.ts`, `src/hooks/pointer/use-sticky-cursor.ts`
- `src/lib/motion/{lerp,cursor}.ts` + `cursor.test.ts` (pure target-size/position step)
- `src/theme/page-transition.css` (keyframes copied from prototype; imported by `main.css`)
- `src/types/cursor.ts` (`CursorLabel`)
- UI primitives: `src/components/ui/dialog.tsx` (shadcn add, after `search`/`docs`)

Change: `src/routes.ts`, `src/root.tsx` (`<html class="dark">`, providers), `src/config.ts` (route templates + `shell.*` numbers), `src/locales/en.json` (`shell.*`, `common.cursor.*`, `common.contact.*`), `src/main.css`.

## Steps

1. **Routes.** Register all seven routes in `routes.ts` with paths from `config.routes`; `routes/about/layout.tsx` loader redirects `/about` → `/about/explore`. Check: each URL loads; `/about` lands on `/about/explore`; unknown `/work/x` shows a placeholder, no crash.
2. **Contexts + shell layout.** `shell-context` (`menuOpen`, `terminalOpen`) and `preloader-context` (`loaded`). Layout renders `<Outlet/>`. Check: React devtools shows providers; no console errors.
3. **Preloader.** Port markup; counter via rAF (`use-preloader`), `clip-path: inset(0 0 100% 0)` wipe; only on first load (module flag, not storage); `loaded` flips at count end. Check: 000→100 in ≈1.7s, wipe 1s, node removed ≈1.05s later; refresh shows it again; client navigation does not.
4. **Nav pill.** `SiteNav` with `NavLink`s (`aria-current`), `PillButton`s, "Get in touch" scrolls to `#contact` on home (navigates home first if elsewhere); hidden (`opacity 0`, `pointer-events none`, inert) on `config.routes.work`. Check: matches prototype at 1440×900 (64px, 900 max); at 390×844 the About/Notes links collapse per prototype `.mob-hide` rules; appears 0.5s after loader.
5. **Menu.** `ui/dialog` (modal, always mounted) styled full-screen; page links (numbers `01…`, hover dims others via `group-hover:`/`:has` CSS only, no state); live preview card from `useProjects` (hover on a project row swaps the preview); project list; jump chips; contacts; terminal shortcut (sets `terminalOpen`). Overlay lifecycle: hover index resets in `onOpenChangeComplete(false)`. Check: Esc, close button, overlay click all close; reopen shows defaults; focus returns to the trigger; link click closes and navigates.
6. **Page transition spike → decision.** Add `viewTransition` to nav/menu/home links and to `navigate()`; port `pgEnter`/`pgLeave` onto `::view-transition-new(root)` / `::view-transition-old(root)`. Verify tilt, rounded top corners and `perspective` in Chromium, Safari, Firefox. Write the outcome in MEMORY.md. If broken: build the two-slot transition outlet (prototype `slots`) instead, decision recorded in overview §5.1.
7. **Sticky cursor.** `use-sticky-cursor` + `StickyCursor`: dot + ring, `mix-blend-mode: difference`; `[data-cursor]` label ring 88px; snap to `a, button, [data-snap]` ≤900×240 with size+14px / radius+7px; magnetic pull 0.28/0.38 on `[data-magnetic]`; lerp 0.2; not mounted on `(hover: none)`. Labels via `t(\`common.cursor.${label}\`)`. Check: see acceptance.
8. **Scramble.** `use-scramble` for `[data-scramble]` text (nav brand, section labels). Check: scrambles once on hover/enter, ends with exact original text (also for screen readers: `aria-label` holds the original).
9. **Contact placeholders.** `ContactLinks` renders `[YOUR EMAIL]`, `[GITHUB]`, `[LINKEDIN]` as non-link text until real values exist (value starting `[` ⇒ placeholder).
10. **Terminal button** (fixed bottom-left, 44px, mono) toggles `terminalOpen`; dialog in plan `07`. Update MEMORY.md.

## States (every query consumer)

- Menu project list / preview (`useProjects`): `Skeleton` rows with the same height (6 rows), `QueryErrorAlert` + retry, `QueryEmpty`, success.
- Nav, preloader, cursor: no queries.
- Mutations: none.

## Acceptance checks

1440×900:

- Preloader count reaches 100 in 1.7s ±0.1; wipe duration 1s; hero will wait for `loaded` (verified in plan 04).
- Page transition lasts 0.95s; incoming page starts `rotateX(26deg)` with top corners 36px and ends flat; outgoing page ends at `−14vh`, brightness .34, blur 4px, no scale; transform/opacity/filter only.
- Cursor ring: 36px default; 88px on `data-cursor` element with translated label; wraps buttons/links ≤ 900×240 with +14px size, +7px radius; dot hidden while snapping.
- Nav hidden on `/work/aads`, visible elsewhere; current page has `aria-current="page"`.

390×844:

- No cursor mounted; nav fits 100% width − 32px gutter; menu is full-screen, preview card hidden (`mob-hide`), project list scrolls inside the dialog.
- Tap targets ≥ 44px.

Reduced motion (`prefers-reduced-motion: reduce`):

- Preloader skipped (no count, no wipe); page change is an instant swap (no view transition animation); cursor lerp replaced by direct positioning or hidden; scramble no-op.

Keyboard only:

- Tab order: nav → page; menu opens on Enter/Space, focus trapped, Esc closes, focus restored; skip link to `<main>` (add if missing); visible focus on pills.

## Done gate

`bun run check` · `bun run lint:tw` · `bun run lint:style` · `bun run pretty` · `graphify update .` · MEMORY.md updated (transition decision, new files). No commits.

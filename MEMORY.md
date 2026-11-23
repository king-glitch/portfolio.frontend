# MEMORY.md — Current Implementation State

Single source of truth for implementation state. Read first, update before finishing turn. Rules in [AGENTS.md](./AGENTS.md), plans in [docs/plans/](./docs/plans/), source content in [content/ME.md](./content/ME.md).

_Last updated: 2026-11-23 — Unslop + performance pass across landing page and `/projects/*` (sentence-case editorial eyebrows, static hero tags, crisp hover/copy, LCP image priority, desktop `useInView` gating, dynamic project `<title>`); `bun run check` green._

---

## 1. Recent Milestones & State

- **Hello (01) pinned lines (2026-11-23)**: `profile.about` is split by `sentences()` into `HelloLines` (10 columns, `clamp(28px,3.6vw,60px)`). On desktop the section pins via `usePinnedSteps` (track `lines*60+100` svh) and lights one line per step. A 2-column rail plus a `01 / 05` counter show progress. The owner removed the stats and the project images: the images did not match the text, and the facts panel "doesn't make total sense". Removed `HelloPanel`, `HelloStatDigit`, `HelloStatRow` and `home.hello.stats`/`panel` copy. Content edits go straight to Mongo. Not deployed.
- **Update-all pass (2026-11-23)**: Habits read `profile.core` directly (en.json override removed; copy now in `content/ME.md` → `seed.json`). Dashboard `settings/stack` tab edits `stack_stops` (`StackForm`, `StackStopRow`). Home copy unslopped (hero lede, marquee = stack names, spotlight hints). `ProjectPreviewCard` side pill moved onto the image so names are not truncated. Backend deployed (Cloud Run rev 00015, prod serves `stack_stops`); frontend deployed to Firebase. Owner ran `content seed --force`; prod `profile.core` now has the new habit copy.
- **Stack stops from DB (2026-11-23)**: section 04 stops moved out of `en.json` into public setting `stack_stops` (backend `SettingKeyStackStops`, default in `setting/rules.go`, schema `content/schemas/setting/stack_stops.json`; `serve` seeds missing settings on startup). Frontend: `StackStop` model in `api/types/portfolio/project.ts`, `publicStackStopsSchema`, `listStackStops`, `stackStopsQuery` (`queryKeys.portfolio.stops`), `useStackStops`; `StackFlow` handles loading/error/empty. Post hooks moved to `api/hooks/portfolio/post/`. Copy unslopped (literal stop names: screen/socket/server/database/chain; "One tap, five stops"). No dashboard editor yet: edit via settings API. Prod shows empty state until backend deploy.
- **Home 04/07/08 interaction pass (2026-11-23)**: `04 StackFlow` scroll-pins on desktop (`usePinnedSteps`, `h-[400svh]` track + sticky stage; click scrolls to stop; touch/narrow/reduced = hover/tap list), `StackRail` wire + packet, `StackStage` inverted panel with `animate-stage-in` wipe + ghost outlined index. Fixed stop 1 keywords (`client` matched nothing → `react/typescript/electron`). `07 Toolkit` filter runs a View Transition (`morph()` in `lib/motion/view-transition.ts`, `html[data-vt="toolkit"]` CSS, tab bar scroll-anchored), tool hover shows project count (`projectCountFor`). `08 Notes` rows compact, open on hover/focus (`grid-rows` 0fr→1fr + clip wipe; open by default on coarse pointer/reduced motion). Fixed `text-outline-inverse` (stroke was `currentColor` = transparent). Deleted dead `usePinnedTrack` + `lib/motion/pin`. Browser-verified headless Chrome 1440/500.
- **Landing + project layout pass (2026-11-23)**: Contact redesign tried and reverted by user (keep pill layout). `Spotlight` layer padding aligned to the 1360 column. Work index columns `1.6fr/0.7fr` so names stay one line. Project `BlockArchitecture` stacks vertically below `lg` (was overflowing at 760–1024px). Notes teaser meta uses `notes.card.meta` plural key. Browser-verified (headless Chrome 1440 + 900).
- **Home sections 04, 07, 08 ground-up Awwwards redesign (2026-11-23)**: Kept **05 `Habits`** (sticky-left editorial ledger) and **06 `Timeline`** (open hairline ruler + `rounded-sm` tracks). Rebuilt **04 `StackFlow`** as a split-stage architecture inspector (5-row interactive layer selector on left + monumental inverted live stage poster on right with 5-step progress rail and inline `StackUsedIn` `↗` links). Rebuilt **07 `Toolkit`** from scratch as an interactive typographic discipline matrix (underline filter tabs + oversized slash-separated Swiss type specimen with hover isolation; removed gravity bubble gimmick `toolkit-bubble.tsx` and rAF loop). Rebuilt **08 `NotesTeaser`** as a full-width numbered publication ledger (`01`/`02`/`03`, display titles with micro-shift, excerpts, sibling dimming, gliding `↗` arrows). Added `MetaCode` (`src/components/common/typography/meta-code.tsx`).
- **Unslop & performance pass on Home + `/projects/*` (2026-11-23)**: Switched `Eyebrow`, hero eyebrow, and project index column headers from wide uppercase tracking to sentence-case editorial labels. Removed infinite `animate-bob` on `HeroTags` and oversized `scale-105` card jump on `HeroFanCard` (`duration-400`, `-translate-y-4`). Tightened landing & project copy in `src/locales/en.json` (removed exclamation marks, trailing periods on display/hint copy, replaced abstract spotlight buzzwords with concrete stack nouns, tightened stats & preloader copy). Performance: added `priority` (`loading="eager"` + `fetchPriority="high"` + `decoding="async"`) on hero cards (`ProjectPreviewCard`/`ProjectPreviewMock`) and project cover (`MediaFrame` in `BlockProjectHeader`), gated `useInView` `IntersectionObserver` on `coarse` pointer in `MediaFrame` (zero idle observers on desktop), snappier `duration-300` color reveal, dynamic per-project `<title>` in `routes/projects/[project-id]/index.tsx`.

- **AGENTS.md sync, skills & polish (2026-11-23)**: Installed `github/awesome-copilot@anti-ui-slop` & `uizze/uizze@uizze-ui`. Synced `AGENTS.md` to portfolio stack. Fixed 3 i18next v27 TS errors (`terminal-line.tsx`, `tile-caption.tsx`, `wall-tile.tsx`), canonical class (`hero-tags.tsx`: `max-lg:hidden`), deleted dead `countUpValue`/`countUpMs`/`countUpEasePower`, memoized `all` page flattening in `dashboard/files` & `dashboard/gallery`, fixed `FrameLightboxDialog` prev/next `aria-label`s, added `onOpenChangeComplete(false)` copy-state reset + timer cleanup (`FrameLightboxDialog`, `FileDetailSheet`), and aligned `FileDetailSheet` URL row icon buttons (`size="icon"`, 32px) with `h-8` Input.
- **Project pages v2**: 11 blocks (`project-header`, `overview`, `filmstrip`, `showcase`, `contributions`, `architecture`, `challenge`, `statement`, `feature-grid`, `lineage`, `links`; backend `content_version: 2`). `MediaFrame` grayscale→color on hover/touch-center; real WebP assets in `public/projects/<slug>/*.webp`; per-project spec in `scripts/build-portfolio/layout.ts`. Overlap-free image-only parallax (`parallaxMaxShare`); `useChapter` top-bar section indicator. Browser-verified (Chromium 1920/1440/1280/390, light+dark).
- **Dashboard files & gallery redesign**: `/dashboard/files` (`FilesMetrics`, `FilesToolbar`, `FileCard`, `FilesTable`, `FileDetailSheet`) and `/dashboard/gallery` (`GalleryMetrics`, `GalleryToolbar`, `FrameCard`, `GalleryTable`, `FrameLightboxDialog`). Types (`ViewMode`, `FileSortOption`, `FrameSortOption`) in `src/types/ui.ts`; frame components grouped under `gallery/components/frame/`.
- **Plan 11 — Void & dashboard motion** ([11-dashboard-redesign-void.md](./docs/plans/11-dashboard-redesign-void.md)): Spring/bounce `:root` tokens (`--ease-spring`, `--ease-bounce`) in `theme.json`; dashboard CSS scoped by `html[data-area="dashboard"]`. `Companion` ("Void") docked bottom-right site-wide + dashboard (`CompanionProvider`, mutation `meta[config.companion.metaKey]`). Theme circular-reveal View Transition originates from Void (`use-theme-switch.ts`). `/dashboard/overview` stat cards + sidebar badges (`use-overview-stats.ts`). Not browser-verified.
- **Plan 10 — Dashboard storage, taxonomy, dynamic forms & seed** ([10-dashboard-review-storage-taxonomy-seed.md](./docs/plans/10-dashboard-review-storage-taxonomy-seed.md)): Schema-driven block/profile forms (`lib/dynamic-form/`), `useFieldArray` + `useController`, `applyViolations` (`blocks.<n>.root`), `FileSelectField` Combobox + `FileUploadDialog`, dynamic project categories (`GET /settings/public`, `/dashboard/settings/categories`), `StatusActions` + `useUnsavedGuard`, `TagsField`, `LinesEditor`, `content/seed.json` via `bun run build:portfolio`. Not browser-verified.
- **Backend integration & auth**: Native `fetch` client (`src/api/client.ts`, 10s timeout, `VITE_API_URL`, `{ data, errors }` unwrap → `ApiError` + zod `src/api/schemas/`). Opaque bearer session in `localStorage` (`lib/auth/session.ts`); clears only on 401 `Service.Authentication.InvalidToken`. `MutationCache` toasts errors (`lib/api-toast.ts`).
- **Portfolio site (Plans 02–07)**: Home (hero, marquee, hello odometer stats, spotlight, index, stack, pinned habits, timeline, physics toolkit, notes teaser, contact), `/projects/:projectId` (horizontal desktop scroller + resisted dark next-project cover pull), `/about/{explore,resume}` (27-tile pan wall + printable resume), `/notes` + `/notes/:slug` (`sugar-high` Catppuccin highlighting), `/gallery` (cursor-paginated infinite masonry + lightbox), Terminal (`Dialog`, `lib/terminal/commands.ts`), custom cursor, preloader, light/dark themes, hidden hero gesture → `/dashboard`.

---

## 2. Core Architecture & Implemented Domains

- **Public site (`routes/layout.tsx`)**: `/`, `/projects/:projectId`, `/about/{explore,resume}`, `/notes`, `/notes/:slug`, `/gallery`. Preloaded via `clientLoader` (`api/queries/portfolio.ts`); detail prefetch after preloader.
- **Owner dashboard (`routes/dashboard/layout.tsx`)**: `/dashboard/{overview,projects,projects/new,projects/:projectId,notes,notes/new,notes/:noteId,gallery,files,settings/{general,seo,profile,categories},account}`, auth at `/dashboard/authentication/{login,recover}`. Outside site shell (no preloader/custom cursor).
- **Styling & tokens**: Single CSS entry `src/main.css` (Tailwind v4 + generated `/* tokens:start */`..`/* tokens:end */` from `scripts/build-token/configs/theme.json`). No extra `.css` files. Breakpoint `max-desk:` (`desk` = 760px); sideways scrollers gated on `config.media.horizontal` (`>=1024px` + fine pointer).
- **Content & deploy**: Source `content/ME.md` (6 projects: Pocket, Metal Valley, Evermoon, Estic AI, Village, AADS) → `bun run build:portfolio` writes mocks + `content/seed.json`. Firebase Hosting: project `rachamon`, site `portfolio-rachamon` (`firebase.json`, `.firebaserc`).

---

## 3. Customized / Generated Files

| File | Notes |
| --- | --- |
| `src/components/ui/*` | shadcn Base UI primitives; `cn` fixed to `@/lib/utils`, classes canonicalized; `dialog.tsx` adds `overlayClassName` (menu blur-free close); `spinner.tsx` prop type fixed; `combobox.tsx` arbitrary classes canonicalized; `collapsible.tsx` unmodified. |
| `src/main.css` (tokens block) & `src/theme/tokens.ts` | Generated by `bun run build:tokens` from `scripts/build-token/configs/theme.json`. |
| `src/api/mocks/portfolio/*` & `content/seed.json` | Generated by `bun run build:portfolio` from `content/ME.md` + `scripts/build-portfolio/layout.ts` (test fixtures + DB seed; app reads live backend). |

---

## 4. Architectural Invariants & Decisions

- **Modes & skills**: Ponytail Ultra + Caveman Ultra; `shadcn` (Base UI `render`, never `asChild`), `vercel-react-best-practices`, `graphify`, `anti-ui-slop`, `uizze-ui`.
- **Stack**: React Router 8 (SPA), Tailwind CSS v4, shadcn/Base UI, RHF + zod + common `Field` wrappers (`src/components/common/fields/`), TanStack Query, native `fetch` (no Axios), `@remixicon/react`, single i18n file `src/locales/en.json` (`pluralSeparator: "-"`).
- **Rules**: Zero `any`; TypeScript `enum`s over string unions; `@/` path aliases only (except `routes.ts`/`config.ts` manifest closure); no types exported from `.tsx`; max 6 files/folder (excluding `ui/`); overlays stay mounted (`useRetainedValue`), modal only, reset in `onOpenChangeComplete(false)`, matching button heights. User commits only.
- **Key deviations & gotchas**:
  - `FileUploadDialog` stops `submit` bubbling on `DialogContent` (portalled inside picker form). Keep `config.dashboard.fileAccept` synced with backend `internal/core/constant/storage.go`.
  - Base UI `ToggleGroup` ignores empty string value → use `"__all__"` sentinel.
  - shadcn `Button variant="ghost"` overrides custom hover bg/text → set explicit `hover:` / `dark:hover:` when styling selected ghost buttons.
  - Motion tokens (`--ease-spring`, `--ease-bounce`) are `:root` vars, not `@theme` utilities → use `ease-(--ease-spring)`.
  - `desk:` sorts before `sm:` in CSS → use `sm:`/`lg:` for responsive columns where needed.
  - Safari skipped `translate` transition on preloader → uses keyframed `transform` (`loader-out`, `content-rise`).

---

## 5. Active Open Issues & Next Actions

- **Backend bug**: `adminGuard` checks `admin-` prefix while routes are `/administration/...` (fix in `../backend/internal/adapters/endpoint/fiber/handler.go` / `constant.AdminSegmentPrefix`). Backend also needs site CORS origin + seeded DB.
- **Browser verification pending**:
  1. Plan 11 checklist (Void theme bounce, dashboard route fade, sidebar spring, overview states, row hover reveal, Void mutation events, reduced motion).
  2. Plan 10 Parts A & C against live backend (file picker states, upload reset, `?kind=&q=`, 409 delete conflict, block error card).
  3. Reduced-motion, Lighthouse, keyboard-only walkthrough, Safari preloader check.
- **Content & assets**: Add real screenshots for Estic AI (and optional live Pocket captures) in `scripts/build-portfolio/layout.ts`, then `bun run build:portfolio`. Optional future projects: hexag, School Bus, Minecraft plugins.
- **Deploy order**: Backend first → `go run ./commands content seed --file ../portfolio.frontend/content/seed.json --force` → frontend (`bun run deploy`).

---

## 6. Verification Commands & How to Update

```bash
bun run pretty        # Prettier format
bun run check         # typecheck + typecheck:scripts + lint:style + lint:tw + test + build
graphify update .     # Refresh knowledge graph after code edits
```

**How to update**: Bump `_Last updated_`, prepend concise bullets in `## 1` (collapse older history when growing), record `components/ui/*` or generated changes in `## 3`, resolve/add items in `## 5`, keep under ~120 lines.

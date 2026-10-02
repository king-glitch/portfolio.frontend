# 09 — Foundation notes (from agent F, for wave 2)

`bun run check` passed after wave 1. `lint:style` has 0 errors, 29 warnings (21 `i18n-unused-key`, 8 `common-reuse`) that wave 2 clears by consuming the keys and components. Do not suppress them.

## Config and routes

`config.routes.*`, `config.sections.*`, `config.shell.*` (incl. `shell.preloader.*`), `config.home.*`, `config.work.*` (incl. `work.scroller.*`), `config.about.wall`, `config.notes`, `config.terminal`. `config.portfolio.defaultFilter`, `config.portfolio.searchParams`. Paths: `workPath(id)`, `notePath(slug)` from `@/lib/routes`. Plans 02/05 say `config.portfolio.scroller.*` / `portfolio.preloader.*`; real keys are `config.work.scroller.*` and `config.shell.preloader.*`.

## Locale

Parts in `src/locales/parts/{common,shell,home,work,about,notes}.json`; run `bun run build:locales` after editing. Placeholder `*.meta.title` / `*.placeholder.title` keys exist in home/work/about/notes parts; remove/replace when the real route lands. Namespaces: shell + terminal components use `shell.*`; `routes/index.tsx` uses `home.*`; `shared/posts` uses `notes.*`; otherwise folder name or `common.*`. Meta titles: `i18n.t(...)` from `@/lib/i18n`.

## Hooks / contexts

`@/hooks/motion/use-raf` `useRaf(cb(dt,t), active=true)`; `use-reduced-motion` `useReducedMotion()`; `use-scramble` `useScramble(ref)`. `@/contexts/preloader-context` `usePreloader() → { loaded, setLoaded }`; `@/contexts/shell-context` `useShell() → { menuOpen, setMenuOpen, terminalOpen, setTerminalOpen }`. Providers already in `root.tsx`.

## Components

- `@/components/common/buttons`: `PillButton({ variant?: PillVariant, size?: PillSize, magnetic?, cursor?: CursorLabel, ...Button props })`, `IconButton({ label, icon, variant?, ... })`.
- `DisplayHeading({ variant?: DisplayVariant, render? })` (h2; `render={<h1/>}` for page title; variants include `ProjectTitle, Panel, PanelSm, Subhead`), `SectionLabel({ index, children: string })`.
- `QueryErrorAlert({ onRetry })`, `QueryEmpty({ titleKey, descriptionKey?, action?: { to, labelKey } })`, `FilterToggle<T>({ value, options, onChange, ariaLabel })` (`FilterOption` in `@/types/ui`), `TagPill`.
- Art: `ProjectMotif({ kind })`, `ProjectMock({ kind, screen?, fit?: ArtFit })`, `ProjectMedia({ item })`. Art CSS in `src/theme/art.css` (F-owned).
- Shared: `PostCard({ post, variant?: PostCardVariant })`, `PostCardSkeleton`, `ProjectPreviewCard({ project })`, `ProjectPreviewMock({ kind })`, `ContactLinks({ className })` (+ skeleton).
- Data: hooks in `@/api/hooks/portfolio/{use-profile,use-projects,use-project,use-posts,use-post}`, `NotFoundError` (`@/api/errors`), `filterProjects`, `countByFilter` (`@/lib/portfolio/filter`), `yearsSince`, `toFractionalYear` (`@/lib/portfolio/time`). UI enums in `@/types/{ui,cursor,about,terminal}`.
- Fixtures: 6 projects, 5 posts. Filter counts: All 6, Games 3, Platforms 3, On-chain 4 (plan 04's estimates were wrong; trust the fixtures).

## Lint / tooling

`lint:style --changed` needs git (fails here); run the full `lint:style` and ignore errors in files you do not own. `routes.ts`/`config.ts` import relatively (React Router loader has no `@/`). Mock art files carry a file-level `hardcoded-jsx-text` suppression (decorative SVG); do not remove. Prettier is tabs + semicolons (`.prettierrc`); `pretty` does not organize imports.

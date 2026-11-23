## 🚀 0. Mandatory Agent Behavior

### 🛑 Session Start Protocol (Mandatory on Turn 1 of Every Session)

Every session MUST immediately auto-start with these modes and skills active. Never skip or delay until sub-tasks:

1. **Caveman Ultra Mode (Communication)**:
    - Ultra-compressed communication style across ALL turns and subagents.
    - Strip articles (a/an/the), unnecessary conjunctions, filler words (just/really/basically/actually/simply), pleasantries, hedging, and tool-call narration.
    - Maximum 20 words per sentence. One idea per sentence. State facts once. Fragments OK.
    - Exact technical substance: code blocks, commands, paths, API symbols, error strings stay verbatim and exact.
    - Direct output format: `[thing] [action] [reason]. [next step].`
    - Revert to normal clarity only for security warnings, destructive actions, or data loss risks.

2. **Ponytail Ultra Mode (Architecture & Code Logic)**:
    - **YAGNI Extremist**: Deletion before addition. Question if code/feature needs to exist at all before writing.
    - **The Ladder Enforced**:
        1. Does this need to be built at all? (YAGNI)
        2. Does the standard library do it? Use stdlib.
        3. Does a native platform feature cover it? Use native platform.
        4. Does an already-installed dependency solve it? Use it.
        5. Can this be one line? Make it one line.
        6. Only then: write minimum code that works.
    - **No Unrequested Abstractions**: Zero boilerplate, no unnecessary dependencies, no speculative design, fewest files possible.
    - **Mark Simplifications**: Tag intentional shortcuts with `// ponytail: <ceiling and upgrade path>`.
    - Never simplify: input validation at trust boundaries, error handling preventing data loss, security, accessibility, or explicit requirements.

3. **Mandatory Skills Active on Session Start (Zero Delay)**:
   Every agent MUST activate and strictly adhere to these core skills from turn 1:
    - **`shadcn` Skill for All UI (Mandatory)**: Always active for all UI work, components, layouts, forms, dialogs, sheets, tables, and icons. Follow shadcn composition (`base-vs-radix.md`, `composition.md`, `forms.md`). Never build from scratch when shadcn has a primitive. Project base is **Base UI**: use `render`, not `asChild`. Forms use `react-hook-form` + `zod` + `Field`.
    - **`vercel-react-best-practices` Skill (Mandatory)**: Always active for all React code. Strictly enforce performance rules: compute derived state during render (no derived state in effects), no nested ternaries, map repeated sibling elements from data, eliminate redundant re-renders.
    - **`graphify` Skill (Mandatory)**: Always active for codebase exploration and architecture understanding. Check `graphify-out/` first before reading raw source or grepping (`graphify query "<question>"`, `graphify path`, `graphify explain`). Always run `graphify update .` after code modifications.
    - **`anti-ui-slop` & `uizze-ui` Skills (Mandatory for UI Design/Polish)**: Use `anti-ui-slop` (load at most one playbook per task: `polish.md`, `operate.md`, `new-work.md`, `distill.md`, `audit.md`) and `uizze-ui` for visual hierarchy, spacing, typography, states, and finish-gate checks. Always extend existing portfolio tokens (`scripts/build-token/configs/theme.json`, `src/main.css`) and components rather than inventing a parallel design system.

---

### Core Behavioral Rules

- **Always Read Frontend Docs First**: Whenever performing any frontend work, read [AGENTS.md](./AGENTS.md), [MEMORY.md](./MEMORY.md), and [src/config.ts](./src/config.ts) to adhere to all type, architectural, and routing constraints.
- **Mandatory Type Check Before Completion**: Always run `bun run check` before completing any frontend task (it runs `typecheck`, `typecheck:scripts`, `lint:style`, `lint:tw`, `test`, and `build` in one command). All TypeScript errors and build warnings must be fixed with zero errors.
- **Mandatory Prettier Format (Mandatory)**: Format changed files with `bun run pretty` before completion. Generated files (`src/theme/tokens.ts`, `src/main.css` tokens block) must match it: `bun run build:tokens` formats its own output with Prettier, so regenerating never dirties the tree.
- **Mandatory Tailwind Lint Before Completion**: Always run `bun run lint:tw` before completing any frontend task. It must print `Tailwind classes are canonical.` Use `bun run lint:tw -- --fix` to rewrite non-canonical classes (e.g. `max-[1024px]:hidden` → `max-lg:hidden`, `w-[230px]` → `w-57.5`, `bg-[image:var(--x)]` → `bg-(image:--x)`).
- **Mandatory Style Lint Before Completion**: Always run `bun run lint:style` before completing any frontend task. It must print `Code style is clean.` It checks the machine-checkable rules in this file (file names and placement, route registration, component boilerplate, imports, hardcoded labels, i18n keys, config keys, class strings). Use `bun run lint:style -- --changed` while working and the full run before completion; `bun run lint:style -- --fix` applies safe fixes; `bun run lint:style -- --list-rules` lists every rule with its AGENTS.md section.
    - Errors must be fixed. Warnings must be fixed or suppressed.
    - Suppress only with `// style-lint-ignore-next-line <rule-id> -- <reason>` (or `style-lint-ignore-file`). A suppression without a reason fails the lint. Never add names to allowlists in the script.
    - A rule that is wrong for a real case is fixed in `scripts/lint-style/`, with a test, in the same change.
- **React Best Practices (Mandatory)**: Active from session start (`vercel-react-best-practices` skill). Also:
    - **No nested ternaries**: at most one `?:` per expression, and never in JSX. For 3+ branches, use a lookup object/`Record<Union, …>` keyed by the value, an early-return helper, or a `switch` in a small function; for element variants, a map of components.
    - **No derived state in Effects**: compute during render, `useMemo` only when measured expensive (and keep `useMemo` dependencies stable — never derive a fresh array on every render as a dependency).
    - **No inline component definitions** inside components; hoist them or make them file-local components.
    - **No boolean props that toggle a single class** (`minWidth0`, `noPadding`, `fullWidth`): if every caller needs it, put the class in the base; if it is layout for some callers, pass it as `className` at those call sites; if it is a real design variant, make it a `cva` `variant`.
    - **No props equal to the default** (`size="default"` when `default` is the default variant): only pass what differs.
    - **Repeated sibling elements are data**: 3+ sibling buttons/rows/items that differ only by label, handler, icon, or visibility condition are rendered by mapping a typed array (`{ id, labelKey, onClick, visible }[]`), not written out one `{cond && <Button>…}` block at a time.
    - **Exhaustive unions**: lookups over an enum/union are typed `Record<Enum, …>` (or `satisfies`) so a new member fails typecheck.
- **Strict Path Alias Imports (`@/...`)**: NEVER use relative imports like `./` or `../` in `src/`. Always use the `@/...` path alias (e.g., `@/api/...`, `@/components/...`, `@/routes/...`, `@/lib/...`, `@/theme/...`). Only the React Router manifest closure (`src/routes.ts` and `src/config.ts`) is exempt because React Router's config loader runs without Vite's `@/` alias.
- **Skills First**: Utilize installed skills before improvising or writing boilerplate.
- **shadcn Skill for All UI (Mandatory)**: Active from session start (`shadcn` skill). Follow its Critical Rules and rule files (`rules/forms.md`, `composition.md`, `icons.md`, `styling.md`, `base-vs-radix.md`). Before building anything, check existing primitives in `src/components/ui/` or run `bunx --bun shadcn@latest search @shadcn -q "<need>"` and `bunx --bun shadcn@latest docs <component>`. **Never write a component from scratch when shadcn has one.** Examples: `Sheet` (side panel), `Dialog`/`AlertDialog`, `Field`, `InputGroup`, `ToggleGroup`, `Empty`, `Alert`, `Spinner`, `Skeleton`, `Sidebar`, `Table`, `Tabs`, `Combobox`, `toast` (Base UI project: `@/components/ui/toast`, not `sonner`). The project base is **Base UI**: use `render`, not `asChild`.
- **Library Stack (Mandatory)**: Styling uses **Tailwind CSS v4** (`src/main.css` + tokens generated from `scripts/build-token/configs/theme.json`). Forms use **react-hook-form + zod** (`@hookform/resolvers/zod`) composed with shadcn `Field` components (`Controller` + `data-invalid`/`aria-invalid`). Server state uses **TanStack Query** hooks in `src/api/hooks/`. Icons use **`@remixicon/react`**. Do not hand-roll form state, validation, or fetching.
- **Every Async State Is Handled (Mandatory)**: Any UI that reads a TanStack Query hook must render all of its states:
    - **loading**: a shadcn `Skeleton` layout matching the loaded UI's outer size and position (no layout shift);
    - **error**: `QueryErrorAlert` (`@/components/common/feedback/query-error-alert`, wraps shadcn `Alert`) with retry `Button` calling `refetch()`;
    - **empty**: `QueryEmpty` (`@/components/common/feedback/query-empty`, wraps shadcn `Empty`);
    - **success**.

    Every mutation shows a **pending** state (`Spinner` with `data-icon`, trigger `disabled`), and reports errors via `MutationCache` / shadcn `toast`. Skeletons live next to their component as `<name>-skeleton.tsx`.

- **Views Are Routes, Not State (Mandatory)**: Any tab, sub-tab, or sub-view a user can switch to (about `explore/resume`, dashboard `overview/projects/notes/gallery/files/settings/account`, dashboard settings `general/seo/profile/categories`, …) is a **nested route with its own URL**, so refresh, back/forward, and shared links land on the same view.
    - The shared shell (header, filters, tab bar, query states) lives in the parent's `layout.tsx` and renders `<Outlet />`; each view is `routes/<parent>/<view>/index.tsx`, registered in `src/routes.ts`, with its path in `config.routes`. The parent path redirects to its default view.
    - The tab bar is shadcn `Tabs` or `NavLink`-based links driven by the current path — never `useState` or `?tab=` for view selection, and never a `{tab === "x" && <X/>}` switch in JSX.
    - Child views read data through the same TanStack Query hook with the same params as the layout (deduped by cache), not through prop drilling or casts.
    - State that changes what is shown and should survive refresh (filters, search, kind, tag) lives in URL search params, parsed and validated (zod or a typed guard, no `as` casts), with defaults from `src/config.ts`.
- **Overlay State Lifecycle (Mandatory)**: Every `Dialog`/`AlertDialog`/`Sheet` that holds a form or local state starts clean on each open:
    - form values, validation errors, touched/dirty state, search/filter text, copied state, and selection all reset on close;
    - reset in `onOpenChangeComplete(false)` (after exit animation, so content doesn't flash) — or key inner content by an open session id so it remounts; never reset in a `useEffect` watching `open`;
    - mutations: `mutation.reset()` on close so a stale error/success/pending never shows on next open; a pending mutation keeps the trigger disabled and the overlay decides explicitly whether it may close;
    - reopening for a different record shows that record's defaults (`reset(defaultsFor(record))`), never previous edits;
    - intentionally persisted drafts are the only exception and must be named as such in code.
- **Overlays Stay Mounted (Mandatory — rule `overlay-always-mounted`)**: A `Sheet`/`Dialog`/`AlertDialog` that shows a record is never unmounted while closed (no `if (!x) return null`, no `{x && <XSheet open={…x…} />}`), or its first open and close have no animation. Wrap the record in `useRetainedValue(x)` (`@/hooks/use-retained-value`), render `<Sheet open={false} onOpenChange={…} />` until the first record exists, and drive `open` from its own flag. Every overlay is modal: `modal={false}` is banned.
- **Overlay Button Sizing Parity (Mandatory)**: In all sheets, dialogs, and alert dialogs, all action buttons in the same footer, header, action bar, or form row MUST have the exact same height. Never mix heights (e.g. `h-8` input next to `size-7` icon button, or `h-8` cancel next to `h-11` submit). Form actions use `FormButton` (`h-11` / 44px); compact toolbar/footer actions use matching shadcn `Button` sizes (`default` / `icon` at `h-8` / 32px, `sm` / `icon-sm` at `h-7` / 28px).
- **Common Form Fields Over Raw shadcn (Mandatory)**: Form inputs, textareas, switches, toggle groups, line editors, and tag inputs MUST use common components from `src/components/common/fields/` (`FormTextField`, `FormTextareaField`, `FormSwitchField`, `FormLinesField`, `FormToggleGroupField`, `LinesEditor`, `TagsField`) and buttons from `src/components/common/buttons/` (`FormButton`, `PillButton`, `IconButton`), never raw unstyled or inline-styled shadcn primitives at call sites. If a reusable field pattern does not exist, build it under `src/components/common/fields/` before using it in forms.
- **Pixel-parity Styling Order**: Follow shadcn's customization order:
    1. Theme tokens (`scripts/build-token/configs/theme.json` → `bun run build:tokens` → `src/main.css` + `src/theme/tokens.ts`).
    2. Built-in variants (`cva`).
    3. Wrapper components in `src/components/common/` holding any remaining design-specific classes.

    At call sites, `className` is for layout only. Only `src/main.css` holds CSS (no extra `.css` files).

- **Project Memory (Mandatory)**: Read [MEMORY.md](./MEMORY.md) first. It holds the current implementation state, user decisions, customized generated files, and next actions. **Before completing any task, update MEMORY.md**.
- **Portfolio Plans & Prototype**: Refer to [docs/plans/](./docs/plans/) for architecture and feature plans. Source portfolio data lives in `content/ME.md` (regenerate mocks/seed with `bun run build:portfolio`).
- **No Unrequested Commits**: NEVER commit code directly. User commits only. Keep changes clean in the working tree.
- **TypeScript Strictness**: Strictly typed TypeScript with zero `any` types. Ensure all models match API contracts.
- **TypeScript Enums Over String Unions (Mandatory)**: Never declare string literal unions for domain models, statuses, categories, view modes, or kinds (`type X = "a" | "b"` is forbidden). Always declare TypeScript `enum`s (`export enum FileKind { Image = "image", Video = "video", ... }`, `ProjectStatus`, `BlockType`, `ViewMode`, `CompanionPlace`). Always reference `Enum.Member` rather than raw string literals. Lookup tables must use `Record<Enum, ...>` for compile-time exhaustiveness.
- **No Class Constant Files or Infile Class Constants (Mandatory)**: Never create `*-classes.ts` files or export loose Tailwind class strings (`export const fooClassName = "..."`). Never declare inline class constants inside component files. Reusable styling belongs strictly in theme tokens, component variants (`cva`), or wrapper components in `src/components/common/<group>/`. Call sites only pass `className` for positional/layout overrides.
- **No Standalone Icon Dictionary Files (Mandatory)**: Never create standalone icon lookup dictionary files exporting `Record<Type, IconComponent>`. Encapsulate icon lookup and rendering inside a dedicated component.
- **No Types Exported From Components (Mandatory)**: A `.tsx` file never exports an `enum`, `interface`, or `type` (rule `component-type-export`), so components never import types from each other.
    - Shared UI contracts live in `src/types/<domain>.ts` (`about`, `cursor`, `dynamic-form`, `home`, `terminal`, `ui`, `work`); domain/API models stay in `src/api/types/`.
    - A component's own `XProps` is a non-exported `interface`. It may be exported only as an intersection of a shared type and its internal props: `export type XProps = SharedXProps & { onClose: () => void }`.
    - Subcomponents that share props import the shared type from `src/types/` and compose it the same way; they never import a parent component's props.
- **No Micro `types.ts` in Component Subdirectories (Mandatory)**: Never create micro `types.ts` files inside component subfolders (e.g. `components/detail/types.ts`). Shared domain/API models live in `src/api/types/`. Shared UI contracts live in `src/types/`.

---

## 📁 1. Project Directory Structure

We enforce a modular, feature-oriented structure with clear boundaries between shared UI primitives, global features, routes, and data access layers:

```
src/
├── api/                    # Native fetch client, zod schemas, HTTP services, models, and TanStack Query hooks
│   ├── client.ts           # Native fetch wrapper with bearer auth, timeout & `{ data, errors }` unwrapping
│   ├── errors.ts           # Typed `ApiError` & `ApiErrorKind`
│   ├── parse.ts            # Response parsing helper
│   ├── schemas/            # Zod wire-to-model schemas (`portfolio.ts`, `admin.ts`)
│   ├── services/           # HTTP service functions (`portfolio.ts`, `admin.ts`)
│   ├── queries/            # Query option factories & clientLoader preloading
│   ├── types/              # Typed domain & admin contracts (`portfolio/`, `admin/`)
│   ├── hooks/              # TanStack Query hooks (`portfolio/`, `admin/`)
│   └── mocks/              # Test fixtures & `build:portfolio` generated output
├── components/
│   ├── ui/                 # shadcn-generated primitives — keep as generated, never restyle here
│   ├── common/             # Design-system components built on ui/, grouped by kind
│   │   ├── buttons/        # form-button.tsx, icon-button.tsx, pill-button.tsx
│   │   ├── fields/         # form/ (RHF fields), lines-editor.tsx, tags-field.tsx
│   │   └── <group>/        # art/, badges/, feedback/, filters/, forms/, layout/, mascot/, typography/
│   └── shared/             # Reusable shared UI widgets — used by 2+ route subtrees (contact/, posts/, projects/, root/, shell/, terminal/)
├── contexts/               # React contexts (provider + consumer hook), one per file `<name>-context.tsx`
├── hooks/                  # Shared non-query hooks (`motion/`, `physics/`, `pointer/`, `scroll/`, `terminal/`, `theme/`, top-level)
├── lib/                    # Pure domain & engine helpers (`art/`, `auth/`, `dynamic-form/`, `mascot/`, `motion/`, `portfolio/`, `storage/`, `terminal/`)
├── locales/                # Single i18n copy file (`en.json`)
├── routes/                 # React Router route modules, nested to mirror the route tree
│   ├── z/                  # A route with children owns a folder named after itself ("z" is placeholder)
│   │   ├── layout.tsx      # z's shared layout, colocated with z — NOT a separate top-level routes/layouts/ folder
│   │   ├── components/     # Components used by z's layout or shared across 2+ of z's children (never a single child only)
│   │   ├── index.tsx       # z's own index route, if it has one (e.g. "/z")
│   │   ├── a/              # A child route "a" with no children of its own
│   │   │   └── index.tsx   # a's page: routes/z/a/index.tsx
│   │   └── a2/             # A child route with grandchildren repeats the same pattern one level deeper
│   │       ├── components/ # Scoped only to a2's own children — not to all of z
│   │       ├── index.tsx   # a2's own page, if it has one
│   │       └── b/
│   │           └── index.tsx # routes/z/a2/b/index.tsx
├── theme/                  # Generated design tokens (`tokens.ts`)
├── types/                  # Shared UI contracts (`about.ts`, `cursor.ts`, `dynamic-form.ts`, `home.ts`, `terminal.ts`, `ui.ts`, `work.ts`)
├── config.ts               # Centralized configuration (API paths, query keys, routes, motion/layout constants)
├── main.css                # Single CSS entry point (Tailwind v4 + generated tokens block + custom utilities/animations)
├── root.tsx                # App root layout, HTML shell, providers
└── routes.ts               # React Router route configuration table
```

### Folder Grouping (Mandatory — rule `folder-grouping`)

A folder holds at most **6 files** (a file and its `.test` count once). When it grows past that, files that share a leading word move into a subfolder named after that word, recursively, instead of piling up in one flat folder. Applies to every folder under `src/` — `components/**`, `routes/**/components/`, `lib/`, `hooks/`, `api/hooks|mocks|types/`, `contexts/` — except generated `components/ui/`.

- `routes/dashboard/gallery/components/frame-*.tsx` → `routes/dashboard/gallery/components/frame/frame-*.tsx` (component files keep their full kebab-case name so the component name still matches the file; non-component `.ts` files and hooks other than `use-*` drop the group prefix; `use-*` hook files keep their name).
- `hooks/use-theme.ts`, `hooks/use-theme-switch.ts` → `hooks/theme/use-theme.ts`, `hooks/theme/use-theme-switch.ts`.
- A leading word that repeats an ancestor folder is ignored (`file-upload-dialog.tsx` in `storage/file/upload/` does not create `upload/file/`).
- A file named exactly like the group joins the group folder.
- Group by topic first; never create a folder for a single file, and never nest deeper than the rule asks.
- `routes/**` page folders still hold only `index.tsx` / `layout.tsx` plus `components/`; group folders live **inside** `components/` (and keep the route's i18n namespace).

### Component Placement Rules:

- **React Contexts** (`src/contexts/<name>-context.tsx`): Every `createContext` call — its context, provider, and consumer hook — lives in its own file under `src/contexts/`. Never call `createContext` inside a `components/` or `routes/` file.
- **Global / Shared Components** (`src/components/shared/`): General UI components, layouts, navigation, and feedback widgets reused across route subtrees that do not share a common parent folder.
- **UI Snippets** (`src/components/ui/`): shadcn-generated primitives (`bunx shadcn@latest add …`). Keep them as generated (only `cn` import fixed to `@/lib/utils` and documented overrides in `MEMORY.md`). Never add design variants here and never regenerate an existing file with `--overwrite`.
- **Common Components — No Duplicated UI Code (DRY)** (`src/components/common/<group>/<name>.tsx`): Whenever the same design (same classes / same look) is used in 2+ places, implement it **once** as a common component and reuse it — never copy the same class string to a second call site. Buttons live in `src/components/common/buttons/` (`form-button.tsx`, `icon-button.tsx`, `pill-button.tsx`); other repeated designs go in their own group folder (`art/`, `badges/`, `feedback/`, `fields/`, `filters/`, `forms/`, `layout/`, `mascot/`, `typography/`). Each common component wraps the matching shadcn primitive from `src/components/ui/`, takes typed props, forwards `className`/props, and uses theme tokens from `src/main.css`.
- **Route-Scoped Components** (`src/routes/<path>/components/`): Place a component at the folder of the _shallowest_ route that owns every one of its callers. Never place it higher than that (that's what `src/components/shared/` is for) and never duplicate it sideways into multiple siblings' `components/` folders.
- **Route-File Naming** (`src/routes/<path>/index.tsx`): The page file for a route must be named `index.tsx`, inside a folder named after that route segment (kebab-case) — never a flat `src/routes/<path>.tsx`. Dynamic route segments must use brackets `[...]` like `routes/projects/[project-id]/index.tsx` or `routes/notes/[slug]/index.tsx`.
- **Route Nesting Mirrors the Route Tree**: A route with children (whether or not it has its own layout) owns a folder; each child is a subfolder of it, recursively — not a flat folder per leaf route.
- **Layout Naming** (`src/routes/<path>/layout.tsx`): A route's shared layout is named `layout.tsx` and colocated inside that route's own folder (`routes/about/layout.tsx`, `routes/dashboard/layout.tsx`) — never collected into a separate top-level `routes/layouts/` directory.

---

## 🔠 2. File & Component Naming Conventions

- **Filenames**: Must strictly use **`kebab-case`** (lowercase with hyphens). Dynamic route segment folders use bracket notation `[kebab-case]` (e.g., `[project-id]`, `[slug]`).
    - _Correct_: `post-card.tsx`, `file-detail-sheet.tsx`, `use-admin-files.ts`
    - _Incorrect_: `PostCard.tsx`, `fileDetailSheet.tsx`, `useAdminFiles.ts`
- **Component Names**: Must match the PascalCase translation of the filename.
- **One Component Per File (Mandatory — rule `one-component-per-file`)**: A `.tsx` file declares exactly one top-level component, named after the file. Helpers, sub-sections, rows, cells, form bodies, and skeleton parts are their own kebab-case files next to it (then grouped per §1 Folder Grouping). Local non-component helpers/constants used by several components live in a small `.ts` file next to them; shared types live in `src/types/`. The only exemption is a framework module that must export several components (`src/root.tsx`), suppressed with a reasoned `style-lint-ignore-file`.
- **Component Boilerplate**:
    ```tsx
    import React from "react";

    interface ComponentNameProps {
    	// define typed props here
    }

    export const ComponentName: React.FC<ComponentNameProps> = ({}) => {
    	return <div>{/* component markup */}</div>;
    };

    export default ComponentName;
    ```

---

## 🌐 3. I18n (Internationalization)

- **No Hardcoded Labels (Mandatory)**: Every user-facing string goes through `t()` with a key in `src/locales/en.json`: labels, headings, placeholders, button text, `aria-label`/`title`/`alt`, toasts, validation/error messages, empty states, and strings built in `src/lib/` that end up in the UI (return a key, translate at render). Use i18next interpolation/plurals (`t("…", { count, name })`) instead of string concatenation. Only data values (names, slugs, dates formatted via config) may render raw.
- **No Fallback Text in `t()` (Mandatory)**: Call `t("key")` / `t("key", { values })` only. Never pass a default string (`t("key", "Fallback")`, `defaultValue: …`). `src/locales/en.json` is the single source of copy, and typed keys (`src/i18next.d.ts`) catch missing ones at compile time.
- **Naming**: Use dot (`.`) notation for translation keys, e.g., `common.submit`, `errors.required`. No camelCase or snake_case for keys; always use dot notation to indicate hierarchy.
- **Group by Subject, Not by Suffix (Mandatory)**: A key names _what_ first, then _which part of it_, each as its own segment, so related copy can grow under one object. Never glue the part onto the subject with a hyphen.
    - _Correct_: `dashboard.files.delete.in-use.title`, `…in-use.description`, `dashboard.gallery.lightbox.prev.aria-label`
    - _Incorrect_: `dashboard.files.delete-title`, `…cancel-button`
    - Parts that become their own segment: `title`, `subtitle`, `description`, `label`, `placeholder`, `hint`, `helper`, `aria-label`, `button`, `submit`, `cancel`, `confirm`, `empty`, `error`, `success`, `loading`, `tooltip`, `heading`, `eyebrow`, `body`, `action`.
    - Hyphens stay only inside one multi-word name (`in-use`, `aria-label`, `not-found`).
    - A key is either a string or an object, never both.
- **Key Format**: Use kebab-case for multi-word keys, e.g., `common.errors.kinds.not-found`.
- **Group Related Keys Under Plural Nouns (Mandatory)**: Keys that belong together nest under one object instead of repeating a hyphenated prefix or suffix. Enforced by `i18n-category-glue`, `i18n-key-indexed`, `i18n-key-sibling-prefix`.
    - Category nouns (`status`, `role`, `type`, `mode`, `state`, `kind`, `category`, `size`, `level`) lead a **plural** group: `statuses.*`, `types.*`, `modes.*`, `kinds.*`.
    - Numbered items nest under the plural of their name: `lines.1`, `lines.2`, `steps.1`, `steps.2`.
- **Plural Forms Are Kebab-Case**: i18next runs with `pluralSeparator: "-"` (`src/lib/i18n.ts`, `src/i18next.d.ts`). Write `count-one` / `count-other`, never snake_case `count_one` / `count_other`. Call `t("…count", { count })` — never branch on `count === 1` in code.
- **Variant Copy Is a Key Map, Not a Ternary Chain**: When text depends on an enum value, key it by that value (`t(\`dashboard.storage.kinds.${file.kind}\`)` or a `Record<Enum, ParseKeys>` lookup) — never nest `?:` over the enum.
- **Namespace Organization**: A route's namespace is its path under `routes/`, without the `routes/` prefix and without trailing `index`/`layout` segments (`routes/about/explore/index.tsx` → `about.explore`, `routes/dashboard/files/index.tsx` → `dashboard.files`); that route's own `components/` share the same namespace. A file under `src/components/common/` or `src/components/shared/` uses its feature folder (`components.common.feedback`, `shell.*`). A key used in a file may live under that file's own namespace, an ancestor route namespace, or `common`.
- **Common Keys**: Define frequently used translation keys under `common` (e.g., `common.errors.kinds.*`).

---

## ⚙️ 4. Configuration Centralization (No Magic Strings)

- **Centralized Configuration**: All static values, API base URLs, API paths, pagination limits, date formats, motion constants, and route paths must be declared in [src/config.ts](./src/config.ts).
- **Config Keys Are Grouped by Domain (Mandatory)**: `config.queryKeys` (and any other key/route map in `src/config.ts`) nest by domain matching the dotted string value they hold — never a flat camelCase prefix.
    - _Correct_: `queryKeys: { portfolio: { projects: { list: "portfolio.projects.list", detail: "portfolio.projects.detail" } }, admin: { storage: { files: "admin.storage.files" } } }` → `config.queryKeys.portfolio.projects.list`
    - _Incorrect_: `portfolioProjectsList: "portfolio.projects.list"`, `adminStorageFiles`
    - The object path mirrors the string value; a node is either a string or a group, never both.
    - Query keys are arrays starting with the domain key followed by params (`[config.queryKeys.portfolio.projects.detail, slug]`), so invalidating a domain prefix works.
- **Decoupled Presentation**: Never hardcode endpoint URLs, query keys, or backend status enum values directly inside TSX markup or components. Reference typed enums and `config`.

---

## 🧪 5. Type Safety & Validation / API Implementation Flow

- **Native Fetch + Envelope Unwrapping**: `src/api/client.ts` uses native `fetch` (no Axios) with timeout, optional bearer session header, and `{ data, errors }` envelope unwrapping; failures throw typed `ApiError` (`src/api/errors.ts`).
- **Zod Wire Schemas**: Every API response is parsed and validated through `src/api/schemas/` (zod), mapping snake_case wire payloads to typed camelCase models (`ApiErrorKind.Invalid` on contract mismatch).
- **Domain Models**: Export typed models and enums in `src/api/types/` (`portfolio/`, `admin/`).
- **Query Hooks**: Place TanStack Query hooks in `src/api/hooks/` organized by resource (`portfolio/`, `admin/`) and query option factories in `src/api/queries/`.

---

## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

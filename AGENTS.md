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
   Every agent MUST activate and strictly adhere to these three core skills from turn 1:
   - **`shadcn` Skill for All UI (Mandatory)**: Always active for all UI work, components, layouts, forms, dialogues, sheets, tables, and icons. Follow shadcn composition (`base-vs-radix.md`, `composition.md`, `forms.md`). Never build from scratch when shadcn has a primitive. Project base is Base UI: use `render`, not `asChild`. Forms use react-hook-form + zod + Field.
   - **`vercel-react-best-practices` Skill (Mandatory)**: Always active for all React code. Strictly enforce performance rules: compute derived state during render (no derived state in effects), no nested ternaries, map repeated sibling elements from data, eliminate redundant re-renders.
   - **`graphify` Skill (Mandatory)**: Always active for codebase exploration and architecture understanding. Check `graphify-out/` first before reading raw source or grepping (`graphify query "<question>"`, `graphify path`, `graphify explain`). Always run `graphify update .` after code modifications.

---

### Core Behavioral Rules

- **Always Read Frontend Docs First**: Whenever performing any frontend-related work, always read [AGENTS.md](./AGENTS.md) and [src/config.ts](./src/config.ts) to adhere to all type, architectural, and routing constraints.
- **Mandatory Type Check Before Completion**: Always run `bun run check` before completing any frontend task (it runs `typecheck`, `typecheck:scripts`, `lint:style`, `lint:tw`, `test` and `build` in one command). All TypeScript type errors and build warnings must be fully fixed with zero errors.
- **Mandatory Prettier Format (Mandatory)**: Format changed files with `bun run pretty` (Prettier + organize-imports) before completion. Generated files (`src/theme/tokens.*`) must match it: `bun run build:tokens` formats its own output with Prettier, so regenerating never dirties the tree.
- **Mandatory Tailwind Lint Before Completion**: Always run `bun run lint:tw` before completing any frontend task. It must print `Tailwind classes are canonical.` (same rule as the Tailwind IntelliSense `suggestCanonicalClasses` lint). Use `bun run lint:tw -- --fix` to rewrite non-canonical classes (e.g. `w-[230px]` → `w-57.5`, `bg-[image:var(--x)]` → `bg-(image:--x)`).
- **Mandatory Style Lint Before Completion**: Always run `bun run lint:style` before completing any frontend task. It must print `Code style is clean.` It checks the machine-checkable rules in this file (file names and placement, route registration, component boilerplate, imports, hardcoded labels, i18n keys, config keys, class strings). Use `bun run lint:style -- --changed` while working and the full run before completion; `bun run lint:style -- --fix` applies safe fixes; `bun run lint:style -- --list-rules` lists every rule with its AGENTS.md section.
  - Errors must be fixed. Warnings must be fixed or suppressed.
  - Suppress only with `// style-lint-ignore-next-line <rule-id> -- <reason>` (or `style-lint-ignore-file`). A suppression without a reason fails the lint. Never add names to allowlists in the script.
  - A rule that is wrong for a real case is fixed in `scripts/lint-style/`, with a test, in the same change.
- **React Best Practices (Mandatory)**: Active from session start (`vercel-react-best-practices` skill). Also:
  - **No nested ternaries**: at most one `?:` per expression, and never in JSX. For 3+ branches, use a lookup object/`Record<Union, …>` keyed by the value, an early-return helper, or a `switch` in a small function; for element variants, a map of components.
  - **No derived state in Effects**: compute during render, `useMemo` only when measured expensive.
  - **No inline component definitions** inside components; hoist them or make them file-local components.
  - **No boolean props that toggle a single class** (`minWidth0`, `noPadding`, `fullWidth`): if every caller needs it, put the class in the base; if it is layout for some callers, pass it as `className` at those call sites; if it is a real design variant, make it a cva `variant`.
  - **No props equal to the default** (`size="md"` when `md` is the default variant): only pass what differs.
  - **Repeated sibling elements are data**: 3+ sibling buttons/rows/items that differ only by label, handler, icon or visibility condition are rendered by mapping a typed array (`{ id, labelKey, onClick, visible }[]`), not written out one `{cond && <Button>…}` block at a time.
  - **Exhaustive unions**: lookups over a union are typed `Record<Union, …>` (or `satisfies`) so a new member fails typecheck.
- **Strict Path Alias Imports (`@/...`)**: NEVER use relative imports like `./` or `../`. Always use the `@/...` path alias (e.g., `@/api/...`, `@/components/...`, `@/routes/...`, `@/lib/...`, `@/theme/...`).
- **Skills First**: Utilize installed skills before improvising or writing boilerplate.
- **shadcn Skill for All UI (Mandatory)**: Active from session start (`shadcn` skill: `~/.agents/skills/shadcn` / `shadcn`). Follow its Critical Rules and rule files (`rules/forms.md`, `composition.md`, `chat.md`, `icons.md`, `styling.md`, `base-vs-radix.md`). Before building anything, run `bunx --bun shadcn@latest search @shadcn -q "<need>"` and `bunx --bun shadcn@latest docs <component>`, and fetch the docs. **Never write a component from scratch when shadcn has one.** Examples: `Drawer` (bottom sheet), `Sheet` (side panel), `Dialog`/`AlertDialog`, date picker = `Calendar` + `Popover`, `Field`/`FieldGroup`, `InputGroup`, `ToggleGroup`, `Empty`, `Alert`, `Spinner`, `Skeleton`, `toast` (Base UI project: `@/components/ui/toast`, not `sonner`), chat = `MessageScroller` + `Message` + `Bubble` + `Marker`. The project base is **Base UI**: use `render`, not `asChild`.
- **Library Stack (Mandatory)**: Forms use **react-hook-form + zod** (`@hookform/resolvers/zod`) composed with shadcn `Field` components, following the shadcn Forms guide (Controller + `data-invalid`/`aria-invalid`). Server state uses **TanStack Query** hooks in `src/api/hooks/`. Do not hand-roll form state, validation, or fetching.
- **Every Async State Is Handled (Mandatory)**: Any UI that reads a TanStack Query hook must render all of its states:
  - **loading**: a shadcn `Skeleton` layout with the same outer size and position as the loaded UI (no layout shift);
  - **error**: shadcn `Alert` with a retry `Button` that calls `refetch()`;
  - **empty**: shadcn `Empty`;
  - **success**.

  Every mutation shows a **pending** state (`Spinner` with `data-icon`, and the trigger `disabled`), and reports its **error** with shadcn `toast`. Skeletons live next to their component as `<name>-skeleton.tsx`. A component is not done until each state has been seen in the browser. The mocks simulate network latency (`config.mock.latencyMs`) so skeletons are visible in dev; see [docs/plans/03c-async-states.md](./docs/plans/03c-async-states.md).

- **Views Are Routes, Not State (Mandatory)**: Any tab, sub-tab or sub-view a user can switch to (analytics `dashboard/report/activity/transaction`, bookings `upcoming/in-use/history/all`, catering `create/orders`, …) is a **nested route with its own URL**, so refresh, back/forward and shared links land on the same view.
  - The shared shell (header, filters, tab bar, query loading/error/empty states) lives in the parent's `layout.tsx` and renders `<Outlet />`; each view is `routes/<parent>/<view>/index.tsx`, registered in `src/routes.ts`, with its path in `config.routes`. The parent path redirects to its default view.
  - The tab bar is shadcn `Tabs` (or `NavLink`-based links) driven by the current path — never `useState` or `?tab=` for view selection, and never a `{tab === "x" && <X/>}` switch in JSX.
  - Child views read data through the same TanStack Query hook with the same params as the layout (deduped by the cache), not through prop drilling or casts.
  - State that changes what is shown and should survive refresh (filters, date range, scope, search, pagination) lives in URL search params, parsed and validated (zod or a typed guard, no `as` casts), with defaults from `src/config.ts`.
- **Overlay State Lifecycle (Mandatory)**: Every `Dialog`/`AlertDialog`/`Sheet`/`Drawer`/`Popover` that holds a form or local state starts clean on each open:
  - form values, validation errors, touched/dirty state, step index, sub-view (e.g. the active action form), search/filter text and selection all reset on close;
  - reset in `onOpenChangeComplete(false)` (after the exit animation, so content doesn't flash) — or key the inner content by an open session id so it remounts; never reset in a `useEffect` watching `open`;
  - mutations: `mutation.reset()` on close so a stale error/success/pending never shows on the next open; a pending mutation keeps the trigger disabled and the overlay decides explicitly whether it may close;
  - reopening for a different record shows that record's defaults (`reset(defaultsFor(record))`), never the previous one's edits;
  - intentionally persisted drafts are the only exception and must be named as such in code.
    Verify in the browser: fill + trigger an error → close (Esc, close button, overlay click, Cancel) → reopen → everything is back to defaults.
- **Overlays Stay Mounted (Mandatory — rule `overlay-always-mounted`)**: A `Sheet`/`Dialog`/`Drawer` that shows a record is never unmounted while closed (no `if (!x) return null`, no `{x && <XSheet open={…x…} />}`), or its first open and its close have no animation. Wrap the record in `useRetainedValue(x)` (`@/hooks/use-retained-value`), render `<Sheet open={false} onOpenChange={…} />` until the first record exists, and drive `open` from its own flag. Every overlay is modal: `modal={false}` is banned by the same rule, and `ui/sheet.tsx` has no `showOverlay` opt-out. Sheet open/close motion matches the shadcn Drawer (450ms, full-edge slide).
- **Overlay Button Sizing Parity (Mandatory)**: In all sheets, drawers, modals, and dialogs, all action buttons (primary, secondary, danger, etc.) in the same footer, header, action bar, or form row MUST have the exact same size and height. Never mix heights (e.g. 38px `SecondaryButton` next to 44px `PrimaryButton`, or 28px cancel next to 32px delete). Common button components (`PrimaryButton`, `SecondaryButton`, `DangerButton`) share canonical height definitions across size variants (`sm`: `h-8` / 32px, `md`: `h-9.5` / 38px default, `lg`: `h-11` / 44px, `xl`: `h-11.5` / 46px). Overlays must ensure all sibling action buttons use matching sizes.
- **Pixel-parity Styling Order**: Follow shadcn's customization order.
  1. Theme tokens: map the design values to CSS variables so the defaults already match.
  2. Built-in variants.
  3. Wrapper components in `src/components/common/` that hold any remaining design-specific classes.

  At call sites, `className` is for layout only.

- **Project Memory (Mandatory)**: Read [MEMORY.md](./MEMORY.md) first. It holds the current implementation state, the user's decisions, customized generated files and next actions. **Before completing any task, update MEMORY.md** following its "How to update" section.
- **Porting Prototype Screens**: When porting any screen from the `../design` prototype, follow [docs/PORTS.md](./docs/PORTS.md) (research → capture → plan → execute step by step → verify) and the plans in [docs/plans/](./docs/plans/).
- **No Unrequested Commits**: NEVER commit code directly. User commits only. Keep changes clean in the working tree.
- **TypeScript Strictness**: Strictly typed TypeScript with zero `any` types. Ensure all models match API contracts.
- **TypeScript Enums Over String Unions (Mandatory)**: Never declare string literal unions for domain models, statuses, categories, view modes, subtabs, or action views (`type X = "a" | "b"` is forbidden). Always declare TypeScript `enum`s (`export enum SpaceType { Desk = "desk", Room = "room" }`). Always reference `Enum.Member` (e.g. `SpaceType.Desk`, `BookingStatus.Upcoming`) in code rather than raw string literals. Lookup tables must use `Record<Enum, ...>` for compile-time exhaustiveness.
- **No Class Constant Files or Infile Class Constants (Mandatory)**: Never create `*-classes.ts` files or export loose Tailwind class strings (`export const fooClassName = "..."`). Never declare inline class constants inside component files (e.g. `const inputClassName = "..."`). Reusable styling belongs strictly in theme tokens, component variants (`cva`), or wrapper components in `src/components/common/<group>/`. Call sites only pass `className` for positional/layout overrides.
- **No Standalone Icon Dictionary Files (Mandatory)**: Never create standalone icon lookup dictionary files (e.g. `space-type-icons.ts` exporting `Record<Type, LucideIcon>`). Encapsulate icon lookup and rendering inside a dedicated component (e.g. `<SpaceTypeIcon type={SpaceType.Desk} className="..." />`).
- **No Types Exported From Components (Mandatory)**: A `.tsx` file never exports an `enum`, `interface` or `type` (rule `component-type-export`), so components never import types from each other.
  - Shared UI contracts (enums, option/column/def shapes, context shapes) live in `src/types/<domain>.ts` (`table`, `admin-ui`, `space-canvas`, `booking-ui`, `ui`); domain/API models stay in `src/api/types/`.
  - A component's own `XProps` is a non-exported `interface`. It may be exported only as an intersection of a shared type and its internal props: `export type XProps = SharedXProps & { onClose: () => void }`.
  - Subcomponents that share props import the shared type from `src/types/` and compose it the same way; they never import a parent component's props.
- **No Micro `types.ts` in Component Subdirectories (Mandatory)**: Never create micro `types.ts` files inside component subfolders (e.g. `components/detail/types.ts`). Shared domain/API models live in `src/api/types/`. Sub-component or view-scoped props and types are declared directly in the owning parent component.

---

## 📁 1. Project Directory Structure

We enforce a modular, feature-oriented structure with clear boundaries between shared UI primitives, global features, routes, and data access layers:

```
src/
├── api/                    # API client, HTTP services, models, and TanStack Query hooks
│   ├── client.ts           # Axios instance with auth interceptors & envelope parsing
│   ├── types/              # TypeScript interfaces mirroring backend contracts
│   └── hooks/              # Custom TanStack Query hooks
├── components/
│   ├── ui/                 # shadcn-generated primitives — keep as generated, never restyle here
│   ├── common/             # Design-system components built on ui/, grouped by kind
│   │   ├── buttons/        # e.g. primary-button.tsx, secondary-button.tsx, ai-outline-button.tsx
│   │   └── <group>/        # e.g. badges/, avatars/, ai/, fields/, cards/
│   └── shared/             # Reusable shared UI widgets — used by 2+ route subtrees
├── contexts/               # React contexts (provider + consumer hook), one per file `<name>-context.tsx`
├── hooks/                  # Shared non-query hooks (e.g. useSearchQuery, useOpenSession)
├── routes/                 # React Router route modules, nested to mirror the route tree
│   ├── z/                  # A route with children owns a folder named after itself ("z" is placeholder)
│   │   ├── layout.tsx      # z's shared layout, colocated with z — NOT a separate top-level routes/layouts/ folder
│   │   ├── components/     # Components used by z's layout or shared across 2+ of z's children (never a single child only)
│   │   ├── index.tsx       # z's own index route, if it has one (e.g. "/z")
│   │   ├── a/               # A child route "a" with no children of its own
│   │   │   └── index.tsx    # a's page: routes/z/a/index.tsx
│   │   └── a2/               # A child route with grandchildren repeats the same pattern one level deeper
│   │       ├── components/  # Scoped only to a2's own children — not to all of z
│   │       ├── index.tsx    # a2's own page, if it has one
│   │       └── b/
│   │           └── index.tsx  # routes/z/a2/b/index.tsx
├── theme/                  # Theme configuration, design tokens & recipes
├── config.ts               # Centralized configuration (API URLs, storage keys, defaults)
├── root.tsx                # App root layout, HTML shell, providers
└── routes.ts               # React Router route configuration table
```

### Folder Grouping (Mandatory — rule `folder-grouping`)

A folder holds at most **6 files** (a file and its `.test` count once). When it grows past that, files that share a leading word move into a subfolder named after that word, recursively, instead of piling up in one flat folder. Applies to every folder under `src/` — `components/**`, `routes/**/components/`, `lib/`, `hooks/`, `api/hooks|mocks|types/`, `contexts/` — except generated `components/ui/`.

- `lib/admin-rules.ts`, `lib/admin-people.ts`, `lib/admin-reports.ts` (+ tests) → `lib/admin/rules.ts`, `lib/admin/people.ts`, `lib/admin/reports.ts`.
- `lib/booking-flow.ts`, `lib/booking-rules.ts`, `lib/booking-activity.ts` → `lib/booking/flow.ts`, `lib/booking/rules.ts`, `lib/booking/activity.ts`.
- `routes/administrations/components/admin-form-fields.tsx`, `admin-form-skeleton.tsx` → `routes/administrations/components/admin/form/admin-form-fields.tsx`, … (component files keep their full kebab-case name so the component name still matches the file; non-component `.ts` files and hooks other than `use-*` drop the group prefix; `use-*` hook files keep their name).
- A leading word that repeats an ancestor folder is ignored (`ops-filter-x.tsx` in `ops/filter/` does not create `ops/filter/ops/`).
- A file named exactly like the group (`admin.ts`, `admin-skeleton.tsx` next to `admin-*.tsx`) joins the group folder.
- Group by topic first; never create a folder for a single file, and never nest deeper than the rule asks.
- `routes/**` page folders still hold only `index.tsx` / `layout.tsx` plus `components/`; group folders live **inside** `components/` (and keep the route's i18n namespace).

### Component Placement Rules:

- **React Contexts** (`src/contexts/<name>-context.tsx`): Every `createContext` call — its context, provider and consumer hook — lives in its own file under `src/contexts/`, the same way query hooks live in `src/api/hooks/` and other shared hooks live in `src/hooks/`. Never call `createContext` inside a `components/`/`routes/` file. A UI component that merely _uses_ a context (not one that defines it) stays where it otherwise belongs and imports the context from `src/contexts/`.
- **Global / Shared Components** (`src/components/shared/`): General UI components, layouts, navigation, and feedback widgets reused across route subtrees that do not share a common parent folder.
- **UI Snippets** (`src/components/ui/`): shadcn-generated primitives (`bunx shadcn@latest add …`). Keep them as generated (only the `cn` import is fixed to `@/lib/utils`). Never add design variants here and never regenerate an existing file with `--overwrite`.
- **Common Components — No Duplicated UI Code (DRY)** (`src/components/common/<group>/<name>.tsx`): Whenever the same design (same classes / same look) is used in 2+ places, it must be implemented **once** as a common component and reused — never copy the same class string to a second call site. Buttons live in `src/components/common/buttons/` (e.g. `primary-button.tsx`, `book-button.tsx`, `secondary-button.tsx`, `ai-outline-button.tsx`, `soft-button.tsx`, `icon-button.tsx`, `nav-link-button.tsx`); other repeated designs go in their own group folder (`badges/`, `avatars/`, `ai/`, `fields/`, `cards/`, …). Each common component wraps the matching shadcn primitive from `src/components/ui/`, takes typed props, forwards `className`/props, and follows the values in [DESIGN.md](./DESIGN.md). Before writing UI, check `src/components/common/` for an existing component; if a design appears a second time, extract it into `common/` in the same change and update the first call site too.
- **Route-Scoped Components** (`src/routes/<path>/components/`): Place a component at the folder of the _shallowest_ route that owns every one of its callers — a component used only by `routes/z/a2/b/index.tsx` lives at `routes/z/a2/b/components/`; one shared across `b` and a sibling under `a2` lives at `routes/z/a2/components/`; one shared across children of `z` that aren't all under the same child lives at `routes/z/components/`. Never place it higher than that (that's what `src/components/shared/` is for) and never duplicate it sideways into multiple siblings' `components/` folders.
- **Route-File Naming** (`src/routes/<path>/index.tsx`): The page file for a route must be named `index.tsx`, inside a folder named after that route segment (kebab-case) — never a flat `src/routes/<path>.tsx`. Dynamic route segments must use brackets `[...]` like `/[group-id]/rules/index.tsx`.
- **Route Nesting Mirrors the Route Tree**: A route with children (whether or not it has its own layout) owns a folder; each child is a subfolder of it, recursively, however deep the route tree goes — not a flat folder per leaf route.
- **Layout Naming** (`src/routes/<path>/layout.tsx`): A route's shared layout is named `layout.tsx` and colocated inside that route's own folder (`routes/z/layout.tsx` for `z`'s children) — never collected into a separate top-level `routes/layouts/` directory.

---

## 🔠 2. File & Component Naming Conventions

- **Filenames**: Must strictly use **`kebab-case`** (lowercase with hyphens). Dynamic route segment folders use bracket notation `[kebab-case]` (e.g., `[group-id]`, `[employee-id]`).
  - _Correct_: `session-card.tsx`, `account-form.tsx`, `use-sessions.ts`
  - _Incorrect_: `SessionCard.tsx`, `accountForm.tsx`, `useSessions.ts`
- **Component Names**: Must match the PascalCase translation of the filename.
- **One Component Per File (Mandatory — rule `one-component-per-file`)**: A `.tsx` file declares exactly one top-level component, named after the file. Helpers, sub-sections, rows, cells, form bodies and skeleton parts are their own kebab-case files next to it (then grouped per §1 Folder Grouping). Local non-component helpers/constants used by several components live in a small `.ts` file next to them; shared types live in `src/types/`. The only exemption is a framework module that must export several components (`src/root.tsx`), suppressed with a reasoned `style-lint-ignore-file`.
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

- **No Hardcoded Labels (Mandatory)**: Every user-facing string goes through `t()` with a key in `src/locales/en.json`: labels, headings, placeholders, button text, `aria-label`/`title`/`alt`, toasts, validation/error messages, empty states, AI copy, and strings built in `src/lib/` or mocks that end up in the UI (return a key, translate at render). Use i18next interpolation/plurals (`t("…", { count, name })`) instead of string concatenation. Only data values (names, codes, dates formatted via config) may render raw. Before completing a task, grep the touched files for JSX text and string literals in UI props; a new hardcoded label is a failed task.
- **No Fallback Text in `t()` (Mandatory)**: Call `t("key")` / `t("key", { values })` only. Never pass a default string (`t("key", "Booking details")`, `defaultValue: …`). `en.json` is the single source of copy, and typed keys (`src/i18next.d.ts`) catch missing ones at compile time.
- **Naming**: Use dot (`.`) notation for translation keys, e.g., `common.submit`, `errors.required`. No camelCase or snake_case for keys; always use dot notation to indicate hierarchy. Use nested namespaces for grouping related keys.
- **Group by Subject, Not by Suffix (Mandatory)**: A key names _what_ first, then _which part of it_, each as its own segment, so related copy can grow under one object. Never glue the part onto the subject with a hyphen.
  - _Correct_: `schedules.bookings.detail.request.title`, `…request.description`, `…request.submit`
  - _Incorrect_: `schedules.bookings.detail.request-title`, `…request-description`, `…cancel-button`
  - Parts that become their own segment: `title`, `subtitle`, `description`, `label`, `placeholder`, `hint`, `helper`, `aria-label`, `button`, `submit`, `cancel`, `confirm`, `empty`, `error`, `success`, `loading`, `tooltip`, `heading`, `eyebrow`, `body`, `action`.
  - Prefix glue is the same mistake: `…detail.action-end-use` → `…detail.actions.end-use.label` (group plural, then the item, then its part), `…label-date` → `…date.label`, `…error-required` → `…errors.required`.
  - Hyphens stay only inside one multi-word name (`special-request`, `add-to-calendar`, `load-error` when it is the subject itself).
  - A key is either a string or an object, never both: if `x.request` must become a group, move its string to `x.request.label` (or the fitting part).
- **Key Format**: Use kebab-case for multi-word keys, e.g., `common.spinner.loading`, `errors.field.required`.
- **Group Related Keys Under Plural Nouns (Mandatory)**: Keys that belong together nest under one object instead of repeating a hyphenated prefix or suffix. Enforced by `i18n-category-glue`, `i18n-key-indexed`, `i18n-key-sibling-prefix`.
  - Category nouns (`status`, `role`, `type`, `mode`, `state`, `kind`, `category`, `size`, `level`) lead a **plural** group: `card-status` → `statuses.card`, `employee-role` → `roles.employee`, `booking-type` → `types.booking`, `choose-mode` → `modes.choose`. Plural = `+s` (`+es` after s/x/ch/sh, `y` → `ies`).
  - Position pairs group under `pos`: `x-pos`/`y-pos` → `pos.x`/`pos.y`.
  - Numbered items nest under the plural of their name: `step-1`, `step-2` → `steps.1`, `steps.2` (each with its own `title`, `description`, …).
  - A step/tab/section that owns several parts is a group: `wizard.steps.1.title`, `wizard.steps.1.shape.label`.
- **Plural Forms Are Kebab-Case**: i18next runs with `pluralSeparator: "-"` (`src/lib/i18n.ts`, `src/i18next.d.ts`). Write `count-one` / `count-other`, never snake_case `count_one` / `count_other`. Call `t("…count", { count })` — never branch on `count === 1` in code.
- **Variant Copy Is a Key Map, Not a Ternary Chain**: When text depends on a union/enum value, key it by that value (`t(\`schedules.bookings.detail.${action}.title\`)`with a typed union, or a`Record<Action, ParseKeys>`lookup) — never nest`?:` over the union.
- **Namespace Organization**: A route's namespace is its path under `routes/`, without the `routes/` prefix and without trailing `index`/`layout` segments (`routes/spaces/map/index.tsx` → `spaces.map`); that route's own `components/` share the same namespace (a file at `routes/spaces/map/components/x.tsx` also uses `spaces.map.*`, not `spaces.map.components.x.*`). A file under `src/components/common/` or `src/components/shared/` uses its feature folder, or its own file name when it sits directly in `common/`/`shared/` (`src/components/common/feedback/x.tsx` and `…/feedback/sub/y.tsx` → `components.common.feedback`; `src/components/shared/app-toaster.tsx` → `components.shared.app-toaster`). A key used in a file may live under that file's own namespace, an ancestor route namespace, or the shared `common` namespace.
- **Common Keys**: Define frequently used translation keys under a `common` namespace, e.g., `common.submit`, `common.cancel`, `common.loading`.

---

## ⚙️ 4. Configuration Centralization (No Magic Strings)

- **Centralized Configuration**: All static values, API base URLs, pagination limits, date-time formats, and route paths must be declared in [src/config.ts](./src/config.ts).
- **Config Keys Are Grouped by Domain (Mandatory)**: `config.queryKeys`, `config.mock.mutationKeys` (and any other key/route map in `config.ts`) nest by domain like the dotted value they hold — never a flat camelCase prefix.
  - _Correct_: `queryKeys: { analytics: { sensors: "analytics.sensors", rooms: "analytics.rooms", space: { utilization: "analytics.space.utilization" } } }` → `config.queryKeys.analytics.sensors`
  - _Incorrect_: `analyticsSensors: "analytics.sensors"`, `cateringOrders`, `timelineDesks`, `createCateringOrder`
  - The object path mirrors the string value (`catering.order.update` → `mutationKeys.catering.order.update`); a node is either a string or a group, never both (use `…order.detail` for the single-item key when `order` is also a group).
  - Query keys are arrays starting with the domain key followed by params (`[config.queryKeys.analytics.rooms, filter]`), so invalidating a domain prefix works.
- **Decoupled Presentation**: Never hardcode endpoint URLs, query keys, or backend status enum values directly inside TSX markup or components. Reference typed enums and centralized configs.

---

## 🧪 5. Type Safety & Validation / API Implementation Flow

- **Envelope Unwrapping**: The Axios client unwraps the backend `{ data: T }` envelope to return `T` directly.
- **Domain Models**: Export domain interfaces in `src/api/types/` matching backend schemas.
- **Query Hooks**: Place custom TanStack Query hooks in `src/api/hooks/` organized by resource.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

# 01 — Portfolio port: overview

Status: **spec only, no code written.** Source of truth for plans `02`–`07`. AGENTS.md wins over [../PORT_BRIEF.md](../PORT_BRIEF.md); every deviation is listed in §12.

## 0. Ground truth found while researching (read first)

The repo is a **fresh `shadcn create` scaffold**, not the mature project AGENTS.md describes. Facts checked on disk:

| AGENTS.md / brief assumes                                                   | Actual state                                                                                                                                                                       |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/config.ts`                                                             | missing                                                                                                                                                                            |
| `MEMORY.md`, `DESIGN.md`, `docs/PORTS.md`, `docs/plans/03c-async-states.md` | missing (`MEMORY.md` created by this session; `DESIGN.md`, `PORTS.md` still missing)                                                                                               |
| `bun run check / lint:tw / lint:style / pretty / build:tokens / test`       | `package.json` only has `build`, `dev`, `start`, `typecheck`, `format`. Sources exist in `scripts/lint-style/`, `scripts/lint-tailwind/`, `scripts/build-token/` but are not wired |
| TanStack Query, i18next, zod, react-hook-form, Axios                        | none in `package.json` (`zod` is only a transitive dep of `shadcn`)                                                                                                                |
| `src/api/`, `src/hooks/`, `src/contexts/`, `src/locales/`, `src/theme/`     | none exist. `src/` has `components/ui/button.tsx`, `lib/utils.ts`, `routes/index.tsx`, `routes.ts`, `root.tsx`, `main.css`                                                         |
| token pipeline                                                              | `scripts/build-token/configs/theme.json` describes **another product's tokens** ("EXZY Agentic Workplace", blue/purple). It must be replaced, not extended                         |
| prototype at `../design/`                                                   | it is at `./design/` (project root). `content/ME.md` and `PORT_BRIEF.md` are also at root; `docs/PORT_BRIEF.md` is a copy                                                          |
| `components.json`                                                           | `css: "app/app.css"` and aliases `~/…` do not match `src/main.css` and `@/…`. `shadcn add` would write to the wrong place until fixed                                              |
| SSR                                                                         | `react-router.config.ts` has `ssr: false` (SPA). All engines are client-only; no hydration concerns                                                                                |

Consequence: a **Foundation** block (step list in plan `02` §A) must land before any feature work. It is the first open question (§13 Q1).

## 1. Goal and scope

Port the prototype (`design/*.dc.html`) into this project as a typed, API-first, mocked portfolio for William Siefert: Home, Project pages (horizontal), About (Explore wall + printable Resume), Notes (list + post), plus shell (preloader, nav pill, menu, sticky cursor, page transition) and a terminal.

**Out of scope**

- A real backend, auth, or a write path (no mutations ⇒ no toast, no `Spinner`, no form library).
- Real screenshots, real links, real contact values (placeholders stay: `[YOUR EMAIL]`, `[GITHUB]`, `[LINKEDIN]`, `[LISTING TITLE]`).
- A CMS or Markdown pipeline for posts (posts are hand-ported mock data, labelled "Sample post").
- Theme toggle UI (see Q6), analytics, SEO beyond `meta()` titles, i18n locales other than `en`.
- The design-canvas runtime (`<x-dc>`, `DCLogic`, `Mock.dc.html` props panel). Read for intent only.
- Smooth-scroll library, GSAP, Framer Motion.

## 2. Route map

`src/routes.ts` + `config.routes` (new `src/config.ts`). Folder names follow AGENTS §1.

| Key (`config.routes.*`) | Path               | File                                 | Layout                      | Redirect                                                  | Search params (zod) |
| ----------------------- | ------------------ | ------------------------------------ | --------------------------- | --------------------------------------------------------- | ------------------- |
| `home`                  | `/`                | `routes/index.tsx`                   | `routes/layout.tsx` (shell) | –                                                         | `filter`            |
| `work`                  | `/work/:projectId` | `routes/work/[project-id]/index.tsx` | shell, nav hidden           | –                                                         | –                   |
| `about`                 | `/about`           | `routes/about/layout.tsx`            | shell                       | → `config.routes.aboutExplore` (loader, exact-path match) | –                   |
| `aboutExplore`          | `/about/explore`   | `routes/about/explore/index.tsx`     | about                       | –                                                         | –                   |
| `aboutResume`           | `/about/resume`    | `routes/about/resume/index.tsx`      | about                       | –                                                         | –                   |
| `notes`                 | `/notes`           | `routes/notes/index.tsx`             | shell                       | –                                                         | `tag`               |
| `note`                  | `/notes/:slug`     | `routes/notes/[slug]/index.tsx`      | shell                       | –                                                         | –                   |

`routes.ts` shape:

```ts
layout("routes/layout.tsx", [
	index("routes/index.tsx"),
	route("work/:projectId", "routes/work/[project-id]/index.tsx"),
	route("about", "routes/about/layout.tsx", [
		route("explore", "routes/about/explore/index.tsx"),
		route("resume", "routes/about/resume/index.tsx"),
	]),
	route("notes", "routes/notes/index.tsx"),
	route("notes/:slug", "routes/notes/[slug]/index.tsx"),
]);
```

Route builders take paths from `config.routes` templates (`config.routes.work = "/work/:projectId"`, with a `buildPath` helper in `src/lib/routes.ts`, e.g. `workPath(id)`).

**Search param shapes** (parsed with `safeParse`, falling back to defaults; no `as` casts):

```ts
const homeSearch = z.object({
	filter: z.enum(ProjectFilter).catch(config.portfolio.defaultFilter),
});
const notesSearch = z.object({
	tag: z.string().min(1).optional().catch(undefined),
}); // absent = all
```

Defaults live in `config.portfolio.defaultFilter = ProjectFilter.All`. Invalid `?filter=` silently becomes the default. Unknown `?tag=` shows `Empty` (not a 404).

**Behaviour notes**

- `/about` redirect is a `loader` in `routes/about/layout.tsx` that compares the normalised pathname to `config.routes.about`; the layout owns the Explore/Resume toggle as two `NavLink`s.
- Project loop = `navigate(workPath(nextId), { viewTransition: true })`. Next id = `projects[(i+1) % n].id`; prev = `(i-1+n) % n`.
- Unknown `:projectId` / `:slug` ⇒ `Empty` (not-found copy) with a link home, not a thrown 404.
- Close (✕) on a project page: `navigate(-1)` if the previous entry is in-app (`history.state.idx > 0`), else `config.routes.home`.
- Scroll restoration: home restores via `ScrollRestoration`; `/work/*` and `/about/explore` are fixed-viewport (`overflow: hidden`) and ignore it.

## 3. Data contract

All files under `src/api/types/portfolio/` (≤ 6 files per folder): `enums.ts`, `block.ts`, `profile.ts`, `project.ts`, `post.ts`.

### 3.1 Enums

```ts
export enum BlockType {
	ProjectHeader = "project-header",
	Quote = "quote",
	BigNumber = "big-number",
	AboutSplit = "about-split",
	NumberedList = "numbered-list",
	StackCards = "stack-cards",
	FeatureGrid = "feature-grid",
	Timeline = "timeline",
	Zigzag = "zigzag",
	MotifFull = "motif-full",
	Chips = "chips",
	Mock = "mock",
	Gallery = "gallery",
	Architecture = "architecture",
	Lineage = "lineage",
}
export enum HeaderVariant {
	Split = "split",
	SplitRev = "split-rev",
	Center = "center",
	Outline = "outline",
	Vertical = "vertical",
}
export enum MotifKind {
	Radar = "radar",
	Moon = "moon",
	Pixel = "pixel",
	Hex = "hex",
	Orbit = "orbit",
	Pins = "pins",
}
export enum MockScreen {
	Main = "main",
	Alt = "alt",
}
export enum DeviceView {
	Desktop = "desktop",
	Phone = "phone",
}
export enum ProjectSide {
	BehindTheScenes = "behind-the-scenes",
	OnScreen = "on-screen",
}
export enum ProjectFilter {
	All = "all",
	Games = "games",
	Platforms = "platforms",
	OnChain = "on-chain",
}
export enum BlockTone {
	Default = "default",
	Invert = "invert",
}
export enum PostBlockType {
	Paragraph = "p",
	Heading = "h",
	List = "list",
	Code = "code",
	Quote = "quote",
	Callout = "callout",
}
export enum ExperienceKind {
	Work = "work",
	Education = "education",
}
```

UI-only enums go in `src/types/` (AGENTS: shared UI contracts): `CursorLabel` (`Open|View|Read|Drag|Next|Close|LookCloser|SayHi|Write`, values kebab-case, used as `data-cursor` and as i18n key suffix), `TerminalCommand` (`Help|Whoami|Ls|Open|Read|Cat|Skills|About|Blog|Home|Contact|Date|Clear|Exit|Sudo`), `AboutTileKind` (`Mock|Stat|Words|Icon|Timeline|Mono|Chat|Motif|Chips|Donut|Hero|Tall|Habits|Bars|Soft|Hello`), `ArchStop` is data not enum (see 3.4).

Prototype → enum value diffs: `ProjectSide` was display text `"Behind the scenes"`/`"On screen"`; the enum holds kebab values and `common.sides.<value>` renders the label. `ProjectFilter.OnChain` was `'web3'`.

### 3.2 `Block` discriminated union (`block.ts`)

Wire shape stays exactly `{ type, params }`.

```ts
interface BlockBase<T extends BlockType, P> {
	type: T;
	params: P;
}
interface MediaItem {
	kind: MotifKind;
	screen: MockScreen;
	view: DeviceView;
	caption: string;
	imageUrl?: string;
}

export type Block =
	| BlockBase<
			BlockType.ProjectHeader,
			{
				variant: HeaderVariant;
				title: string;
				subtitle: string;
				index: string;
				discipline: ProjectSide;
				tags: string[];
				kind: MotifKind;
			}
	  >
	| BlockBase<
			BlockType.Quote,
			{ text: string; cite: string; tone?: BlockTone }
	  >
	| BlockBase<
			BlockType.BigNumber,
			{ value: string; label: string; caption: string }
	  >
	| BlockBase<
			BlockType.AboutSplit,
			{ label: string; text: string; kind?: MotifKind; list?: string[] }
	  >
	| BlockBase<BlockType.NumberedList, { label: string; items: string[] }>
	| BlockBase<BlockType.StackCards, { label: string; items: string[] }>
	| BlockBase<BlockType.FeatureGrid, { label: string; items: string[] }>
	| BlockBase<BlockType.Timeline, { label: string; items: string[] }>
	| BlockBase<BlockType.Zigzag, { label: string; items: string[] }>
	| BlockBase<BlockType.MotifFull, { kind: MotifKind; label?: string }>
	| BlockBase<
			BlockType.Chips,
			{ label: string; title: string; text: string; items: string[] }
	  >
	| BlockBase<BlockType.Mock, MediaItem & { label: string }>
	| BlockBase<
			BlockType.Gallery,
			{ label: string; items: MediaItem[]; caption: string }
	  >
	| BlockBase<
			BlockType.Architecture,
			{ label: string; nodes: { name: string; description: string }[] }
	  >
	| BlockBase<
			BlockType.Lineage,
			{ label: string; from: string; to: string; text: string }
	  >;
```

`MotifFull` is in the prototype renderer (Main.dc.html line 609) but no project's `layout()` emits it yet; the renderer supports it, fixtures do not use it.
`Architecture.nodes` were tuples `[name, description]` in the prototype; objects are the typed form (Q4).
`caption: "Illustrative mock — swap for a real screenshot"` is authored content kept as data; once `imageUrl` is set, `ProjectMedia` shows the image and drops the mock look.

`block-registry` is `Record<BlockType, React.FC<…>>` in `block-renderer.tsx`; a generic `BlockProps<T extends BlockType> = Extract<Block, { type: T }>["params"]` keeps each block file typed.

### 3.3 Models

```ts
// profile.ts
interface Experience {
	id: string;
	title: string;
	period: string;
	notes: string[];
	kind: ExperienceKind;
	start: string;
	end: string | null;
} // start/end "YYYY-MM"; end null = present
interface SkillGroup {
	label: string;
	items: string[];
}
interface CoreSkill {
	label: string;
	text: string;
}
interface Contact {
	email: string;
	github: string;
	linkedin: string;
} // placeholders today, "[YOUR EMAIL]" …
interface Profile {
	name: string;
	headline: string;
	about: string;
	skills: SkillGroup[];
	core: CoreSkill[];
	experience: Experience[];
	education: Experience[];
	contact: Contact;
}

// project.ts
interface ProjectSummary {
	id: string;
	num: string;
	name: string;
	full: string;
	kind: MotifKind;
	side: ProjectSide;
	tags: string[];
	categories: ProjectFilter[];
	stack: string[];
	about: string;
	role: string[];
}
interface Project extends ProjectSummary {
	blocks: Block[];
}

// post.ts
type PostBlock =
	| {
			type:
				| PostBlockType.Paragraph
				| PostBlockType.Heading
				| PostBlockType.Quote
				| PostBlockType.Callout;
			text: string;
	  }
	| { type: PostBlockType.List; items: string[] }
	| { type: PostBlockType.Code; lang: string; text: string };
interface PostSummary {
	slug: string;
	num: string;
	title: string;
	date: string;
	tags: string[];
	kind: MotifKind;
	excerpt: string;
	readMinutes: number;
	sample: boolean;
}
interface Post extends PostSummary {
	blocks: PostBlock[];
}
```

Notes on the models:

- `id` = kebab slug of `name` (`aads`, `morning-moon-village`, `morning-moon-pocket`, `metal-valley`, `evermoon-socialfi`, `estic-ai`); `num` = zero-padded 4 (`0001`) for projects, 2 for posts, as in the prototype.
- `categories` replaces prototype flags (`game`, `web3`): `Games` if `hay` matches `/ game/`, `OnChain` if `/web3|solidity|nft|defi|blockchain/`, `Platforms` if not a game. `All` is never stored. Predicate lookup is `Record<ProjectFilter, (p) => boolean>` in `src/lib/portfolio/filter.ts`.
- `stack` = the prototype's `KW` keyword hits (Golang, MongoDB, Solidity, Real-time, Radar protocols, …) plus the lowercased keywords used by the "How a tap becomes a thing" hover (computed once in the script from `hay`, stored so the client does no text mining).
- `Project.features/challenges` live inside `blocks` only; `about/role` are duplicated on the summary because Resume and terminal need them without fetching detail.
- Anything year-relative (years in production, timeline "now") is **computed at render** from `Experience.start/end`, never baked into fixtures.

### 3.4 Static (non-API) content

"How a tap becomes a thing" stops (`Your screen`, `A live line`, `The brain`, `The memory`, `The rulebook`, `The ledger` + their sub-lines and keyword lists, Main.dc.html line 1311), marquee phrases (line 1325) and menu/terminal copy are **UI copy**, so they live in `en.json` (stop name/description) with a typed `src/lib/portfolio/stack-stops.ts` holding only the keyword arrays and i18n keys.

### 3.5 Query keys & hooks

```ts
config.queryKeys.portfolio = {
	profile: "portfolio.profile",
	projects: {
		list: "portfolio.projects.list",
		detail: "portfolio.projects.detail",
	},
	posts: { list: "portfolio.posts.list", detail: "portfolio.posts.detail" },
};
```

| Hook (file in `src/api/hooks/portfolio/`) | Key                     | Returns                                                                        |
| ----------------------------------------- | ----------------------- | ------------------------------------------------------------------------------ |
| `use-profile.ts`                          | `[profile]`             | `Profile`                                                                      |
| `use-projects.ts`                         | `[projects.list]`       | `ProjectSummary[]`                                                             |
| `use-project.ts`                          | `[projects.detail, id]` | `Project`                                                                      |
| `use-posts.ts`                            | `[posts.list]`          | `PostSummary[]` (tag filter applied in render, so the tag list stays complete) |
| `use-post.ts`                             | `[posts.detail, slug]`  | `Post`                                                                         |

Service seam: `src/api/services/portfolio.ts` (one file) exports `getProfile / listProjects / getProject / listPosts / getPost`. Today they `await sleep(config.mock.latencyMs)` then read fixtures; later they call the real client. Hooks never import fixtures. `getProject` throws a typed `NotFoundError` for unknown ids; hooks map it to the `Empty` state (`retry: false` for it).
`QueryClientProvider` is mounted in `root.tsx`; defaults `staleTime: Infinity` for mock mode (config).

### 3.6 ME.md → fixtures

`scripts/build-portfolio/index.ts` (pattern of `scripts/build-token`): reads `content/ME.md`, ports `parse()` (me-data.js line 154) and `layout()` (line 223) to typed TS, resolves enum values, then writes `src/api/mocks/portfolio/profile.ts` and `projects.ts`, formatted with Prettier (clean tree on re-run, like `build:tokens`). `posts.ts` is hand-ported from `POSTS` (me-data.js, line ~290) and is **not** generated. Script has `index.test.ts` (bun:test) covering: section parsing, `kindFor`, tags/stack, categories, id slugging, `layout()` block order per kind, 6 projects emitted, deterministic output. New package script `build:portfolio`; `check` runs it and fails if the tree is dirty is **not** required (keep it simple).

Because ME.md has no `# Features` for projects 2–6, `FeatureGrid` is emitted only for AADS (as in `layout()`).

### 3.7 Example payload — `GET project "aads"` (abridged, real ME.md text)

```json
{
	"id": "aads",
	"num": "0001",
	"name": "AADS",
	"full": "Army Air Defense System",
	"kind": "radar",
	"side": "behind-the-scenes",
	"categories": ["platforms"],
	"tags": ["Real-time", "Radar protocols", "Encryption"],
	"stack": ["socket", "trml", "encrypt"],
	"about": "A military program that tracks the aircraft from surveillance radars and let user to control the system. …",
	"role": [
		"Implemented a military program to control aircraft …",
		"Established communication between server and client using sockets …",
		"Developed a user interface …"
	],
	"blocks": [
		{
			"type": "project-header",
			"params": {
				"variant": "split",
				"title": "AADS",
				"subtitle": "Army Air Defense System",
				"index": "0001",
				"discipline": "behind-the-scenes",
				"tags": ["Real-time", "Radar protocols", "Encryption"],
				"kind": "radar"
			}
		},
		{
			"type": "quote",
			"params": {
				"text": "A military program that tracks the aircraft from surveillance radars and let user to control the system.",
				"cite": "Brief"
			}
		},
		{
			"type": "mock",
			"params": {
				"label": "Operator console",
				"kind": "radar",
				"screen": "main",
				"view": "desktop",
				"caption": "Illustrative mock — swap for a real screenshot"
			}
		},
		{
			"type": "big-number",
			"params": {
				"value": "2",
				"label": "Radar protocols, decoded",
				"caption": "TRML and DR127ADV messages turned into readable, real-time tracks."
			}
		},
		{
			"type": "architecture",
			"params": {
				"label": "How it flows",
				"nodes": [
					{
						"name": "Surveillance radars",
						"description": "Encoded track messages"
					},
					{
						"name": "Decoder",
						"description": "TRML · DR127ADV → readable"
					},
					{
						"name": "Socket server",
						"description": "Real-time state, both ways"
					},
					{
						"name": "Operator UI",
						"description": "Map, voice, messaging, alerts"
					}
				]
			}
		},
		{
			"type": "feature-grid",
			"params": {
				"label": "Features",
				"items": [
					"Real-time tracking of aircraft from surveillance radars",
					"…6 more from ME.md"
				]
			}
		},
		{
			"type": "timeline",
			"params": { "label": "Role", "items": ["…3 role bullets"] }
		},
		{
			"type": "zigzag",
			"params": {
				"label": "Challenges",
				"items": ["…3 challenge bullets"]
			}
		}
	]
}
```

Per-kind block order (from `layout()`): radar = header split · quote · mock · big-number · architecture · feature-grid · timeline · zigzag; moon = header center · about-split · mock · stack-cards · architecture · quote(invert) · numbered-list; pixel = header vertical · chips · lineage · gallery · numbered-list · architecture · stack-cards; hex = header outline · about-split · gallery · big-number · architecture · timeline · zigzag; orbit = header center · chips · mock · quote · architecture · quote(invert); pins = header split-rev · big-number · gallery · about-split · stack-cards · numbered-list.

## 4. Component inventory

Placement per AGENTS §1 (one component per file, kebab-case, ≤ 6 files per folder, no types exported from `.tsx`, shared UI types in `src/types/`). "Wraps" = shadcn primitive (Base UI, `render` prop). **Foundation adds** the primitives marked `+`: `dialog`, `sheet`, `skeleton`, `alert`, `empty`, `toggle-group`, `input-group`, `badge` (run `bunx --bun shadcn@latest search @shadcn -q …` and `docs <name>` first at execution; never `--overwrite`).

### 4.1 Reuse from the repo

Only `ui/button.tsx` and `lib/utils.ts` (`cn`) exist. Everything else is new.

### 4.2 `src/components/common/` (design-system, DRY)

| Component         | File                                                                           | Wraps                                     | Props sketch                                                                                                               | States                                 |
| ----------------- | ------------------------------------------------------------------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `PillButton`      | `common/buttons/pill-button.tsx`                                               | `ui/button`                               | `variant: PillVariant (solid\|outline\|ghost\|invert)`, `size`, `magnetic?` (adds `data-magnetic`), `cursor?: CursorLabel` | hover, focus-visible, disabled         |
| `IconButton`      | `common/buttons/icon-button.tsx`                                               | `ui/button`                               | `label` (aria), `icon`, 44px tap                                                                                           | same                                   |
| `TagPill`         | `common/badges/tag-pill.tsx`                                                   | `ui/badge`+                               | `children`, `active?`                                                                                                      | default, active                        |
| `FilterToggle`    | `common/filters/filter-toggle.tsx`                                             | `ui/toggle-group`+                        | `value`, `options: {id,labelKey,count?}[]`, `onChange`                                                                     | pressed, hover                         |
| `QueryErrorAlert` | `common/feedback/query-error-alert.tsx`                                        | `ui/alert`+, `PillButton`                 | `onRetry`                                                                                                                  | error                                  |
| `QueryEmpty`      | `common/feedback/query-empty.tsx`                                              | `ui/empty`+                               | `titleKey`, `actionTo?`                                                                                                    | empty                                  |
| `ProjectMotif`    | `common/art/project-motif.tsx`                                                 | custom SVG (`currentColor`)               | `kind: MotifKind`, `className`                                                                                             | static                                 |
| `ProjectMock`     | `common/art/project-mock.tsx`                                                  | custom SVG                                | `kind`, `screen`, `view`, `className`                                                                                      | static                                 |
| `ProjectMedia`    | `common/art/project-media.tsx`                                                 | `ProjectMock` or `<img>`                  | `item: MediaItem`                                                                                                          | image loading/err → falls back to mock |
| Motif/mock parts  | `common/art/motif/motif-<kind>.tsx` (6), `common/art/mock/mock-<kind>.tsx` (6) | custom                                    | none (each renders its screens/views)                                                                                      | static                                 |
| `SectionLabel`    | `common/typography/section-label.tsx`                                          | custom (`<span data-scramble>(01) Hello`) | `index`, `children`                                                                                                        | scramble on enter                      |

Motif/mock registries are `Record<MotifKind, React.FC<…>>` inside `project-motif.tsx` / `project-mock.tsx`. Source: Motif.dc.html (9.9 KB), Mock.dc.html (desktop screens from line 15, phone and alt screens below it).

### 4.3 `src/components/shared/` (used by 2+ route subtrees)

| Component                      | File                                           | Wraps                                | Props sketch                         | States                                         |
| ------------------------------ | ---------------------------------------------- | ------------------------------------ | ------------------------------------ | ---------------------------------------------- |
| `Preloader`                    | `shared/shell/preloader.tsx`                   | custom                               | – (reads context)                    | counting, wiping, done                         |
| `SiteNav`                      | `shared/shell/site-nav.tsx`                    | `NavLink`, `PillButton`              | –                                    | hidden (project route), current page           |
| `SiteMenu`                     | `shared/shell/site-menu.tsx`                   | `ui/dialog`+ (always mounted, modal) | –                                    | open/closed, hover-preview index               |
| `MenuPageLink`                 | `shared/shell/menu/menu-page-link.tsx`         | `NavLink`                            | `index`, `labelKey`, `to`, `onHover` | current, dimmed                                |
| `MenuPreview`                  | `shared/shell/menu/menu-preview.tsx`           | custom                               | `item`                               |                                                |
| `MenuProjects`                 | `shared/shell/menu/menu-projects.tsx`          | `useProjects`                        | –                                    | loading/error/empty/success                    |
| `StickyCursor`                 | `shared/shell/sticky-cursor.tsx`               | custom                               | –                                    | hidden on touch                                |
| `PageTransition`               | `shared/shell/page-transition.tsx`             | RR view transitions                  | –                                    | reduced motion = none                          |
| `TerminalDialog`               | `shared/terminal/terminal-dialog.tsx`          | `ui/dialog`+, `ui/input-group`+      | – (context)                          | open/closed, lines                             |
| `TerminalLine`                 | `shared/terminal/terminal-line.tsx`            | custom                               | `line`                               |                                                |
| `ProjectPreviewCard`           | `shared/projects/project-preview-card.tsx`     | `ProjectMock`                        | `project`                            | floating index preview, fan card, menu preview |
| `ContactLinks`                 | `shared/contact/contact-links.tsx`             | `PillButton`                         | `className`                          | placeholder (non-link) vs real link            |
| `PostCard`, `PostCardSkeleton` | `shared/posts/post-card.tsx`, `…-skeleton.tsx` | `ProjectMotif`                       | `post`                               | home teaser + notes grid                       |

### 4.4 Route components

`src/routes/index.tsx` + `routes/components/home/*` (grouped by section: `hero/`, `marquee/`, `hello/`, `spotlight/`, `index/`, `stack/`, `habits/`, `timeline/`, `toolkit/`, `notes/`, `contact/`; each with its `…-skeleton.tsx`), `routes/work/[project-id]/components/…` (`project-viewport.tsx`, `project-topbar.tsx`, `project-json-sheet.tsx` + `ui/sheet`+, `end-cap.tsx`, `block-renderer.tsx`, `blocks/<block>.tsx` ×15 in `blocks/` groups `header/`, `lists/`, `media/`, `text/`), `routes/about/components/…` (`mode-switch.tsx`, `wall/wall-tile.tsx`, `wall/wall-minimap.tsx`, `tiles/*` ×16, `resume/resume-sheet.tsx`), `routes/notes/components/…` (`featured-post.tsx`, `post-grid.tsx`, `tag-filter.tsx`, `post/post-progress.tsx`, `post/post-block.tsx` + one file per `PostBlockType`, `post/next-note.tsx`). Exact file lists are in plans `03`–`06`.

### 4.5 Contexts (`src/contexts/`)

`preloader-context.tsx` (`loaded`, gates hero animation), `shell-context.tsx` (`menuOpen`, `terminalOpen`, setters; used by nav, menu, home contact, terminal). Nothing else needs context.

## 5. Engines and hooks (`src/hooks/<group>/`)

Pure maths live in `src/lib/motion/*.ts` (unit-tested with `bun:test`, no DOM). Hooks are thin: refs in, rAF, writes `transform` / `opacity` / `clip-path` only. Rules for all:

- One rAF loop per engine, started only while its element intersects the viewport (IntersectionObserver) and `document.visibilityState === "visible"`; cancelled on unmount; no work when idle (target within 0.05px).
- Rects cached on mount and on `ResizeObserver`; never `getBoundingClientRect` per frame except where noted (the prototype does it in `tick()`; we cache and refresh on scroll/resize).
- `prefers-reduced-motion: reduce` (`use-reduced-motion`, `useSyncExternalStore` on `matchMedia`) → engines render the settled end state without a loop (details per hook).
- Touch (`(pointer: coarse)` / `hover: none`): see per hook.
- Test strategy: pure step function tests + one browser check per acceptance list. No jsdom/happy-dom/testing-library (not installed, not needed).

| Hook (`src/hooks/…`)             | Inputs → outputs                                                   | Numbers (prototype source)                                                                                                                                                                                                                                                                                                                                                                                                                                      | Reduced motion                                         | Touch                                                             | Tests                                                                  |
| -------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `motion/use-raf`                 | `(cb(dt,t), active)` → void                                        | visibility-aware                                                                                                                                                                                                                                                                                                                                                                                                                                                | n/a                                                    | n/a                                                               | n/a                                                                    |
| `motion/use-reduced-motion`      | – → boolean                                                        | –                                                                                                                                                                                                                                                                                                                                                                                                                                                               | –                                                      | –                                                                 | –                                                                      |
| `scroll/use-horizontal-scroller` | `{vpRef, trackRef, onThreshold}` → `{pull, progress, activePanel}` | lerp **0.085**; `x = current + pull*0.2`; parallax `(base−x)*(1−speed)*0.35` via `data-speed`; resistance `pull += d*max(.12, .5*(1−.55*pull/th))`, `th` **420px** (config `portfolio.scroller.resistancePx`); decay `pull*=0.9` after **160ms** idle, zero below 0.5; meter/fill `q = min(1, pull/th)`, fill = `clip-path: inset(0 (100−q*100)% 0 0)`; active panel = last panel with `left <= x + 0.45vw`; keys ←/→/PgUp/PgDn/Space/Esc (Main 1104–1150, 872) | no lerp: jump; no parallax; resistance still navigates | native `scroll-snap-x`, engine off, progress from `scrollLeft`    | `lib/motion/scroller.test.ts`                                          |
| `scroll/use-pinned-track`        | `{outerRef, trackRef, extra}` → void                               | `prog = clamp(−top/(height−vh))`, `translateX(−prog*extra)` over a CSS `position: sticky` stage (Main 1190)                                                                                                                                                                                                                                                                                                                                                     | vertical stack instead of pin                          | same sticky pin, native                                           | step fn                                                                |
| `scroll/use-velocity-marquee`    | `ref` → void                                                       | `vel += ((y−lastY)−vel)*0.2`; `mq −= (1.1 + min(40,                                                                                                                                                                                                                                                                                                                                                                                                             | vel                                                    | )*0.6)*dir`; skewX `clamp(−vel*0.35, ±12)deg`; wrap at half width | static, no loop                                                        | runs | step fn |
| `scroll/use-word-reveal`         | `{containerRef}` → void                                            | `prog = clamp((0.85vh − top)/(0.9vh))`; `opacity = 0.16 + 0.84*clamp(prog*n*1.1 − i)`                                                                                                                                                                                                                                                                                                                                                                           | all opacity 1                                          | runs                                                              | step fn                                                                |
| `motion/use-count-up`            | `ref, target, pad` → void                                          | starts at `top < 0.9vh`; **1600ms**, ease `1−(1−t)^4`, zero-padded                                                                                                                                                                                                                                                                                                                                                                                              | final value                                            | runs                                                              | easing fn                                                              |
| `motion/use-scramble`            | `ref` → void                                                       | chars `!<>-_/[]{}=+*^?#01`, reveal `floor(len*f/16)`; interval in Main 990                                                                                                                                                                                                                                                                                                                                                                                      | no-op                                                  | on tap-enter                                                      | –                                                                      |
| `pointer/use-sticky-cursor`      | – → `{dotRef, ringRef, label}`                                     | ring 36px/r18 default; label **88px**/r44; snap target ≤ **900×240**: size+**14px**, radius+**7px**; ring lerp **0.2**; dot hides when snapping; magnetic **0.28/0.38** (`data-magnetic`) (Main 1190–1214)                                                                                                                                                                                                                                                      | hidden                                                 | not mounted                                                       | step fn                                                                |
| `pointer/use-fan-tilt`           | `ref` → void                                                       | `tiltX += (mx/vw−.5−tiltX)*0.06`; `rotateY(tiltX*10) rotateX(−tiltY*6)`; only `vw ≥ 760` and not touch                                                                                                                                                                                                                                                                                                                                                          | none                                                   | none                                                              | –                                                                      |
| `pointer/use-spotlight`          | `{sectionRef, layerRef}` → `{toggle}`                              | goal radius `min(240, w*0.22)` inside, `hypot(w,h)` when toggled, 0 outside; radius lerp **0.12**, centre lerp **0.2**; `clip-path: circle()`                                                                                                                                                                                                                                                                                                                   | layer fully visible on toggle only                     | tap toggles                                                       | –                                                                      |
| `pointer/use-letter-weight`      | `ref` → void                                                       | weight `round(900 − min(1,d/360)*700)` per letter; desktop only                                                                                                                                                                                                                                                                                                                                                                                                 | fixed 800                                              | fixed                                                             | weight fn                                                              |
| `pointer/use-pan-wall`           | `{wallRef, tiles, geo}` → `{recenter, minimap}`                    | inertia `×0.93`; rubber-band at **30%** viewport; per tile `d = dist(centre)/(0.62*max(vw,vh))`: scale `1−0.2*clamp(d−.3)`, opacity `clamp(1.5−1.05d)`, 7% pull to centre; unit **200/176/148** (vw ≥1100 / ≥760 / below), gap **8%**; click ignored if drag **>6px**; minimap 168px wide (About 314–350)                                                                                                                                                       | no ripple-in, no inertia                               | native drag via pointer events, pan with touch                    | `lib/motion/wall.test.ts`                                              |
| `physics/use-bubble-physics`     | `{playRef, balls}` → `{shake}`                                     | gravity **0.55**, drag `vx*=0.996`, floor restitution **0.42**, wall **0.6**, floor friction **0.94**, 2 collision passes, impulse **1.35**; diameter `clamp(56+len*7, 84, 168)`; drops when `top < 0.8vh`; steps only within ±200px of viewport (Main 1073–1103)                                                                                                                                                                                               | static grid, no physics                                | pointer drag/throw                                                | `lib/motion/physics.test.ts`                                           |
| `motion/use-preloader`           | – → `{count, phase}`                                               | **1700ms** count 000→100 (3 digits), **180ms** hold, clip-path wipe up **1s** `cubic-bezier(.76,0,.24,1)`, unmounted at **+1050ms**, first load only (Main 1027–1038)                                                                                                                                                                                                                                                                                           | skip (instant)                                         | runs                                                              | –                                                                      |
| `motion/use-page-transition`     | – → `navigate` wrapper                                             | see §5.1                                                                                                                                                                                                                                                                                                                                                                                                                                                        | instant swap                                           | same                                                              | –                                                                      |
| `terminal/use-terminal`          | – → `{lines, run(raw)}`                                            | commands from Main 942–988, cap **160** lines, nav after **450ms**                                                                                                                                                                                                                                                                                                                                                                                              | n/a                                                    | n/a                                                               | `lib/terminal/commands.test.ts` (pure parser returning `{lines, nav}`) |

### 5.1 Page transition (view transitions, with a fallback gate)

Ladder: native View Transitions API via `navigate(to, { viewTransition: true })` / `<Link viewTransition>` (react-router) + CSS pseudo-elements. Prototype `pgEnter` (26 linear keyframes, Main 66) is applied to `::view-transition-new(root)`, `pgLeave` (Main 68) to `::view-transition-old(root)`. Numbers: **0.95s**; enter starts `perspective(1600px) translate3d(0,100vh,0) rotateX(26deg)`, corners 36px → 0; movement `cubic-bezier(.5,0,.04,1)`, tilt `cubic-bezier(.3,0,.08,1)` starting 5% later; leave `translateY(-14vh)`, `brightness(.34)`, `blur(4px)`, no scale; `box-shadow: 0 -30px 80px -10px rgba(0,0,0,.55)` on enter. CSS in `src/theme/page-transition.css`, imported by `main.css`.
**Risk/spike (plan 03 step 6):** `border-radius` and `perspective` on `::view-transition-new` must be verified in Chromium, Safari and Firefox. If unsupported/ugly: fallback is a two-slot transition outlet (as the prototype's `slots`). Browsers without View Transitions swap instantly.

## 6. Dependencies (YAGNI ladder)

**Already installed and sufficient:** `react-router` 8.4 (routes, `NavLink`, view transitions, loaders, `ScrollRestoration`), `@base-ui/react` (Dialog/Sheet/Toggle via shadcn), `class-variance-authority`, `tailwindcss` 4 + `tw-animate-css`, `@remixicon/react` (icons; prototype's inline arrows may stay inline SVG inside one `ArrowIcon`), `@fontsource-variable/inter`, `prettier`, `typescript`, `bun:test`. Native: CSS `position: sticky`, `scroll-snap`, `@media print`, `IntersectionObserver`, `ResizeObserver`, WAAPI, `matchMedia`, View Transitions.

**Proposed additions (Foundation; AGENTS-mandated or needed, each with ceiling):**

| Package                    | Ladder justification                                                                       | `// ponytail` ceiling                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `@tanstack/react-query`    | AGENTS mandates it; gives loading/error/retry/cache the brief requires; real backend later | `// ponytail: mock service, staleTime Infinity; add per-query staleTime when a backend exists` |
| `i18next`, `react-i18next` | AGENTS i18n rules (typed keys, plural `-`, no fallback text) cannot be met natively        | `// ponytail: en only; add language detector when a 2nd locale exists`                         |
| `zod` (promote to direct)  | search-param validation without `as` casts; already in tree                                | –                                                                                              |

**Considered and rejected:** `lenis` (native scroll is kept; no smooth-scroll need shown), `gsap`/ScrollTrigger (the pinned track is `sticky` + one transform), `framer-motion`/`motion`, `axios` (service seam first; add with the real backend, Q3), `react-hook-form` + `@hookform/resolvers` (no forms exist: terminal input is not a form, filters are toggles), `sonner`/toast (no mutations), `vaul` Drawer (terminal is a `Dialog`), a syntax highlighter (post code blocks use line numbers + `<pre>`; `// ponytail: no highlighting, add shiki-light if posts get long`), a virtual list (6 projects, 5 posts), a physics lib (~40 lines of maths).

## 7. i18n

`src/lib/i18n.ts` (init, `pluralSeparator: "-"`), `src/i18next.d.ts` (typed resources), `src/locales/en.json`. Namespace = route path under `routes/` (AGENTS §3).

Draft key tree (dot notation; parts are their own segment; plurals `-one`/`-other`):

```
common.menu.label            common.close  common.back-to-top  common.next  common.previous
common.sides.behind-the-scenes   common.sides.on-screen
common.filters.all|games|platforms|on-chain
common.cursor.open|view|read|drag|next|close|look-closer|say-hi|write
common.contact.placeholder-hint
common.loading.title   common.errors.load.title  common.errors.load.description  common.errors.retry
common.empty.not-found.title  common.empty.not-found.action
shell.nav.aria-label  shell.nav.menu  shell.nav.home.aria-label  shell.nav.brand
shell.nav.pages.about|notes   shell.nav.contact
shell.preloader.name  shell.preloader.edition  shell.preloader.message
shell.menu.title  shell.menu.pages.1.title|sub …(home, work, about, notes, contact)
shell.menu.projects.title   shell.menu.jumps.<id>   shell.menu.terminal
shell.menu.meta
shell.terminal.title  shell.terminal.window  shell.terminal.close  shell.terminal.input.aria-label
shell.terminal.input.placeholder  shell.terminal.open  shell.terminal.button.label
shell.terminal.help.<command>.usage|description (×9)  shell.terminal.help.hint
shell.terminal.whoami  shell.terminal.errors.not-found|ls|open|read|cat|sudo
shell.terminal.messages.opening|granted|password
home.hero.eyebrow  home.hero.title.line-1|line-2   home.hero.lede  home.hero.lede-accent
home.hero.tags.always-on|game-ready|zero-drama   home.hero.scroll.aria-label
home.hero.cards.aria-label
home.marquee.phrases.1…6
home.hello.eyebrow  home.hello.cta  home.hello.stats.projects|languages|years|pins.label
home.spotlight.aria-label  home.spotlight.see.eyebrow|lines.1…3|hint  home.spotlight.reveal.eyebrow|lines.1…3|hint
home.index.eyebrow  home.index.title  home.index.filters.aria-label  home.index.row.aria-label
home.stack.eyebrow  home.stack.title.line-1|line-2  home.stack.description  home.stack.used-in
home.stack.stops.1…6.name|description
home.habits.eyebrow  home.habits.title.line-1|line-2|line-3  home.habits.hint  home.habits.next
home.timeline.eyebrow  home.timeline.hint  home.timeline.years.label
home.toolkit.eyebrow  home.toolkit.title.line-1|line-2  home.toolkit.shake  home.toolkit.count-one|count-other  home.toolkit.aria-label
home.notes.eyebrow  home.notes.title.line-1|line-2  home.notes.all
home.contact.eyebrow  home.contact.title  home.contact.lede  home.contact.lede-accent  home.contact.copyright  home.contact.terminal
work.topbar.close  work.topbar.json  work.topbar.counter.aria-label  work.topbar.prev|next.aria-label
work.viewport.aria-label  work.json.aria-label  work.json.endpoint  work.json.blocks-one|blocks-other
work.end-cap.next  work.end-cap.loop  work.blocks.<type>.label (only UI labels, authored labels stay data)
about.mode.aria-label  about.mode.explore|resume   about.explore.minimap.aria-label  about.explore.recenter
about.explore.tiles.<kind>.… (captions: projects-shipped, live-both-ways, from-classroom, …)
about.resume.title.role  about.resume.sections.summary|experience|projects|education  about.resume.print
about.resume.my-part  about.resume.education.degree|focus
notes.eyebrow  notes.title  notes.tags.all  notes.tags.aria-label  notes.featured.eyebrow
notes.card.read-time-one|read-time-other  notes.sample  notes.empty.title
notes.post.progress.aria-label  notes.post.back  notes.post.next  notes.post.code.lang.aria-label
```

Data values rendered raw (project names, skills, ME.md copy, post bodies, dates). Authored block labels inside `Block.params` (e.g. `"Operator console"`, `"Brief"`) are API content, rendered raw.

## 8. Tokens

Prototype `design/tokens.neutral.json` (shadcn nova/neutral preset) maps 1:1 to prototype CSS variables:

| Prototype var (dark / light)            | Token                                  | Notes                  |
| --------------------------------------- | -------------------------------------- | ---------------------- |
| `--bg #0a0a0a / #fff`                   | `background`                           | oklch(.145) / oklch(1) |
| `--fg #fafafa / #0a0a0a`                | `foreground`                           |                        |
| `--card #171717 / #f5f5f5`              | `card`                                 |                        |
| `--muted #262626 / #f5f5f5`             | `muted`                                |                        |
| `--mfg #a1a1a1 / #737373`               | `muted-foreground`                     |                        |
| `--line rgba(255,255,255,.1) / #e5e5e5` | `border`                               |                        |
| `--pill / --pillfg`                     | `foreground` / `background` (inverted) | no new token           |

**Gaps** (add to the pipeline, not to `ui/`): fonts (`--font-mono`: `ui-monospace, Menlo, monospace` for terminal), motion tokens (`--ease-page-move .5,0,.04,1`, `--ease-page-tilt .3,0,.08,1`, `--ease-wipe .76,0,.24,1`, `--duration-page .95s`), z-layer scale (nav 100, menu/terminal 98–200, loader 400, cursor top), `--radius-pill` (999px), `--radius-page` (36px), shell sizes (`--size-nav-h 64px`, `--size-tap 44px`), print tokens (resume sheet is always white/black regardless of theme). The `sidebar-primary` blue in dark is out of palette and unused (monochrome only).

**Pipeline decision:** `scripts/build-token/configs/theme.json` is a different product's tokens and is replaced by a `$value` tree generated from `tokens.neutral.json` plus the gaps above; output goes to `src/theme/tokens.css` / `tokens.ts`, imported by `main.css` (which currently inlines shadcn defaults and has `--accent: oklch(.205)` ("bold") against the preset's "subtle" accent; align to the preset). Dark is default: `<html class="dark">` set in `root.tsx`; `:root` holds light. Light must work (no toggle UI, Q6).

## 9. Typography

Inter Variable only (already installed). The design relies on weights 700–900 and `font-variation` per letter; confirm the installed `@fontsource-variable/inter` ships the `wght` axis 100–900 (it does) and use `font-weight` (not `font-variation-settings`) in `use-letter-weight`. Display sizes are `clamp()` in tokens-backed utilities; exact clamps are in each plan's "Screens and parts".

## 10. Milestones (one plan each)

| #   | File                              | Scope                                                                                            |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | `02-portfolio-data-types.md`      | Foundation gap, enums, models, ME.md script, mocks, hooks, `ProjectMotif`/`Mock`/`Media`, tokens |
| 2   | `03-portfolio-shell.md`           | routes, nav, menu, preloader, cursor, transition                                                 |
| 3   | `04-portfolio-home.md`            | all 11 home sections                                                                             |
| 4   | `05-portfolio-project-page.md`    | scroller, resistance, loop, blocks, JSON sheet                                                   |
| 5   | `06-portfolio-about-notes.md`     | Explore wall, Resume print, Notes                                                                |
| 6   | `07-portfolio-terminal-polish.md` | terminal, mobile, reduced-motion, performance, final checks                                      |

## 11. Risks and unknowns

1. **Foundation gap (§0)** is larger than a port; estimated as much work as one milestone. Without it nothing in AGENTS.md's gate can pass.
2. **Stale `lint-style`/`lint-tailwind`/`build-token` scripts** copied from another product: their rules may reference folders/config keys that do not exist (`config.ts`, `src/locales/en.json`, route registry). Plan `02` step A3 runs them once on the scaffold and records what fails before wiring them into `check`.
3. **View-transition fidelity** (§5.1) across browsers.
4. **`position: sticky` pin** inside a layout whose ancestors set `overflow` breaks; the home page must not set `overflow-x: hidden` on `body`/ancestors (use `overflow-x: clip`).
5. **Prototype reads layout in `tick()`** every frame; porting verbatim would violate the "no layout reads in hot loops" rule. Caching strategy per hook (§5) must be applied, and Explore wall with 27 tiles needs a perf check on a mid-range phone.
6. **Print**: "only the sheet prints" needs the shell hidden under `@media print`; the sheet is white even in dark theme.
7. **`mix-blend-mode: difference` cursor** forces a compositing layer; check it does not tank scroll on the home page.
8. **Copy fidelity**: ME.md has typos ("Cryto", "soneium") kept verbatim as data. Keep as is; flag to the owner.
9. **Data-derived claims**: stats like `4k+` and `2` come from ME.md/prototype; no invented numbers. `x10Start` is derived from the "X10 Interactive" experience entry by regex in the prototype; the script must store `start`/`end` explicitly.
10. **Time-relative content** (years, timeline "now") changes yearly; computed at render from `Date`, centralised in `src/lib/portfolio/time.ts` and injectable for tests.

## 12. Deviations from AGENTS.md / brief (recorded for MEMORY.md)

- No Axios client yet: a service seam (`src/api/services/portfolio.ts`) stands in (Q3). AGENTS lists `client.ts`; add it when a backend exists.
- No `react-hook-form`/`toast`/`Spinner`: there are no forms or mutations. Mutation-state rules are vacuously satisfied.
- Terminal is a `Dialog`, not a `Drawer`.
- `Architecture.nodes` objects instead of tuples (typed).
- `ProjectSide`/`ProjectFilter` values are kebab-case enums; display labels via i18n.
- Docs numbering starts at `01` because `docs/plans/` was empty (Q9).

## 13. Open questions (answer before milestone 1)

| #   | Question                                                                                                                                                                                                                 | Recommendation                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Q1  | The repo lacks `config.ts`, scripts wiring, TanStack Query, i18next, zod, `DESIGN.md`, `docs/PORTS.md`, `MEMORY.md` and has another product's token config. OK to add a Foundation block (plan `02` §A) before the port? | **Yes.** It is required for AGENTS.md's gate. Also approve me writing `docs/PORTS.md` and `DESIGN.md` as short stubs, since AGENTS.md links them |
| Q2  | Is `./design/` (project root) the canonical prototype location, instead of `../design/`?                                                                                                                                 | Yes. Leave it; all plans cite `design/…`. Move later if you want it out of the repo                                                              |
| Q3  | Axios `client.ts` now or after the backend exists?                                                                                                                                                                       | After. Service seam covers it                                                                                                                    |
| Q4  | `Architecture.nodes` as `{ name, description }` objects (typed) instead of tuples?                                                                                                                                       | Objects. Backend sends the same                                                                                                                  |
| Q5  | Route name `/work/:projectId` uses slug ids (`aads`) rather than `0001`?                                                                                                                                                 | Slugs. Pretty, stable, still unique                                                                                                              |
| Q6  | Theme: dark default, light supported but **no toggle UI** in v1?                                                                                                                                                         | Yes. Add a toggle only if you ask. Verify light via a dev-only class flip                                                                        |
| Q7  | Home `ProjectFilter` is a URL param `?filter=`; Notes `?tag=`. Keep param names?                                                                                                                                         | Yes                                                                                                                                              |
| Q8  | Terminal as `Dialog` (not `Drawer`)?                                                                                                                                                                                     | Yes, no extra dependency                                                                                                                         |
| Q9  | Plan numbers `01…07` (none existed)?                                                                                                                                                                                     | Yes                                                                                                                                              |
| Q10 | Sample posts keep the "Sample post" callout (data) and `sample: true` flag; Notes shows a visible "Sample" label per brief?                                                                                              | Yes, per brief                                                                                                                                   |
| Q11 | Do you want a real contact link behavior (mailto etc.) once values exist, or keep non-link text?                                                                                                                         | Placeholders render as non-links; real values render as links via `ContactLinks` automatically                                                   |
| Q12 | Browser support floor: View Transitions need Chromium/Safari 18+; Firefox gets instant swap. Acceptable?                                                                                                                 | Yes                                                                                                                                              |

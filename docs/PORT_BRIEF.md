# Port brief — William Siefert portfolio

Port the design prototype into **this existing project**. AGENTS.md (the house rules) wins over anything here. Where this brief and AGENTS.md disagree, follow AGENTS.md and note the deviation in MEMORY.md.

## Before writing code

1. Read `AGENTS.md`, `src/config.ts`, `MEMORY.md`, `DESIGN.md`, `docs/PORTS.md` and `docs/plans/`.
2. Run `graphify query` to learn the shell: `root.tsx`, `routes.ts`, the theme token pipeline, `common/` components and the mock layer.
3. The prototype lives in `../design/` (copy this bundle's `design/` folder there):
    - `Main.dc.html`: home, project pages, menu, cursor, terminal, page transition.
    - `About.dc.html`: Explore wall and Resume sheet.
    - `Blog.dc.html`: notes list and post.
    - `Mock.dc.html` and `Motif.dc.html`: generated SVG art.
    - `me-data.js`: ME.md parser, per-project block layouts, sample posts.
    - `tokens.neutral.json`: design tokens.
4. The prototype files are `.dc.html` for a design-canvas runtime (`<x-dc>`, `<sc-for>`, `<sc-if>`, `{{holes}}`, `DCLogic`). Read them for look, copy, layout, numbers and motion. Do **not** copy their structure; rebuild in this project's patterns.
5. Follow `docs/PORTS.md` for every screen: research → capture → plan (write `docs/plans/<nn>-portfolio-<screen>.md`) → execute step by step → verify in the browser at 1440×900 and 390×844.

## Data contract (API-first, mocked now)

The site reads everything through **TanStack Query hooks**. Mocks with `config.mock.latencyMs` stand in for the backend until it exists.

- `content/ME.md` (this bundle) is the source. Add a script in `scripts/` that parses it into mock fixtures under `src/api/mocks/`. Port the parser from `parse()` in `../design/me-data.js`.
- Types go in `src/api/types/portfolio*.ts` (grouped per folder rules). Use **enums**, never string unions:
    - `BlockType`: `ProjectHeader = "project-header"`, `Quote`, `BigNumber`, `AboutSplit`, `NumberedList`, `StackCards`, `FeatureGrid`, `Timeline`, `Zigzag`, `MotifFull`, `Chips`, `Mock`, `Gallery`, `Architecture`, `Lineage`.
    - `HeaderVariant`: `Split`, `SplitRev`, `Center`, `Outline`, `Vertical`.
    - `MotifKind`: `Radar`, `Moon`, `Pixel`, `Hex`, `Orbit`, `Pins`.
    - `MockScreen`: `Main`, `Alt`. `DeviceView`: `Desktop`, `Phone`.
    - `ProjectSide`: `BehindTheScenes`, `OnScreen`. `ProjectFilter`: `All`, `Games`, `Platforms`, `OnChain`.
- A project page is `{ id, name, …, blocks: Block[] }` where `Block = { type: BlockType; params: … }` is a discriminated union keyed by `BlockType`. Keep exactly this `[{ type, params }]` shape: the real backend will send it. Port each project's block list from `layout()` in `me-data.js`.
- Hooks in `src/api/hooks/` (grouped): profile, projects list, project by id, posts list, post by slug. Query keys go in `config.queryKeys.portfolio.*`, nested by domain.
- Every hook consumer renders loading (`Skeleton` with the same box), error (`Alert` plus retry), empty (`Empty`) and success.
- Blog posts are mock data ported from `POSTS` in `me-data.js`. Keep the "Sample post" label.
- Placeholders stay visible: `[YOUR EMAIL]`, `[GITHUB]`, `[LINKEDIN]`, `[LISTING TITLE]`. Never invent links, stats or dates.

## Routes (views are routes)

Register each route in `src/routes.ts` with its path in `config.routes`:

| Route                | Folder                               | Notes                                                                          |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------------ |
| `/`                  | `routes/index.tsx`                   | Home                                                                           |
| `/work/[project-id]` | `routes/work/[project-id]/index.tsx` | Horizontal project page                                                        |
| `/about`             | `routes/about/layout.tsx`            | Redirects to `/about/explore`. The mode toggle is `NavLink`s, never `useState` |
| `/about/explore`     | `routes/about/explore/index.tsx`     | Draggable wall                                                                 |
| `/about/resume`      | `routes/about/resume/index.tsx`      | Printable sheet                                                                |
| `/notes`             | `routes/notes/index.tsx`             | Blog list. Tag filter lives in a URL search param, validated with zod          |
| `/notes/[slug]`      | `routes/notes/[slug]/index.tsx`      | Post                                                                           |

- Index filter (`ProjectFilter`) is a URL search param, with its default in `config.ts`.
- Next-project looping is navigation to `/work/<next-id>`, so the back button and refresh both work.

## UI rules applied to this design

- **Copy:** every visible string goes in `src/locales/en.json` under the route namespace. This includes the headline, section titles, marquee phrases, menu, terminal help, aria-labels and the cursor labels (`Open`, `View`, `Read`, `Drag`, `Next`, `Close`). Data values from the API render raw.
- **Primitives:** check shadcn first and use the Base UI `render` prop.
    - Full-screen **menu** → `Dialog` or a full-height `Sheet`, always mounted and modal.
    - **Terminal** → `Drawer` or `Dialog`. Its command input is a plain `InputGroup` driven by local state that resets on close (overlay lifecycle rule). It is not a form.
    - **JSON drawer** on project pages → `Sheet` (side right).
    - **Filter chips** and the About mode switch → `ToggleGroup` or `NavLink`-based tabs.
    - Buttons → `src/components/common/buttons/*`. Add pill variants via `cva` if missing.
- **Design tokens:** map `design/tokens.neutral.json` into the theme pipeline (`bun run build:tokens`). Dark is the default theme and light must work. Monochrome only; inverted blocks are the only accent.
- **Component rules:** one component per file, kebab-case, `@/` imports, no class-constant files, no nested ternaries, no derived state in effects, and repeated siblings mapped from typed arrays. Lookups are `Record<Enum, …>`. For example, the **block registry** is `Record<BlockType, React.FC<…>>` in one `block-renderer.tsx`, and each block is its own file in a grouped folder.
- **SVG art:** port `Motif` and `Mock` as components (`<ProjectMotif kind={MotifKind.Radar} />`, `<ProjectMock kind=… screen=… />`), themed with `currentColor`. Add a `<ProjectMedia>` that accepts either a mock or a real image URL, so screenshots can replace mocks later.

## Motion: walk the YAGNI ladder

Check installed dependencies first. Prefer CSS, the Web Animations API (`element.animate`) and small rAF loops. Add a library only when the ladder fails:

- `lenis` for home smooth scroll, if native scroll feels wrong.
- `gsap` with ScrollTrigger only if the pinned "habits" section is hard natively.

Mark each such choice with `// ponytail: …`. The custom engines are small; write them as hooks in `src/hooks/` (grouped):

| Hook                      | Behaviour (numbers from the prototype)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `use-horizontal-scroller` | Wheel/trackpad delta becomes horizontal movement, lerp 0.085. Parallax via `data-speed`: offset = (panelLeft − x) × (1 − speed) × 0.35. End resistance: `pull += d * max(.12, .5*(1-.55*pull/th))`, threshold 420px, decays ×0.9 per frame after 160ms idle. The next title fills left→right with `clip-path`. Crossing the threshold navigates to the next project, looping with modulo. Keyboard: arrows, PageUp/PageDown, Space and Esc. Touch: native scroll-snap.                                                                                                                                                                                                               |
| `use-page-transition`     | Wraps route changes; the router's view transitions or a transition outlet are both fine. The incoming page slides up at full width with `transform-origin: bottom center`. It starts at `perspective(1600px) rotateX(26deg)`, so its top reads about 80% wide, then flattens to 0°. Rounded top corners (36px) square off with the tilt. Movement curve `cubic-bezier(.5,0,.04,1)`; tilt curve `cubic-bezier(.3,0,.08,1)` starting 5% later; total 0.95s. The prototype bakes these into 26 linear keyframes (`pgEnter`/`pgLeave` in Main.dc.html), so you can copy them. The outgoing page moves to −14vh, brightness .34, blur 4px. No scaling. With reduced motion: instant swap. |
| `use-sticky-cursor`       | Desktop only. A dot plus ring with `mix-blend-mode: difference`. Over a `data-cursor` label the ring grows to 88px filled, showing the translated label. Over other links and buttons up to 900×240 the ring wraps the element: its size plus 14px, radius plus 7px, lerp 0.2, and the dot hides. Magnetic pull is 0.28/0.38 of the offset.                                                                                                                                                                                                                                                                                                                                          |
| `use-pan-wall`            | About Explore wall. Pointer drag, wheel and touch pan, with inertia ×0.93 and rubber-band edges at 30% of the viewport. Per tile, distance d from the viewport centre (normalised by 0.62 × the longer side) sets: scale 1 − 0.2×clamp(d − .3), opacity clamp(1.5 − 1.05d), and a 7% pull toward the centre. Tiles ripple in from the hero on load. A click after a drag of more than 6px is ignored. Includes a minimap and a recenter control.                                                                                                                                                                                                                                     |
| `use-bubble-physics`      | Toolkit section. Circles with gravity .55, wall and floor bounce, pairwise collision, drag and throw, and "Shake".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

All motion animates only `transform`, `opacity` and `clip-path`, one rAF per engine, and never reads layout in hot loops without caching.

## Screens (match the prototype's current copy and order)

- **Global:**
    - **Preloader:** 000→100 counter (1.7s) that wipes up; hero animations wait for it.
    - **Nav pill:** MENU · W—SIEFERT · About · Notes · Get in touch; hidden on project pages.
    - **Menu:** big numbered page links (hovering one dims the others), a live preview card, a project list, section chips, contacts and a terminal shortcut.
    - **Terminal commands:** `help, whoami, ls [projects|posts], open, read, cat about, skills, about, blog, home, contact, date, clear, exit` and `sudo hire william`.
- **Home sections:**
    1. Hero: "Quiet code **behind** loud products.", a fanned card deck that tilts in 3D, and the tags @always-on, @game-ready, @zero-drama.
    2. Velocity marquee.
    3. Hello: word reveal plus count-up stats.
    4. Spotlight reveal.
    5. Index: filters and a floating preview.
    6. "How a tap becomes a thing": a flow diagram with moving packets and hover-to-trace.
    7. Pinned horizontal "Five habits".
    8. Timeline ruler.
    9. Toolkit bubbles.
    10. Notes teaser.
    11. "Say hello.", with variable font weight following the cursor distance.
- **Project page:** block renderer, top bar (Close returns to the referrer; JSON sheet; rolling counter; prev/next), and the end-cap resistance.
- **About Explore:** the 27-tile wall. The layout table is `L` in `About.dc.html`: a 10×7 grid with unit 200/176/148 px and gap 8% of the unit. **About Resume:** one white sheet; Print outputs only the sheet via a print stylesheet.
- **Notes:** a featured post, a staggered grid and tag filters. A post has a sticky progress bar and blocks (paragraph, heading, list, code with line numbers, quote, callout) plus a "next note" footer.

## Done means

- `bun run check`, `bun run lint:tw` (prints "Tailwind classes are canonical.") and `bun run lint:style` (prints "Code style is clean.") all pass; then `bun run pretty`.
- `graphify update .`, and MEMORY.md updated as its "How to update" section says.
- Every async state seen in the browser. Mobile and reduced-motion passes are done. No commits.

## Milestones (one plan file each)

1. Types, enums, mock fixtures from ME.md, query hooks, tokens, `ProjectMotif`/`ProjectMock`.
2. Shell: routes, nav, menu, preloader, cursor, page transition.
3. Home.
4. Project page, block renderer and horizontal scroller.
5. About (explore and resume routes) and Notes.
6. Terminal, mobile, reduced motion, performance and the final check.

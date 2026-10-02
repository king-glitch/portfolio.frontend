# 04 — Milestone 3: Home

Status: not started. Depends on: plans `02`, `03`. Overview refs: §3, §4.4, §5 (engines), §7 (i18n `home.*`).

Everything is read through `useProjects`, `useProfile`, `usePosts`. Route `routes/index.tsx` is the page; each section is its own component folder under `routes/components/home/<section>/` (≤ 6 files per folder). `?filter=` is validated with zod (overview §2).

## Screens and parts (all in `design/Main.dc.html`)

| #   | Section                   | Prototype source                                                                                                                                                                                                                                     | Component(s) (`routes/components/home/…`)                                                             | Engine                                                                                    |
| --- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Hero                      | `<section id="top">` line 171; hero words animate after loader; fan `setFan` (card deck, `fanin` 1.4s `cubic-bezier(.16,1,.3,1)`, line 28); tags `@always-on`, `@game-ready`, `@zero-drama` (lines 205–207, float animation, rotations −12°/−4°/10°) | `hero/hero.tsx`, `hero-title.tsx`, `hero-fan.tsx`, `hero-fan-card.tsx`, `hero-tags.tsx`               | `use-fan-tilt` (`rotateY(tiltX*10) rotateX(−tiltY*6)`, lerp 0.06, vw ≥ 760 and not touch) |
| 2   | Velocity marquee          | line 215 (`mItems` line 1325: "Make it work / fast / fair / last / fun / Then ship it", doubled, alternating outline)                                                                                                                                | `marquee/marquee.tsx`, `marquee-item.tsx`                                                             | `use-velocity-marquee` (base 1.1px/frame + `min(40,                                       | vel | )*0.6`; skew ≤ ±12°) |
| 3   | Hello                     | `<section id="about">` line 224; `aboutWords` (word reveal), `stats` line 1290                                                                                                                                                                       | `hello/hello.tsx`, `hello-words.tsx`, `hello-stat.tsx`                                                | `use-word-reveal`, `use-count-up` (1600ms, ease-out quart)                                |
| 4   | Spotlight                 | line 242 (`data-cursor="Look closer"`, `aria-label="What you see, and what I see"`)                                                                                                                                                                  | `spotlight/spotlight.tsx`, `spotlight-layer.tsx`                                                      | `use-spotlight` (radius ≤ 240 or 22% width, lerp 0.12/0.2; tap toggles to full)           |
| 5   | Index                     | `<section id="work">` line 255; filters line 1242; floating preview line 411                                                                                                                                                                         | `index/project-index.tsx`, `project-index-row.tsx`, `project-index-skeleton.tsx`, `index-filters.tsx` | preview follow (lerp 0.14, rotate ≤ ±8°)                                                  |
| 6   | How a tap becomes a thing | `<!-- THE USUAL STACK -->` line 278; `ARCH` line 1311 (6 stops, keyword matching)                                                                                                                                                                    | `stack/stack-flow.tsx`, `stack-stop.tsx`, `stack-link.tsx`, `stack-used-in.tsx`, `stack-stops.ts`     | moving packets: CSS keyframes on `transform` only; hover/focus/click = select stop        |
| 7   | Five habits (pinned)      | `<section id="process">` line 305; `core` from `Profile.core`; pin logic `measure()` line 1005 + `tick()`                                                                                                                                            | `habits/habits.tsx`, `habit-card.tsx`, `habits-skeleton.tsx`                                          | `use-pinned-track` (`sticky` stage; outer height = `innerHeight + extra`; only vw ≥ 760)  |
| 8   | Timeline ruler            | `<section id="timeline">` line 325; `entries/ticks/tl` line 1296+                                                                                                                                                                                    | `timeline/timeline.tsx`, `timeline-bar.tsx`, `timeline-detail.tsx`, `timeline-skeleton.tsx`           | none (pure CSS positions)                                                                 |
| 9   | Toolkit bubbles           | `<section id="skills">` line 348; `balls` line 1305; physics `dropBalls/stepBalls` lines 1073–1103                                                                                                                                                   | `toolkit/toolkit.tsx`, `toolkit-bubble.tsx`, `toolkit-skeleton.tsx`                                   | `use-bubble-physics`                                                                      |
| 10  | Notes teaser              | `<!-- NOTES TEASER -->` line 359 (3 posts, `ProjectMotif`)                                                                                                                                                                                           | `notes/notes-teaser.tsx` (+ shared `PostCard`)                                                        | none                                                                                      |
| 11  | Say hello.                | `<section id="contact">` line 376; letters `data-vw`                                                                                                                                                                                                 | `contact/contact.tsx`, `contact-letters.tsx` (+ shared `ContactLinks`)                                | `use-letter-weight` (weight 900 → 200 over 360px)                                         |

Section eyebrows `(01) Hello` … `(09) Contact` use `SectionLabel` + `use-scramble`. Display sizes are `clamp()` values from the prototype (e.g. hero `h1`, index `h2`, contact `clamp(72px, 17vw, 300px)`, weight 800, tracking −0.06em); each lives in a `cva` variant of a `common/typography/display-heading.tsx` (add; used ≥ 2 times), not as call-site class strings.

Stats (Hello) are derived at render: projects count, languages count (`Profile.skills[0].items.length`), years in production (`now − X10 start`), and the literal `4k+` from ME.md (Estic AI). No invented numbers.

## Files (exact paths)

Create: `src/routes/index.tsx` (rewritten), `src/routes/components/home/**` (list above), `src/components/common/typography/{display-heading,section-label}.tsx`, `src/components/shared/projects/project-preview-card.tsx` (from plan 03), `src/components/shared/posts/{post-card,post-card-skeleton}.tsx`, `src/hooks/scroll/{use-velocity-marquee,use-word-reveal,use-pinned-track}.ts`, `src/hooks/pointer/{use-fan-tilt,use-spotlight,use-letter-weight}.ts`, `src/hooks/motion/use-count-up.ts`, `src/hooks/physics/use-bubble-physics.ts`, `src/lib/motion/{marquee,reveal,spotlight,physics,pin}.ts` (+ tests for `physics`, `reveal`, `pin`), `src/lib/portfolio/stack-stops.ts`, `src/lib/portfolio/timeline.ts` (+ test), `src/types/home.ts` (`StackStop`), `src/components/ui/toggle-group.tsx` if not added earlier.

Change: `src/config.ts` (`home.*`: marquee speed, count-up ms, spotlight max radius, fan tilt, physics constants), `src/locales/en.json` (`home.*`), `src/main.css`.

## Steps

1. **Page skeleton + sections as empty stubs** with ids `top, about, work, stack, process, timeline, skills, notes, contact`; nav "Get in touch" and hero arrow scroll to them. Check: anchors scroll; no layout shift.
2. **Hero.** Words stagger (`0.1 + i*0.08s`, `0.44 + i*0.08s`) starting only when `preloader.loaded`; `behind` in outlined/inverted treatment; fan deck of `ProjectPreviewCard`s (`fanin` 1.4s); tags floating. `use-fan-tilt`. Check: nothing animates under the preloader; tilt follows cursor on desktop.
3. **Marquee.** Doubled list, wrap at half width; scroll velocity speeds it and reverses on scroll-up. Check: continuous seamless loop; skew within ±12°.
4. **Hello.** Word reveal + stats count-up. Check: words fade 0.16 → 1 progressively; counts finish in 1.6s once.
5. **Spotlight.** Cursor circle reveals the second layer; tap toggles full reveal on touch. Check: radius ≤ 240.
6. **Index.** `ToggleGroup` filter bound to `?filter=` (back button restores); rows link to `workPath(id)` with `viewTransition`; floating preview follows cursor on row hover (desktop). States per below.
7. **Stack flow.** 6 stops from `stack-stops.ts`; selecting shows "used in" projects (keyword match against `ProjectSummary.stack`); packets animate along links with CSS; hover-to-trace dims unrelated stops. Check: keyboard focus selects (same as hover).
8. **Habits pin.** Native `sticky`; no `overflow-x: hidden` on ancestors (use `clip`). Below 760px the pin is disabled and cards stack vertically (as prototype `pin.style.height = ''`). Check: no jank, sticky releases exactly at track end, "Timeline ↓" link scrolls on.
9. **Timeline.** Bars positioned by `(a − minY)/span`; selected bar inverts; detail below. Years derived from `Experience.start/end` via `lib/portfolio/timeline.ts`.
10. **Toolkit.** Bubbles drop when the section is 80% in view; drag/throw; "Shake the box". Group → style: group 0 solid inverted, 1 outlined, 2 muted, 3 ringed.
11. **Notes teaser** (3 newest) with `PostCard`.
12. **Contact.** Letter weight engine; `ContactLinks` placeholders; "open the terminal" button; back-to-top. Check at the end of scroll.
13. Skeletons for each query consumer, check each state in the browser (throttle latency via `config.mock.latencyMs`; force error). Update MEMORY.md.

## States (every query consumer)

| Consumer             | Hook          | Loading (same box)                                              | Error                               | Empty                                                        | Success       |
| -------------------- | ------------- | --------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------ | ------------- |
| Hero fan             | `useProjects` | 6 grey card shapes in the fan positions                         | `QueryErrorAlert` replaces fan area | `QueryEmpty`                                                 | cards         |
| Hello (stats, words) | `useProfile`  | text block lines + 4 stat boxes                                 | alert + retry                       | n/a (about empty ⇒ `QueryEmpty`)                             | words + stats |
| Index                | `useProjects` | 6 rows × row height                                             | alert + retry                       | `QueryEmpty` ("no projects match this filter" when filtered) | rows          |
| Stack "used in"      | `useProjects` | 3 chip skeletons                                                | alert                               | none shown                                                   | chips         |
| Habits               | `useProfile`  | 5 card skeletons (pin height = same as loaded)                  | alert                               | `QueryEmpty`                                                 | cards         |
| Timeline             | `useProfile`  | ruler + 3 bar skeletons + detail                                | alert                               | `QueryEmpty`                                                 | bars          |
| Toolkit              | `useProfile`  | bubble-sized skeleton circles in a grid (no physics until data) | alert                               | `QueryEmpty`                                                 | bubbles       |
| Notes teaser         | `usePosts`    | 3 `PostCardSkeleton`                                            | alert                               | `QueryEmpty`                                                 | cards         |
| Contact              | `useProfile`  | link-pill skeletons                                             | alert (links stay as placeholders)  | placeholders                                                 | links         |

Mutations: none. Pinned/physics sections must not start engines until `success`.

## Acceptance checks

1440×900:

- Hero: tilt max ≈ ±5° Y / ±3° X (`tilt*10`, `tilt*6` with tilt ∈ ±0.5); words in after preloader; fan visible without scroll.
- Marquee: base ≈ 1.1px/frame; skew never exceeds 12°.
- Count-up total 1600ms; word reveal ramp 0.16 → 1.
- Spotlight radius ≤ min(240, 0.22·width).
- Index filter count badges match: All 6, Games ≥ 4, On-chain 5 (verify against fixtures), URL updates `?filter=on-chain`; reload keeps it; invalid value falls back to All.
- Habits: scroll distance = `innerHeight + (trackScrollWidth − innerWidth)`; pinned stage never scrolls vertically while sliding.
- Toolkit physics: gravity .55 visible; floor bounce loses energy; no overlap after 2s; throw works; "Shake" re-drops.
- Contact letters: weight 900 at cursor, ~200 at ≥ 360px.

390×844:

- No horizontal page scroll; fan deck stacks/swipes; habits stack vertically; marquee still runs; toolkit bubbles fit width, touch-drag works without scrolling the page while dragging; contact title fits (`17vw`).
- Filter chips scroll horizontally if needed (`overflow-x: auto`, no wrap overflow).

Reduced motion:

- Hero words and fan visible immediately; marquee static; no tilt; words fully visible; stats show final numbers; spotlight toggles by tap/click only; habits stack vertically (no pin); toolkit static grid; letters fixed weight; scramble off.

Keyboard only:

- Filters, rows, stack stops, timeline bars, "Shake", contact links, terminal button reachable in DOM order; stack and timeline respond to `focus` the same as hover; spotlight reachable (`Enter` toggles); no keyboard traps in the pinned section.

## Done gate

`bun run check` · `bun run lint:tw` · `bun run lint:style` · `bun run pretty` · `graphify update .` · MEMORY.md updated. No commits.

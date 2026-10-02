# 07 — Milestone 6: terminal, mobile, reduced motion, performance, final checks

Status: not started. Depends on: plans `02`–`06`. Overview refs: §5 (`use-terminal`), §7 (`shell.terminal.*`), §11 (risks).

## Screens and parts

| Part            | Prototype source (`design/Main.dc.html`)                                                                                                                                                                                                                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Terminal window | `<!-- TERMINAL -->` line 694: `role="dialog" aria-label="Terminal"`, title bar (3 dots, `william@x10 — ~/portfolio`, `esc` close), output, input row `❯`, placeholder `type help`, `autoComplete=off`, `spellCheck=false`                                                                                                               |
| Commands        | `termRun()` line 942: `help, whoami, ls [projects\|posts], open <n\|name>, read <n>, cat about, skills, about, blog, home, contact, date, clear, exit`, easter egg `sudo hire william`; output opacity 1 / .85 / .8 / .7 / .6 / .5; command echo bold `❯ <cmd>`; keeps last 160 lines; navigates 450ms after a nav command, then closes |
| Terminal launch | fixed bottom-left button (line 696), menu shortcut, contact section link                                                                                                                                                                                                                                                                |
| Mobile rules    | `.mob-1`, `.mob-scroll`, `.mob-hide` classes in the prototype `<style>` (lines ~15–100)                                                                                                                                                                                                                                                 |
| Reduced motion  | `reduce` branch in `componentDidMount` (line 1045) and `prefers-reduced-motion` handling across the file                                                                                                                                                                                                                                |

## Files (exact paths)

Create: `src/components/shared/terminal/{terminal-dialog,terminal-line,terminal-input,terminal-titlebar}.tsx`, `src/hooks/terminal/use-terminal.ts`, `src/lib/terminal/commands.ts` + `commands.test.ts` (pure: `run(raw, ctx) → { lines: {text, opacity, weight}[]; nav?: TerminalNav; clear?: boolean; exit?: boolean }`), `src/types/terminal.ts` (`TerminalCommand`, `TerminalLine`, `TerminalNav`), `docs/perf-notes.md` (measurements, optional).
Change: `src/routes/layout.tsx` (mount dialog), `src/locales/en.json` (`shell.terminal.*`), `src/config.ts` (`terminal.maxLines` 160, `terminal.navDelayMs` 450), engine hooks for any perf/reduced-motion fixes found.

## Steps

1. **Pure command engine.** Port `termRun` to `lib/terminal/commands.ts`; all copy via keys (`shell.terminal.*`), data (names, titles, skills, about) from `useProjects`/`usePosts`/`useProfile`. `open <n|name>` matches 1-based index or case-insensitive substring of `name`; `read <n>` 1-based on posts; navigation uses `workPath`/`notePath`/`config.routes`. Check: `bun test src/lib/terminal` covers every command, unknown command (`command not found: x — try help`), `ls foo`, `open` miss, `read` out of range, `cat` variants, `sudo` hit and miss, `clear`, `exit`.
2. **Dialog.** `ui/dialog` positioned bottom-left via `className` (layout only; variant in a wrapper). Input is a plain `InputGroup` (not a form) with local state; Enter runs; output auto-scrolls; focus goes to the input on open. Overlay lifecycle: lines, input text and history reset in `onOpenChangeComplete(false)` (a conscious deviation: output does not persist between opens). Check: open via button, menu, contact link, and `` ` `` is not bound (no global hotkey).
3. **Data in the terminal.** While queries load the commands that need data print `shell.terminal.messages.loading`; on error print `shell.terminal.messages.error` (no skeleton in a text UI, documented exception).
4. **Mobile pass.** Walk every route at 390×844 and 360×740 against the list below; fix with Tailwind responsive utilities and wrapper variants, never call-site strings. Specifically: nav pill width, menu dialog scroll, hero fan, habits stack, toolkit touch, project page snap, wall touch, resume single column, notes grid, terminal full-width with `visualViewport` so the keyboard does not cover the input.
5. **Reduced-motion pass.** `prefers-reduced-motion: reduce` flipped in devtools: every engine honours its overview §5 "Reduced motion" cell; CSS keyframes (page transition, fan-in, tags float, marquee, packets) wrapped in `motion-safe:` or a `prefers-reduced-motion` media query; nothing flashes. Also respects a runtime change (no reload needed) via `use-reduced-motion`.
6. **Performance pass.** Chrome performance panel on Home and a project page: no layout thrash in rAF loops (only `transform`/`opacity`/`clip-path` writes; rect reads cached); long tasks < 50ms; engines idle when off-screen or tab hidden (`visibilitychange`); cursor `mix-blend-mode` cost checked; Explore wall with 27 tiles at 60fps on a throttled 4× CPU; bundle: no new heavy deps (run `bun run build`, record sizes in `docs/perf-notes.md`); fonts: `font-display: swap` is inherited from `@fontsource-variable/inter`; images none (SVG art).
7. **A11y pass.** Landmarks (`header`, `nav`, `main`), one `h1` per route, `aria-label` translations, focus order, focus return after dialogs, contrast ≥ 4.5:1 for muted text (`muted-foreground` passes per tokens), cursor labels hidden from AT (`aria-hidden`), skip link.
8. **Lighthouse-style smoke** on `/`, `/work/aads`, `/about/explore`, `/about/resume`, `/notes`, `/notes/<slug>` (accessibility ≥ 95 target; record, do not chase 100).
9. **Final sweep.** `grep` touched files for hardcoded labels in JSX and UI props (AGENTS §3); no `as` casts in search params; no string-literal unions; no `./` imports; enum lookups are `Record<…>`; every async state seen once in the browser (checklist in MEMORY.md); light theme eyeballed on each route; `build:portfolio` idempotent.
10. **MEMORY.md** final update: implementation state "complete", decisions, generated files, next actions (real screenshots, real contact values, backend).

## States (every query consumer)

- Terminal: text-only exception (step 3).
- All earlier consumers re-verified: skeleton → error (+ retry) → empty → success, on every route, at both viewports.
- Mutations: none.

## Acceptance checks

1440×900:

- Every command in the brief works; `sudo hire william` prints the password line then "Access granted…", navigates to `/#contact` after 450ms and closes; `clear` empties; `exit` / Esc / close button close; `ls` lists 6 projects (`0001…0006`, name, side) and 5 posts (`01…05`); `open 3` and `open pocket` both open Morning Moon Pocket; history capped at 160 lines.
- Cursor, transitions and engines meet the numbers in plans 03–05 (re-spot-check: transition 0.95s, tilt 26° → 0°, resistance 420px, wall inertia ×0.93).
- 60fps scroll on Home with all engines active; no long tasks > 50ms during route transition.

390×844 (and 360×740):

- No horizontal page scroll on any route; tap targets ≥ 44px; terminal usable with the on-screen keyboard; `JSON` button hidden on project page; print preview of Resume still correct.

Reduced motion:

- Whole site static-safe (see step 5); route changes instant; no looping animation remains (marquee, packets, tag float, fan-in).

Keyboard only:

- Full site operable: nav, menu, filters, project page keys, wall arrow keys, terminal (open via button/Enter, type, Enter, Esc); focus never lost or trapped.

## Done gate

`bun run check` · `bun run lint:tw` (prints `Tailwind classes are canonical.`) · `bun run lint:style` (prints `Code style is clean.`) · `bun run pretty` · `graphify update .` · MEMORY.md updated · no commits.

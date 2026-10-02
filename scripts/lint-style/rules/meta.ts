/**
 * Meta rules (plan §4.7). `parse-error` is a real per-file check.
 * `suppression-reason` / `unused-suppression` / `memory-updated` are cross-cutting
 * (need every rule's violations, or the whole changed-file set) and are actually
 * computed by the engine itself (see core.ts `applySuppressions`/`checkMemoryUpdated`).
 * They are still registered here — with a no-op check — purely so their ids are
 * typed in config.ts's `rules` overrides and they show up in `--list-rules`.
 */
import { defineFileRule, defineProjectRule, Severity } from "../core";

export const parseError = defineFileRule<Record<string, never>>({
	id: "parse-error",
	description: "A file failed to parse.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	defaults: {},
	check(file, ctx) {
		if (file.parseErrorMessage) {
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message: file.parseErrorMessage,
				hint: "Fix the syntax error so the linter (and TypeScript) can analyze this file.",
			});
		}
	},
});

export const suppressionReason = defineFileRule<Record<string, never>>({
	id: "suppression-reason",
	description: "A style-lint-ignore comment must have a `-- reason`.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: [],
	defaults: {},
	check() {
		// computed by core.ts applySuppressions
	},
});

export const unusedSuppression = defineFileRule<Record<string, never>>({
	id: "unused-suppression",
	description: "A style-lint-ignore comment that did not suppress anything.",
	docs: "AGENTS §0",
	severity: Severity.Warn,
	fixable: false,
	include: [],
	defaults: {},
	check() {
		// computed by core.ts applySuppressions
	},
});

export const memoryUpdated = defineProjectRule<Record<string, never>>({
	id: "memory-updated",
	description: "src/ changed but MEMORY.md was not, in --changed mode.",
	docs: "AGENTS §0",
	severity: Severity.Warn,
	fixable: false,
	include: [],
	defaults: {},
	check() {
		// computed by core.ts checkMemoryUpdated
	},
});

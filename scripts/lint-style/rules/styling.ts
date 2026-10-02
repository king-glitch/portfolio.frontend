/** Tailwind class-string rules — AGENTS.md §0/§1. */
import * as t from "@babel/types";
import {
	classStrings,
	defineFileRule,
	defineProjectRule,
	matchesGlob,
	Severity,
	walk,
} from "../core";

export const nativeElement = defineFileRule<Record<string, never>>({
	id: "native-element",
	description:
		"Native HTML form/interactive elements must use the matching shadcn component.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (!t.isJSXOpeningElement(node) || !t.isJSXIdentifier(node.name))
				return true;
			const replacement =
				ctx.config.styling.nativeElements[node.name.name];
			if (replacement) {
				ctx.report(file, {
					node,
					message: `<${node.name.name}> should use the shadcn ${replacement} component.`,
					hint: `Use <${replacement}/> from @/components/ui (AGENTS §0).`,
				});
			}
			return true;
		});
	},
});

function tokensOf(value: string): string[] {
	return value.split(/\s+/).filter(Boolean);
}

export const noSpaceUtilities = defineFileRule<Record<string, never>>({
	id: "no-space-utilities",
	description:
		"space-x-*/space-y-* utilities are not allowed outside shadcn primitives.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		for (const hit of classStrings(file, ctx.config)) {
			const matches = tokensOf(hit.value).filter((token) =>
				/^-?space-[xy]-/.test(token),
			);
			if (matches.length > 0) {
				ctx.report(file, {
					node: hit.node,
					message: `Uses ${matches.join(", ")}.`,
					hint: "Use flex/grid gap utilities instead of space-x-*/space-y-* (AGENTS §0).",
				});
			}
		}
	},
});

interface SizeToken {
	token: string;
	prefix: string;
	axis: "w" | "h";
	value: string;
}

function parseSizeToken(token: string): SizeToken | null {
	const match = /^((?:[a-z0-9-]+:)*)([wh])-(.+)$/.exec(token);
	if (!match) return null;
	const [, prefix, axis, value] = match;
	if (prefix === undefined || value === undefined) return null;
	return { token, prefix, axis: axis === "w" ? "w" : "h", value };
}

function widthHeightRewrite(value: string): string | null {
	const tokens = tokensOf(value);
	const parsed = tokens.map(parseSizeToken);
	const dropped = new Set<number>();
	const result = [...tokens];
	let changed = false;
	for (let i = 0; i < parsed.length; i++) {
		const w = parsed[i];
		if (!w || w.axis !== "w" || dropped.has(i)) continue;
		const pairIndex = parsed.findIndex(
			(h, j) =>
				!!h &&
				!dropped.has(j) &&
				h.axis === "h" &&
				h.prefix === w.prefix &&
				h.value === w.value,
		);
		if (pairIndex === -1) continue;
		result[i] = `${w.prefix}size-${w.value}`;
		dropped.add(pairIndex);
		changed = true;
	}
	if (!changed) return null;
	return result.filter((_, index) => !dropped.has(index)).join(" ");
}

export const sizeShorthand = defineFileRule<Record<string, never>>({
	id: "size-shorthand",
	description: "Matching w-N/h-N on one element should be size-N.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: true,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		for (const hit of classStrings(file, ctx.config)) {
			const rewritten = widthHeightRewrite(hit.value);
			if (!rewritten) continue;
			const node = hit.node;
			const canFix =
				t.isStringLiteral(node) &&
				typeof node.start === "number" &&
				typeof node.end === "number";
			ctx.report(file, {
				node,
				message: `"${hit.value}" should be "${rewritten}".`,
				hint: "Use size-N instead of matching w-N h-N (AGENTS §0).",
				...(canFix &&
				t.isStringLiteral(node) &&
				typeof node.start === "number" &&
				typeof node.end === "number"
					? {
							fix: {
								start: node.start + 1,
								end: node.end - 1,
								text: rewritten,
							},
						}
					: {}),
			});
		}
	},
});

const HEX_COLOR = /\[#[0-9a-fA-F]{3,8}\]/;
const FUNCTIONAL_COLOR = /\[(?:rgba?|hsla?)\(/;

export const rawColor = defineFileRule<Record<string, never>>({
	id: "raw-color",
	description: "Arbitrary color values should be theme tokens.",
	docs: "AGENTS §0",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		for (const hit of classStrings(file, ctx.config)) {
			for (const token of tokensOf(hit.value)) {
				if (HEX_COLOR.test(token) || FUNCTIONAL_COLOR.test(token)) {
					ctx.report(file, {
						node: hit.node,
						message: `"${token}" is a raw color value.`,
						hint: "Add a theme token in main.css instead (AGENTS §0).",
					});
				}
			}
		}
	},
});

/** Positional utilities only — call sites may repeat these (AGENTS §0 "className is for layout only"). */
const LAYOUT_TOKEN =
	/^(?:[a-z-]+:)*(?:flex|inline-flex|grid|block|inline-block|hidden|gap|items|justify|self|place|content|p[xytblr]?|m[xytblr]?|space|grid-cols|grid-rows|col|row|overflow|max-[hw]|min-[hw]|[wh]|size|truncate|whitespace|shrink|grow|basis|order|sticky|relative|absolute|inset|top|bottom|left|right|z)(?:-|$)/;

const isLayoutOnly = (tokens: string[]): boolean =>
	tokens.every((token) => LAYOUT_TOKEN.test(token));

export const duplicateClassString = defineProjectRule<Record<string, never>>({
	id: "duplicate-class-string",
	description:
		"The same 4+ class string repeated across files should be a shared component.",
	docs: "AGENTS §1",
	severity: Severity.Warn,
	fixable: false,
	include: [],
	defaults: {},
	check(project, ctx) {
		const bySignature = new Map<string, Set<string>>();
		for (const file of project.files) {
			if (
				!matchesGlob(file.path, ["src/**/*.tsx"]) ||
				matchesGlob(file.path, [
					"src/components/ui/**",
					"src/components/common/**",
					"src/**/*-skeleton.tsx",
				])
			)
				continue;
			for (const hit of classStrings(file, ctx.config)) {
				const tokens = tokensOf(hit.value);
				if (tokens.length < 4 || isLayoutOnly(tokens)) continue;
				const signature = [...tokens].sort().join(" ");
				const files = bySignature.get(signature) ?? new Set<string>();
				files.add(file.path);
				bySignature.set(signature, files);
			}
		}
		for (const [signature, files] of bySignature) {
			if (files.size < 2) continue;
			const [first] = [...files].sort();
			const file = first ? project.byPath.get(first) : undefined;
			if (!file) continue;
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message: `Class string "${signature}" is repeated in ${files.size} files: ${[...files].sort().join(", ")}.`,
				hint: "Extract a shared component in src/components/common/ (AGENTS §1).",
			});
		}
	},
});

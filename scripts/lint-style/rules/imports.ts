/** Import and composition rules — AGENTS.md §0. */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import * as t from "@babel/types";
import {
	defineFileRule,
	matchesGlob,
	resolveImport,
	Severity,
	walk,
	type ProjectConfig,
} from "../core";

function toAliasSpecifier(
	resolvedPath: string,
	config: ProjectConfig,
): string | null {
	if (!resolvedPath.startsWith(config.alias.target)) return null;
	let withoutTarget = resolvedPath.slice(config.alias.target.length);
	withoutTarget = withoutTarget
		.replace(/\/index\.tsx?$/, "")
		.replace(/\.tsx?$/, "");
	return `${config.alias.prefix}${withoutTarget}`;
}

function sourceOf(
	stmt: t.Node,
): { source: t.StringLiteral; node: t.Node } | null {
	if (t.isImportDeclaration(stmt)) return { source: stmt.source, node: stmt };
	if (t.isExportNamedDeclaration(stmt) && stmt.source)
		return { source: stmt.source, node: stmt };
	return null;
}

const RELATIVE_SPEC = /(?:from|import)\s*["'](\.{1,2}\/[^"']+)["']/g;

/**
 * Modules evaluated by the React Router config loader: the routes manifest and
 * everything it reaches through relative imports. That loader runs without the
 * Vite alias, so these files cannot use `@/` and must import relatively.
 */
function routerConfigModules(config: ProjectConfig): Set<string> {
	const seen = new Set<string>();
	const queue = [config.routes.manifest];
	while (queue.length) {
		const path = queue.pop();
		if (!path || seen.has(path)) continue;
		const abs = join(config.root, path);
		if (!existsSync(abs)) continue;
		seen.add(path);
		for (const [, spec] of readFileSync(abs, "utf8").matchAll(
			RELATIVE_SPEC,
		)) {
			const resolved = spec ? resolveImport(path, spec, config) : null;
			if (resolved) queue.push(resolved);
		}
	}
	return seen;
}

export const noRelativeImport = defineFileRule<Record<string, never>>({
	id: "no-relative-import",
	description: "Imports must use the `@/…` alias, never `./` or `../`.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: true,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		if (routerConfigModules(ctx.config).has(file.path)) return;
		for (const stmt of file.ast.program.body) {
			const found = sourceOf(stmt);
			if (!found) continue;
			const spec = found.source.value;
			if (!spec.startsWith(".")) continue;
			if (matchesGlob(spec, ctx.config.allowRelativeImports)) continue;
			const resolved = resolveImport(file.path, spec, ctx.config);
			const alias = resolved
				? toAliasSpecifier(resolved, ctx.config)
				: null;
			ctx.report(file, {
				node: found.source,
				message: `Relative import "${spec}" — use the @/ alias.`,
				hint: alias
					? `Import from "${alias}" instead (AGENTS §0).`
					: "Import via the @/ alias instead (AGENTS §0).",
				...(alias
					? {
							fix: {
								start: found.source.start ?? 0,
								end: found.source.end ?? 0,
								text: `"${alias}"`,
							},
						}
					: {}),
			});
		}
	},
});

export const bannedImport = defineFileRule<Record<string, never>>({
	id: "banned-import",
	description: "Import source is banned in favor of the project's UI base.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		const patterns = Object.keys(ctx.config.bannedImports);
		for (const stmt of file.ast.program.body) {
			const found = sourceOf(stmt);
			if (!found) continue;
			const match = patterns.find((pattern) =>
				matchesGlob(found.source.value, [pattern]),
			);
			if (!match) continue;
			ctx.report(file, {
				node: found.source,
				message: `"${found.source.value}" is a banned import.`,
				hint: `Use ${ctx.config.bannedImports[match]} instead (AGENTS §0).`,
			});
		}
	},
});

export const noAsChild = defineFileRule<Record<string, never>>({
	id: "no-as-child",
	description: "Base UI components take `render`, not `asChild`.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (
				t.isJSXAttribute(node) &&
				t.isJSXIdentifier(node.name) &&
				node.name.name === "asChild"
			) {
				ctx.report(file, {
					node,
					message: "`asChild` is not used in this project.",
					hint: "Use `render` instead (Base UI, AGENTS §0).",
				});
			}
			return true;
		});
	},
});

export const rawAdminTable = defineFileRule<Record<string, never>>({
	id: "raw-admin-table",
	description:
		"Administrations pages render tables with AdminDataTable, not raw shadcn Table.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/routes/administrations/**/*.tsx"],
	exclude: ["src/routes/administrations/components/admin/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		for (const stmt of file.ast.program.body) {
			const found = sourceOf(stmt);
			if (found?.source.value !== "@/components/ui/table") continue;
			ctx.report(file, {
				node: found.source,
				message:
					"Raw shadcn `Table` import in an administrations page.",
				hint: "Use AdminDataTable from routes/administrations/components/admin/admin-data-table (AGENTS §0).",
			});
		}
	},
});

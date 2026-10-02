/** File naming, placement and route-tree rules — AGENTS.md §1/§2. */
import * as t from "@babel/types";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import {
	defineFileRule,
	defineProjectRule,
	isKebabCase,
	matchesGlob,
	pascalCase,
	Severity,
	walk,
	type SourceFile,
} from "../core";
import { findComponents } from "./components";

function basename(path: string): string {
	return path.split("/").pop() ?? path;
}

function stripKnownSuffix(name: string): string {
	return name.replace(/\.(test-d\.ts|test\.tsx?|d\.ts|tsx?|json)$/, "");
}

export const fileKebabCase = defineFileRule<Record<string, never>>({
	id: "file-kebab-case",
	description: "File and directory names must be kebab-case.",
	docs: "AGENTS §2",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		const segments = file.path.split("/");
		const name = segments[segments.length - 1] ?? file.path;
		const stem = stripKnownSuffix(name);
		if (!isKebabCase(stem)) {
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message: `"${name}" is not kebab-case.`,
				hint: "Rename the file to kebab-case (AGENTS §2).",
			});
		}
		for (const dir of segments.slice(1, -1)) {
			if (dir.startsWith(":")) continue;
			const unbracketed =
				dir.startsWith("[") && dir.endsWith("]")
					? dir.slice(1, -1)
					: dir;
			if (!isKebabCase(unbracketed)) {
				ctx.report(file, {
					at: { line: 1, column: 1 },
					message: `Directory "${dir}" is not kebab-case.`,
					hint: "Rename the directory to kebab-case (AGENTS §2).",
				});
			}
		}
	},
});

export const componentNameMatchesFile = defineFileRule<Record<string, never>>({
	id: "component-name-matches-file",
	description:
		"A non-route component file must export a component named after the file.",
	docs: "AGENTS §2",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	// A context file (context + provider + consumer hook, one per file per context-location)
	// is named after the concept, not any single exported component (e.g. the provider).
	check(file, ctx) {
		if (matchesGlob(file.path, [`${ctx.config.routes.dir}/**`])) return;
		if (file.path.startsWith(`${ctx.config.contextsDir}/`)) return;
		const components = findComponents(file);
		if (components.length === 0) return;
		const expected = pascalCase(stripKnownSuffix(basename(file.path)));
		if (!components.some((c) => c.name === expected)) {
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message: `No component named ${expected} in this file.`,
				hint: `Name the component ${expected} to match the file (AGENTS §2).`,
			});
		}
	},
});

export const routeFileNaming = defineFileRule<Record<string, never>>({
	id: "route-file-naming",
	description:
		"Route files must be index.tsx/layout.tsx or live in a component directory.",
	docs: "AGENTS §1",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	defaults: {},
	check(file, ctx) {
		if (!matchesGlob(file.path, [`${ctx.config.routes.dir}/**`])) return;
		const name = basename(file.path);
		if (ctx.config.routes.pageFiles.includes(name)) return;
		const segments = file.path.split("/");
		if (
			segments.some((segment) =>
				ctx.config.routes.componentDirs.includes(segment),
			)
		)
			return;
		ctx.report(file, {
			at: { line: 1, column: 1 },
			message: `"${file.path}" is not index.tsx/layout.tsx nor inside a component directory.`,
			hint: `Route files must be named ${ctx.config.routes.pageFiles.join("/")} or live under components/ (AGENTS §1).`,
		});
	},
});

export const noLayoutsDir = defineFileRule<Record<string, never>>({
	id: "no-layouts-dir",
	description: "There must be no top-level routes/layouts/ folder.",
	docs: "AGENTS §1",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*"],
	defaults: {},
	check(file, ctx) {
		if (matchesGlob(file.path, [`${ctx.config.routes.dir}/layouts/**`])) {
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message:
					"Layouts must be colocated as routes/<path>/layout.tsx, not in a layouts/ folder.",
				hint: "Move this file next to the route it lays out (AGENTS §1).",
			});
		}
	},
});

export const noClassConstantFile = defineFileRule<Record<string, never>>({
	id: "no-class-constant-file",
	description: "No `*-classes.ts(x)` files.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*-classes.{ts,tsx}"],
	defaults: {},
	check(file, ctx) {
		ctx.report(file, {
			at: { line: 1, column: 1 },
			message: "Class-constant files are not allowed.",
			hint: "Move classes into theme tokens, a cva variant, or a common/ wrapper component (AGENTS §0).",
		});
	},
});

export const noMicroTypesFile = defineFileRule<Record<string, never>>({
	id: "no-micro-types-file",
	description: "No micro types.ts files under components/.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/components/**/types.ts"],
	defaults: {},
	check(file, ctx) {
		ctx.report(file, {
			at: { line: 1, column: 1 },
			message: "Micro types.ts files under components/ are not allowed.",
			hint: "Declare shared types in src/api/types/, or inline view-scoped types in the owning component (AGENTS §0).",
		});
	},
});

function iconImportNames(file: SourceFile): Set<string> {
	const names = new Set<string>();
	if (!file.ast) return names;
	for (const stmt of file.ast.program.body) {
		if (
			t.isImportDeclaration(stmt) &&
			(stmt.source.value === "lucide-react" ||
				stmt.source.value.startsWith("react-icons/"))
		) {
			for (const spec of stmt.specifiers) names.add(spec.local.name);
		}
	}
	return names;
}

export const noIconDictionary = defineFileRule<Record<string, never>>({
	id: "no-icon-dictionary",
	description: "No standalone icon lookup dictionaries.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	// Only an EXPORTED dictionary is flagged: a file-private lookup used only inside the
	// file's own <XIcon/> component (the prescribed pattern) is not a "standalone" dictionary.
	check(file, ctx) {
		if (!file.ast) return;
		const icons = iconImportNames(file);
		if (icons.size === 0) return;
		for (const stmt of file.ast.program.body) {
			if (
				!t.isExportNamedDeclaration(stmt) ||
				!stmt.declaration ||
				!t.isVariableDeclaration(stmt.declaration)
			)
				continue;
			const declarations = stmt.declaration.declarations;
			for (const decl of declarations) {
				if (!t.isObjectExpression(decl.init)) continue;
				const values = decl.init.properties.filter(
					(p): p is t.ObjectProperty => t.isObjectProperty(p),
				);
				if (values.length === 0) continue;
				if (
					values.every(
						(prop) =>
							t.isIdentifier(prop.value) &&
							icons.has(prop.value.name),
					)
				) {
					ctx.report(file, {
						node: decl,
						message: "This object maps keys to icon components.",
						hint: "Encapsulate icon lookup inside a dedicated <XIcon/> component instead (AGENTS §0).",
					});
				}
			}
		}
	},
});

export const skeletonColocated = defineFileRule<Record<string, never>>({
	id: "skeleton-colocated",
	description:
		"A <name>-skeleton.tsx must have a sibling <name>.tsx or index.tsx.",
	docs: "AGENTS §0",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/**/*-skeleton.tsx"],
	// common/skeletons/ is a shared bucket of generic primitives (like common/badges), not
	// components paired 1:1 with one owner.
	exclude: ["src/components/common/**"],
	defaults: {},
	// A skeleton inside a routes/<view>/components/ dir pairs with the OWNING route's
	// index.tsx/layout.tsx one directory up, not a same-directory sibling.
	check(file, ctx) {
		const name = basename(file.path);
		const stem = name.replace(/-skeleton\.tsx$/, "");
		const dir = dirname(file.absPath);
		// Group folders nest inside components/: the owning route is the parent of the nearest `components` ancestor.
		let componentsDir = dir;
		while (
			basename(componentsDir) !== "components" &&
			dirname(componentsDir) !== componentsDir
		)
			componentsDir = dirname(componentsDir);
		const parentDir =
			basename(componentsDir) === "components"
				? dirname(componentsDir)
				: null;
		const hasSibling =
			existsSync(join(dir, `${stem}.tsx`)) ||
			existsSync(join(dir, "index.tsx")) ||
			(parentDir !== null &&
				(existsSync(join(parentDir, "index.tsx")) ||
					existsSync(join(parentDir, "layout.tsx"))));
		if (!hasSibling) {
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message: `No sibling ${stem}.tsx or index.tsx next to ${name}.`,
				hint: "Skeletons live next to their component (AGENTS §0).",
			});
		}
	},
});

export const routeRegistered = defineProjectRule<Record<string, never>>({
	id: "route-registered",
	description:
		"Every route page/layout must be registered in the route manifest.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: [],
	defaults: {},
	check(project, ctx) {
		const manifest = project.byPath.get(ctx.config.routes.manifest);
		if (!manifest?.ast) return;

		const registered = new Set<string>();
		walk(manifest.ast, (node) => {
			if (!t.isCallExpression(node) || !t.isIdentifier(node.callee))
				return true;
			const name = node.callee.name;
			const literal =
				name === "route"
					? node.arguments[1]
					: name === "index" || name === "layout"
						? node.arguments[0]
						: null;
			if (literal && t.isStringLiteral(literal))
				registered.add(`${ctx.config.routes.appDir}/${literal.value}`);
			return true;
		});

		for (const file of project.files) {
			if (!matchesGlob(file.path, [`${ctx.config.routes.dir}/**`]))
				continue;
			if (!ctx.config.routes.pageFiles.includes(basename(file.path)))
				continue;
			if (!registered.has(file.path)) {
				ctx.report(file, {
					at: { line: 1, column: 1 },
					message: `${file.path} is not registered in ${ctx.config.routes.manifest}.`,
					hint: "Register this route in src/routes.ts (AGENTS §1).",
				});
			}
		}
		for (const path of registered) {
			if (!project.byPath.has(path)) {
				ctx.report(manifest, {
					at: { line: 1, column: 1 },
					message: `${ctx.config.routes.manifest} references missing file ${path}.`,
					hint: "Fix the path or add the missing route file (AGENTS §1).",
				});
			}
		}
	},
});

function ownerRouteDir(path: string): string | null {
	const index = path.indexOf("/components/");
	return index === -1 ? null : path.slice(0, index);
}

export const componentPlacement = defineProjectRule<Record<string, never>>({
	id: "component-placement",
	description:
		"A routes/<X>/components/ file should be used by 2+ children of X, and never outside X.",
	docs: "AGENTS §1",
	severity: Severity.Warn,
	fixable: false,
	include: [],
	defaults: {},
	check(project, ctx) {
		for (const file of project.files) {
			if (
				!matchesGlob(file.path, [
					`${ctx.config.routes.dir}/**/components/**`,
				])
			)
				continue;
			const owner = ownerRouteDir(file.path);
			if (!owner) continue;
			const importers = project.importedBy.get(file.path) ?? [];
			if (importers.length === 0) continue;

			const outside = importers.filter(
				(importer) => !importer.startsWith(`${owner}/`),
			);
			if (outside.length > 0) {
				ctx.report(file, {
					at: { line: 1, column: 1 },
					message: `Imported from outside ${owner} (e.g. ${outside[0]}).`,
					hint: "Move this to src/components/shared/ (AGENTS §1).",
				});
				continue;
			}

			function collectConsumers(
				targetPath: string,
				visited = new Set<string>(),
			): string[] {
				if (visited.has(targetPath)) return [];
				visited.add(targetPath);
				const imps = project.importedBy.get(targetPath) ?? [];
				const result: string[] = [];
				for (const imp of imps) {
					if (imp.startsWith(`${owner}/components/`)) {
						result.push(...collectConsumers(imp, visited));
					} else {
						result.push(imp);
					}
				}
				return result;
			}

			const consumers = collectConsumers(file.path);
			const children = new Set<string>();
			let usedByOwnerDirectly = false;
			for (const importer of consumers) {
				const rest = importer.slice(owner.length + 1);
				const segment = rest.split("/")[0] ?? "";
				if (segment === "layout.tsx" || segment === "index.tsx") {
					usedByOwnerDirectly = true;
				} else if (segment && !segment.includes(".")) {
					children.add(segment);
				}
			}
			if (!usedByOwnerDirectly && children.size === 1) {
				ctx.report(file, {
					at: { line: 1, column: 1 },
					message: `Only used by ${owner}/${[...children][0]}.`,
					hint: `Move this down to ${owner}/${[...children][0]}/components/ (AGENTS §1).`,
				});
			}
		}
	},
});

export const commonReuse = defineProjectRule<Record<string, never>>({
	id: "common-reuse",
	description: "A src/components/common/ file should be reused in 2+ places.",
	docs: "AGENTS §1",
	severity: Severity.Warn,
	fixable: false,
	include: [],
	defaults: {},
	check(project, ctx) {
		for (const file of project.files) {
			if (!file.path.startsWith(`${ctx.config.components.common}/`))
				continue;
			if (/\.(test|spec)(-d)?\.[jt]sx?$/.test(file.path)) continue;
			const importers = project.importedBy.get(file.path) ?? [];
			// A private part of a composite (e.g. art/motif/motif-moon.tsx used only by art/project-motif.tsx)
			// is extracted for one-component-per-file, not for reuse: importers inside its own group count as internal.
			const group = file.path.split("/").slice(0, 4).join("/");
			const internalOnly =
				importers.length > 0 &&
				importers.every((importer) => importer.startsWith(`${group}/`));
			if (importers.length < 2 && !internalOnly) {
				ctx.report(file, {
					at: { line: 1, column: 1 },
					message: `Only ${importers.length} importer(s).`,
					hint: "common/ components should be reused 2+ places (AGENTS §1).",
				});
			}
		}
	},
});

export const contextLocation = defineFileRule<Record<string, never>>({
	id: "context-location",
	description:
		"A React context (createContext) must live under the contexts directory, one per `<name>-context.tsx` file.",
	docs: "AGENTS §1",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		const inContextsDir = file.path.startsWith(
			`${ctx.config.contextsDir}/`,
		);

		let hasCreateContext = false;
		walk(file.ast, (node) => {
			if (
				t.isCallExpression(node) &&
				t.isIdentifier(node.callee) &&
				node.callee.name === "createContext"
			) {
				hasCreateContext = true;
			}
			return true;
		});
		if (hasCreateContext && !inContextsDir) {
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message: `createContext is used outside ${ctx.config.contextsDir}.`,
				hint: `Move the context (provider + consumer hook) to ${ctx.config.contextsDir}/<name>-context.tsx (AGENTS §1).`,
			});
		}

		if (inContextsDir) {
			const name = basename(file.path);
			const stem = name.replace(/\.tsx?$/, "");
			if (!name.endsWith("-context.tsx") || !isKebabCase(stem)) {
				ctx.report(file, {
					at: { line: 1, column: 1 },
					message: `"${name}" must be kebab-case and end with -context.tsx.`,
					hint: `Rename to <name>-context.tsx (AGENTS §1).`,
				});
			}
		}
	},
});

function unitOf(fileName: string): string {
	return fileName
		.replace(/\.(test|spec)\.(ts|tsx)$/, "")
		.replace(/\.(ts|tsx)$/, "");
}

/** Words of a unit with a leading `use-` and any words repeating an ancestor folder dropped: `ops-filter-x` in `ops/filter/` -> ["x"]. */
export function unitWords(
	unit: string,
	ancestors: readonly string[],
): string[] {
	const words = unit.replace(/^use-/, "").split("-");
	while (words.length > 1 && ancestors.includes(words[0] ?? ""))
		words.shift();
	return words;
}

/**
 * A folder holds at most `structure.maxFilesPerFolder` files (a file and its test count once).
 * Past that, files that share a leading word move into a subfolder named after it:
 * `lib/admin-rules.ts`, `lib/admin-people.ts` -> `lib/admin/rules.ts`, `lib/admin/people.ts`.
 * A file named exactly like the word (`admin.ts`, `admin-skeleton.tsx`) joins that group.
 */
export const folderGrouping = defineProjectRule<Record<string, never>>({
	id: "folder-grouping",
	description:
		"A crowded folder must group files that share a leading word into subfolders.",
	docs: "AGENTS §1",
	severity: Severity.Error,
	fixable: false,
	include: [],
	defaults: {},
	check(project, ctx) {
		const { maxFilesPerFolder, exemptDirs } = ctx.config.structure;
		const byDir = new Map<string, SourceFile[]>();
		for (const file of project.files) {
			if (!file.path.startsWith("src/") || file.path.endsWith(".d.ts"))
				continue;
			const dir = file.path.slice(0, file.path.lastIndexOf("/"));
			if (exemptDirs.some((e) => dir === e || dir.startsWith(`${e}/`)))
				continue;
			(byDir.get(dir) ?? byDir.set(dir, []).get(dir)!).push(file);
		}
		for (const [dir, files] of byDir) {
			const units = new Set(files.map((f) => unitOf(basename(f.path))));
			if (units.size <= maxFilesPerFolder) continue;
			const groups = groupUnits([...units], dir.split("/"));
			if (groups.size === 0) continue;
			const first = files[0];
			if (!first) continue;
			ctx.report(first, {
				at: { line: 1, column: 1 },
				message: `${dir}/ has ${units.size} files (max ${maxFilesPerFolder}); group ${[
					...groups,
				]
					.map(([w, u]) => `${u.length}× "${w}-*" → ${w}/`)
					.join(", ")}.`,
				hint: "Move files that share a leading word into a subfolder named after it, recursively (AGENTS §1).",
			});
		}
	},
});

/** word -> units that move into `<word>/`: 2+ units whose first word is `word`, plus a unit named exactly `word`. */
export function groupUnits(
	units: readonly string[],
	ancestors: readonly string[],
): Map<string, string[]> {
	const byWord = new Map<string, string[]>();
	const solo = new Map<string, string>();
	for (const unit of units) {
		const words = unitWords(unit, ancestors);
		const [word] = words;
		if (!word) continue;
		if (words.length === 1) solo.set(word, unit);
		else (byWord.get(word) ?? byWord.set(word, []).get(word)!).push(unit);
	}
	const groups = new Map<string, string[]>();
	for (const [word, members] of byWord) {
		if (ancestors.includes(word)) continue;
		const own = solo.get(word);
		const all = own ? [own, ...members] : members;
		if (members.length >= 2 || own) groups.set(word, all);
	}
	return groups;
}

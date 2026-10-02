/** Component boilerplate rules — AGENTS.md §2. */
import * as t from "@babel/types";
import {
	defineFileRule,
	functionName,
	isPascalCase,
	matchesGlob,
	pascalCase,
	returnsJsx,
	Severity,
	walk,
	walkWithAncestors,
	type SourceFile,
} from "../core";

export interface ComponentInfo {
	name: string;
	/** node used for reporting a location (the id / function name) */
	nameNode: t.Node;
	kind: "fc" | "plain-arrow" | "function-declaration";
	fcTypeArgument: t.TSTypeParameterInstantiation | null;
	hasTypeParams: boolean;
}

function isReactFcAnnotation(
	typeAnn: t.TSType | null | undefined,
): t.TSTypeReference | null {
	if (!typeAnn || !t.isTSTypeReference(typeAnn)) return null;
	const { typeName } = typeAnn;
	if (
		t.isTSQualifiedName(typeName) &&
		t.isIdentifier(typeName.left) &&
		typeName.left.name === "React" &&
		typeName.right.name === "FC"
	) {
		return typeAnn;
	}
	if (t.isIdentifier(typeName) && typeName.name === "FC") return typeAnn;
	return null;
}

/** Components declared at any depth in the file (VariableDeclarator arrows/function-expressions and FunctionDeclarations). */
export function findComponents(file: SourceFile): ComponentInfo[] {
	if (!file.ast) return [];
	const components: ComponentInfo[] = [];
	walk(file.ast, (node) => {
		if (
			t.isVariableDeclarator(node) &&
			t.isIdentifier(node.id) &&
			isPascalCase(node.id.name)
		) {
			const init = node.init;
			if (
				!init ||
				!(
					t.isArrowFunctionExpression(init) ||
					t.isFunctionExpression(init)
				)
			)
				return true;
			const idTypeAnnotation = t.isTSTypeAnnotation(
				node.id.typeAnnotation,
			)
				? node.id.typeAnnotation.typeAnnotation
				: null;
			const fcType = isReactFcAnnotation(idTypeAnnotation);
			if (fcType) {
				components.push({
					name: node.id.name,
					nameNode: node.id,
					kind: "fc",
					// ponytail: @babel/parser 7 emits `typeParameters`, @babel/types 8 types it as `typeArguments`; both are read through a loose cast so either installed version typechecks.
					fcTypeArgument:
						(
							fcType as {
								typeArguments?: t.TSTypeParameterInstantiation;
								typeParameters?: t.TSTypeParameterInstantiation;
							}
						).typeArguments ??
						(
							fcType as {
								typeParameters?: t.TSTypeParameterInstantiation;
							}
						).typeParameters ??
						null,
					hasTypeParams: false,
				});
			} else if (returnsJsx(init)) {
				components.push({
					name: node.id.name,
					nameNode: node.id,
					kind: "plain-arrow",
					fcTypeArgument: null,
					hasTypeParams: false,
				});
			}
			return true;
		}
		if (
			t.isFunctionDeclaration(node) &&
			node.id &&
			isPascalCase(node.id.name) &&
			returnsJsx(node)
		) {
			const typeParams = t.isTSTypeParameterDeclaration(
				node.typeParameters,
			)
				? node.typeParameters.params
				: [];
			components.push({
				name: node.id.name,
				nameNode: node.id,
				kind: "function-declaration",
				fcTypeArgument: null,
				hasTypeParams: typeParams.length > 0,
			});
		}
		return true;
	});
	return components;
}

/** Names of declared `interface X` AND `type X = …` (a union-shaped Props can only be a `type`; see props-interface-not-type). */
function declaredInterfaces(file: SourceFile): Set<string> {
	const names = new Set<string>();
	if (!file.ast) return names;
	walk(file.ast, (node) => {
		if (t.isTSInterfaceDeclaration(node)) names.add(node.id.name);
		if (t.isTSTypeAliasDeclaration(node)) names.add(node.id.name);
		return true;
	});
	return names;
}

function importedNames(file: SourceFile): Set<string> {
	const names = new Set<string>();
	if (!file.ast) return names;
	for (const stmt of file.ast.program.body) {
		if (t.isImportDeclaration(stmt)) {
			for (const spec of stmt.specifiers) names.add(spec.local.name);
		}
	}
	return names;
}

export const reactImport = defineFileRule<Record<string, never>>({
	id: "react-import",
	description: "Component files that use JSX or React.* must import React.",
	docs: "AGENTS §2",
	severity: Severity.Error,
	fixable: true,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		let usesReact = false;
		let hasImport = false;
		walk(file.ast, (node) => {
			if (t.isJSXElement(node) || t.isJSXFragment(node)) usesReact = true;
			if (
				t.isMemberExpression(node) &&
				t.isIdentifier(node.object) &&
				node.object.name === "React"
			)
				usesReact = true;
			if (
				t.isTSQualifiedName(node) &&
				t.isIdentifier(node.left) &&
				node.left.name === "React"
			)
				usesReact = true;
			if (
				t.isImportDeclaration(node) &&
				node.source.value === "react" &&
				node.specifiers.some(
					(s) =>
						(t.isImportDefaultSpecifier(s) &&
							s.local.name === "React") ||
						(t.isImportNamespaceSpecifier(s) &&
							s.local.name === "React"),
				)
			) {
				hasImport = true;
			}
			return true;
		});
		if (usesReact && !hasImport) {
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message: "File uses JSX or React but does not import React.",
				hint: 'Add `import React from "react";` (AGENTS §2)',
				fix: { start: 0, end: 0, text: 'import React from "react";\n' },
			});
		}
	},
});

export const propsInterface = defineFileRule<Record<string, never>>({
	id: "props-interface",
	description:
		"Every component needs a `<Name>Props` interface, declared or imported.",
	docs: "AGENTS §2",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		const interfaces = declaredInterfaces(file);
		const imported = importedNames(file);
		for (const component of findComponents(file)) {
			const expected = `${component.name}Props`;
			if (interfaces.has(expected) || imported.has(expected)) continue;
			ctx.report(file, {
				node: component.nameNode,
				message: `${component.name} has no ${expected} interface.`,
				hint: `Declare \`interface ${expected} { … }\` (AGENTS §2)`,
			});
		}
	},
});

export const fcTypeArgument = defineFileRule<Record<string, never>>({
	id: "fc-type-argument",
	description:
		"React.FC must be typed with the component's own Props interface.",
	docs: "AGENTS §2",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		for (const component of findComponents(file)) {
			if (component.kind !== "fc") continue;
			const expected = `${component.name}Props`;
			const arg = component.fcTypeArgument?.params[0];
			if (!arg) {
				ctx.report(file, {
					node: component.nameNode,
					message: `React.FC on ${component.name} has no type argument.`,
					hint: `Use \`React.FC<${expected}>\` (AGENTS §2)`,
				});
				continue;
			}
			const name =
				t.isTSTypeReference(arg) && t.isIdentifier(arg.typeName)
					? arg.typeName.name
					: null;
			if (name !== expected) {
				ctx.report(file, {
					node: arg,
					message: `React.FC<${name ?? "…"}> on ${component.name} does not use ${expected}.`,
					hint: `Use \`React.FC<${expected}>\` (AGENTS §2)`,
				});
			}
		}
	},
});

function containsUnion(type: t.TSType): boolean {
	if (t.isTSParenthesizedType(type))
		return containsUnion(type.typeAnnotation);
	if (t.isTSUnionType(type)) return true;
	if (t.isTSIntersectionType(type)) return type.types.some(containsUnion);
	return false;
}

export const propsInterfaceNotType = defineFileRule<Record<string, never>>({
	id: "props-interface-not-type",
	description:
		"A component's Props must be declared as `interface`, not `type`.",
	docs: "AGENTS §2",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	// A Props type that is (or contains) a union can't be expressed as a plain `interface`
	// (e.g. a discriminated union of client/server table modes) — only flag object shapes.
	// An intersection (`type XProps = CommonProps & { … }`) is how shared props are composed (see component-type-export).
	check(file, ctx) {
		if (!file.ast) return;
		const componentNames = new Set(
			findComponents(file).map((c) => `${c.name}Props`),
		);
		walk(file.ast, (node) => {
			if (
				t.isTSTypeAliasDeclaration(node) &&
				componentNames.has(node.id.name) &&
				!containsUnion(node.typeAnnotation) &&
				!t.isTSIntersectionType(node.typeAnnotation)
			) {
				ctx.report(file, {
					node: node.id,
					message: `${node.id.name} is a \`type\` alias; components need an \`interface\`.`,
					hint: `Change \`type ${node.id.name} = …\` to \`interface ${node.id.name} { … }\` (AGENTS §2)`,
				});
			}
			return true;
		});
	},
});

export const componentDeclaration = defineFileRule<Record<string, never>>({
	id: "component-declaration",
	description:
		"Components must use `const Name: React.FC<NameProps> = (…) => {}`.",
	docs: "AGENTS §2",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		for (const component of findComponents(file)) {
			if (component.kind === "fc") continue;
			if (
				component.kind === "function-declaration" &&
				component.hasTypeParams
			)
				continue;
			const hint =
				component.kind === "function-declaration"
					? `Generic components may stay a \`function\`; otherwise convert to \`const ${component.name}: React.FC<${component.name}Props> = (…) => {}\` (AGENTS §2)`
					: `Annotate with \`const ${component.name}: React.FC<${component.name}Props> = (…) => {}\` (AGENTS §2)`;
			ctx.report(file, {
				node: component.nameNode,
				message: `${component.name} is not declared as \`const Name: React.FC<NameProps>\`.`,
				hint,
			});
		}
	},
});

function fileBaseName(path: string): string {
	const file = path.split("/").pop() ?? path;
	return file.replace(/\.tsx?$/, "");
}

export const defaultExportMatchesFile = defineFileRule<Record<string, never>>({
	id: "default-export-matches-file",
	description:
		"A component file's default export must be the component named after the file.",
	docs: "AGENTS §2",
	severity: Severity.Error,
	fixable: true,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	// A route's own components/ dir (like component-name-matches-file) may hold a family of
	// related primitives (e.g. AdminTable/AdminTableRow/.../AdminDataTable) — the file is named
	// after the family, not any single one of them, so it is exempt here too.
	check(file, ctx) {
		if (!file.ast) return;
		if (
			matchesGlob(file.path, [`${ctx.config.routes.dir}/**`]) &&
			file.path
				.split("/")
				.some((segment) =>
					ctx.config.routes.componentDirs.includes(segment),
				)
		) {
			return;
		}
		// A context file is named after the concept (context-location), not its provider component.
		if (file.path.startsWith(`${ctx.config.contextsDir}/`)) return;
		const components = findComponents(file);
		if (components.length === 0) return;

		const base = fileBaseName(file.path);
		const isRouteFile =
			matchesGlob(file.path, [`${ctx.config.routes.dir}/**`]) &&
			ctx.config.routes.pageFiles.includes(`${base}.tsx`);

		let defaultExportName: string | null = null;
		let hasDefaultExport = false;
		for (const stmt of file.ast.program.body) {
			if (t.isExportDefaultDeclaration(stmt)) {
				hasDefaultExport = true;
				if (t.isIdentifier(stmt.declaration))
					defaultExportName = stmt.declaration.name;
				else if (
					"id" in stmt.declaration &&
					stmt.declaration.id &&
					t.isIdentifier(stmt.declaration.id)
				) {
					defaultExportName = stmt.declaration.id.name;
				}
			}
		}

		if (!hasDefaultExport) {
			const first = components[0];
			if (!first || !file.ast.program.body.length) return;
			const lastStmt =
				file.ast.program.body[file.ast.program.body.length - 1];
			const insertAt = lastStmt?.end ?? file.code.length;
			ctx.report(file, {
				at: { line: file.ast.loc?.end.line ?? 1, column: 1 },
				message: "File has no default export.",
				hint: `Add \`export default ${first.name};\` (AGENTS §2)`,
				fix: {
					start: insertAt,
					end: insertAt,
					text: `\n\nexport default ${first.name};`,
				},
			});
			return;
		}

		if (isRouteFile) {
			if (
				defaultExportName &&
				!components.some((c) => c.name === defaultExportName)
			) {
				ctx.report(file, {
					at: { line: 1, column: 1 },
					message: `Default export ${defaultExportName} is not a component declared in this file.`,
					hint: "Route files must default-export their page component (AGENTS §1).",
				});
			}
			return;
		}

		const expected = pascalCase(base);
		if (defaultExportName !== expected) {
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message: `Default export is ${defaultExportName ?? "not a named component"}, expected ${expected}.`,
				hint: `Default-export the component named ${expected} (AGENTS §2)`,
			});
		}
	},
});

function isComponentFunction(
	fn: t.Function,
	ancestorsOfFn: readonly t.Node[],
): boolean {
	const name = functionName(fn, ancestorsOfFn);
	return !!name && isPascalCase(name) && returnsJsx(fn);
}

function findEnclosingComponentName(
	ancestors: readonly t.Node[],
): string | null {
	for (let i = ancestors.length - 1; i >= 0; i--) {
		const candidate = ancestors[i];
		if (
			candidate &&
			t.isFunction(candidate) &&
			isComponentFunction(candidate, ancestors.slice(0, i))
		) {
			return functionName(candidate, ancestors.slice(0, i));
		}
	}
	return null;
}

export const inlineComponent = defineFileRule<Record<string, never>>({
	id: "inline-component",
	description:
		"A component must not be declared inside another component's body.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walkWithAncestors(file.ast, (node, ancestors) => {
			let name: string | null = null;
			let fn: t.Function | null = null;
			if (
				t.isVariableDeclarator(node) &&
				t.isIdentifier(node.id) &&
				isPascalCase(node.id.name) &&
				node.init &&
				(t.isArrowFunctionExpression(node.init) ||
					t.isFunctionExpression(node.init)) &&
				returnsJsx(node.init)
			) {
				name = node.id.name;
				fn = node.init;
			} else if (
				t.isFunctionDeclaration(node) &&
				node.id &&
				isPascalCase(node.id.name) &&
				returnsJsx(node)
			) {
				name = node.id.name;
				fn = node;
			}
			if (!name || !fn) return;
			const outer = findEnclosingComponentName(ancestors);
			if (outer) {
				ctx.report(file, {
					node: fn,
					message: `${name} is declared inside ${outer}'s body.`,
					hint: `Hoist ${name} to module scope or its own file (AGENTS §0).`,
				});
			}
		});
	},
});

/**
 * Types, enums and interfaces are shared contracts: they live in `src/types/` (UI) or
 * `src/api/types/` (domain), never exported from a component file. The one exception is a
 * Props type that composes a shared type: `export type XProps = CommonProps & { … }`.
 */
export const componentTypeExport = defineFileRule<Record<string, never>>({
	id: "component-type-export",
	description:
		"A .tsx file must not export types/enums/interfaces; only `type XProps = Common & { … }`.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		for (const stmt of file.ast.program.body) {
			if (!t.isExportNamedDeclaration(stmt) || !stmt.declaration)
				continue;
			const decl = stmt.declaration;
			const isEnum = t.isTSEnumDeclaration(decl);
			const isInterface = t.isTSInterfaceDeclaration(decl);
			const isAlias = t.isTSTypeAliasDeclaration(decl);
			if (!isEnum && !isInterface && !isAlias) continue;
			if (
				isAlias &&
				decl.id.name.endsWith("Props") &&
				t.isTSIntersectionType(decl.typeAnnotation)
			)
				continue;
			ctx.report(file, {
				node: decl.id,
				message: `${decl.id.name} is exported from a component file.`,
				hint: `Move it to src/types/ (UI) or src/api/types/ (domain) and import it; compose props as \`type XProps = SharedProps & { … }\`. Unused elsewhere? Drop \`export\` (AGENTS §0).`,
			});
		}
	},
});

export const oneComponentPerFile = defineFileRule<Record<string, never>>({
	id: "one-component-per-file",
	description:
		"A .tsx file declares exactly one top-level component, named after the file.",
	docs: "AGENTS §2",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		const topLevel = new Set<string>();
		for (const stmt of file.ast.program.body) {
			const decl = t.isExportNamedDeclaration(stmt)
				? stmt.declaration
				: t.isExportDefaultDeclaration(stmt)
					? null
					: stmt;
			if (t.isFunctionDeclaration(decl) && decl.id)
				topLevel.add(decl.id.name);
			if (t.isVariableDeclaration(decl)) {
				for (const d of decl.declarations)
					if (t.isIdentifier(d.id)) topLevel.add(d.id.name);
			}
		}
		const components = findComponents(file).filter((c) =>
			topLevel.has(c.name),
		);
		const owner = pascalCase(
			(file.path.split("/").pop() ?? "").replace(/\.tsx$/, ""),
		);
		const primary =
			components.find((c) => c.name === owner)?.name ??
			components[components.length - 1]?.name;
		for (const extra of components.filter((c) => c.name !== primary)) {
			ctx.report(file, {
				node: extra.nameNode,
				message: `${extra.name} is a second component in this file (${primary} is the main one).`,
				hint: "Move it to its own kebab-case file next to this one (AGENTS §2).",
			});
		}
	},
});

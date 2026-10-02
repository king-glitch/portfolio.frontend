/** Config-key and magic-string rules — AGENTS.md §4. */
import * as t from "@babel/types";
import { defineFileRule, Severity, walk, type SourceFile } from "../core";

function keyName(prop: t.ObjectProperty): string | null {
	if (t.isIdentifier(prop.key)) return prop.key.name;
	if (t.isStringLiteral(prop.key)) return prop.key.value;
	return null;
}

function findConfigRoot(file: SourceFile): t.ObjectExpression | null {
	if (!file.ast) return null;
	let root: t.ObjectExpression | null = null;
	for (const stmt of file.ast.program.body) {
		if (
			!t.isExportNamedDeclaration(stmt) ||
			!stmt.declaration ||
			!t.isVariableDeclaration(stmt.declaration)
		)
			continue;
		for (const decl of stmt.declaration.declarations) {
			if (
				!t.isIdentifier(decl.id) ||
				decl.id.name !== "config" ||
				!decl.init
			)
				continue;
			const init = t.isTSAsExpression(decl.init)
				? decl.init.expression
				: decl.init;
			if (t.isObjectExpression(init)) root = init;
		}
	}
	return root;
}

function descend(
	root: t.ObjectExpression,
	path: readonly string[],
): t.ObjectExpression | null {
	let current: t.ObjectExpression = root;
	for (const segment of path) {
		const prop = current.properties.find(
			(p): p is t.ObjectProperty =>
				t.isObjectProperty(p) && keyName(p) === segment,
		);
		if (!prop || !t.isObjectExpression(prop.value)) return null;
		current = prop.value;
	}
	return current;
}

function checkKeyShape(
	node: t.ObjectExpression,
	pathSoFar: readonly string[],
	report: (node: t.Node, path: string, actual: string) => void,
): void {
	for (const prop of node.properties) {
		if (!t.isObjectProperty(prop)) continue;
		const name = keyName(prop);
		if (!name) continue;
		if (t.isObjectExpression(prop.value)) {
			checkKeyShape(prop.value, [...pathSoFar, name], report);
		} else if (t.isStringLiteral(prop.value)) {
			const expected = [...pathSoFar, name].join(".");
			if (prop.value.value !== expected)
				report(prop.value, expected, prop.value.value);
		}
	}
}

export const configKeyShape = defineFileRule<Record<string, never>>({
	id: "config-key-shape",
	description: "Grouped config keys must mirror their dotted string value.",
	docs: "AGENTS §4",
	severity: Severity.Error,
	fixable: false,
	include: ["src/config.ts"],
	defaults: {},
	check(file, ctx) {
		const root = findConfigRoot(file);
		if (!root) return;
		for (const keyRoot of ctx.config.config.keyRoots) {
			const target = descend(root, keyRoot.split("."));
			if (!target) continue;
			checkKeyShape(target, [], (node, expected, actual) => {
				ctx.report(file, {
					node,
					message: `${keyRoot}: "${actual}" should be "${expected}".`,
					hint: "The object path must equal the string value (AGENTS §4).",
				});
			});
		}
	},
});

export const literalQueryKey = defineFileRule<Record<string, never>>({
	id: "literal-query-key",
	description:
		"queryKey/mutationKey (and mock key helpers) must reference config, not a string literal.",
	docs: "AGENTS §4",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	// Tests legitimately call the mock respond() helper with ad-hoc keys to test failure injection.
	exclude: ["src/components/ui/**", "src/config.ts", "src/**/*.test.ts"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (
				t.isObjectProperty(node) &&
				!node.computed &&
				t.isIdentifier(node.key) &&
				(node.key.name === "queryKey" ||
					node.key.name === "mutationKey") &&
				t.isArrayExpression(node.value) &&
				node.value.elements[0] &&
				t.isStringLiteral(node.value.elements[0])
			) {
				ctx.report(file, {
					node: node.value.elements[0],
					message: `${node.key.name} starts with a string literal.`,
					hint: "Reference a config.queryKeys/mutationKeys member instead (AGENTS §4).",
				});
			}
			if (
				t.isCallExpression(node) &&
				t.isIdentifier(node.callee) &&
				ctx.config.config.mockKeyFunctions.includes(node.callee.name) &&
				node.arguments[0] &&
				t.isStringLiteral(node.arguments[0])
			) {
				ctx.report(file, {
					node: node.arguments[0],
					message: `${node.callee.name}() is called with a string literal key.`,
					hint: "Reference a config.queryKeys/mutationKeys member instead (AGENTS §4).",
				});
			}
			return true;
		});
	},
});

function isRoutePath(value: string): boolean {
	return value.startsWith("/");
}

export const hardcodedRoute = defineFileRule<Record<string, never>>({
	id: "hardcoded-route",
	description:
		"Route paths must come from config.routes, not string literals.",
	docs: "AGENTS §4",
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
				(node.name.name === "to" || node.name.name === "href") &&
				node.value &&
				t.isStringLiteral(node.value) &&
				isRoutePath(node.value.value)
			) {
				ctx.report(file, {
					node: node.value,
					message: `${node.name.name}="${node.value.value}" is a hardcoded route.`,
					hint: "Reference config.routes.* instead (AGENTS §4).",
				});
			}
			if (
				t.isCallExpression(node) &&
				t.isIdentifier(node.callee) &&
				(node.callee.name === "navigate" ||
					node.callee.name === "redirect") &&
				node.arguments[0] &&
				t.isStringLiteral(node.arguments[0]) &&
				isRoutePath(node.arguments[0].value)
			) {
				ctx.report(file, {
					node: node.arguments[0],
					message: `${node.callee.name}("${node.arguments[0].value}") is a hardcoded route.`,
					hint: "Reference config.routes.* instead (AGENTS §4).",
				});
			}
			return true;
		});
	},
});

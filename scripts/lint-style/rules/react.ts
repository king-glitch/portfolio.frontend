/** React/TypeScript best-practice rules — AGENTS.md §0. */
import * as t from "@babel/types";
import {
	defineFileRule,
	defineProjectRule,
	resolveImport,
	Severity,
	walk,
	walkOwnBody,
	type SourceFile,
} from "../core";
import { findComponents } from "./components";

export const noNestedTernary = defineFileRule<Record<string, never>>({
	id: "no-nested-ternary",
	description: "At most one `?:` per expression.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (
				t.isConditionalExpression(node) &&
				(t.isConditionalExpression(node.consequent) ||
					t.isConditionalExpression(node.alternate))
			) {
				ctx.report(file, {
					node,
					message: "Nested ternary expression.",
					hint: "Use a lookup Record, an early return, or a switch (AGENTS §0).",
				});
			}
			return true;
		});
	},
});

export const noAny = defineFileRule<Record<string, never>>({
	id: "no-any",
	description: "The `any` type is not allowed.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (t.isTSAnyKeyword(node)) {
				ctx.report(file, {
					node,
					message: "`any` is not allowed.",
					hint: "Use a precise type or `unknown` (AGENTS §0).",
				});
			}
			return true;
		});
	},
});

function isAsConst(node: t.TSAsExpression): boolean {
	return (
		t.isTSTypeReference(node.typeAnnotation) &&
		t.isIdentifier(node.typeAnnotation.typeName) &&
		node.typeAnnotation.typeName.name === "const"
	);
}

export const noAsCast = defineFileRule<Record<string, never>>({
	id: "no-as-cast",
	description: "`as` casts are not allowed (except `as const`).",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (t.isTSAsExpression(node) && !isAsConst(node)) {
				ctx.report(file, {
					node,
					message: "`as` cast is not allowed.",
					hint: "Use a type guard, a typed helper, or `satisfies` (AGENTS §0).",
				});
			}
			return true;
		});
	},
});

function isStringLiteralUnion(node: t.TSType): boolean {
	if (!t.isTSUnionType(node)) return false;
	if (node.types.length < 2) return false;
	return node.types.every(
		(member) =>
			t.isTSLiteralType(member) && t.isStringLiteral(member.literal),
	);
}

export const noStringUnion = defineFileRule<Record<string, never>>({
	id: "no-string-union",
	description:
		"Named domain unions must be TypeScript enums, not string-literal unions.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	// Only top-level named `type X = "a" | "b"` aliases are checked, not every inline
	// TSPropertySignature — a component's own `variant`/`size`/`tone` prop mirroring its
	// cva variant keys is the project's idiomatic (shadcn) pattern, not a "domain model,
	// status, category, view mode, subtab, or action view" (AGENTS §0), and flagging it
	// would mean converting dozens of correct, working cva-driven props with no behavior
	// change to justify the churn.
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (
				t.isTSTypeAliasDeclaration(node) &&
				isStringLiteralUnion(node.typeAnnotation)
			) {
				ctx.report(file, {
					node,
					message: `${node.id.name} is a string-literal union.`,
					hint: `Declare \`enum ${node.id.name.replace(/s$/, "")} { … }\` instead (AGENTS §0).`,
				});
			}
			return true;
		});
	},
});

function isSetterCall(node: t.Node): boolean {
	return (
		t.isExpressionStatement(node) &&
		t.isCallExpression(node.expression) &&
		t.isIdentifier(node.expression.callee) &&
		/^set[A-Z]/.test(node.expression.callee.name)
	);
}

function effectCallback(
	node: t.CallExpression,
	hookName: string,
): t.Function | null {
	if (!t.isIdentifier(node.callee) || node.callee.name !== hookName)
		return null;
	const first = node.arguments[0];
	return first && t.isFunction(first) ? first : null;
}

export const effectDerivedState = defineFileRule<Record<string, never>>({
	id: "effect-derived-state",
	description:
		"A useEffect whose body only calls set* setters computes derived state; compute it during render.",
	docs: "AGENTS §0",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (!t.isCallExpression(node)) return true;
			const fn = effectCallback(node, "useEffect");
			if (!fn || !t.isBlockStatement(fn.body)) return true;
			const statements = fn.body.body;
			if (statements.length > 0 && statements.every(isSetterCall)) {
				ctx.report(file, {
					node,
					message: "useEffect body only calls set* setters.",
					hint: "Compute this value during render instead of an Effect (AGENTS §0).",
				});
			}
			return true;
		});
	},
});

function dependsOnOpen(deps: t.Node | null | undefined): boolean {
	if (!deps || !t.isArrayExpression(deps)) return false;
	return deps.elements.some((element) => {
		if (t.isIdentifier(element)) return /open$/i.test(element.name);
		if (t.isMemberExpression(element) && t.isIdentifier(element.property))
			return /open$/i.test(element.property.name);
		return false;
	});
}

function callsResetOrSetter(fn: t.Function): boolean {
	let found = false;
	walkOwnBody(fn, (node) => {
		if (found || !t.isCallExpression(node)) return;
		if (
			t.isIdentifier(node.callee) &&
			(node.callee.name === "reset" || /^set[A-Z]/.test(node.callee.name))
		)
			found = true;
		if (
			t.isMemberExpression(node.callee) &&
			t.isIdentifier(node.callee.property) &&
			node.callee.property.name === "reset"
		)
			found = true;
	});
	return found;
}

export const effectOpenReset = defineFileRule<Record<string, never>>({
	id: "effect-open-reset",
	description:
		"Overlay state must reset in onOpenChangeComplete(false), not a useEffect watching `open`.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (!t.isCallExpression(node)) return true;
			const fn = effectCallback(node, "useEffect");
			if (!fn) return true;
			const deps = node.arguments[1];
			if (dependsOnOpen(deps) && callsResetOrSetter(fn)) {
				ctx.report(file, {
					node,
					message: "useEffect watching `open` resets state.",
					hint: "Reset in onOpenChangeComplete(false) instead (AGENTS §0).",
				});
			}
			return true;
		});
	},
});

export const viewState = defineFileRule<Record<string, never>>({
	id: "view-state",
	description: "Tabs/sub-views must be routes, not component state.",
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
				t.isVariableDeclarator(node) &&
				t.isArrayPattern(node.id) &&
				node.init &&
				t.isCallExpression(node.init) &&
				t.isIdentifier(node.init.callee) &&
				node.init.callee.name === "useState"
			) {
				const first = node.id.elements[0];
				if (
					first &&
					t.isIdentifier(first) &&
					/tab|view|subtab/i.test(first.name)
				) {
					ctx.report(file, {
						node,
						message: `useState binding "${first.name}" looks like view/tab selection state.`,
						hint: "Make this view a nested route instead (AGENTS §0).",
					});
				}
			}
			if (
				t.isCallExpression(node) &&
				t.isMemberExpression(node.callee) &&
				t.isIdentifier(node.callee.object) &&
				node.callee.object.name === "searchParams" &&
				t.isIdentifier(node.callee.property) &&
				node.callee.property.name === "get" &&
				node.arguments[0] &&
				t.isStringLiteral(node.arguments[0]) &&
				node.arguments[0].value === "tab"
			) {
				ctx.report(file, {
					node,
					message:
						'searchParams.get("tab") selects a view via a query param.',
					hint: "Make this view a nested route instead (AGENTS §0).",
				});
			}
			return true;
		});
	},
});

function isBlankJsxText(node: t.Node): boolean {
	return t.isJSXText(node) && node.value.trim() === "";
}

function jsxAttributeNames(element: t.JSXElement): string[] {
	return element.openingElement.attributes
		.filter(
			(attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name),
		)
		.map((attr) =>
			t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)
				? attr.name.name
				: "",
		);
}

function jsxTagName(element: t.JSXElement): string | null {
	const name = element.openingElement.name;
	return t.isJSXIdentifier(name) ? name.name : null;
}

function jsxClassNameValue(element: t.JSXElement): string | null {
	for (const attr of element.openingElement.attributes) {
		if (
			t.isJSXAttribute(attr) &&
			t.isJSXIdentifier(attr.name) &&
			attr.name.name === "className"
		) {
			if (t.isStringLiteral(attr.value)) return attr.value.value;
		}
	}
	return null;
}

export const repeatedSiblings = defineFileRule<Record<string, never>>({
	id: "repeated-siblings",
	description:
		"3+ sibling elements differing only by data should be rendered from a mapped array.",
	docs: "AGENTS §0",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**", "src/**/*-skeleton.tsx"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		const reported = new Set<t.Node>();
		const ignoredTags = new Set([
			"Field",
			"AdminField",
			"FormItem",
			"FormField",
			"Controller",
			"section",
			"main",
			"article",
			"nav",
			"header",
			"footer",
		]);
		walk(file.ast, (node) => {
			if (!t.isJSXElement(node) && !t.isJSXFragment(node)) return true;
			const children = node.children.filter(
				(child) => !isBlankJsxText(child),
			);
			let runStart = 0;
			for (let i = 1; i <= children.length; i++) {
				const prev = children[i - 1];
				const curr = children[i];
				const prevTag =
					prev && t.isJSXElement(prev) ? jsxTagName(prev) : null;
				const currTag =
					curr && t.isJSXElement(curr) ? jsxTagName(curr) : null;
				const isLayoutTag = currTag === "div" || currTag === "span";
				const sameTag =
					currTag !== null &&
					prevTag !== null &&
					currTag === prevTag &&
					!ignoredTags.has(currTag) &&
					(!isLayoutTag ||
						(t.isJSXElement(curr) &&
							t.isJSXElement(prev) &&
							jsxClassNameValue(curr) ===
								jsxClassNameValue(prev)));
				const sameAttrs =
					sameTag &&
					curr &&
					prev &&
					t.isJSXElement(curr) &&
					t.isJSXElement(prev) &&
					jsxAttributeNames(curr).sort().join(",") ===
						jsxAttributeNames(prev).sort().join(",");
				if (!sameAttrs) {
					const runLength = i - runStart;
					if (runLength >= 3) {
						const first = children[runStart];
						if (first && !reported.has(first)) {
							reported.add(first);
							ctx.report(file, {
								node: first,
								message: `${runLength} sibling elements repeat the same tag/attributes.`,
								hint: "Render this run from a mapped typed array instead (AGENTS §0).",
							});
						}
					}
					runStart = i;
				}
			}
			return true;
		});
	},
});

function booleanPropNames(
	file: SourceFile,
	componentName: string,
): Set<string> {
	const names = new Set<string>();
	if (!file.ast) return names;
	walk(file.ast, (node) => {
		if (
			!t.isTSInterfaceDeclaration(node) ||
			node.id.name !== `${componentName}Props`
		)
			return true;
		for (const member of node.body.body) {
			if (
				t.isTSPropertySignature(member) &&
				t.isIdentifier(member.key) &&
				member.typeAnnotation &&
				t.isTSBooleanKeyword(member.typeAnnotation.typeAnnotation)
			) {
				names.add(member.key.name);
			}
		}
		return true;
	});
	return names;
}

export const booleanClassProp = defineFileRule<Record<string, never>>({
	id: "boolean-class-prop",
	description:
		"A boolean prop used only to toggle one class should be a layout className or a cva variant.",
	docs: "AGENTS §0",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		const boolProps = new Set<string>();
		for (const component of findComponents(file)) {
			for (const name of booleanPropNames(file, component.name))
				boolProps.add(name);
		}
		if (boolProps.size === 0) return;
		walk(file.ast, (node) => {
			if (
				t.isLogicalExpression(node) &&
				node.operator === "&&" &&
				t.isIdentifier(node.left) &&
				boolProps.has(node.left.name) &&
				(t.isStringLiteral(node.right) ||
					t.isTemplateLiteral(node.right))
			) {
				ctx.report(file, {
					node,
					message: `Boolean prop "${node.left.name}" toggles a single class.`,
					hint: "Put the class in the base, pass className at call sites, or make it a cva variant (AGENTS §0).",
				});
			}
			return true;
		});
	},
});

function isHookImportSource(source: string): boolean {
	return source.startsWith("@/api/hooks/");
}

function isMutationHookName(name: string): boolean {
	return /^use(Create|Update|Delete|Toggle|Cancel|Send|Save|Set|Reject|Approve)/.test(
		name,
	);
}

export const queryStates = defineFileRule<Record<string, never>>({
	id: "query-states",
	description:
		"A file rendering a query hook must handle loading, error and refetch.",
	docs: "AGENTS §0",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		const hookNames = new Set<string>();
		for (const stmt of file.ast.program.body) {
			if (
				t.isImportDeclaration(stmt) &&
				isHookImportSource(stmt.source.value)
			) {
				for (const spec of stmt.specifiers) {
					if (!isMutationHookName(spec.local.name)) {
						hookNames.add(spec.local.name);
					}
				}
			}
		}
		if (hookNames.size === 0) return;
		let callsHook = false;
		let hasJsx = false;
		walk(file.ast, (node) => {
			if (
				t.isCallExpression(node) &&
				t.isIdentifier(node.callee) &&
				hookNames.has(node.callee.name)
			)
				callsHook = true;
			if (t.isJSXElement(node) || t.isJSXFragment(node)) hasJsx = true;
			return true;
		});
		if (!callsHook || !hasJsx) return;
		const text = file.code;
		const missing: string[] = [];
		if (!/isLoading|isPending|loading/i.test(text)) missing.push("loading");
		if (!/isError|error/i.test(text)) missing.push("error");
		if (!/refetch/i.test(text)) missing.push("refetch");
		if (missing.length > 0) {
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message: `Renders a query hook but does not reference: ${missing.join(", ")}.`,
				hint: "Handle loading/error/empty/success and expose retry via refetch() (AGENTS §0).",
			});
		}
	},
});

export const mutationPending = defineFileRule<Record<string, never>>({
	id: "mutation-pending",
	description: "A file calling mutate/mutateAsync must read isPending.",
	docs: "AGENTS §0",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		let callsMutate = false;
		walk(file.ast, (node) => {
			if (t.isCallExpression(node)) {
				if (
					t.isIdentifier(node.callee) &&
					(node.callee.name === "mutate" ||
						node.callee.name === "mutateAsync")
				)
					callsMutate = true;
				if (
					t.isMemberExpression(node.callee) &&
					t.isIdentifier(node.callee.property) &&
					(node.callee.property.name === "mutate" ||
						node.callee.property.name === "mutateAsync")
				) {
					callsMutate = true;
				}
			}
			return true;
		});
		if (callsMutate && !/isPending/.test(file.code)) {
			ctx.report(file, {
				at: { line: 1, column: 1 },
				message: "Calls a mutation but never reads isPending.",
				hint: "Show a pending Spinner and disable the trigger while isPending (AGENTS §0).",
			});
		}
	},
});

interface CvaVariants {
	componentNames: readonly string[];
	defaultVariants: Readonly<Record<string, string>>;
}

function stringRecordFromObjectExpression(
	node: t.Node | undefined,
): Record<string, string> | null {
	if (!node || !t.isObjectExpression(node)) return null;
	const record: Record<string, string> = {};
	for (const prop of node.properties) {
		if (
			t.isObjectProperty(prop) &&
			!prop.computed &&
			t.isStringLiteral(prop.value)
		) {
			const key = t.isIdentifier(prop.key)
				? prop.key.name
				: t.isStringLiteral(prop.key)
					? prop.key.value
					: null;
			if (key) record[key] = prop.value.value;
		}
	}
	return record;
}

function findCvaVariants(file: SourceFile): CvaVariants | null {
	if (!file.ast) return null;
	let defaultVariants: Record<string, string> | null = null;
	walk(file.ast, (node) => {
		if (
			t.isCallExpression(node) &&
			t.isIdentifier(node.callee) &&
			node.callee.name === "cva"
		) {
			const options = node.arguments[1];
			if (options && t.isObjectExpression(options)) {
				for (const prop of options.properties) {
					if (
						t.isObjectProperty(prop) &&
						!prop.computed &&
						t.isIdentifier(prop.key) &&
						prop.key.name === "defaultVariants"
					) {
						defaultVariants = stringRecordFromObjectExpression(
							prop.value,
						);
					}
				}
			}
		}
		return true;
	});
	if (!defaultVariants) return null;
	const componentNames = findComponents(file).map((c) => c.name);
	if (componentNames.length === 0) return null;
	return { componentNames, defaultVariants };
}

export const defaultVariantProp = defineProjectRule<Record<string, never>>({
	id: "default-variant-prop",
	description:
		"A call site should not pass a variant prop equal to the component's cva default.",
	docs: "AGENTS §0",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/components/common/**/*.tsx"],
	defaults: {},
	check(project, ctx) {
		const variantsByFile = new Map<string, CvaVariants>();
		for (const file of project.files) {
			if (!file.path.startsWith("src/components/common/")) continue;
			const variants = findCvaVariants(file);
			if (variants) variantsByFile.set(file.path, variants);
		}
		if (variantsByFile.size === 0) return;

		for (const file of project.files) {
			if (!file.ast || file.path.startsWith("src/components/common/"))
				continue;
			const importedFrom = new Map<string, string>();
			for (const stmt of file.ast.program.body) {
				if (!t.isImportDeclaration(stmt)) continue;
				const target = resolveImport(
					file.path,
					stmt.source.value,
					ctx.config,
				);
				if (!target || !variantsByFile.has(target)) continue;
				for (const spec of stmt.specifiers)
					importedFrom.set(spec.local.name, target);
			}
			if (importedFrom.size === 0) continue;

			walk(file.ast, (node) => {
				if (
					!t.isJSXOpeningElement(node) ||
					!t.isJSXIdentifier(node.name)
				)
					return true;
				const target = importedFrom.get(node.name.name);
				const variants = target
					? variantsByFile.get(target)
					: undefined;
				if (
					!variants ||
					!variants.componentNames.includes(node.name.name)
				)
					return true;
				for (const attr of node.attributes) {
					if (
						!t.isJSXAttribute(attr) ||
						!t.isJSXIdentifier(attr.name) ||
						!t.isStringLiteral(attr.value)
					)
						continue;
					const propName = attr.name.name;
					if (
						variants.defaultVariants[propName] === attr.value.value
					) {
						ctx.report(file, {
							node: attr,
							message: `${propName}="${attr.value.value}" is already ${node.name.name}'s default.`,
							hint: "Remove the prop; only pass what differs from the default (AGENTS §0).",
						});
					}
				}
				return true;
			});
		}
	},
});

export const rawNumberInput = defineFileRule<Record<string, never>>({
	id: "raw-number-input",
	description:
		'`type="number"` / `"date"` (and `"time"` in administrations) inputs must use FormNumberInput / FormDatePicker / FormTimeInput (or AdminInputField).',
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: [
		"src/components/ui/**",
		"src/components/common/fields/form/form-number-input.tsx",
		"src/components/common/fields/form/form-date-picker.tsx",
		"src/components/common/fields/form/form-time-input.tsx",
		"src/routes/administrations/components/admin/form/admin-form-fields.tsx",
	],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (
				t.isJSXAttribute(node) &&
				t.isJSXIdentifier(node.name, { name: "type" }) &&
				t.isStringLiteral(node.value) &&
				(node.value.value === "number" ||
					node.value.value === "date" ||
					(node.value.value === "time" &&
						file.path.startsWith("src/routes/administrations/")))
			) {
				ctx.report(file, {
					node,
					message: `Raw \`type="${node.value.value}"\` input.`,
					hint: "Use FormNumberInput / FormDatePicker from components/common/fields/form (AGENTS §0).",
				});
			}
			return true;
		});
	},
});

function isHandleSubmitCall(node: t.Node | null | undefined): boolean {
	if (!t.isCallExpression(node)) return false;
	const callee = node.callee;
	return (
		t.isIdentifier(callee, { name: "handleSubmit" }) ||
		(t.isMemberExpression(callee) &&
			t.isIdentifier(callee.property, { name: "handleSubmit" }))
	);
}

const FIELD_ELEMENT =
	/^(?:input|textarea|select|Input|Textarea|Select|InputGroupInput|Form(?:Input|NumberInput|DatePicker|TimeInput|Textarea|Select)|Admin(?:Input|Textarea|InputField|TextareaField))$/;

/** A field the user types/picks a value into. Search boxes only filter, checkboxes/buttons carry no text to validate. */
function hasValidatedField(form: t.JSXElement): boolean {
	let found = false;
	walk(form, (node) => {
		if (
			t.isJSXOpeningElement(node) &&
			t.isJSXIdentifier(node.name) &&
			FIELD_ELEMENT.test(node.name.name) &&
			!node.attributes.some(
				(a) =>
					t.isJSXAttribute(a) &&
					t.isJSXIdentifier(a.name, { name: "type" }) &&
					t.isStringLiteral(a.value) &&
					(a.value.value === "search" ||
						a.value.value === "checkbox"),
			)
		)
			found = true;
		return !found;
	});
	return found;
}

export const formZodValidation = defineFileRule<Record<string, never>>({
	id: "form-zod-validation",
	description:
		"Forms validate through zod only: `<form noValidate onSubmit={form.handleSubmit(...)}>`, no native `required`/`pattern`.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: true,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		const submitHandlers = new Set<string>();
		walk(file.ast, (node) => {
			if (
				t.isVariableDeclarator(node) &&
				t.isIdentifier(node.id) &&
				isHandleSubmitCall(node.init)
			) {
				submitHandlers.add(node.id.name);
			}
			return true;
		});
		walk(file.ast, (node) => {
			if (
				t.isJSXAttribute(node) &&
				t.isJSXIdentifier(node.name) &&
				(node.name.name === "required" || node.name.name === "pattern")
			) {
				ctx.report(file, {
					node,
					message: `Native \`${node.name.name}\` validation attribute.`,
					hint: "Validate in the zod schema; errors render through Field (AGENTS §0).",
				});
				return true;
			}
			if (
				!t.isJSXElement(node) ||
				!t.isJSXIdentifier(node.openingElement.name, { name: "form" })
			)
				return true;
			const opening = node.openingElement;
			const attr = (name: string) =>
				opening.attributes.find(
					(a): a is t.JSXAttribute =>
						t.isJSXAttribute(a) &&
						t.isJSXIdentifier(a.name, { name }),
				);
			if (!attr("noValidate") && typeof opening.name.end === "number") {
				ctx.report(file, {
					node: opening,
					message: "<form> without `noValidate`.",
					hint: "Browser validation bubbles bypass zod; add noValidate (AGENTS §0).",
					fix: {
						start: opening.name.end,
						end: opening.name.end,
						text: " noValidate",
					},
				});
			}
			const submit = attr("onSubmit");
			const value = submit?.value;
			if (
				submit &&
				hasValidatedField(node) &&
				t.isJSXExpressionContainer(value) &&
				!isHandleSubmitCall(value.expression) &&
				!(
					t.isIdentifier(value.expression) &&
					submitHandlers.has(value.expression.name)
				)
			) {
				ctx.report(file, {
					node: submit,
					message:
						"<form onSubmit> is not a `handleSubmit(...)` call.",
					hint: "Use react-hook-form + zodResolver so zod owns errors (AGENTS §0).",
				});
			}
			return true;
		});
	},
});

function propKey(prop: t.ObjectMember | t.SpreadElement): string | null {
	if (!t.isObjectProperty(prop)) return null;
	if (t.isIdentifier(prop.key)) return prop.key.name;
	return t.isStringLiteral(prop.key) ? prop.key.value : null;
}

function isActionsId(node: t.Node | undefined): boolean {
	if (t.isStringLiteral(node)) {
		return node.value === "actions" || node.value === "action";
	}
	return (
		t.isMemberExpression(node) &&
		t.isIdentifier(node.property, { name: "Actions" })
	);
}

export const adminTableSortable = defineFileRule<Record<string, never>>({
	id: "admin-table-sortable",
	description:
		"Every administrations table column except `actions` must be sortable.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/routes/administrations/**/*.tsx"],
	exclude: ["src/routes/administrations/analytics/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (!t.isObjectExpression(node)) return true;
			const byKey = new Map<string, t.Node>();
			for (const prop of node.properties) {
				const key = propKey(prop);
				if (key && t.isObjectProperty(prop)) byKey.set(key, prop.value);
			}
			const id = byKey.get("id");
			if (isActionsId(id)) return true;
			const sortable = byKey.get("sortable");
			const getSortValue = byKey.get("getSortValue");
			if (
				(t.isBooleanLiteral(sortable) && !sortable.value) ||
				t.isNullLiteral(getSortValue)
			) {
				ctx.report(file, {
					node,
					message: "Non-actions table column is not sortable.",
					hint: "Give it a sort value (`getSortValue` / `sortValue`); only the `actions` column may be unsortable.",
				});
			}
			return true;
		});
		walk(file.ast, (node) => {
			if (
				!t.isCallExpression(node) ||
				!t.isMemberExpression(node.callee) ||
				!t.isIdentifier(node.callee.property, { name: "display" })
			)
				return true;
			const [arg] = node.arguments;
			if (!t.isObjectExpression(arg)) return true;
			const keys = new Map<string, t.Node>();
			for (const prop of arg.properties) {
				const key = propKey(prop);
				if (key && t.isObjectProperty(prop)) keys.set(key, prop.value);
			}
			if (isActionsId(keys.get("id")) || keys.has("sortValue"))
				return true;
			ctx.report(file, {
				node,
				message: "`display` column without `sortValue`.",
				hint: "Add `sortValue: (row) => …` or use `accessor`; only `actions` columns may be unsortable.",
			});
			return true;
		});
	},
});

const OVERLAY_ROOT = /^(Sheet|Dialog|AlertDialog|Drawer)$/;
const OVERLAY_NAME = /(Sheet|Dialog|Drawer)$/;

function jsxName(node: t.JSXElement): string {
	return t.isJSXIdentifier(node.openingElement.name)
		? node.openingElement.name.name
		: "";
}

function identifiersIn(node: t.Node): Set<string> {
	const names = new Set<string>();
	walk(node, (n) => {
		if (t.isIdentifier(n)) names.add(n.name);
		return true;
	});
	return names;
}

export const overlayAlwaysMounted = defineFileRule<Record<string, never>>({
	id: "overlay-always-mounted",
	description:
		"Sheets/dialogs stay mounted so the first open and the close both animate.",
	docs: "AGENTS §0",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		const hint =
			"Keep the overlay mounted: `useRetainedValue(prop)` + `if (!x) return <Sheet open={false} onOpenChange={…} />` (see request-detail-sheet.tsx).";
		let hasOverlayRoot = false;
		walk(file.ast, (node) => {
			if (t.isJSXElement(node) && OVERLAY_ROOT.test(jsxName(node)))
				hasOverlayRoot = true;
			return true;
		});
		if (hasOverlayRoot) {
			walk(file.ast, (node) => {
				if (t.isIfStatement(node) && returnsNull(node.consequent)) {
					ctx.report(file, {
						node,
						message:
							"Overlay component returns null before rendering its Sheet/Dialog.",
						hint,
					});
				}
				return true;
			});
		}
		walk(file.ast, (node) => {
			if (
				t.isJSXElement(node) &&
				(OVERLAY_NAME.test(jsxName(node)) ||
					OVERLAY_ROOT.test(jsxName(node)))
			) {
				for (const attr of node.openingElement.attributes) {
					if (
						t.isJSXAttribute(attr) &&
						t.isJSXIdentifier(attr.name, { name: "modal" }) &&
						t.isJSXExpressionContainer(attr.value) &&
						t.isBooleanLiteral(attr.value.expression, {
							value: false,
						})
					)
						ctx.report(file, {
							node: attr,
							message: "Non-modal overlay (`modal={false}`).",
							hint: "Every Sheet/Dialog/Drawer is modal (backdrop + focus trap); remove `modal={false}`.",
						});
				}
			}
			return true;
		});
		walk(file.ast, (node) => {
			if (!t.isLogicalExpression(node, { operator: "&&" })) return true;
			if (!t.isJSXElement(node.right)) return true;
			const el = node.right;
			if (!OVERLAY_NAME.test(jsxName(el))) return true;
			const open = el.openingElement.attributes.find(
				(a): a is t.JSXAttribute =>
					t.isJSXAttribute(a) &&
					t.isJSXIdentifier(a.name, { name: "open" }),
			);
			if (!open?.value) return true;
			const condNames = identifiersIn(node.left);
			const openNames = identifiersIn(open.value);
			if (![...condNames].some((n) => openNames.has(n))) return true;
			ctx.report(file, {
				node,
				message: `\`<${jsxName(el)}>\` is mounted only while its record exists, so it never animates in/out.`,
				hint: "Always render it: `open={x !== null}` + `useRetainedValue(x)` for its content.",
			});
			return true;
		});
	},
});

function returnsNull(stmt: t.Statement): boolean {
	const ret = t.isBlockStatement(stmt) ? stmt.body[0] : stmt;
	return t.isReturnStatement(ret) && t.isNullLiteral(ret.argument);
}

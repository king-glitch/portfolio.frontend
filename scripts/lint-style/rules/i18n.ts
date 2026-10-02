/** i18n rules — AGENTS.md §3. */
import * as t from "@babel/types";
import {
	defineFileRule,
	defineProjectRule,
	flattenJsonKeys,
	isJsonRecord,
	isKebabCase,
	parseJson,
	Severity,
	translationCalls,
	walk,
	type JsonValue,
	type ProjectConfig,
} from "../core";

function hasLetters(value: string): boolean {
	return /[A-Za-z]/.test(value);
}

function isAllowedText(value: string, config: ProjectConfig): boolean {
	const trimmed = value.trim();
	return trimmed === "" || config.i18n.allowedText.includes(trimmed);
}

export const hardcodedJsxText = defineFileRule<Record<string, never>>({
	id: "hardcoded-jsx-text",
	description: "User-facing JSX text must go through t().",
	docs: "AGENTS §3",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (!t.isJSXElement(node) && !t.isJSXFragment(node)) return true;
			for (const child of node.children) {
				if (
					t.isJSXText(child) &&
					hasLetters(child.value) &&
					!isAllowedText(child.value, ctx.config)
				) {
					ctx.report(file, {
						node: child,
						message: `"${child.value.trim()}" is hardcoded JSX text.`,
						hint: 'Replace with t("…") and a key in en.json (AGENTS §3).',
					});
				}
				if (
					t.isJSXExpressionContainer(child) &&
					t.isStringLiteral(child.expression) &&
					hasLetters(child.expression.value) &&
					!isAllowedText(child.expression.value, ctx.config)
				) {
					ctx.report(file, {
						node: child,
						message: `"${child.expression.value}" is hardcoded JSX text.`,
						hint: 'Replace with t("…") and a key in en.json (AGENTS §3).',
					});
				}
			}
			return true;
		});
	},
});

export const hardcodedUiAttribute = defineFileRule<Record<string, never>>({
	id: "hardcoded-ui-attribute",
	description: "aria-label/title/alt/placeholder/label must go through t().",
	docs: "AGENTS §3",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.tsx"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (!t.isJSXAttribute(node) || !t.isJSXIdentifier(node.name))
				return true;
			if (!ctx.config.i18n.uiAttributes.includes(node.name.name))
				return true;
			const value = node.value;
			const literal =
				value && t.isStringLiteral(value)
					? value.value
					: value &&
						  t.isJSXExpressionContainer(value) &&
						  t.isStringLiteral(value.expression)
						? value.expression.value
						: null;
			if (
				literal !== null &&
				hasLetters(literal) &&
				!isAllowedText(literal, ctx.config)
			) {
				ctx.report(file, {
					node,
					message: `${node.name.name}="${literal}" is hardcoded.`,
					hint: 'Replace with t("…") and a key in en.json (AGENTS §3).',
				});
			}
			return true;
		});
	},
});

function toastArgStrings(
	arg: t.Node | undefined,
): { node: t.Node; value: string }[] {
	if (!arg || !t.isObjectExpression(arg)) return [];
	const hits: { node: t.Node; value: string }[] = [];
	for (const prop of arg.properties) {
		if (
			!t.isObjectProperty(prop) ||
			prop.computed ||
			!t.isIdentifier(prop.key)
		)
			continue;
		if (prop.key.name !== "title" && prop.key.name !== "description")
			continue;
		if (t.isStringLiteral(prop.value))
			hits.push({ node: prop.value, value: prop.value.value });
	}
	return hits;
}

export const hardcodedToast = defineFileRule<Record<string, never>>({
	id: "hardcoded-toast",
	description: "toast title/description must go through t().",
	docs: "AGENTS §3",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		walk(file.ast, (node) => {
			if (!t.isCallExpression(node)) return true;
			const callee = node.callee;
			const isToastCall =
				(t.isIdentifier(callee) && callee.name === "toast") ||
				(t.isMemberExpression(callee) &&
					t.isIdentifier(callee.object) &&
					callee.object.name === "toast");
			if (!isToastCall) return true;
			for (const hit of toastArgStrings(node.arguments[0])) {
				if (
					!hasLetters(hit.value) ||
					isAllowedText(hit.value, ctx.config)
				)
					continue;
				ctx.report(file, {
					node: hit.node,
					message: `"${hit.value}" is a hardcoded toast string.`,
					hint: 'Replace with t("…") and a key in en.json (AGENTS §3).',
				});
			}
			return true;
		});
	},
});

export const tFallback = defineFileRule<Record<string, never>>({
	id: "t-fallback",
	description: "t() must not take fallback text or `defaultValue`.",
	docs: "AGENTS §3",
	severity: Severity.Error,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		for (const call of translationCalls(file, ctx.config)) {
			const second = call.args[1];
			if (!second) continue;
			if (t.isStringLiteral(second)) {
				ctx.report(file, {
					node: second,
					message: "t() has a fallback string argument.",
					hint: 'Call t("key") only; put the copy in en.json (AGENTS §3).',
				});
			} else if (t.isObjectExpression(second)) {
				for (const prop of second.properties) {
					if (
						t.isObjectProperty(prop) &&
						!prop.computed &&
						t.isIdentifier(prop.key) &&
						prop.key.name === "defaultValue"
					) {
						ctx.report(file, {
							node: prop,
							message: "t() has a defaultValue option.",
							hint: "Remove defaultValue; en.json is the only source of copy (AGENTS §3).",
						});
					}
				}
			}
		}
	},
});

export const tConcat = defineFileRule<Record<string, never>>({
	id: "t-concat",
	description: "t() must not be concatenated with other text.",
	docs: "AGENTS §3",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		if (!file.ast) return;
		const tCalls = new Set(
			translationCalls(file, ctx.config).map((call) => call.call),
		);
		walk(file.ast, (node) => {
			if (t.isBinaryExpression(node) && node.operator === "+") {
				if (
					(t.isCallExpression(node.left) && tCalls.has(node.left)) ||
					(t.isCallExpression(node.right) && tCalls.has(node.right))
				) {
					ctx.report(file, {
						node,
						message: "t() result is concatenated with `+`.",
						hint: "Use i18next interpolation instead (AGENTS §3).",
					});
				}
			}
			if (t.isTemplateLiteral(node)) {
				const hasTCall = node.expressions.some(
					(expr) => t.isCallExpression(expr) && tCalls.has(expr),
				);
				const hasSurroundingText = node.quasis.some(
					(quasi) => quasi.value.raw.trim() !== "",
				);
				if (hasTCall && hasSurroundingText) {
					ctx.report(file, {
						node,
						message:
							"t() result is embedded in a template literal with other text.",
						hint: "Use i18next interpolation instead (AGENTS §3).",
					});
				}
			}
			return true;
		});
	},
});

function localeKeySet(localeCode: string): Set<string> | null {
	const data = parseJson(localeCode);
	if (!data) return null;
	return new Set(flattenJsonKeys(data));
}

export const iKeyExists = defineProjectRule<Record<string, never>>({
	id: "t-key-exists",
	description: "t() keys must exist in the locale file.",
	docs: "AGENTS §3",
	severity: Severity.Error,
	fixable: false,
	include: [],
	defaults: {},
	check(project, ctx) {
		const localeFile = project.byPath.get(ctx.config.i18n.locale);
		if (!localeFile) return;
		const keys = localeKeySet(localeFile.code);
		if (!keys) return;
		for (const file of project.files) {
			if (!file.ast) continue;
			for (const call of translationCalls(file, ctx.config)) {
				if (call.key === null) continue;
				const hasPluralForm = ctx.config.i18n.pluralSuffixes.some(
					(suffix) =>
						keys.has(
							`${call.key}${ctx.config.i18n.pluralSeparator}${suffix}`,
						),
				);
				const exists = call.isTemplate
					? [...keys].some((key) => key.startsWith(call.key ?? ""))
					: keys.has(call.key) || hasPluralForm;
				if (!exists) {
					ctx.report(file, {
						node: call.call,
						message: `Translation key "${call.key}${call.isTemplate ? "…" : ""}" does not exist in ${ctx.config.i18n.locale}.`,
						hint: "Add the key to en.json or fix the typo (AGENTS §3).",
					});
				}
			}
		}
	},
});

export const i18nKeyFormat = defineFileRule<Record<string, never>>({
	id: "i18n-key-format",
	description: "Every locale key segment must be kebab-case.",
	docs: "AGENTS §3",
	severity: Severity.Error,
	fixable: false,
	include: ["src/locales/*.json"],
	defaults: {},
	check(file, ctx) {
		const data = parseJson(file.code);
		if (!data) return;
		for (const key of flattenJsonKeys(data)) {
			const bad = key.split(".").find((segment) => !isKebabCase(segment));
			if (bad) {
				ctx.report(file, {
					at: { line: 1, column: 1 },
					message: `Locale key "${key}" has a non-kebab-case segment "${bad}".`,
					hint: "Use kebab-case for every segment; plural forms are `key-one`/`key-other`, never `key_one` (AGENTS §3).",
				});
			}
		}
	},
});

export const i18nKeyGlue = defineFileRule<Record<string, never>>({
	id: "i18n-key-glue",
	description:
		"A key segment must not glue a part name onto the subject with a hyphen.",
	docs: "AGENTS §3",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/locales/*.json"],
	defaults: {},
	check(file, ctx) {
		const data = parseJson(file.code);
		if (!data) return;
		const parts = ctx.config.i18n.partNames.join("|");
		const prefixPattern = new RegExp(`^(${parts})-`);
		const suffixPattern = new RegExp(`-(${parts})$`);
		const allowedMultiWords = new Set([
			"load-error",
			"query-error",
			"action-guide",
			"step-success",
			"special-request",
			"add-to-calendar",
			"limit-action",
		]);
		for (const key of flattenJsonKeys(data)) {
			const segments = key.split(".");
			const glued = segments.find(
				(segment) =>
					!ctx.config.i18n.partNames.includes(segment) &&
					!allowedMultiWords.has(segment) &&
					(prefixPattern.test(segment) ||
						suffixPattern.test(segment)),
			);
			if (glued) {
				ctx.report(file, {
					at: { line: 1, column: 1 },
					message: `Locale key "${key}" glues a part name onto "${glued}".`,
					hint: "Group by subject: move the part name to its own segment (AGENTS §3).",
				});
			}
		}
	},
});

function stripPluralSuffix(
	segment: string,
	{ pluralSuffixes, pluralSeparator }: ProjectConfig["i18n"],
): string {
	const match = pluralSuffixes.find((suffix) =>
		segment.endsWith(`${pluralSeparator}${suffix}`),
	);
	return match
		? segment.slice(0, -(match.length + pluralSeparator.length))
		: segment;
}

/** 2+ sibling keys in the same object sharing the same leading hyphen-word must nest as a group. */
export const i18nKeySiblingPrefix = defineFileRule<Record<string, never>>({
	id: "i18n-key-sibling-prefix",
	description:
		"Sibling keys that share a leading hyphen-word must be nested as a group.",
	docs: "AGENTS §3",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/locales/*.json"],
	defaults: {},
	check(file, ctx) {
		const data = parseJson(file.code);
		if (!data) return;
		const i18n = ctx.config.i18n;
		const walkObject = (value: JsonValue, path: string): void => {
			if (!isJsonRecord(value)) return;
			const keys = Object.keys(value);
			const byLeadWord = new Map<string, string[]>();
			for (const key of keys) {
				// Only group leaf (string) copy entries — object-valued keys are namespace
				// containers that mirror route/component file names (naturally hyphenated,
				// see AGENTS §2 file naming) and are not subject to this grouping heuristic.
				if (isJsonRecord(value[key] as JsonValue)) continue;
				const stem = stripPluralSuffix(key, i18n);
				const dashIndex = stem.indexOf("-");
				if (dashIndex <= 0) continue;
				const lead = stem.slice(0, dashIndex);
				const siblings = byLeadWord.get(lead) ?? [];
				siblings.push(key);
				byLeadWord.set(lead, siblings);
			}
			for (const [lead, siblings] of byLeadWord) {
				const distinctStems = new Set(
					siblings.map((key) => stripPluralSuffix(key, i18n)),
				);
				if (distinctStems.size < 2) continue;
				ctx.report(file, {
					at: { line: 1, column: 1 },
					message: `Locale keys "${[...distinctStems].join('", "')}" under "${path}" share the leading word "${lead}" — nest them as "${path}.${lead}.…" instead.`,
					hint: "Group by subject: use a nested object for the shared prefix (AGENTS §3).",
				});
			}
			for (const key of keys) {
				const child = value[key];
				if (child !== undefined)
					walkObject(child, path ? `${path}.${key}` : key);
			}
		};
		walkObject(data, "");
	},
});

/** A segment starting with a qualifier word glued onto a subject must be subject-first instead. */
export const i18nQualifierGlue = defineFileRule<Record<string, never>>({
	id: "i18n-qualifier-glue",
	description:
		"A qualifier word must not prefix a subject; the subject comes first.",
	docs: "AGENTS §3",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/locales/*.json"],
	defaults: {},
	check(file, ctx) {
		const data = parseJson(file.code);
		if (!data) return;
		const qualifiers = ctx.config.i18n.qualifierNames.join("|");
		const pattern = new RegExp(`^(${qualifiers})-(.+)$`);
		for (const key of flattenJsonKeys(data)) {
			for (const segment of key.split(".")) {
				const stem = stripPluralSuffix(segment, ctx.config.i18n);
				const match = pattern.exec(stem);
				if (match) {
					ctx.report(file, {
						at: { line: 1, column: 1 },
						message: `Locale key "${key}" glues the qualifier "${match[1]}" onto "${match[2]}".`,
						hint: `Put the subject first: "${match[2]}.${match[1]}" (AGENTS §3).`,
					});
					break;
				}
			}
		}
	},
});

/** Plural group name for a category noun: status -> statuses, category -> categories, mode -> modes. */
function pluralize(noun: string): string {
	if (noun === "pos") return noun;
	if (noun.endsWith("y")) return `${noun.slice(0, -1)}ies`;
	if (/(s|x|ch|sh)$/.test(noun)) return `${noun}es`;
	return `${noun}s`;
}

/** A trailing category noun glued onto a subject (`card-status`, `x-pos`) must lead a plural group (`statuses.card`, `pos.x`). */
export const i18nCategoryGlue = defineFileRule<Record<string, never>>({
	id: "i18n-category-glue",
	description:
		"A category noun (status, role, type, pos, …) must be a group, not a hyphen suffix.",
	docs: "AGENTS §3",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/locales/*.json"],
	defaults: {},
	check(file, ctx) {
		const data = parseJson(file.code);
		if (!data) return;
		const nouns = ctx.config.i18n.categoryNouns.join("|");
		const pattern = new RegExp(`^(.+)-(${nouns})$`);
		const seen = new Set<string>();
		const walkObject = (value: JsonValue, path: string): void => {
			if (!isJsonRecord(value)) return;
			for (const key of Object.keys(value)) {
				const child = value[key];
				if (child === undefined) continue;
				const childPath = path ? `${path}.${key}` : key;
				const match = pattern.exec(
					stripPluralSuffix(key, ctx.config.i18n),
				);
				if (match && !seen.has(childPath)) {
					seen.add(childPath);
					ctx.report(file, {
						at: { line: 1, column: 1 },
						message: `Locale key "${childPath}" glues the category "${match[2]}" onto "${match[1]}".`,
						hint: `Group by plural category: "${pluralize(match[2] ?? "")}.${match[1]}" (AGENTS §3).`,
					});
				}
				walkObject(child, childPath);
			}
		};
		walkObject(data, "");
	},
});

/** `step-1`, `step-2` siblings must be one numbered group: `steps.1`, `steps.2`. */
export const i18nKeyIndexed = defineFileRule<Record<string, never>>({
	id: "i18n-key-indexed",
	description:
		"A numbered key (`step-1`) must be an item of a plural group (`steps.1`).",
	docs: "AGENTS §3",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/locales/*.json"],
	defaults: {},
	check(file, ctx) {
		const data = parseJson(file.code);
		if (!data) return;
		const walkObject = (value: JsonValue, path: string): void => {
			if (!isJsonRecord(value)) return;
			for (const key of Object.keys(value)) {
				const child = value[key];
				if (child === undefined) continue;
				const childPath = path ? `${path}.${key}` : key;
				const match = /^(.*[a-z])-([1-9]\d*)$/.exec(key);
				if (match) {
					ctx.report(file, {
						at: { line: 1, column: 1 },
						message: `Locale key "${childPath}" numbers a hyphenated segment.`,
						hint: `Nest it: "${match[1]}s.${match[2]}" (AGENTS §3).`,
					});
				}
				walkObject(child, childPath);
			}
		};
		walkObject(data, "");
	},
});

/** A part name (title, label, description, …) must be the last segment of a key — never a group with children. */
/**
 * A part-name segment (title, label, …) must normally be the last segment of a key. Some part
 * words (empty, error, cancel, success, …) also legitimately name a whole sub-flow/state that
 * owns its own parts (AGENTS §3's own `request.title`/`request.description`/`request.submit`
 * example) — that is fine as long as at least one immediate child is itself a recognized part
 * (or a validation `errors` subtree), which is what marks the node as a real subject rather than
 * a bare enumeration of unrelated variants (the `title.catering`/`title.setup`/`title.both` bug).
 */
export const i18nPartAsGroup = defineFileRule<Record<string, never>>({
	id: "i18n-part-as-group",
	description:
		"A part-name segment used as a group must own at least one real part; a pure variant enumeration must be subject-first instead.",
	docs: "AGENTS §3",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/locales/*.json"],
	defaults: {},
	check(file, ctx) {
		const data = parseJson(file.code);
		if (!data) return;
		const parts = new Set(ctx.config.i18n.partNames);
		const i18n = ctx.config.i18n;
		const isRealPartChild = (childKey: string): boolean => {
			const stem = stripPluralSuffix(childKey, i18n);
			return stem === "errors" || parts.has(stem);
		};
		const walkObject = (value: JsonValue, path: string): void => {
			if (!isJsonRecord(value)) return;
			for (const key of Object.keys(value)) {
				const child = value[key];
				if (child === undefined) continue;
				const childPath = path ? `${path}.${key}` : key;
				const stem = stripPluralSuffix(key, i18n);
				if (
					isJsonRecord(child) &&
					parts.has(stem) &&
					!Object.keys(child).some(isRealPartChild)
				) {
					ctx.report(file, {
						at: { line: 1, column: 1 },
						message: `Locale key "${childPath}" groups unrelated variants under part name "${stem}" instead of owning real parts.`,
						hint: `Put the subject first: move "${stem}" to the end for each variant (AGENTS §3).`,
					});
				}
				walkObject(child, childPath);
			}
		};
		walkObject(data, "");
	},
});

function namespaceOf(path: string, config: ProjectConfig): string {
	const alias = config.i18n.namespaceAliases
		.filter((a) => path === a.path || path.startsWith(`${a.path}/`))
		.sort((a, b) => b.path.length - a.path.length)[0];
	if (alias) return alias.namespace;
	const relRaw = path
		.replace(/^src\//, "")
		.replace(/\.tsx?$/, "")
		.replace(/\.json$/, "");
	if (path.startsWith(`${config.routes.dir}/`)) {
		const segments = relRaw.split("/").slice(1);
		const componentsIndex = segments.findIndex((segment) =>
			config.routes.componentDirs.includes(segment),
		);
		const scoped =
			componentsIndex === -1
				? segments
				: segments.slice(0, componentsIndex);
		const filtered = scoped.filter(
			(segment) => segment !== "index" && segment !== "layout",
		);
		return (filtered.length > 0 ? filtered : scoped).join(".");
	}
	const segments = relRaw.split("/");
	// common/shared components: the feature folder (or file, when flat) is the namespace, so
	// sub-grouping folders inside it never change keys.
	const [root, kind] = segments;
	if (
		root === "components" &&
		(`src/components/${kind}` === config.components.common ||
			`src/components/${kind}` === config.components.shared)
	)
		return segments.slice(0, 3).join(".");
	return segments.join(".");
}

function allowedNamespacePrefixes(
	namespace: string,
	config: ProjectConfig,
): string[] {
	const prefixes = [...config.i18n.sharedNamespaces];
	const parts = namespace.split(".");
	for (let i = 1; i <= parts.length; i++)
		prefixes.push(parts.slice(0, i).join("."));
	return prefixes;
}

export const i18nKeyNamespace = defineFileRule<Record<string, never>>({
	id: "i18n-key-namespace",
	description:
		"A t() key must live under this file's namespace, an ancestor route namespace, or a shared namespace.",
	docs: "AGENTS §3",
	severity: Severity.Warn,
	fixable: false,
	include: ["src/**/*.{ts,tsx}"],
	exclude: ["src/components/ui/**"],
	defaults: {},
	check(file, ctx) {
		const namespace = namespaceOf(file.path, ctx.config);
		if (!namespace) return;
		const allowed = allowedNamespacePrefixes(namespace, ctx.config);
		for (const call of translationCalls(file, ctx.config)) {
			if (call.key === null) continue;
			if (
				!allowed.some(
					(prefix) =>
						call.key === prefix ||
						call.key?.startsWith(`${prefix}.`),
				)
			) {
				ctx.report(file, {
					node: call.call,
					message: `Key "${call.key}" is outside this file's namespace "${namespace}".`,
					hint: `Use a key under "${namespace}", an ancestor route namespace, or common (AGENTS §3).`,
				});
			}
		}
	},
});

export const i18nUnusedKey = defineProjectRule<Record<string, never>>({
	id: "i18n-unused-key",
	description: "A locale key that no file references.",
	docs: "AGENTS §3",
	severity: Severity.Warn,
	fixable: false,
	include: [],
	defaults: {},
	check(project, ctx) {
		const localeFile = project.byPath.get(ctx.config.i18n.locale);
		if (!localeFile) return;
		const data = parseJson(localeFile.code);
		if (!data) return;
		const allKeys = flattenJsonKeys(data);

		const referenced = new Set<string>();
		const prefixes: string[] = [];
		for (const file of project.files) {
			if (!file.ast) continue;
			// Any string literal anywhere (not just t() calls) counts as a reference — catches
			// keys stored in a Record<Enum, TranslationKey> lookup and read via a computed t(map[x]).
			walk(file.ast, (node) => {
				if (t.isStringLiteral(node)) referenced.add(node.value);
				return true;
			});
			// t() calls specifically also resolve the `const P = "…"; t(\`${P}.suffix\`)` idiom.
			for (const call of translationCalls(file, ctx.config)) {
				if (call.key === null) continue;
				if (call.isTemplate) prefixes.push(call.key);
				else referenced.add(call.key);
			}
		}

		for (const key of allKeys) {
			if (referenced.has(key)) continue;
			const pluralBase = stripPluralSuffix(key, ctx.config.i18n);
			if (pluralBase !== key && referenced.has(pluralBase)) continue;
			if (
				prefixes.some(
					(prefix) => prefix.length > 0 && key.startsWith(prefix),
				)
			)
				continue;
			ctx.report(localeFile, {
				at: { line: 1, column: 1 },
				message: `Locale key "${key}" is not referenced by any file.`,
				hint: "Remove it, or reference it via t() (AGENTS §3).",
			});
		}
	},
});

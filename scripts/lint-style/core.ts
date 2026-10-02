/**
 * Core types, parsing, traversal helpers and the lint engine for
 * scripts/lint-style. Nothing here is project-specific — see config.ts.
 */
import { parse } from "@babel/parser";
import * as t from "@babel/types";
import { existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";

// ─────────────────────────── Core enums & types ───────────────────────────

export enum Severity {
	Error = "error",
	Warn = "warn",
	Off = "off",
}

export enum RuleKind {
	File = "file",
	Project = "project",
}

export interface Location {
	line: number;
	column: number;
}

export interface TextEdit {
	start: number;
	end: number;
	text: string;
}

export interface Report {
	node?: t.Node;
	at?: Location;
	message: string;
	hint?: string;
	fix?: TextEdit;
}

export interface SourceFile {
	absPath: string;
	/** repo-relative, POSIX separators */
	path: string;
	code: string;
	ast: t.File | null;
	parseErrorMessage: string | null;
}

export interface Project {
	files: readonly SourceFile[];
	byPath: ReadonlyMap<string, SourceFile>;
	/** file path -> resolved repo-relative paths it imports */
	imports: ReadonlyMap<string, readonly string[]>;
	/** file path -> repo-relative paths that import it (reverse of imports) */
	importedBy: ReadonlyMap<string, readonly string[]>;
	changedPaths: ReadonlySet<string> | null;
}

interface RuleBase<TOptions extends object> {
	id: string;
	description: string;
	/** AGENTS.md anchor, printed with each violation */
	docs: string;
	severity: Severity;
	fixable: boolean;
	/** Bun.Glob patterns, relative to project root */
	include: readonly string[];
	exclude?: readonly string[];
	defaults: TOptions;
}

export interface RuleContext<TOptions extends object> {
	options: TOptions;
	config: ProjectConfig;
	report(file: SourceFile, report: Report): void;
}

export interface FileRule<TOptions extends object> extends RuleBase<TOptions> {
	kind: RuleKind.File;
	check(file: SourceFile, ctx: RuleContext<TOptions>): void;
}

export interface ProjectRule<
	TOptions extends object,
> extends RuleBase<TOptions> {
	kind: RuleKind.Project;
	check(project: Project, ctx: RuleContext<TOptions>): void;
}

/**
 * Every rule in this project declares empty options (`Record<string, never>`), so the
 * registry is stored at that concrete type rather than erased to `never` — erasing to
 * `never` would require an unsafe cast to reconstruct a value of type `never` at the
 * generic call site in the engine, which the project bans.
 */
export type AnyRule =
	FileRule<Record<string, never>> | ProjectRule<Record<string, never>>;

export function defineFileRule<TOptions extends object>(
	rule: Omit<FileRule<TOptions>, "kind">,
): FileRule<TOptions> {
	return { ...rule, kind: RuleKind.File };
}

export function defineProjectRule<TOptions extends object>(
	rule: Omit<ProjectRule<TOptions>, "kind">,
): ProjectRule<TOptions> {
	return { ...rule, kind: RuleKind.Project };
}

// ─────────────────────────── Project config shape ───────────────────────────

export interface ProjectConfig {
	root: string;
	include: readonly string[];
	exclude: readonly string[];
	alias: { prefix: string; target: string };
	allowRelativeImports: readonly string[];
	routes: {
		dir: string;
		manifest: string;
		/** react-router `appDirectory`; route()/index()/layout() paths in the manifest are relative to this. */
		appDir: string;
		pageFiles: readonly string[];
		componentDirs: readonly string[];
	};
	components: { common: string; shared: string; ui: string };
	/** React contexts (provider + consumer hook), one per file `<name>-context.tsx` — see context-location. */
	contextsDir: string;
	/** Folder size limit: a crowded folder groups files by shared leading word (see folder-grouping). */
	structure: { maxFilesPerFolder: number; exemptDirs: readonly string[] };
	i18n: {
		locale: string;
		functions: readonly string[];
		sharedNamespaces: readonly string[];
		/** Path prefix -> i18n namespace, for files whose path-derived namespace is not where their copy lives (longest prefix wins). */
		namespaceAliases: readonly { path: string; namespace: string }[];
		partNames: readonly string[];
		/** Qualifier words that must lead a subject-first nested key (`invalid-date` -> `date.invalid`) rather than prefix it. */
		qualifierNames: readonly string[];
		pluralSuffixes: readonly string[];
		/** Separator before a plural suffix: `items-one`, never snake_case `items_one`. Must match `pluralSeparator` in src/lib/i18n.ts. */
		pluralSeparator: string;
		/** Category nouns that must lead a nested key (`card-status` -> `status.card`) rather than trail a hyphenated one. */
		categoryNouns: readonly string[];
		uiAttributes: readonly string[];
		allowedText: readonly string[];
	};
	styling: {
		classAttributes: readonly string[];
		classFunctions: readonly string[];
		nativeElements: Readonly<Record<string, string>>;
	};
	config: {
		file: string;
		keyRoots: readonly string[];
		routesRoot: string;
		/** functions whose first string-literal argument acts like a query/mutation key */
		mockKeyFunctions: readonly string[];
	};
	bannedImports: Readonly<Record<string, string>>;
	memoryFile: string;
}

// ─────────────────────────── Violations ───────────────────────────

export interface Violation {
	ruleId: string;
	severity: Severity;
	path: string;
	line: number;
	column: number;
	message: string;
	hint: string | null;
	docs: string;
	fix: TextEdit | null;
}

type RuleOverride = Severity | readonly [Severity, Record<string, unknown>];

export interface LintConfigLike {
	project: ProjectConfig;
	rules?: Readonly<Record<string, RuleOverride | undefined>>;
}

export interface LintOptions {
	/** run only these rule ids */
	ruleIds?: readonly string[];
	/** repo-relative paths changed vs HEAD (enables --changed scoped reporting + memory-updated) */
	changedPaths?: ReadonlySet<string>;
}

export interface LintResult {
	violations: Violation[];
	project: Project;
}

// ─────────────────────────── Parsing ───────────────────────────

export function parseSource(
	path: string,
	code: string,
	absPath = path,
): SourceFile {
	if (path.endsWith(".json")) {
		return { absPath, path, code, ast: null, parseErrorMessage: null };
	}
	try {
		const ast = parse(code, {
			sourceType: "module",
			errorRecovery: true,
			plugins: ["typescript", "jsx"],
			tokens: false,
		});
		// ponytail: parser 7 returns @babel/types 7 nodes while this project types against 8; drop the cast with parser 8.
		return {
			absPath,
			path,
			code,
			ast: ast as unknown as t.File,
			parseErrorMessage: null,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return { absPath, path, code, ast: null, parseErrorMessage: message };
	}
}

// ─────────────────────────── JSON helpers (for locale files) ───────────────────────────

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export function isJsonRecord(
	value: JsonValue,
): value is { [key: string]: JsonValue } {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseJson(code: string): JsonValue | null {
	try {
		const data: JsonValue = JSON.parse(code);
		return data;
	} catch {
		return null;
	}
}

/** Flatten a JSON object into dot-path keys (leaves only). */
export function flattenJsonKeys(value: JsonValue, prefix = ""): string[] {
	if (!isJsonRecord(value)) return prefix ? [prefix] : [];
	const keys: string[] = [];
	for (const key of Object.keys(value)) {
		const child = value[key];
		if (child === undefined) continue;
		keys.push(...flattenJsonKeys(child, prefix ? `${prefix}.${key}` : key));
	}
	return keys;
}

// ─────────────────────────── Path & string helpers ───────────────────────────

export function toPosixPath(path: string): string {
	return path.split("\\").join("/");
}

export function matchesGlob(
	path: string,
	patterns: readonly string[],
): boolean {
	return patterns.some((pattern) => new Bun.Glob(pattern).match(path));
}

export function isIncluded(
	path: string,
	include: readonly string[],
	exclude: readonly string[] | undefined,
): boolean {
	if (!matchesGlob(path, include)) return false;
	if (exclude && matchesGlob(path, exclude)) return false;
	return true;
}

export function pascalCase(kebab: string): string {
	return kebab
		.split(/[-_]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
}

export function kebabCase(name: string): string {
	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
		.toLowerCase();
}

export function isKebabCase(name: string): boolean {
	return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

export function isPascalCase(name: string): boolean {
	return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

// ─────────────────────────── AST traversal ───────────────────────────

/** Every direct AST child of `node` (no comments/loc/etc, since those aren't Nodes). */
export function forEachChild(node: t.Node, fn: (child: t.Node) => void): void {
	for (const value of Object.values(node)) {
		if (t.isNode(value)) {
			fn(value);
		} else if (Array.isArray(value)) {
			for (const item of value) {
				if (t.isNode(item)) fn(item);
			}
		}
	}
}

/** Full-tree preorder walk. `visitor` returning `false` skips that node's subtree. */
export function walk(
	root: t.Node,
	visitor: (node: t.Node) => boolean | void,
): void {
	const stack: t.Node[] = [root];
	while (stack.length > 0) {
		const node = stack.pop();
		if (!node) continue;
		const descend = visitor(node);
		if (descend === false) continue;
		const children: t.Node[] = [];
		forEachChild(node, (child) => children.push(child));
		for (let i = children.length - 1; i >= 0; i--) {
			const child = children[i];
			if (child) stack.push(child);
		}
	}
}

/** Walk `root`, but never descend into a nested Function (or Class) boundary. */
export function walkOwnBody(
	root: t.Node,
	visitor: (node: t.Node) => void,
): void {
	walk(root, (node) => {
		if (node !== root && (t.isFunction(node) || t.isClass(node)))
			return false;
		visitor(node);
		return true;
	});
}

export function isJsxNode(node: t.Node): boolean {
	return t.isJSXElement(node) || t.isJSXFragment(node);
}

/** Does this function's own body (not nested functions) return JSX? */
export function returnsJsx(fn: t.Function): boolean {
	if (t.isArrowFunctionExpression(fn) && !t.isBlockStatement(fn.body)) {
		return isJsxNode(fn.body);
	}
	let found = false;
	walkOwnBody(fn, (node) => {
		if (found) return;
		if (
			t.isReturnStatement(node) &&
			node.argument &&
			isJsxNode(node.argument)
		) {
			found = true;
		}
	});
	return found;
}

export interface Ancestor {
	node: t.Node;
	parents: readonly t.Node[];
}

/** Preorder walk exposing the ancestor chain (root..parent) for every node. */
export function walkWithAncestors(
	root: t.Node,
	visitor: (node: t.Node, ancestors: readonly t.Node[]) => void,
): void {
	const recurse = (node: t.Node, ancestors: readonly t.Node[]): void => {
		visitor(node, ancestors);
		const nextAncestors = [...ancestors, node];
		forEachChild(node, (child) => recurse(child, nextAncestors));
	};
	recurse(root, []);
}

export function nearestFunction(
	ancestors: readonly t.Node[],
): t.Function | null {
	for (let i = ancestors.length - 1; i >= 0; i--) {
		const candidate = ancestors[i];
		if (candidate && t.isFunction(candidate)) return candidate;
	}
	return null;
}

/** Name bound to a function declaration/expression/arrow, if any (via VariableDeclarator or FunctionDeclaration id). */
export function functionName(
	fn: t.Function,
	ancestors: readonly t.Node[],
): string | null {
	if (t.isFunctionDeclaration(fn) && fn.id) return fn.id.name;
	const parent = ancestors[ancestors.length - 1];
	if (parent && t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) {
		return parent.id.name;
	}
	return null;
}

// ─────────────────────────── Comments / suppressions ───────────────────────────

const SUPPRESSION_PATTERN =
	/^style-lint-ignore-(next-line|file)\s+([a-z0-9-]+)(?:\s+--\s*(.+))?$/;

export interface SuppressionDirective {
	kind: "next-line" | "file";
	ruleId: string;
	reason: string | null;
	line: number;
	targetLine: number | null;
	used: boolean;
}

export function collectSuppressions(file: SourceFile): SuppressionDirective[] {
	if (!file.ast) return [];
	const directives: SuppressionDirective[] = [];
	for (const comment of file.ast.comments ?? []) {
		const match = SUPPRESSION_PATTERN.exec(comment.value.trim());
		if (!match) continue;
		const kind = match[1] === "file" ? "file" : "next-line";
		const ruleId = match[2] ?? "";
		const reason = match[3]?.trim() || null;
		const line = comment.loc?.start.line ?? 1;
		const endLine = comment.loc?.end.line ?? line;
		directives.push({
			kind,
			ruleId,
			reason,
			line,
			targetLine: kind === "next-line" ? endLine + 1 : null,
			used: false,
		});
	}
	return directives;
}

// ─────────────────────────── classStrings / translationCalls ───────────────────────────

export interface ClassStringHit {
	value: string;
	node: t.Node;
}

function collectStringLiterals(
	node: t.Node,
	out: ClassStringHit[],
	seen: Set<t.Node>,
): void {
	if (seen.has(node)) return;
	seen.add(node);
	if (t.isStringLiteral(node)) {
		out.push({ value: node.value, node });
		return;
	}
	if (t.isTemplateLiteral(node)) {
		for (const quasi of node.quasis) {
			if (quasi.value.raw.trim())
				out.push({ value: quasi.value.raw, node: quasi });
		}
	}
	forEachChild(node, (child) => collectStringLiterals(child, out, seen));
}

/** Every class-string literal/template chunk passed to a configured class attribute or class function. */
export function classStrings(
	file: SourceFile,
	config: ProjectConfig,
): ClassStringHit[] {
	if (!file.ast) return [];
	const hits: ClassStringHit[] = [];
	const seen = new Set<t.Node>();
	walk(file.ast, (node) => {
		if (
			t.isJSXAttribute(node) &&
			t.isJSXIdentifier(node.name) &&
			config.styling.classAttributes.includes(node.name.name) &&
			node.value
		) {
			collectStringLiterals(node.value, hits, seen);
		}
		if (
			t.isCallExpression(node) &&
			t.isIdentifier(node.callee) &&
			config.styling.classFunctions.includes(node.callee.name)
		) {
			for (const arg of node.arguments)
				collectStringLiterals(arg, hits, seen);
		}
		return true;
	});
	return hits;
}

export interface TranslationCall {
	call: t.CallExpression;
	/** literal key, or template prefix up to the first ${…} */
	key: string | null;
	isTemplate: boolean;
	args: readonly t.Node[];
}

function calleeMatchesTFunction(
	callee: t.Node,
	functions: readonly string[],
): boolean {
	if (t.isIdentifier(callee)) return functions.includes(callee.name);
	if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
		return functions.includes(callee.property.name);
	}
	return false;
}

/** Top-level `const NAME = "literal"` bindings — resolves the common `const P = "a.b.c"; t(\`${P}.d\`)` idiom. */
function resolveConstStrings(file: SourceFile): ReadonlyMap<string, string> {
	const map = new Map<string, string>();
	if (!file.ast) return map;
	for (const stmt of file.ast.program.body) {
		if (!t.isVariableDeclaration(stmt)) continue;
		for (const decl of stmt.declarations) {
			if (
				t.isIdentifier(decl.id) &&
				decl.init &&
				t.isStringLiteral(decl.init)
			) {
				map.set(decl.id.name, decl.init.value);
			}
		}
	}
	return map;
}

/** Reconstructs a template literal's static prefix, resolving simple identifier bindings (see resolveConstStrings). */
function templateKeyPrefix(
	file: SourceFile,
	template: t.TemplateLiteral,
): string {
	const consts = resolveConstStrings(file);
	let result = "";
	for (let i = 0; i < template.quasis.length; i++) {
		result += template.quasis[i]?.value.raw ?? "";
		if (i >= template.expressions.length) continue;
		const expr = template.expressions[i];
		const resolved =
			expr && t.isIdentifier(expr) ? consts.get(expr.name) : undefined;
		if (resolved === undefined) return result;
		result += resolved;
	}
	return result;
}

export function translationCalls(
	file: SourceFile,
	config: ProjectConfig,
): TranslationCall[] {
	if (!file.ast) return [];
	const calls: TranslationCall[] = [];
	walk(file.ast, (node) => {
		if (!t.isCallExpression(node)) return true;
		if (!calleeMatchesTFunction(node.callee, config.i18n.functions))
			return true;
		let first = node.arguments[0];
		while (
			first &&
			(t.isTSAsExpression(first) || t.isTSTypeAssertion(first))
		) {
			first = first.expression;
		}
		let key: string | null = null;
		let isTemplate = false;
		if (first && t.isStringLiteral(first)) {
			key = first.value;
		} else if (first && t.isTemplateLiteral(first)) {
			isTemplate = true;
			key = templateKeyPrefix(file, first);
		}
		calls.push({ call: node, key, isTemplate, args: node.arguments });
		return true;
	});
	return calls;
}

// ─────────────────────────── Import resolution ───────────────────────────

const RESOLVE_EXTENSIONS = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

/** Resolve an import specifier from `fromPath` (repo-relative) to a repo-relative file path, or null. */
export function resolveImport(
	fromPath: string,
	spec: string,
	config: ProjectConfig,
): string | null {
	let base: string;
	if (spec.startsWith(config.alias.prefix)) {
		base = join(
			config.alias.target,
			spec.slice(config.alias.prefix.length),
		);
	} else if (spec.startsWith(".")) {
		base = join(dirname(fromPath), spec);
	} else {
		return null;
	}
	base = toPosixPath(base);
	for (const suffix of RESOLVE_EXTENSIONS) {
		const candidate = base + suffix;
		if (existsSync(join(config.root, candidate))) return candidate;
	}
	return null;
}

export function importSpecifiers(file: SourceFile): string[] {
	if (!file.ast) return [];
	const specs: string[] = [];
	for (const stmt of file.ast.program.body) {
		if (t.isImportDeclaration(stmt)) specs.push(stmt.source.value);
		if (
			t.isExportNamedDeclaration(stmt) &&
			stmt.source &&
			typeof stmt.source.value === "string"
		) {
			specs.push(stmt.source.value);
		}
	}
	walk(file.ast, (node) => {
		if (
			t.isCallExpression(node) &&
			node.callee.type === "Import" &&
			node.arguments[0] &&
			t.isStringLiteral(node.arguments[0])
		) {
			specs.push(node.arguments[0].value);
		}
		return true;
	});
	return specs;
}

function buildProject(
	files: readonly SourceFile[],
	config: ProjectConfig,
	changedPaths: ReadonlySet<string> | null,
): Project {
	const byPath = new Map(files.map((file) => [file.path, file]));
	const imports = new Map<string, readonly string[]>();
	const importedByBuilder = new Map<string, string[]>();
	for (const file of files) {
		const resolved: string[] = [];
		for (const spec of importSpecifiers(file)) {
			const target = resolveImport(file.path, spec, config);
			if (target && byPath.has(target)) resolved.push(target);
		}
		imports.set(file.path, resolved);
		for (const target of resolved) {
			const list = importedByBuilder.get(target) ?? [];
			list.push(file.path);
			importedByBuilder.set(target, list);
		}
	}
	const importedBy = new Map<string, readonly string[]>();
	for (const [path, list] of importedByBuilder) importedBy.set(path, list);
	return { files, byPath, imports, importedBy, changedPaths };
}

// ─────────────────────────── Rule execution engine ───────────────────────────

function locationOf(report: Report): Location {
	if (report.node?.loc) {
		return {
			line: report.node.loc.start.line,
			column: report.node.loc.start.column + 1,
		};
	}
	if (report.at) return report.at;
	return { line: 1, column: 1 };
}

function overrideTable(
	rules: LintConfigLike["rules"],
): Readonly<Record<string, RuleOverride | undefined>> {
	return rules ?? {};
}

function severityOf(
	id: string,
	fallback: Severity,
	config: LintConfigLike,
): Severity {
	const override = overrideTable(config.rules)[id];
	if (override === undefined) return fallback;
	return typeof override === "string" ? override : override[0];
}

function runFileRule<TOptions extends object>(
	rule: FileRule<TOptions>,
	project: Project,
	config: LintConfigLike,
	emit: (violation: Violation) => void,
): void {
	const severity = severityOf(rule.id, rule.severity, config);
	if (severity === Severity.Off) return;
	const ctx: RuleContext<TOptions> = {
		options: rule.defaults,
		config: config.project,
		report: (file, report) => {
			const loc = locationOf(report);
			emit({
				ruleId: rule.id,
				severity,
				path: file.path,
				line: loc.line,
				column: loc.column,
				message: report.message,
				hint: report.hint ?? null,
				docs: rule.docs,
				fix: report.fix ?? null,
			});
		},
	};
	for (const file of project.files) {
		if (!isIncluded(file.path, rule.include, rule.exclude)) continue;
		rule.check(file, ctx);
	}
}

function runProjectRule<TOptions extends object>(
	rule: ProjectRule<TOptions>,
	project: Project,
	config: LintConfigLike,
	emit: (violation: Violation) => void,
): void {
	const severity = severityOf(rule.id, rule.severity, config);
	if (severity === Severity.Off) return;
	const ctx: RuleContext<TOptions> = {
		options: rule.defaults,
		config: config.project,
		report: (file, report) => {
			const loc = locationOf(report);
			emit({
				ruleId: rule.id,
				severity,
				path: file.path,
				line: loc.line,
				column: loc.column,
				message: report.message,
				hint: report.hint ?? null,
				docs: rule.docs,
				fix: report.fix ?? null,
			});
		},
	};
	rule.check(project, ctx);
}

function applySuppressions(
	files: readonly SourceFile[],
	violations: readonly Violation[],
	config: LintConfigLike,
	ruleIds: readonly string[] | undefined,
): Violation[] {
	const byFile = new Map<string, SuppressionDirective[]>();
	for (const file of files) byFile.set(file.path, collectSuppressions(file));

	const kept: Violation[] = [];
	for (const violation of violations) {
		const directives = byFile.get(violation.path) ?? [];
		const match = directives.find(
			(directive) =>
				directive.reason !== null &&
				directive.ruleId === violation.ruleId &&
				(directive.kind === "file" ||
					directive.targetLine === violation.line),
		);
		if (match) {
			match.used = true;
			continue;
		}
		kept.push(violation);
	}

	const reasonSeverity = severityOf(
		"suppression-reason",
		Severity.Error,
		config,
	);
	const unusedSeverity = severityOf(
		"unused-suppression",
		Severity.Warn,
		config,
	);
	for (const file of files) {
		for (const directive of byFile.get(file.path) ?? []) {
			if (directive.reason === null && reasonSeverity !== Severity.Off) {
				kept.push({
					ruleId: "suppression-reason",
					severity: reasonSeverity,
					path: file.path,
					line: directive.line,
					column: 1,
					message: `style-lint-ignore-${directive.kind} ${directive.ruleId} has no reason`,
					hint: 'Add " -- <reason>" after the rule id.',
					docs: "AGENTS §0",
					fix: null,
				});
			} else if (
				directive.reason !== null &&
				!directive.used &&
				unusedSeverity !== Severity.Off &&
				(ruleIds === undefined || ruleIds.includes(directive.ruleId))
			) {
				kept.push({
					ruleId: "unused-suppression",
					severity: unusedSeverity,
					path: file.path,
					line: directive.line,
					column: 1,
					message: `style-lint-ignore-${directive.kind} ${directive.ruleId} did not suppress anything`,
					hint: "Remove this suppression or fix the rule id.",
					docs: "AGENTS §0",
					fix: null,
				});
			}
		}
	}
	return kept;
}

function checkMemoryUpdated(
	project: Project,
	config: LintConfigLike,
): Violation[] {
	if (!project.changedPaths) return [];
	const severity = severityOf("memory-updated", Severity.Warn, config);
	if (severity === Severity.Off) return [];
	const memoryPath = config.project.memoryFile;
	const touchedSrc = [...project.changedPaths].some((path) =>
		path.startsWith("src/"),
	);
	if (!touchedSrc || project.changedPaths.has(memoryPath)) return [];
	return [
		{
			ruleId: "memory-updated",
			severity,
			path: memoryPath,
			line: 1,
			column: 1,
			message: "src/ changed but MEMORY.md was not updated",
			hint: 'Update MEMORY.md following its "How to update" section (AGENTS §0).',
			docs: "AGENTS §0",
			fix: null,
		},
	];
}

export function lintSources(
	files: readonly SourceFile[],
	config: LintConfigLike,
	rules: Readonly<Record<string, AnyRule>>,
	options: LintOptions = {},
): LintResult {
	const project = buildProject(
		files,
		config.project,
		options.changedPaths ?? null,
	);
	const scope = options.changedPaths
		? project.files.filter((file) => options.changedPaths?.has(file.path))
		: project.files;
	const scopedProject: Project = { ...project, files: scope };

	const raw: Violation[] = [];
	const emit = (violation: Violation) => raw.push(violation);
	const wanted = options.ruleIds;

	for (const rule of Object.values(rules)) {
		if (wanted && !wanted.includes(rule.id)) continue;
		if (rule.kind === RuleKind.File) {
			runFileRule(rule, scopedProject, config, emit);
		} else {
			runProjectRule(rule, project, config, emit);
		}
	}

	const suppressed = applySuppressions(scope, raw, config, wanted);
	if (!wanted || wanted.includes("memory-updated")) {
		suppressed.push(...checkMemoryUpdated(project, config));
	}
	suppressed.sort(
		(a, b) =>
			a.path.localeCompare(b.path) ||
			a.line - b.line ||
			a.column - b.column,
	);
	return { violations: suppressed, project };
}

export function relativePosix(root: string, absPath: string): string {
	return toPosixPath(relative(root, absPath));
}

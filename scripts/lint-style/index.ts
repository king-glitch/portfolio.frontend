/**
 * CLI for the style linter. See docs/plans/10-style-lint.md §3.7 for flags.
 *
 *   bun run lint:style
 *   bun run lint:style -- --changed
 *   bun run lint:style -- --fix
 *   bun run lint:style -- --rule=no-as-cast,no-any
 *   bun run lint:style -- --json
 *   bun run lint:style -- --quiet
 *   bun run lint:style -- --max-warnings=0
 *   bun run lint:style -- --list-rules
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import config, { rules } from "./config";
import {
	lintSources,
	matchesGlob,
	parseSource,
	Severity,
	toPosixPath,
	type SourceFile,
	type Violation,
} from "./core";

const args = process.argv.slice(2);
const flag = (name: string): boolean => args.includes(name);
const option = (name: string): string | null => {
	const arg = args.find((a) => a.startsWith(`${name}=`));
	return arg ? arg.slice(name.length + 1) : null;
};

const isChanged = flag("--changed");
const isFix = flag("--fix");
const isJson = flag("--json");
const isQuiet = flag("--quiet");
const isListRules = flag("--list-rules");
const ruleFilter = option("--rule")
	?.split(",")
	.map((id) => id.trim());
const maxWarningsOption = option("--max-warnings");
const maxWarnings =
	maxWarningsOption === null ? null : Number(maxWarningsOption);

function discoverPaths(): string[] {
	const found = new Set<string>();
	for (const pattern of config.project.include) {
		for (const path of new Bun.Glob(pattern).scanSync({
			cwd: config.project.root,
		})) {
			found.add(toPosixPath(path));
		}
	}
	return [...found]
		.filter((path) => !matchesGlob(path, config.project.exclude))
		.sort();
}

function loadSources(paths: readonly string[]): SourceFile[] {
	return paths.map((path) => {
		const absPath = join(config.project.root, path);
		return parseSource(path, readFileSync(absPath, "utf8"), absPath);
	});
}

function gitChangedPaths(): Set<string> {
	const run = (command: string): string[] =>
		execSync(command, { cwd: config.project.root })
			.toString()
			.split("\n")
			.filter(Boolean);
	const changed = [
		...run("git diff --name-only HEAD"),
		...run("git ls-files --others --exclude-standard"),
	];
	return new Set(changed.map(toPosixPath));
}

function printListRules(): void {
	const rows = Object.values(rules).map((rule) => ({
		id: rule.id,
		severity: rule.severity,
		fixable: rule.fixable ? "fix" : "-",
		docs: rule.docs,
		description: rule.description,
	}));
	for (const row of rows.sort((a, b) => a.id.localeCompare(b.id))) {
		console.log(
			`${row.id}\t${row.severity}\t${row.fixable}\t${row.docs}\t${row.description}`,
		);
	}
}

function formatLine(violation: Violation): string {
	const hint = violation.hint
		? ` → ${violation.hint} (${violation.docs})`
		: ` (${violation.docs})`;
	return `${violation.path}:${violation.line}:${violation.column}  ${violation.severity}  ${violation.ruleId}  ${violation.message}${hint}`;
}

function applyFixes(violations: readonly Violation[]): number {
	const byPath = new Map<string, Violation[]>();
	for (const violation of violations) {
		if (!violation.fix) continue;
		const list = byPath.get(violation.path) ?? [];
		list.push(violation);
		byPath.set(violation.path, list);
	}
	let fixed = 0;
	for (const [path, list] of byPath) {
		const absPath = join(config.project.root, path);
		let code = readFileSync(absPath, "utf8");
		const sorted = [...list].sort(
			(a, b) => (b.fix?.start ?? 0) - (a.fix?.start ?? 0),
		);
		for (const violation of sorted) {
			const fix = violation.fix;
			if (!fix) continue;
			code = code.slice(0, fix.start) + fix.text + code.slice(fix.end);
			fixed++;
		}
		writeFileSync(absPath, code);
	}
	return fixed;
}

function main(): void {
	if (isListRules) {
		printListRules();
		process.exit(0);
	}

	const paths = discoverPaths();
	let sources = loadSources(paths);
	const changedPaths = isChanged ? gitChangedPaths() : undefined;
	const lintOptions = {
		...(ruleFilter ? { ruleIds: ruleFilter } : {}),
		...(changedPaths ? { changedPaths } : {}),
	};

	let result = lintSources(sources, config, rules, lintOptions);

	if (isFix) {
		const fixed = applyFixes(result.violations);
		if (fixed > 0) {
			sources = loadSources(discoverPaths());
			result = lintSources(sources, config, rules, lintOptions);
		}
	}

	const violations = result.violations;
	const errors = violations.filter((v) => v.severity === Severity.Error);
	const warnings = violations.filter((v) => v.severity === Severity.Warn);

	if (isJson) {
		console.log(
			JSON.stringify(
				{
					violations,
					counts: {
						errors: errors.length,
						warnings: warnings.length,
					},
				},
				null,
				2,
			),
		);
	} else {
		const toPrint = isQuiet ? errors : violations;
		for (const violation of toPrint) console.log(formatLine(violation));
		if (errors.length === 0 && warnings.length === 0) {
			console.log("Code style is clean.");
		} else {
			console.log(
				`\n${errors.length} error(s), ${warnings.length} warning(s).`,
			);
		}
	}

	const exceedsMaxWarnings =
		maxWarnings !== null && warnings.length > maxWarnings;
	if (errors.length > 0 || exceedsMaxWarnings) process.exit(1);
	process.exit(0);
}

main();

/**
 * Table-driven tests for scripts/lint-style. One describe per rule id in the
 * registry (config.ts `rules`), each with `valid` (0 violations of that rule)
 * and `invalid` (expected violation count) fixtures. Plus suppression forms,
 * fixable-rule fix output, a registry completeness check, and CLI smoke tests.
 *
 * Most fixtures use `parseSource` directly (no disk I/O). A handful of
 * project rules resolve imports via `resolveImport`, which checks real file
 * existence under `ProjectConfig.root` — for those we write real files to a
 * throwaway temp directory and point `root` at it (see `withDisk`).
 */
import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import config, { rules, type RuleId } from "./config";
import {
	lintSources,
	parseSource,
	type LintConfigLike,
	type LintOptions,
	type Violation,
} from "./core";

type Files = Record<string, string>;

function toSources(files: Files) {
	return Object.entries(files).map(([path, code]) => parseSource(path, code));
}

const isRuleId = (id: string): id is RuleId => id in rules;
const ruleIds = Object.keys(rules).filter(isRuleId);

/** Lints `files` with only `ruleId` enabled, returning that rule's own violations. */
function lintRule(
	ruleId: RuleId,
	files: Files,
	options: LintOptions = {},
): Violation[] {
	const testConfig: LintConfigLike = {
		project: config.project,
		rules: {
			[ruleId]: rules[ruleId].severity,
		},
	};
	const result = lintSources(toSources(files), testConfig, rules, {
		ruleIds: [ruleId],
		...options,
	});
	return result.violations.filter((v) => v.ruleId === ruleId);
}

/** Runs every rule (no `ruleIds` filter) — needed for engine-level checks (unused-suppression, memory-updated). */
function lintAll(files: Files, options: LintOptions = {}): Violation[] {
	return lintSources(toSources(files), config, rules, options).violations;
}

/**
 * Writes `files` to a throwaway temp directory and lints them with a config
 * whose `root` points there, so rules that call `resolveImport` (which checks
 * real file existence) resolve against our fixtures instead of the real repo.
 */
function lintRuleOnDisk(ruleId: RuleId, files: Files): Violation[] {
	const root = mkdtempSync(join(tmpdir(), "lint-style-test-"));
	try {
		for (const [path, code] of Object.entries(files)) {
			const abs = join(root, path);
			mkdirSync(dirname(abs), { recursive: true });
			writeFileSync(abs, code);
		}
		const testConfig: LintConfigLike = {
			project: { ...config.project, root },
		};
		const sources = Object.entries(files).map(([path, code]) =>
			parseSource(path, code, join(root, path)),
		);
		const result = lintSources(sources, testConfig, rules, {
			ruleIds: [ruleId],
		});
		return result.violations.filter((v) => v.ruleId === ruleId);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
}

interface RuleCase {
	files: Files;
	count?: number; // invalid only; defaults to 1
	changedPaths?: readonly string[];
}

interface RuleFixture {
	onDisk?: boolean;
	/** Lint with every rule enabled instead of scoping to just this id (needed for
	 * unused-suppression, whose own detection is itself gated by the ruleIds filter). */
	noRestrict?: boolean;
	valid: RuleCase[];
	invalid: RuleCase[];
}

function oneFile(path: string, code: string): Files {
	return { [path]: code };
}

// ─────────────────────────── Fixtures ───────────────────────────
// A `Record<RuleId, RuleFixture>` — TypeScript itself fails the build if a
// rule is registered in config.ts but missing here.

const fixtures: Record<RuleId, RuleFixture> = {
	// ── components.ts ──────────────────────────────────────────────
	"react-import": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				'import React from "react";\nexport const SampleWidget = () => <div>hi</div>;\n',
			),
			oneFile(
				"src/lib/math.ts",
				"export const add = (a: number, b: number) => a + b;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"export const SampleWidget = () => <div>hi</div>;\n",
			),
		].map((files) => ({ files })),
	},

	"props-interface": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"interface SampleWidgetProps {}\nexport const SampleWidget = () => <div>hi</div>;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"export const SampleWidget = () => <div>hi</div>;\n",
			),
		].map((files) => ({ files })),
	},

	"fc-type-argument": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"interface SampleWidgetProps {}\nexport const SampleWidget: React.FC<SampleWidgetProps> = () => <div/>;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/components/common/widgets/sample-widget.tsx",
					"interface SampleWidgetProps {}\nexport const SampleWidget: React.FC = () => <div/>;\n",
				),
			},
			{
				files: oneFile(
					"src/components/common/widgets/sample-widget.tsx",
					"interface SampleWidgetProps {}\ninterface OtherProps {}\nexport const SampleWidget: React.FC<OtherProps> = () => <div/>;\n",
				),
			},
		],
	},

	"props-interface-not-type": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"interface SampleWidgetProps {}\nexport const SampleWidget: React.FC<SampleWidgetProps> = () => <div/>;\n",
			),
			// A union Props type can't be a plain interface — this is exempt, not flagged.
			oneFile(
				"src/components/common/widgets/table.tsx",
				'type TableProps = { mode: "client" } | { mode: "server" };\nexport const Table: React.FC<TableProps> = () => <div/>;\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"type SampleWidgetProps = { foo: string };\nexport const SampleWidget: React.FC<SampleWidgetProps> = (p) => <div>{p.foo}</div>;\n",
			),
		].map((files) => ({ files })),
	},

	"component-declaration": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"interface SampleWidgetProps {}\nexport const SampleWidget: React.FC<SampleWidgetProps> = () => <div/>;\n",
			),
			// Generic components can't be React.FC — a plain `function` is allowed.
			oneFile(
				"src/components/common/widgets/data-table.tsx",
				"export function DataTable<T>(props: { rows: T[] }) {\n\treturn <div/>;\n}\n",
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/components/common/widgets/sample-widget.tsx",
					"export const SampleWidget = () => <div/>;\n",
				),
			},
			{
				files: oneFile(
					"src/components/common/widgets/sample-widget.tsx",
					"export function SampleWidget() {\n\treturn <div/>;\n}\n",
				),
			},
			// export default function — still not React.FC, still flagged (not generic).
			{
				files: oneFile(
					"src/components/common/widgets/sample-widget.tsx",
					"export default function SampleWidget() {\n\treturn <div/>;\n}\n",
				),
			},
		],
	},

	"default-export-matches-file": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"export const SampleWidget = () => <div/>;\nexport default SampleWidget;\n",
			),
			// Route index.tsx only needs *a* default-exported component from the file.
			oneFile(
				"src/routes/spaces/index.tsx",
				"export const Spaces = () => <div/>;\nexport default Spaces;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			// Fixable: no default export at all.
			{
				files: oneFile(
					"src/components/common/widgets/sample-widget.tsx",
					"export const SampleWidget = () => <div>hi</div>;\n",
				),
			},
			// Default export name does not match the file.
			{
				files: oneFile(
					"src/components/common/widgets/sample-widget.tsx",
					"const SampleWidget = () => <div/>;\nconst Other = () => <div/>;\nexport default Other;\n",
				),
			},
		],
	},

	"inline-component": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"const Helper = () => <span/>;\nexport const SampleWidget = () => (\n\t<div><Helper/></div>\n);\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"export const SampleWidget = () => {\n\tconst Inner = () => <span/>;\n\treturn <div><Inner/></div>;\n};\n",
			),
		].map((files) => ({ files })),
	},

	// ── files.ts ────────────────────────────────────────────────────
	"file-kebab-case": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"export const x = 1;\n",
			),
			// Known suffix (.test-d.ts) is stripped before the kebab-case check.
			oneFile("src/lib/data-table.test-d.ts", "export const x = 1;\n"),
			// Bracketed dynamic route segments are allowed.
			oneFile(
				"src/routes/administrations/users/groups/[group-id]/rules/index.tsx",
				"export const x = 1;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/SampleWidget.tsx",
				"export const x = 1;\n",
			),
			oneFile(
				"src/components/CommonStuff/widgets/sample-widget.tsx",
				"export const x = 1;\n",
			),
		].map((files) => ({ files })),
	},

	"component-name-matches-file": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"export const SampleWidget = () => <div/>;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"export const DifferentName = () => <div/>;\n",
			),
		].map((files) => ({ files })),
	},

	"route-file-naming": {
		valid: [
			oneFile(
				"src/routes/spaces/index.tsx",
				"export default function Spaces() { return null; }\n",
			),
			oneFile(
				"src/routes/spaces/components/foo.tsx",
				"export const Foo = () => <div/>;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/routes/spaces/context/spaces-filter-context.tsx",
				"export const x = 1;\n",
			),
		].map((files) => ({ files })),
	},

	"route-registered": {
		valid: [
			{
				files: {
					"src/routes.ts":
						'export default [route("spaces", "routes/spaces/index.tsx")];\n',
					"src/routes/spaces/index.tsx":
						"export default function Spaces() { return null; }\n",
				},
			},
		],
		invalid: [
			{
				files: {
					"src/routes.ts":
						'export default [route("spaces", "routes/spaces/index.tsx")];\n',
					"src/routes/spaces/index.tsx":
						"export default function Spaces() { return null; }\n",
					"src/routes/other/index.tsx":
						"export default function Other() { return null; }\n",
				},
			},
			{
				files: {
					// References a route file that does not exist -> violation on the manifest.
					"src/routes.ts":
						'export default [route("missing", "routes/missing/index.tsx")];\n',
				},
			},
		],
	},

	"no-layouts-dir": {
		valid: [
			oneFile(
				"src/routes/spaces/layout.tsx",
				"export default function Layout() { return null; }\n",
			),
		].map((files) => ({
			files,
		})),
		invalid: [
			oneFile(
				"src/routes/layouts/spaces.tsx",
				"export default function Layout() { return null; }\n",
			),
		].map((files) => ({
			files,
		})),
	},

	"component-placement": {
		onDisk: true,
		valid: [
			{
				files: {
					"src/routes/spaces/components/shared-widget.tsx":
						"export const SharedWidget = () => <div/>;\n",
					"src/routes/spaces/map/index.tsx":
						'import { SharedWidget } from "@/routes/spaces/components/shared-widget";\nexport default function Map() { return <SharedWidget/>; }\n',
					"src/routes/spaces/catering/index.tsx":
						'import { SharedWidget } from "@/routes/spaces/components/shared-widget";\nexport default function Catering() { return <SharedWidget/>; }\n',
				},
			},
		],
		invalid: [
			{
				files: {
					"src/routes/spaces/components/shared-widget.tsx":
						"export const SharedWidget = () => <div/>;\n",
					"src/routes/spaces/map/index.tsx":
						'import { SharedWidget } from "@/routes/spaces/components/shared-widget";\nexport default function Map() { return <SharedWidget/>; }\n',
				},
			},
			{
				files: {
					"src/routes/spaces/components/shared-widget.tsx":
						"export const SharedWidget = () => <div/>;\n",
					"src/routes/other/index.tsx":
						'import { SharedWidget } from "@/routes/spaces/components/shared-widget";\nexport default function Other() { return <SharedWidget/>; }\n',
				},
			},
		],
	},

	"common-reuse": {
		onDisk: true,
		valid: [
			{
				files: {
					"src/components/common/badges/status-badge.tsx":
						"export const StatusBadge = () => <span/>;\n",
					"src/routes/a/index.tsx":
						'import { StatusBadge } from "@/components/common/badges/status-badge";\nexport default function A() { return <StatusBadge/>; }\n',
					"src/routes/b/index.tsx":
						'import { StatusBadge } from "@/components/common/badges/status-badge";\nexport default function B() { return <StatusBadge/>; }\n',
				},
			},
			// Private part of a composite: only its own group imports it.
			{
				files: {
					"src/components/common/art/motif/motif-moon.tsx":
						"export const MotifMoon = () => <g/>;\n",
					"src/components/common/art/project-motif.tsx":
						'import { MotifMoon } from "@/components/common/art/motif/motif-moon";\nexport const ProjectMotif = () => <MotifMoon/>;\n',
					"src/routes/a/index.tsx":
						'import { ProjectMotif } from "@/components/common/art/project-motif";\nexport default function A() { return <ProjectMotif/>; }\n',
					"src/routes/b/index.tsx":
						'import { ProjectMotif } from "@/components/common/art/project-motif";\nexport default function B() { return <ProjectMotif/>; }\n',
				},
			},
		],
		invalid: [
			{
				files: {
					"src/components/common/badges/status-badge.tsx":
						"export const StatusBadge = () => <span/>;\n",
					"src/routes/a/index.tsx":
						'import { StatusBadge } from "@/components/common/badges/status-badge";\nexport default function A() { return <StatusBadge/>; }\n',
				},
			},
		],
	},

	"no-class-constant-file": {
		valid: [
			oneFile("src/lib/button-styles.ts", 'export const x = "flex";\n'),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/lib/button-classes.ts",
				'export const buttonClassName = "flex";\n',
			),
		].map((files) => ({ files })),
	},

	"no-micro-types-file": {
		valid: [
			oneFile(
				"src/api/types/booking.ts",
				"export interface Booking { id: string }\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/routes/spaces/components/types.ts",
				"export interface Foo {}\n",
			),
		].map((files) => ({ files })),
	},

	"no-icon-dictionary": {
		valid: [
			// Not exported -> not a "standalone" dictionary.
			oneFile(
				"src/lib/icons.ts",
				'import { Home, Settings } from "lucide-react";\nconst icons = { home: Home, settings: Settings };\nexport function getIcon(k: string) { return icons[k as keyof typeof icons]; }\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/lib/icons.ts",
				'import { Home, Settings } from "lucide-react";\nexport const icons = { home: Home, settings: Settings };\n',
			),
		].map((files) => ({ files })),
	},

	"skeleton-colocated": {
		onDisk: true,
		valid: [
			{
				files: {
					"src/widgets/foo-skeleton.tsx":
						"export const FooSkeleton = () => <div/>;\n",
					"src/widgets/foo.tsx": "export const Foo = () => <div/>;\n",
				},
			},
		],
		invalid: [
			{
				files: {
					"src/widgets/bar-skeleton.tsx":
						"export const BarSkeleton = () => <div/>;\n",
				},
			},
		],
	},

	"context-location": {
		valid: [
			oneFile(
				"src/contexts/spaces-filter-context.tsx",
				'import { createContext } from "react";\nexport const SpacesFilterContext = createContext(null);\n',
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/routes/spaces/context/spaces-filter-context.tsx",
					'import { createContext } from "react";\nexport const SpacesFilterContext = createContext(null);\n',
				),
			},
			{
				files: oneFile(
					"src/contexts/spacesFilter.tsx",
					'import { createContext } from "react";\nexport const SpacesFilterContext = createContext(null);\n',
				),
			},
		],
	},

	// ── imports.ts ──────────────────────────────────────────────────
	"no-relative-import": {
		onDisk: true,
		valid: [
			// The routes manifest and what it imports run in the React Router config
			// loader, which has no @/ alias: relative imports are required there.
			{
				"src/routes.ts":
					'import { config } from "./config";\nexport default [config.home];\n',
				"src/config.ts":
					'import { Filter } from "./api/enums";\nexport const config = { home: "/", f: Filter.All };\n',
				"src/api/enums.ts": 'export enum Filter {\n\tAll = "all",\n}\n',
			},
			oneFile(
				"src/lib/foo.ts",
				'import { bar } from "@/lib/bar";\nexport const x = bar;\n',
			),
			// react-router typegen imports are explicitly allowed.
			oneFile(
				"src/routes/spaces/index.tsx",
				'import type { Route } from "./+types/index";\nexport default function Spaces() { return null; }\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/lib/foo.ts",
				'import { bar } from "./bar";\nexport const x = bar;\n',
			),
		].map((files) => ({ files })),
	},

	"banned-import": {
		valid: [
			oneFile(
				"src/lib/foo.ts",
				'import { toast } from "@/components/ui/toast";\n',
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/lib/foo.ts",
					'import { toast } from "sonner";\n',
				),
			},
			{
				files: oneFile(
					"src/lib/foo.ts",
					'import { Dialog } from "@radix-ui/react-dialog";\n',
				),
			},
		],
	},

	"no-as-child": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => <Dialog render={<div/>}/>;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => <Dialog asChild/>;\n",
			),
		].map((files) => ({
			files,
		})),
	},

	// ── react.ts ────────────────────────────────────────────────────
	"no-nested-ternary": {
		valid: [
			oneFile(
				"src/lib/foo.ts",
				"export const x = (a: boolean) => (a ? 1 : 2);\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/lib/foo.ts",
				"export const x = (a: boolean, b: boolean) => (a ? (b ? 1 : 2) : 3);\n",
			),
		].map((files) => ({
			files,
		})),
	},

	"no-any": {
		valid: [oneFile("src/lib/foo.ts", "export let x: unknown;\n")].map(
			(files) => ({ files }),
		),
		invalid: [oneFile("src/lib/foo.ts", "export let x: any;\n")].map(
			(files) => ({ files }),
		),
	},

	"raw-admin-table": {
		valid: [
			oneFile(
				"src/routes/administrations/foo/index.tsx",
				'import { AdminDataTable } from "@/routes/administrations/components/admin/admin-data-table";\nexport const A = () => <AdminDataTable />;\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/routes/administrations/foo/index.tsx",
				'import { Table } from "@/components/ui/table";\nexport const A = () => <Table />;\n',
			),
		].map((files) => ({ files })),
	},

	"overlay-always-mounted": {
		valid: [
			oneFile(
				"src/routes/foo/index.tsx",
				"export const A = ({ x }: { x: string | null }) => { if (!x) return <Sheet open={false} />; return <Sheet open />; };\n",
			),
			oneFile(
				"src/routes/foo/index.tsx",
				"export const A = () => <div>{item && <FooDialog open={isOpen} />}</div>;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/routes/foo/index.tsx",
				"export const A = ({ x }: { x: string | null }) => { if (!x) return null; return <Sheet open />; };\n",
			),
			oneFile(
				"src/routes/foo/index.tsx",
				"export const A = () => <div>{editing && <FooSheet open={Boolean(editing)} />}</div>;\n",
			),
		].map((files) => ({ files })),
	},

	"admin-table-sortable": {
		valid: [
			oneFile(
				"src/routes/administrations/foo/index.tsx",
				'export const a = { id: "actions", getSortValue: null };\nexport const b = { id: "name", getSortValue: () => 1 };\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/routes/administrations/foo/index.tsx",
				'export const a = { id: "name", getSortValue: null };\n',
			),
			oneFile(
				"src/routes/administrations/foo/index.tsx",
				'export const a = h.display({ id: "name", cell: () => null });\n',
			),
		].map((files) => ({ files })),
	},

	"raw-number-input": {
		valid: [
			oneFile(
				"src/routes/foo/index.tsx",
				'export const A = () => <input type="text" />;\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/routes/foo/index.tsx",
				'export const A = () => <input type="number" />;\n',
			),
		].map((files) => ({ files })),
	},

	"form-zod-validation": {
		valid: [
			oneFile(
				"src/routes/foo/index.tsx",
				"export const A = () => <form noValidate onSubmit={f.handleSubmit(go)} />;\n",
			),
			oneFile(
				"src/routes/foo/index.tsx",
				'export const A = () => <form noValidate onSubmit={go}><Input type="search" /><button type="submit" /></form>;\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/routes/foo/index.tsx",
				"export const A = () => <form noValidate onSubmit={go}><Input /></form>;\n",
			),
		].map((files) => ({ files })),
	},

	"no-as-cast": {
		valid: [
			oneFile("src/lib/foo.ts", "export const x = { a: 1 } as const;\n"),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/lib/foo.ts",
				"export const x = (y: unknown) => y as string;\n",
			),
		].map((files) => ({ files })),
	},

	"no-string-union": {
		valid: [
			oneFile(
				"src/lib/types.ts",
				'export enum Foo {\n\tA = "a",\n\tB = "b",\n}\n',
			),
			// Not all members are string literals -> not flagged.
			oneFile("src/lib/types.ts", 'export type Foo = "a" | number;\n'),
		].map((files) => ({ files })),
		invalid: [
			oneFile("src/lib/types.ts", 'export type Foo = "a" | "b";\n'),
		].map((files) => ({ files })),
	},

	"effect-derived-state": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				'export const Foo = () => { useEffect(() => { console.log("mount"); setX(1); }, []); return <div/>; };\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => { useEffect(() => { setX(1); setY(2); }, [a]); return <div/>; };\n",
			),
		].map((files) => ({ files })),
	},

	"effect-open-reset": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => { useEffect(() => { console.log(open); }, [open]); return <div/>; };\n",
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/components/common/widgets/foo.tsx",
					"export const Foo = () => { useEffect(() => { reset(); }, [open]); return <div/>; };\n",
				),
			},
			{
				files: oneFile(
					"src/components/common/widgets/foo.tsx",
					"export const Foo = () => { useEffect(() => { setValue(1); }, [isOpen]); return <div/>; };\n",
				),
			},
		],
	},

	"view-state": {
		valid: [
			oneFile(
				"src/routes/spaces/index.tsx",
				"export default function Spaces() { const [count, setCount] = useState(0); return <div>{count}</div>; }\n",
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/routes/spaces/index.tsx",
					'export default function Spaces() { const [activeTab, setActiveTab] = useState("a"); return <div>{activeTab}</div>; }\n',
				),
			},
			{
				files: oneFile(
					"src/routes/spaces/index.tsx",
					'export default function Spaces() { const view = searchParams.get("tab"); return <div>{view}</div>; }\n',
				),
			},
		],
	},

	"repeated-siblings": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => (\n\t<div>\n\t\t<Button onClick={a}>A</Button>\n\t\t<Button onClick={b}>B</Button>\n\t</div>\n);\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => (\n\t<div>\n\t\t<Button onClick={a}>A</Button>\n\t\t<Button onClick={b}>B</Button>\n\t\t<Button onClick={c}>C</Button>\n\t</div>\n);\n",
			),
		].map((files) => ({ files })),
	},

	"boolean-class-prop": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"interface FooProps { fullWidth: boolean }\nexport const Foo: React.FC<FooProps> = ({ fullWidth }) => { return fullWidth ? <div/> : <span/>; };\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				'interface FooProps { fullWidth: boolean }\nexport const Foo: React.FC<FooProps> = ({ fullWidth }) => {\n\tconst cls = fullWidth && "w-full";\n\treturn <div className={cls}>Hi</div>;\n};\n',
			),
		].map((files) => ({ files })),
	},

	"default-variant-prop": {
		onDisk: true,
		valid: [
			{
				files: {
					"src/components/common/buttons/primary-button.tsx":
						'import { cva } from "cva";\nexport const primaryButtonVariants = cva("base", { variants: { size: { sm: "text-sm", md: "text-base" } }, defaultVariants: { size: "md" } });\nexport const PrimaryButton: React.FC<PrimaryButtonProps> = ({ size }) => <button className={primaryButtonVariants({ size })}>x</button>;\ninterface PrimaryButtonProps { size?: string }\n',
					"src/routes/spaces/index.tsx":
						'import { PrimaryButton } from "@/components/common/buttons/primary-button";\nexport default function Page() { return <PrimaryButton size="sm" />; }\n',
				},
			},
		],
		invalid: [
			{
				files: {
					"src/components/common/buttons/primary-button.tsx":
						'import { cva } from "cva";\nexport const primaryButtonVariants = cva("base", { variants: { size: { sm: "text-sm", md: "text-base" } }, defaultVariants: { size: "md" } });\nexport const PrimaryButton: React.FC<PrimaryButtonProps> = ({ size }) => <button className={primaryButtonVariants({ size })}>x</button>;\ninterface PrimaryButtonProps { size?: string }\n',
					"src/routes/spaces/index.tsx":
						'import { PrimaryButton } from "@/components/common/buttons/primary-button";\nexport default function Page() { return <PrimaryButton size="md" />; }\n',
				},
			},
		],
	},

	"query-states": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				'import { useLogin } from "@/api/hooks/admin/auth/use-login";\nexport const Foo = () => {\n\tconst login = useLogin();\n\treturn <button disabled={login.isPending} />;\n};\n',
			),
			oneFile(
				"src/components/common/widgets/foo.tsx",
				'import { useFoo } from "@/api/hooks/use-foo";\nexport const Foo = () => {\n\tconst { data, isLoading, isError, refetch } = useFoo();\n\treturn <div>{isLoading ? "..." : data}</div>;\n};\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				'import { useFoo } from "@/api/hooks/use-foo";\nexport const Foo = () => {\n\tconst { data } = useFoo();\n\treturn <div>{data}</div>;\n};\n',
			),
		].map((files) => ({ files })),
	},

	"mutation-pending": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => { const m = useMutation(); const onClick = () => m.mutate(); return <button disabled={m.isPending} onClick={onClick}>Go</button>; };\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => { const m = useMutation(); const onClick = () => m.mutate(); return <button onClick={onClick}>Go</button>; };\n",
			),
		].map((files) => ({ files })),
	},

	// ── i18n.ts ─────────────────────────────────────────────────────
	"hardcoded-jsx-text": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				'export const Foo = () => <div>{t("common.hello")}</div>;\n',
			),
			// Digits and allowed punctuation have no letters / are allowlisted.
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => <div>123</div>;\n",
			),
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => <div> — </div>;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => <div>Hello world</div>;\n",
			),
		].map((files) => ({ files })),
	},

	"hardcoded-ui-attribute": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				'export const Foo = () => <input aria-label={t("form.name")} />;\n',
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/components/common/widgets/foo.tsx",
					'export const Foo = () => <input aria-label="Name" />;\n',
				),
			},
			// JSXExpressionContainer wrapping a plain string literal is also flagged.
			{
				files: oneFile(
					"src/components/common/widgets/foo.tsx",
					'export const Foo = () => <input aria-label={"Name"} />;\n',
				),
			},
		],
	},

	"hardcoded-toast": {
		valid: [
			oneFile("src/lib/foo.ts", 'toast({ title: t("toast.title") });\n'),
		].map((files) => ({ files })),
		invalid: [
			oneFile("src/lib/foo.ts", 'toast({ title: "Saved!" });\n'),
		].map((files) => ({ files })),
	},

	"t-fallback": {
		valid: [
			oneFile("src/lib/foo.ts", 'export const x = t("common.save");\n'),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/lib/foo.ts",
					'export const x = t("common.save", "Save");\n',
				),
			},
			{
				files: oneFile(
					"src/lib/foo.ts",
					'export const x = t("common.save", { defaultValue: "Save" });\n',
				),
			},
		],
	},

	"t-concat": {
		valid: [
			oneFile(
				"src/lib/foo.ts",
				'export const x = t("common.greeting", { name });\n',
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/lib/foo.ts",
					'export const x = "Hello " + t("common.name");\n',
				),
			},
			{
				files: oneFile(
					"src/lib/foo.ts",
					'export const x = `${t("common.name")} !`;\n',
				),
			},
		],
	},

	"t-key-exists": {
		valid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						common: { save: "Save" },
					}),
					"src/lib/foo.ts": 't("common.save");\n',
				},
			},
			// i18next plural form: t("cart.items") matches cart.items-one/cart.items-other.
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						cart: {
							"items-one": "1 item",
							"items-other": "{{count}} items",
						},
					}),
					"src/lib/foo.ts": 't("cart.items", { count });\n',
				},
			},
		],
		invalid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						common: { save: "Save" },
					}),
					"src/lib/foo.ts": 't("common.missing");\n',
				},
			},
		],
	},

	"i18n-key-format": {
		valid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						common: { "save-button": "Save" },
					}),
				},
			},
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						cart: {
							"items-one": "1 item",
							"items-other": "{{count}} items",
						},
					}),
				},
			},
		],
		invalid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						cart: { items_one: "1 item" },
					}),
				},
			},
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						common: { saveButton: "Save" },
					}),
				},
			},
		],
	},

	"i18n-key-glue": {
		valid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						schedules: {
							bookings: { detail: { request: { title: "x" } } },
						},
					}),
				},
			},
		],
		invalid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						schedules: {
							bookings: { detail: { "request-title": "x" } },
						},
					}),
				},
			},
		],
	},

	"i18n-category-glue": {
		valid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: { statuses: { card: "Card" }, pos: { x: "X" } },
					}),
				},
			},
		],
		invalid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: { "card-status": "Card" },
					}),
				},
			},
		],
	},

	"i18n-key-indexed": {
		valid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: { steps: { "1": { title: "One" } } },
					}),
				},
			},
		],
		invalid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: { "step-1": { title: "One" } },
					}),
				},
			},
		],
	},

	"component-type-export": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				'import type { SharedProps } from "@/types/ui";\ninterface SampleWidgetProps {}\nexport type PanelProps = SharedProps & { open: boolean };\nexport const SampleWidget: React.FC<SampleWidgetProps> = () => <div/>;\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				'export enum Tone { A = "a" }\nexport const SampleWidget = () => <div/>;\n',
			),
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"export interface SampleWidgetProps {}\nexport const SampleWidget = () => <div/>;\n",
			),
		].map((files) => ({ files })),
	},

	"one-component-per-file": {
		valid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"interface SampleWidgetProps {}\nexport const SampleWidget: React.FC<SampleWidgetProps> = () => <div/>;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/sample-widget.tsx",
				"interface AProps {}\nconst Helper: React.FC<AProps> = () => <i/>;\ninterface SampleWidgetProps {}\nexport const SampleWidget: React.FC<SampleWidgetProps> = () => <div/>;\n",
			),
		].map((files) => ({ files })),
	},

	"folder-grouping": {
		noRestrict: true,
		valid: [
			{
				files: Object.fromEntries(
					["a", "b", "c", "d", "e", "f", "g"].map((n) => [
						`src/lib/${n}.ts`,
						"export const x = 1;\n",
					]),
				),
			},
			{
				files: Object.fromEntries(
					[
						"admin/rules",
						"admin/people",
						"x",
						"y",
						"z",
						"w",
						"v",
					].map((n) => [`src/lib/${n}.ts`, "export const x = 1;\n"]),
				),
			},
		],
		invalid: [
			{
				files: Object.fromEntries(
					[
						"admin-rules",
						"admin-people",
						"x",
						"y",
						"z",
						"w",
						"v",
					].map((n) => [`src/lib/${n}.ts`, "export const x = 1;\n"]),
				),
			},
		],
	},

	"i18n-part-as-group": {
		valid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: { catering: { title: "x" } },
					}),
				},
			},
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: { title: "x" },
					}),
				},
			},
			// "empty"/"cancel" naming a real sub-flow that owns actual parts (title/description) is fine —
			// matches AGENTS §3's own `request.title`/`request.description`/`request.submit` example.
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: { empty: { title: "x", description: "y" } },
					}),
				},
			},
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: { cancel: { title: "x", confirm: "y" } },
					}),
				},
			},
			// A part grouping a validation `errors` subtree alongside its own label counts as a real field.
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: {
							description: {
								label: "x",
								errors: { required: "y" },
							},
						},
					}),
				},
			},
		],
		invalid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: { title: { catering: "x" } },
					}),
				},
			},
			// A part with only unrelated variant leaves (no real part among its children) is the bug.
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						x: { empty: { filtered: "x", all: "y" } },
					}),
				},
			},
		],
	},

	"i18n-key-sibling-prefix": {
		valid: [
			// Single-word multi-word subject names are fine, even sharing a leading word once.
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						lib: {
							conflicts: {
								"already-booked": "x",
								"not-in-schedule": "y",
								"special-request": "z",
							},
						},
					}),
				},
			},
			// Already nested — no siblings share a leading hyphen-word.
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						lib: {
							conflicts: {
								repeat: {
									"single-desk": "x",
									"end-before-start": "y",
									max: "z",
								},
							},
						},
					}),
				},
			},
			// A plural pair is one stem, not two siblings.
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						lib: { duration: { "max-one": "x", "max-other": "y" } },
					}),
				},
			},
		],
		invalid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						lib: {
							conflicts: {
								"repeat-single-desk": "x",
								"repeat-end-before-start": "y",
								"repeat-max": "z",
							},
						},
					}),
				},
			},
		],
	},

	"i18n-qualifier-glue": {
		valid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						lib: {
							conflicts: {
								date: { invalid: "x" },
								duration: { max: "y" },
								"already-booked": "z",
								"not-in-schedule": "w",
							},
						},
					}),
				},
			},
		],
		invalid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						lib: { conflicts: { "invalid-date": "x" } },
					}),
				},
			},
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						lib: { conflicts: { "select-space": "x" } },
					}),
				},
			},
		],
	},

	"i18n-key-namespace": {
		valid: [
			oneFile(
				"src/routes/spaces/map/index.tsx",
				'export default () => { t("spaces.map.title"); t("common.save"); return null; };\n',
			),
			// namespaceAliases: shell components and the home route own their own namespace.
			oneFile(
				"src/components/shared/shell/site-nav.tsx",
				'export default () => { t("shell.nav.menu"); return null; };\n',
			),
			oneFile(
				"src/routes/index.tsx",
				'export default () => { t("home.title"); return null; };\n',
			),
			// components/common files can also use the shared "common" namespace.
			oneFile(
				"src/components/common/feedback/toast-helper.ts",
				't("common.save");\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/routes/spaces/map/index.tsx",
				'export default () => { t("catering.title"); return null; };\n',
			),
			oneFile(
				"src/components/shared/shell/site-nav.tsx",
				'export default () => { t("home.title"); return null; };\n',
			),
		].map((files) => ({ files })),
	},

	"i18n-unused-key": {
		valid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						common: { save: "Save" },
					}),
					"src/lib/foo.ts": 't("common.save");\n',
				},
			},
			// Template-prefix idiom: t(`common.errors.${type}`) references the whole subtree.
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						common: { errors: { required: "Required" } },
					}),
					"src/lib/foo.ts":
						'const type = "required";\nt(`common.errors.${type}`);\n',
				},
			},
		],
		invalid: [
			{
				files: {
					"src/locales/en.json": JSON.stringify({
						common: { save: "Save", unused: "Nope" },
					}),
					"src/lib/foo.ts": 't("common.save");\n',
				},
			},
		],
	},

	// ── config-keys.ts ──────────────────────────────────────────────
	"config-key-shape": {
		valid: [
			{
				files: {
					"src/config.ts":
						'export const config = {\n\tqueryKeys: {\n\t\tanalytics: {\n\t\t\tsensors: "analytics.sensors",\n\t\t},\n\t},\n};\n',
				},
			},
		],
		invalid: [
			{
				files: {
					"src/config.ts":
						'export const config = {\n\tqueryKeys: {\n\t\tanalytics: {\n\t\t\tsensors: "analytics.sensorsWrong",\n\t\t},\n\t},\n};\n',
				},
			},
		],
	},

	"literal-query-key": {
		valid: [
			oneFile(
				"src/api/hooks/use-foo.ts",
				"export const useFoo = () => useQuery({ queryKey: [config.queryKeys.foo, id] });\n",
			),
			oneFile(
				"src/api/mocks/foo.ts",
				"respond(config.mock.mutationKeys.assistant.chat, data);\n",
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/api/hooks/use-foo.ts",
					'export const useFoo = () => useQuery({ queryKey: ["foo.bar", id] });\n',
				),
			},
			{
				files: oneFile(
					"src/api/mocks/foo.ts",
					'respond("assistant.chat", data);\n',
				),
			},
		],
	},

	"hardcoded-route": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => <Link to={config.routes.spaces} />;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/components/common/widgets/foo.tsx",
					'export const Foo = () => <Link to="/spaces" />;\n',
				),
			},
			{
				files: oneFile(
					"src/components/common/widgets/foo.tsx",
					'export const Foo = () => { navigate("/spaces"); return null; };\n',
				),
			},
		],
	},

	// ── styling.ts ──────────────────────────────────────────────────
	"native-element": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => <Button>Click</Button>;\n",
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				"export const Foo = () => <button>Click</button>;\n",
			),
		].map((files) => ({ files })),
	},

	"no-space-utilities": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				'export const Foo = () => <div className="flex gap-2">x</div>;\n',
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/components/common/widgets/foo.tsx",
					'export const Foo = () => <div className="flex space-x-2">x</div>;\n',
				),
			},
			// Multi-line className via cn().
			{
				files: oneFile(
					"src/components/common/widgets/foo.tsx",
					'export const Foo = () => (\n\t<div\n\t\tclassName={cn(\n\t\t\t"flex",\n\t\t\t"space-x-2"\n\t\t)}\n\t>\n\t\tx\n\t</div>\n);\n',
				),
			},
			// cva variant value.
			{
				files: oneFile(
					"src/components/common/widgets/variants.ts",
					'import { cva } from "cva";\nexport const fooVariants = cva("flex", { variants: { tone: { danger: "space-x-1 text-red" } } });\n',
				),
			},
		],
	},

	"size-shorthand": {
		valid: [
			oneFile(
				"src/components/common/widgets/icon.tsx",
				'export const Icon = () => <div className="size-4">x</div>;\n',
			),
		].map((files) => ({ files })),
		invalid: [
			oneFile(
				"src/components/common/widgets/icon.tsx",
				'export const Icon = () => <div className="w-4 h-4">x</div>;\n',
			),
		].map((files) => ({ files })),
	},

	"raw-color": {
		valid: [
			oneFile(
				"src/components/common/widgets/foo.tsx",
				'export const Foo = () => <div className="bg-primary">x</div>;\n',
			),
		].map((files) => ({ files })),
		invalid: [
			{
				files: oneFile(
					"src/components/common/widgets/foo.tsx",
					'export const Foo = () => <div className="bg-[#ffffff]">x</div>;\n',
				),
			},
			{
				files: oneFile(
					"src/components/common/widgets/foo.tsx",
					'export const Foo = () => <div className="text-[rgba(0,0,0,0.5)]">x</div>;\n',
				),
			},
		],
	},

	"duplicate-class-string": {
		valid: [
			{
				files: {
					"src/routes/a/index.tsx":
						'export default function A() { return <div className="flex items-center justify-between gap-2">x</div>; }\n',
				},
			},
			{
				files: {
					"src/components/common/foo.tsx":
						'export default function Foo() { return <div className="flex items-center justify-between gap-2">x</div>; }\n',
					"src/routes/a/index.tsx":
						'export default function A() { return <div className="flex items-center justify-between gap-2">x</div>; }\n',
				},
			},
			{
				files: {
					"src/routes/a/index.tsx":
						'export default function A() { return <div className="flex items-center justify-between gap-2">x</div>; }\n',
					"src/routes/b/index.tsx":
						'export default function B() { return <div className="gap-2 flex items-center justify-between">x</div>; }\n',
				},
			},
		],
		invalid: [
			{
				files: {
					"src/routes/a/index.tsx":
						'export default function A() { return <div className="font-bold text-foreground truncate block">x</div>; }\n',
					"src/routes/b/index.tsx":
						'export default function B() { return <div className="block truncate text-foreground font-bold">x</div>; }\n',
				},
			},
		],
	},

	// ── meta.ts ─────────────────────────────────────────────────────
	"parse-error": {
		valid: [oneFile("src/lib/foo.ts", "export const x = 1;\n")].map(
			(files) => ({ files }),
		),
		invalid: [oneFile("src/lib/broken.ts", "export const x = {")].map(
			(files) => ({ files }),
		),
	},

	"suppression-reason": {
		valid: [
			oneFile(
				"src/lib/foo.ts",
				"// style-lint-ignore-next-line no-any -- test reason\nlet x: any;\n",
			),
		].map((files) => ({
			files,
		})),
		invalid: [
			oneFile(
				"src/lib/foo.ts",
				"// style-lint-ignore-next-line no-any\nlet x: any;\n",
			),
		].map((files) => ({ files })),
	},

	"unused-suppression": {
		noRestrict: true,
		valid: [
			oneFile(
				"src/lib/foo.ts",
				"// style-lint-ignore-next-line no-any -- reason\nlet x: any;\n",
			),
		].map((files) => ({
			files,
		})),
		invalid: [
			// Suppression targets a rule with no violation on the next line.
			{
				files: oneFile(
					"src/lib/foo.ts",
					"// style-lint-ignore-next-line no-any -- reason\nlet x: number;\n",
				),
			},
			// Suppression on the wrong line: comment sits above unrelated code, the real
			// violation is two lines further down and is NOT suppressed by it.
			{
				files: oneFile(
					"src/lib/wrong-line.ts",
					"// style-lint-ignore-next-line no-any -- reason\nconst y = 1;\nlet x: any;\n",
				),
			},
		],
	},

	"memory-updated": {
		noRestrict: true,
		valid: [
			{
				files: { "src/lib/foo.ts": "export const x = 1;\n" },
				changedPaths: ["src/lib/foo.ts", "MEMORY.md"],
			},
		],
		invalid: [
			{
				files: { "src/lib/foo.ts": "export const x = 1;\n" },
				changedPaths: ["src/lib/foo.ts"],
			},
		],
	},
};

// ─────────────────────────── Table-driven rule tests ───────────────────────────

function runFixture(
	id: RuleId,
	fixture: RuleFixture,
	testCase: RuleCase,
): Violation[] {
	const options: LintOptions = testCase.changedPaths
		? { changedPaths: new Set(testCase.changedPaths) }
		: {};
	if (fixture.onDisk) return lintRuleOnDisk(id, testCase.files);
	if (fixture.noRestrict)
		return lintAll(testCase.files, options).filter((v) => v.ruleId === id);
	return lintRule(id, testCase.files, options);
}

for (const id of ruleIds) {
	const fixture = fixtures[id];
	describe(id, () => {
		test.each(fixture.valid.map((c, i) => [i, c] as const))(
			"valid #%d has no violations",
			(_i, testCase) => {
				expect(runFixture(id, fixture, testCase)).toHaveLength(0);
			},
		);

		test.each(fixture.invalid.map((c, i) => [i, c] as const))(
			"invalid #%d reports violations",
			(_i, testCase) => {
				expect(runFixture(id, fixture, testCase)).toHaveLength(
					testCase.count ?? 1,
				);
			},
		);
	});
}

test("every rule id in the registry has at least one invalid case", () => {
	for (const id of ruleIds) {
		expect(fixtures[id].invalid.length).toBeGreaterThan(0);
	}
});

// ─────────────────────────── memory-updated needs changedPaths ───────────────────────────

describe("memory-updated (changedPaths option)", () => {
	test("src/ changed, MEMORY.md also changed -> no violation", () => {
		const violations = lintAll(
			{ "src/lib/foo.ts": "export const x = 1;\n" },
			{
				ruleIds: ["memory-updated"],
				changedPaths: new Set(["src/lib/foo.ts", "MEMORY.md"]),
			},
		);
		expect(
			violations.filter((v) => v.ruleId === "memory-updated"),
		).toHaveLength(0);
	});

	test("src/ changed, MEMORY.md not changed -> violation", () => {
		const violations = lintAll(
			{ "src/lib/foo.ts": "export const x = 1;\n" },
			{
				ruleIds: ["memory-updated"],
				changedPaths: new Set(["src/lib/foo.ts"]),
			},
		);
		expect(
			violations.filter((v) => v.ruleId === "memory-updated"),
		).toHaveLength(1);
	});

	test("nothing under src/ changed -> no violation", () => {
		const violations = lintAll(
			{ "src/lib/foo.ts": "export const x = 1;\n" },
			{
				ruleIds: ["memory-updated"],
				changedPaths: new Set(["package.json"]),
			},
		);
		expect(
			violations.filter((v) => v.ruleId === "memory-updated"),
		).toHaveLength(0);
	});
});

// ─────────────────────────── Suppression forms ───────────────────────────

describe("suppressions", () => {
	test("next-line form suppresses the rule on the following line", () => {
		const violations = lintRule("no-any", {
			"src/lib/foo.ts":
				"// style-lint-ignore-next-line no-any -- reason\nlet x: any;\n",
		});
		expect(violations).toHaveLength(0);
	});

	test("file form suppresses every occurrence in the file", () => {
		const violations = lintRule("no-any", {
			"src/lib/foo.ts":
				"// style-lint-ignore-file no-any -- reason\nlet a: any;\nlet b: any;\n",
		});
		expect(violations).toHaveLength(0);
	});

	test("missing reason is a suppression-reason error and does not suppress", () => {
		const all = lintAll({
			"src/lib/foo.ts":
				"// style-lint-ignore-next-line no-any\nlet x: any;\n",
		});
		expect(all.some((v) => v.ruleId === "no-any")).toBe(true);
		expect(all.some((v) => v.ruleId === "suppression-reason")).toBe(true);
	});

	test("a suppression that matches nothing is an unused-suppression warning", () => {
		const all = lintAll({
			"src/lib/foo.ts":
				"// style-lint-ignore-next-line no-any -- reason\nlet x: number;\n",
		});
		expect(all.some((v) => v.ruleId === "unused-suppression")).toBe(true);
	});

	test("a suppression on the wrong line does not reach the real violation", () => {
		const all = lintAll({
			"src/lib/wrong-line.ts":
				"// style-lint-ignore-next-line no-any -- reason\nconst y = 1;\nlet x: any;\n",
		});
		expect(all.some((v) => v.ruleId === "no-any")).toBe(true);
		expect(all.some((v) => v.ruleId === "unused-suppression")).toBe(true);
	});

	test("a JSX comment suppression works", () => {
		const violations = lintRule("hardcoded-jsx-text", {
			"src/routes/spaces/map/components/foo.tsx":
				"export const Foo = () => (\n\t<div>\n\t\t{/* style-lint-ignore-next-line hardcoded-jsx-text -- literal test */}\n\t\t<span>Hi there</span>\n\t</div>\n);\n",
		});
		expect(violations).toHaveLength(0);
	});
});

// ─────────────────────────── Fixable rules: fix output ───────────────────────────

describe("fixes", () => {
	function applyFix(code: string, violation: Violation): string {
		const fix = violation.fix;
		if (!fix) throw new Error("violation has no fix");
		return code.slice(0, fix.start) + fix.text + code.slice(fix.end);
	}

	test("react-import inserts the import at the top of the file", () => {
		const code = "export const Foo = () => <div>hi</div>;\n";
		const [violation] = lintRule("react-import", {
			"src/components/common/widgets/foo.tsx": code,
		});
		expect(violation).toBeDefined();
		if (!violation) return;
		expect(applyFix(code, violation)).toBe(
			'import React from "react";\nexport const Foo = () => <div>hi</div>;\n',
		);
	});

	test("default-export-matches-file appends the missing default export", () => {
		const code = "export const SampleWidget = () => <div>hi</div>;\n";
		const [violation] = lintRule("default-export-matches-file", {
			"src/components/common/widgets/sample-widget.tsx": code,
		});
		expect(violation).toBeDefined();
		if (!violation) return;
		expect(applyFix(code, violation)).toBe(
			"export const SampleWidget = () => <div>hi</div>;\n\nexport default SampleWidget;\n",
		);
	});

	test("size-shorthand rewrites matching w-N/h-N to size-N", () => {
		const code =
			'export const Icon = () => <div className="w-4 h-4">x</div>;\n';
		const [violation] = lintRule("size-shorthand", {
			"src/components/common/widgets/icon.tsx": code,
		});
		expect(violation).toBeDefined();
		if (!violation) return;
		expect(applyFix(code, violation)).toBe(
			'export const Icon = () => <div className="size-4">x</div>;\n',
		);
	});

	test("form-zod-validation adds noValidate", () => {
		const code =
			"export const A = () => <form onSubmit={f.handleSubmit(go)} />;\n";
		const [violation] = lintRule("form-zod-validation", {
			"src/routes/foo/index.tsx": code,
		});
		expect(violation).toBeDefined();
		if (!violation) return;
		expect(applyFix(code, violation)).toBe(
			"export const A = () => <form noValidate onSubmit={f.handleSubmit(go)} />;\n",
		);
	});

	test("no-relative-import rewrites a resolvable relative import to the @/ alias", () => {
		const root = mkdtempSync(join(tmpdir(), "lint-style-test-"));
		try {
			const files: Files = {
				"src/lib/x.ts": "export const x = 1;\n",
				"src/lib/y.ts":
					'import { x } from "./x";\nexport const y = x;\n',
			};
			for (const [path, code] of Object.entries(files)) {
				const abs = join(root, path);
				mkdirSync(dirname(abs), { recursive: true });
				writeFileSync(abs, code);
			}
			const testConfig: LintConfigLike = {
				project: { ...config.project, root },
			};
			const sources = Object.entries(files).map(([path, code]) =>
				parseSource(path, code, join(root, path)),
			);
			const result = lintSources(sources, testConfig, rules, {
				ruleIds: ["no-relative-import"],
			});
			const [violation] = result.violations.filter(
				(v) => v.ruleId === "no-relative-import",
			);
			expect(violation).toBeDefined();
			if (!violation) return;
			expect(applyFix(files["src/lib/y.ts"] ?? "", violation)).toBe(
				'import { x } from "@/lib/x";\nexport const y = x;\n',
			);
		} finally {
			rmSync(root, { recursive: true, force: true });
		}
	});

	test("every fixable rule in the registry is exercised above", () => {
		const fixableIds = Object.values(rules)
			.filter((rule) => rule.fixable)
			.map((rule) => rule.id)
			.sort();
		expect(fixableIds).toEqual(
			[
				"default-export-matches-file",
				"form-zod-validation",
				"no-relative-import",
				"react-import",
				"size-shorthand",
			].sort(),
		);
	});
});

// ─────────────────────────── CLI smoke tests ───────────────────────────

describe("CLI", () => {
	test("--list-rules prints every registered rule id", () => {
		const result = Bun.spawnSync(
			["bun", "scripts/lint-style/index.ts", "--list-rules"],
			{
				cwd: join(import.meta.dirname, "../.."),
			},
		);
		const output = result.stdout.toString();
		for (const id of Object.keys(rules)) {
			expect(output).toContain(id);
		}
	});

	test("--json prints a violations array", () => {
		const result = Bun.spawnSync(
			["bun", "scripts/lint-style/index.ts", "--json", "--rule=no-any"],
			{
				cwd: join(import.meta.dirname, "../.."),
			},
		);
		const parsed: unknown = JSON.parse(result.stdout.toString());
		expect(parsed).toMatchObject({
			counts: {
				errors: expect.any(Number),
				warnings: expect.any(Number),
			},
		});
		expect(
			Array.isArray((parsed as { violations: unknown }).violations),
		).toBe(true);
	});

	test("a clean run prints 'Code style is clean.'", () => {
		const result = Bun.spawnSync(
			["bun", "scripts/lint-style/index.ts", "--rule=no-as-child"],
			{
				cwd: join(import.meta.dirname, "../.."),
			},
		);
		expect(result.stdout.toString()).toContain("Code style is clean.");
		expect(result.exitCode).toBe(0);
	});
});

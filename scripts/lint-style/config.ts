/**
 * The ONLY project-specific file. Every rule reads project facts from here
 * (`ProjectConfig`) rather than hardcoding paths/names. Severities below are
 * overrides; each rule's own default severity lives next to its definition.
 */
import { resolve } from "node:path";
import {
	componentDeclaration,
	componentTypeExport,
	defaultExportMatchesFile,
	fcTypeArgument,
	inlineComponent,
	oneComponentPerFile,
	propsInterface,
	propsInterfaceNotType,
	reactImport,
} from "./rules/components";
import {
	commonReuse,
	componentNameMatchesFile,
	componentPlacement,
	folderGrouping,
	contextLocation,
	fileKebabCase,
	noClassConstantFile,
	noIconDictionary,
	noLayoutsDir,
	noMicroTypesFile,
	routeFileNaming,
	routeRegistered,
	skeletonColocated,
} from "./rules/files";
import {
	bannedImport,
	noAsChild,
	noRelativeImport,
	rawAdminTable,
} from "./rules/imports";
import {
	hardcodedJsxText,
	hardcodedToast,
	hardcodedUiAttribute,
	i18nCategoryGlue,
	i18nKeyFormat,
	i18nKeyIndexed,
	i18nKeyGlue,
	i18nPartAsGroup,
	i18nKeyNamespace,
	i18nKeySiblingPrefix,
	i18nQualifierGlue,
	i18nUnusedKey,
	iKeyExists,
	tConcat,
	tFallback,
} from "./rules/i18n";
import {
	configKeyShape,
	hardcodedRoute,
	literalQueryKey,
} from "./rules/config-keys";
import {
	parseError,
	suppressionReason,
	unusedSuppression,
	memoryUpdated,
} from "./rules/meta";
import {
	booleanClassProp,
	defaultVariantProp,
	effectDerivedState,
	effectOpenReset,
	mutationPending,
	noAny,
	noAsCast,
	rawNumberInput,
	formZodValidation,
	adminTableSortable,
	noNestedTernary,
	noStringUnion,
	overlayAlwaysMounted,
	queryStates,
	repeatedSiblings,
	viewState,
} from "./rules/react";
import {
	duplicateClassString,
	nativeElement,
	noSpaceUtilities,
	rawColor,
	sizeShorthand,
} from "./rules/styling";
import type { AnyRule, LintConfigLike, ProjectConfig } from "./core";
import { Severity } from "./core";

const root = resolve(import.meta.dirname, "../..");

const projectConfig: ProjectConfig = {
	root,
	include: ["src/**/*.{ts,tsx}", "src/locales/*.json"],
	exclude: ["src/components/ui/**", "src/**/*.d.ts", ".react-router/**"],
	alias: { prefix: "@/", target: "src/" },
	allowRelativeImports: ["./+types/*"],
	routes: {
		dir: "src/routes",
		manifest: "src/routes.ts",
		appDir: "src",
		pageFiles: ["index.tsx", "layout.tsx"],
		componentDirs: ["components"],
	},
	components: {
		common: "src/components/common",
		shared: "src/components/shared",
		ui: "src/components/ui",
	},
	contextsDir: "src/contexts",
	structure: { maxFilesPerFolder: 6, exemptDirs: ["src/components/ui"] },
	i18n: {
		locale: "src/locales/en.json",
		functions: ["t"],
		sharedNamespaces: ["common"],
		// Shell and terminal copy lives in one `shell` namespace; the home route has no folder of its own.
		namespaceAliases: [
			{ path: "src/routes/index.tsx", namespace: "home" },
			{ path: "src/routes/layout.tsx", namespace: "shell" },
			{ path: "src/components/shared/shell", namespace: "shell" },
			{ path: "src/components/shared/terminal", namespace: "shell" },
			{ path: "src/components/shared/posts", namespace: "notes" },
		],
		partNames: [
			"title",
			"subtitle",
			"description",
			"label",
			"placeholder",
			"hint",
			"helper",
			"aria-label",
			"button",
			"submit",
			"cancel",
			"confirm",
			"empty",
			"error",
			"success",
			"loading",
			"tooltip",
			"heading",
			"eyebrow",
			"body",
			"action",
		],
		qualifierNames: [
			"invalid",
			"max",
			"min",
			"select",
			"required",
			"outside",
		],
		pluralSuffixes: ["zero", "one", "two", "few", "many", "other"],
		pluralSeparator: "-",
		categoryNouns: [
			"status",
			"role",
			"type",
			"mode",
			"state",
			"kind",
			"pos",
			"category",
			"size",
			"level",
		],
		uiAttributes: [
			"aria-label",
			"aria-description",
			"title",
			"alt",
			"placeholder",
			"label",
		],
		allowedText: ["·", "—", "–", "/", "|", "%", ":", "×", "x"],
	},
	styling: {
		classAttributes: ["className"],
		classFunctions: ["cn", "clsx", "cva"],
		nativeElements: {
			button: "Button",
			input: "Input",
			textarea: "Textarea",
			select: "Select",
			dialog: "Dialog",
		},
	},
	config: {
		file: "src/config.ts",
		keyRoots: ["queryKeys", "mock.mutationKeys"],
		routesRoot: "routes",
		mockKeyFunctions: ["respond"],
	},
	bannedImports: {
		sonner: "@/components/ui/toast",
		"@radix-ui/*": "Base UI via @/components/ui/*",
	},
	memoryFile: "MEMORY.md",
};

export const rules = {
	// components.ts
	"react-import": reactImport,
	"props-interface": propsInterface,
	"fc-type-argument": fcTypeArgument,
	"props-interface-not-type": propsInterfaceNotType,
	"component-declaration": componentDeclaration,
	"default-export-matches-file": defaultExportMatchesFile,
	"inline-component": inlineComponent,
	"one-component-per-file": oneComponentPerFile,
	"component-type-export": componentTypeExport,
	// files.ts
	"file-kebab-case": fileKebabCase,
	"component-name-matches-file": componentNameMatchesFile,
	"route-file-naming": routeFileNaming,
	"route-registered": routeRegistered,
	"no-layouts-dir": noLayoutsDir,
	"component-placement": componentPlacement,
	"folder-grouping": folderGrouping,
	"context-location": contextLocation,
	"common-reuse": commonReuse,
	"no-class-constant-file": noClassConstantFile,
	"no-micro-types-file": noMicroTypesFile,
	"no-icon-dictionary": noIconDictionary,
	"skeleton-colocated": skeletonColocated,
	// imports.ts
	"no-relative-import": noRelativeImport,
	"banned-import": bannedImport,
	"no-as-child": noAsChild,
	// react.ts
	"no-nested-ternary": noNestedTernary,
	"no-any": noAny,
	"no-as-cast": noAsCast,
	"raw-number-input": rawNumberInput,
	"form-zod-validation": formZodValidation,
	"admin-table-sortable": adminTableSortable,
	"raw-admin-table": rawAdminTable,
	"overlay-always-mounted": overlayAlwaysMounted,
	"no-string-union": noStringUnion,
	"effect-derived-state": effectDerivedState,
	"effect-open-reset": effectOpenReset,
	"view-state": viewState,
	"repeated-siblings": repeatedSiblings,
	"boolean-class-prop": booleanClassProp,
	"default-variant-prop": defaultVariantProp,
	"query-states": queryStates,
	"mutation-pending": mutationPending,
	// i18n.ts
	"hardcoded-jsx-text": hardcodedJsxText,
	"hardcoded-ui-attribute": hardcodedUiAttribute,
	"hardcoded-toast": hardcodedToast,
	"t-fallback": tFallback,
	"t-concat": tConcat,
	"t-key-exists": iKeyExists,
	"i18n-key-format": i18nKeyFormat,
	"i18n-key-glue": i18nKeyGlue,
	"i18n-part-as-group": i18nPartAsGroup,
	"i18n-key-namespace": i18nKeyNamespace,
	"i18n-key-sibling-prefix": i18nKeySiblingPrefix,
	"i18n-category-glue": i18nCategoryGlue,
	"i18n-key-indexed": i18nKeyIndexed,
	"i18n-qualifier-glue": i18nQualifierGlue,
	"i18n-unused-key": i18nUnusedKey,
	// config-keys.ts
	"config-key-shape": configKeyShape,
	"literal-query-key": literalQueryKey,
	"hardcoded-route": hardcodedRoute,
	// styling.ts
	"native-element": nativeElement,
	"no-space-utilities": noSpaceUtilities,
	"size-shorthand": sizeShorthand,
	"raw-color": rawColor,
	"duplicate-class-string": duplicateClassString,
	// meta.ts
	"parse-error": parseError,
	"suppression-reason": suppressionReason,
	"unused-suppression": unusedSuppression,
	"memory-updated": memoryUpdated,
} satisfies Record<string, AnyRule>;

export type RuleId = keyof typeof rules;
export type RuleOptions<K extends RuleId> = (typeof rules)[K]["defaults"];

export interface LintConfig extends LintConfigLike {
	project: ProjectConfig;
	rules?: {
		[K in RuleId]?: Severity | readonly [Severity, Partial<RuleOptions<K>>];
	};
}

function defineConfig(input: LintConfig): LintConfig {
	return input;
}

const config: LintConfig = defineConfig({
	project: projectConfig,
	rules: {
		// Decision 1 (plan §8): keep as warn, don't migrate the 538 hits now.
		"raw-color": Severity.Warn,
		// Decision 3 (plan §8): keep as warn, don't migrate the 63 hits now.
		"i18n-key-glue": Severity.Warn,
		// Project decision: staged locale rollout keeps many keys pre-declared.
		"i18n-unused-key": Severity.Warn,
	},
});

export default config;

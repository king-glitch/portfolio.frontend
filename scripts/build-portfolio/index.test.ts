import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
	BlockType,
	MotifKind,
	ProjectLifecycle,
	ProjectSide,
} from "@/api/types/portfolio/enums";
import { buildSeed, snakeKeys } from "./seed";
import { buildFiles, buildProfile, buildProjects, toTs } from "./index";
import {
	CATEGORY_SLUGS,
	categoriesFor,
	hasKeyword,
	kindFor,
	parseMe,
	toYearMonth,
} from "./parse";

const raw = readFileSync(
	resolve(import.meta.dir, "../../content/ME.md"),
	"utf8",
);
const me = parseMe(raw);
const projects = buildProjects(me);

test("parses every ME.md section", () => {
	expect(me.projects).toHaveLength(6);
	expect(me.skills).toHaveLength(5);
	expect(me.experience).toHaveLength(2);
	expect(me.education).toHaveLength(1);
	expect(me.core).toHaveLength(5);
	expect(me.skills[0]?.items).toHaveLength(7);
});

test("experience start/end are explicit year-months", () => {
	expect(me.experience[0]).toMatchObject({ start: "2023-01", end: null });
	expect(me.experience[1]).toMatchObject({
		start: "2022-06",
		end: "2023-06",
	});
	expect(me.education[0]).toMatchObject({ start: "2019-01", end: "2023-01" });
	expect(toYearMonth("Present")).toBeNull();
});

test("kindFor maps titles", () => {
	expect(kindFor("AADS (Army Air Defense System)")).toBe(MotifKind.Radar);
	expect(kindFor("Morning Moon Pocket")).toBe(MotifKind.Pixel);
	expect(kindFor("Morning Moon Village")).toBe(MotifKind.Moon);
	expect(kindFor("Metal Valley")).toBe(MotifKind.Hex);
	expect(kindFor("Evermoon SocialFi")).toBe(MotifKind.Orbit);
	expect(kindFor("Estic AI")).toBe(MotifKind.Pins);
	expect(kindFor("Something else")).toBe(MotifKind.Hex);
});

test("ids and numbers", () => {
	expect(projects.map((p) => p.id)).toEqual([
		"morning-moon-pocket",
		"metal-valley",
		"evermoon-socialfi",
		"estic-ai",
		"morning-moon-village",
		"aads",
	]);
	expect(projects.map((p) => p.num)).toEqual([
		"0001",
		"0002",
		"0003",
		"0004",
		"0005",
		"0006",
	]);
	expect(new Set(projects.map((p) => p.id)).size).toBe(6);
});

test("tags and facts come from the page spec", () => {
	const aads = projects.find((p) => p.id === "aads");
	expect(aads?.tags).toContain("Radar protocols");
	expect(aads?.lifecycle).toBe(ProjectLifecycle.Research);
	expect(aads?.links).toEqual([]);
	const estic = projects.find((p) => p.id === "estic-ai");
	expect(estic?.side).toBe(ProjectSide.OnScreen);
	expect(estic?.artUrl).toBeUndefined();
	// "permission system" must not read as the Missions keyword
	expect(hasKeyword("permission system", "mission system")).toBe(false);
	expect(hasKeyword("the mission system", "mission system")).toBe(true);
});

test("categories never contain all", () => {
	expect(categoriesFor(" game web3")).toEqual([
		CATEGORY_SLUGS.games,
		CATEGORY_SLUGS.onChain,
	]);
	expect(categoriesFor("a tool")).toEqual([CATEGORY_SLUGS.platforms]);
	for (const p of projects) expect(p.categories).not.toContain("all");
});

test("every page opens on its cover, then the overview, and names what I built", () => {
	for (const p of projects) {
		const types = p.blocks.map((b) => b.type);
		expect(types.slice(0, 2)).toEqual([
			BlockType.ProjectHeader,
			BlockType.Overview,
		]);
		expect(types).toContain(BlockType.Contributions);
		expect(types).toContain(BlockType.Challenge);
	}
});

test("every image is a local asset with a stored size", () => {
	const assets = projects.flatMap((p) =>
		p.blocks.flatMap((b) => {
			if (b.type === BlockType.Filmstrip) return b.params.items;
			if (b.type === BlockType.Showcase) return [b.params];
			return [];
		}),
	);
	expect(assets.length).toBeGreaterThan(10);
	for (const asset of assets) {
		expect(asset.url).toMatch(/^\/projects\/[a-z-]+\/[a-z0-9-]+\.webp$/);
		expect(asset.width).toBeGreaterThan(0);
		expect(asset.height).toBeGreaterThan(0);
		expect(
			existsSync(
				resolve(import.meta.dir, "../../public", `.${asset.url}`),
			),
		).toBe(true);
	}
});

test("AADS lists the ME.md features in its grid", () => {
	const aads = projects.find((p) => p.id === "aads");
	const grid = aads?.blocks.find((b) => b.type === BlockType.FeatureGrid);
	expect(
		grid?.type === BlockType.FeatureGrid && grid.params.items,
	).toHaveLength(6);
});

test("profile has the real name and contacts", () => {
	const profile = buildProfile(me);
	expect(profile.name).toBe("William Siefert");
	expect(profile.contact.email).toBe("wilhelm.hsf@gmail.com");
});

test("output is deterministic and references enums, not literals", () => {
	const a = buildFiles(me);
	expect(buildFiles(me)).toEqual(a);
	expect(a["projects.ts"]).toContain("BlockType.Statement");
	expect(a["projects.ts"]).toContain("MediaFit.Contain");
	expect(a["projects.ts"]).not.toContain('"project-header"');
	expect(a["profile.ts"]).toContain("ExperienceKind.Work");
	expect(() => toTs({ type: "nope" })).toThrow();
});

test("seed has every project, note and the contact data", () => {
	const seed = buildSeed(projects, buildProfile(me));
	expect(seed.projects.map((p) => p.slug)).toEqual(projects.map((p) => p.id));
	expect(seed.notes.map((n) => n.slug)).toEqual([
		"scalable-game-backend",
		"smart-contracts-you-can-sleep-next-to",
		"four-thousand-pins-one-smooth-map",
	]);
	expect(seed.notes.map((n) => n.published_at)).toEqual([
		"2026-10-03T00:00:00Z",
		"2026-10-02T00:00:00Z",
		"2026-10-01T00:00:00Z",
	]);
	expect(seed.project_categories.map((c) => c.slug)).toEqual([
		"games",
		"platforms",
		"on-chain",
	]);
	expect(seed.profile).toMatchObject({
		contact: { email: "wilhelm.hsf@gmail.com" },
	});
	for (const note of seed.notes)
		expect(Object.keys(note)).not.toEqual(
			expect.arrayContaining(["num", "read_minutes", "sample"]),
		);
});

test("seed block keys are snake_case and lineage names its target by slug", () => {
	const seed = buildSeed(projects, buildProfile(me));
	const keys = (value: unknown): string[] =>
		Array.isArray(value)
			? value.flatMap(keys)
			: value && typeof value === "object"
				? Object.entries(value).flatMap(([k, v]) => [k, ...keys(v)])
				: [];
	expect(
		keys(seed.projects.map((p) => p.blocks)).filter((k) => /[A-Z]/.test(k)),
	).toEqual([]);
	const lineage = seed.projects
		.flatMap((p) => p.blocks)
		.find((b) => (b as { type: string }).type === BlockType.Lineage);
	expect(lineage).toMatchObject({
		params: { from_slug: "morning-moon-village" },
	});
	expect(JSON.stringify(lineage)).not.toContain("from_id");
});

test("snakeKeys converts keys at any depth and leaves values alone", () => {
	expect(snakeKeys({ imageUrl: "aB", items: [{ fromId: "x" }] })).toEqual({
		image_url: "aB",
		items: [{ from_id: "x" }],
	});
});

import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
	BlockType,
	MotifKind,
	ProjectFilter,
} from "@/api/types/portfolio/enums";
import { buildFiles, buildProfile, buildProjects, toTs } from "./index";
import {
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

test("tags and stack keywords", () => {
	const aads = projects.find((p) => p.id === "aads");
	expect(aads?.tags).toEqual([
		"Real-time",
		"Radar protocols",
		"Encryption",
		"Maps",
	]);
	expect(aads?.stack).toEqual(
		expect.arrayContaining(["socket", "trml", "encrypt"]),
	);
	// "permission system" must not read as the Missions keyword
	expect(hasKeyword("permission system", "mission system")).toBe(false);
	expect(hasKeyword("the mission system", "mission system")).toBe(true);
});

test("categories never contain All", () => {
	expect(categoriesFor(" game web3")).toEqual([
		ProjectFilter.Games,
		ProjectFilter.OnChain,
	]);
	expect(categoriesFor("a tool")).toEqual([ProjectFilter.Platforms]);
	for (const p of projects)
		expect(p.categories).not.toContain(ProjectFilter.All);
});

test("block order per kind", () => {
	const types = (id: string) =>
		projects.find((p) => p.id === id)?.blocks.map((b) => b.type);
	const B = BlockType;
	expect(types("aads")).toEqual([
		B.ProjectHeader,
		B.Quote,
		B.Mock,
		B.Architecture,
		B.FeatureGrid,
		B.Timeline,
		B.Zigzag,
	]);
	expect(types("morning-moon-village")).toEqual([
		B.ProjectHeader,
		B.AboutSplit,
		B.Mock,
		B.StackCards,
		B.Architecture,
		B.Quote,
		B.NumberedList,
	]);
	expect(types("morning-moon-pocket")).toEqual([
		B.ProjectHeader,
		B.Chips,
		B.Lineage,
		B.Gallery,
		B.NumberedList,
		B.Architecture,
		B.StackCards,
	]);
	expect(types("metal-valley")).toEqual([
		B.ProjectHeader,
		B.AboutSplit,
		B.Gallery,
		B.Architecture,
		B.Timeline,
		B.Zigzag,
	]);
	expect(types("evermoon-socialfi")).toEqual([
		B.ProjectHeader,
		B.Chips,
		B.Mock,
		B.Quote,
		B.Architecture,
		B.Quote,
	]);
	expect(types("estic-ai")).toEqual([
		B.ProjectHeader,
		B.Gallery,
		B.AboutSplit,
		B.StackCards,
		B.NumberedList,
	]);
});

test("AADS payload matches the plan example", () => {
	const aads = projects.find((p) => p.id === "aads");
	const arch = aads?.blocks[3];
	expect(
		arch?.type === BlockType.Architecture && arch.params.nodes[1],
	).toEqual({
		name: "Decoder",
		description: "TRML · DR127ADV → readable",
	});
	const grid = aads?.blocks[4];
	expect(
		grid?.type === BlockType.FeatureGrid && grid.params.items,
	).toHaveLength(7);
});

test("profile has the real name and contacts", () => {
	const profile = buildProfile(me);
	expect(profile.name).toBe("William Siefert");
	expect(profile.contact.email).toBe("wilhelm.hsf@gmail.com");
});

test("output is deterministic and references enums, not literals", () => {
	const a = buildFiles(me);
	expect(buildFiles(me)).toEqual(a);
	expect(a["projects.ts"]).toContain("BlockType.Quote");
	expect(a["projects.ts"]).not.toContain('"project-header"');
	expect(a["profile.ts"]).toContain("ExperienceKind.Work");
	expect(() => toTs({ type: "nope" })).toThrow();
});

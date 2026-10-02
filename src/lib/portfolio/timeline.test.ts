import { describe, expect, test } from "bun:test";
import { ExperienceKind } from "@/api/types/portfolio/enums";
import { buildTimeline, shortTitle } from "@/lib/portfolio/timeline";

const base = { notes: [], period: "" };
const profile = {
	education: [
		{
			...base,
			id: "bu",
			title: "Bangkok University",
			kind: ExperienceKind.Education,
			start: "2019-01",
			end: "2023-01",
		},
	],
	experience: [
		{
			...base,
			id: "x10",
			title: "Software Developer X10 Interactive",
			kind: ExperienceKind.Work,
			start: "2023-01",
			end: null,
		},
		{
			...base,
			id: "lab",
			title: "Bangkok University Multimedia Intelligent Technology",
			kind: ExperienceKind.Work,
			start: "2022-06",
			end: "2023-06",
		},
	],
};

describe("timeline", () => {
	const now = new Date(2026, 5, 1);
	const model = buildTimeline(profile, now);

	test("sorted by start, latest last", () => {
		expect(model.entries.map((e) => e.id)).toEqual(["bu", "lab", "x10"]);
	});

	test("positions are percent of the ruler", () => {
		expect(model.ticks[0]).toEqual({ year: 2019, leftPct: 0 });
		expect(model.ticks.at(-1)?.year).toBe(2027);
		expect(model.entries[0]?.leftPct).toBe(0);
		// 2019 -> 2027 is 8 years; 4 years of study = 50%
		expect(model.entries[0]?.widthPct).toBeCloseTo(50, 5);
	});

	test("open end runs to now and label is derived", () => {
		const x10 = model.entries[2]!;
		expect(x10.widthPct).toBeGreaterThan(30);
		expect(model.spanLabel).toBe("2019—26");
	});

	test("short titles", () => {
		expect(shortTitle("Software Developer X10 Interactive")).toBe(
			"X10 Interactive",
		);
		expect(
			shortTitle("Bangkok University Multimedia Intelligent Technology"),
		).toBe("Bangkok University — MIT lab");
	});
});

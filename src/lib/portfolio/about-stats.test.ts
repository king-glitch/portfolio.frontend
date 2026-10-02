import { expect, test } from "bun:test";
import { profile } from "@/api/mocks/portfolio/profile";
import { projects } from "@/api/mocks/portfolio/projects";
import {
	buildAboutStats,
	clip,
	firstSentence,
	resumeSkills,
	splitRole,
} from "@/lib/portfolio/about-stats";

test("stats come from the data, not constants", () => {
	const s = buildAboutStats(profile, projects, new Date(2026, 5, 1));
	expect(s.total).toBe(projects.length);
	expect(s.games).toBe(3);
	expect(s.onChain).toBe(4);
	expect(s.employer).toBe("X10 Interactive");
	expect(s.yearsInProduction).toBe(3);
	expect(s.timeline).toHaveLength(3);
	expect(s.timeline[0]?.left).toBe(0);
	expect(s.languages[0]).toBe("Golang");
});

test("text helpers", () => {
	expect(firstSentence("One. Two.")).toBe("One.");
	expect(firstSentence("no stop")).toBe("no stop");
	expect(clip("aaa bbb ccc", 8)).toBe("aaa bbb…");
	expect(clip("short", 8)).toBe("short");
	expect(resumeSkills(profile).at(-1)?.label).toBe("Strengths");
});

test("splitRole", () => {
	expect(splitRole("Software Developer X10 Interactive")).toEqual({
		name: "X10 Interactive",
		role: "Software Developer",
	});
	expect(splitRole("Bangkok University").role).toBeNull();
});

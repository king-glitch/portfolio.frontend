import { expect, test } from "bun:test";
import { projects } from "@/api/mocks/portfolio/projects";
import type { StackStop } from "@/api/types/portfolio/project";
import { projectCountFor, projectsForStop } from "@/lib/portfolio/stack-stops";

const stop = (keywords: string[]): StackStop => ({
	id: "x",
	name: "x",
	description: "x",
	keywords,
});

test("stop keywords match project stack entries case-insensitively", () => {
	expect(projectsForStop(stop(["REACT"]), projects).length).toBeGreaterThan(
		0,
	);
	expect(projectsForStop(stop(["no-such-tool"]), projects)).toEqual([]);
});

test("tool count is case-insensitive and zero for unknown tools", () => {
	expect(projectCountFor("golang", projects)).toBe(
		projectCountFor("Golang", projects),
	);
	expect(projectCountFor("Golang", projects)).toBeGreaterThan(0);
	expect(projectCountFor("Teamwork", projects)).toBe(0);
});

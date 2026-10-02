import { expect, test } from "bun:test";
import { projects } from "@/api/mocks/portfolio/projects";
import { ProjectFilter } from "@/api/types/portfolio/enums";
import { countByFilter, filterProjects } from "@/lib/portfolio/filter";

test("All returns every project", () => {
	expect(filterProjects(projects, ProjectFilter.All)).toHaveLength(6);
});

test("counts per filter match the fixtures", () => {
	expect(countByFilter(projects)).toEqual({
		[ProjectFilter.All]: 6,
		[ProjectFilter.Games]: 3,
		[ProjectFilter.Platforms]: 3,
		[ProjectFilter.OnChain]: 4,
	});
});

test("filters keep only matching categories", () => {
	const onChain = filterProjects(projects, ProjectFilter.OnChain);
	expect(
		onChain.every((p) => p.categories.includes(ProjectFilter.OnChain)),
	).toBe(true);
});

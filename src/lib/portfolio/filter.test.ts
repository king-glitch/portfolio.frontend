import { expect, test } from "bun:test";
import { projects } from "@/api/mocks/portfolio/projects";
import { config } from "@/config";
import { countByFilter, filterProjects } from "@/lib/portfolio/filter";

const { games, onChain } = config.portfolio.categorySlugs;
const all = config.portfolio.defaultFilter;

test("All returns every project", () => {
	expect(filterProjects(projects, all)).toHaveLength(6);
});

test("counts per filter match the fixtures", () => {
	expect(countByFilter(projects, [games, "platforms", onChain])).toEqual({
		[all]: 6,
		[games]: 3,
		platforms: 3,
		[onChain]: 4,
	});
});

test("filters keep only matching categories", () => {
	const chain = filterProjects(projects, onChain);
	expect(chain.every((p) => p.categories.includes(onChain))).toBe(true);
});

test("a slug no project has matches nothing", () => {
	expect(filterProjects(projects, "gone")).toHaveLength(0);
});

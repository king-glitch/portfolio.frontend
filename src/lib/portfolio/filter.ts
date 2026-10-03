import type { ProjectSummary } from "@/api/types/portfolio/project";
import { config } from "@/config";

const isAll = (filter: string) => filter === config.portfolio.defaultFilter;

/** `filter` is a category slug or the "all" constant. */
export function filterProjects(
	projects: ProjectSummary[],
	filter: string,
): ProjectSummary[] {
	return isAll(filter)
		? projects
		: projects.filter((p) => p.categories.includes(filter));
}

/** Project count per category slug, plus the "all" constant. */
export function countByFilter(
	projects: ProjectSummary[],
	slugs: string[],
): Record<string, number> {
	return Object.fromEntries(
		[config.portfolio.defaultFilter, ...slugs].map((slug) => [
			slug,
			filterProjects(projects, slug).length,
		]),
	);
}

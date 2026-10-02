import { ProjectFilter } from "@/api/types/portfolio/enums";
import type { ProjectSummary } from "@/api/types/portfolio/project";

/** Predicate per filter; `Record` keeps it exhaustive when a filter is added. */
export const matchesFilter: Record<
	ProjectFilter,
	(project: ProjectSummary) => boolean
> = {
	[ProjectFilter.All]: () => true,
	[ProjectFilter.Games]: (p) => p.categories.includes(ProjectFilter.Games),
	[ProjectFilter.Platforms]: (p) =>
		p.categories.includes(ProjectFilter.Platforms),
	[ProjectFilter.OnChain]: (p) =>
		p.categories.includes(ProjectFilter.OnChain),
};

export function filterProjects(
	projects: ProjectSummary[],
	filter: ProjectFilter,
): ProjectSummary[] {
	return projects.filter(matchesFilter[filter]);
}

export function countByFilter(
	projects: ProjectSummary[],
): Record<ProjectFilter, number> {
	return {
		[ProjectFilter.All]: filterProjects(projects, ProjectFilter.All).length,
		[ProjectFilter.Games]: filterProjects(projects, ProjectFilter.Games)
			.length,
		[ProjectFilter.Platforms]: filterProjects(
			projects,
			ProjectFilter.Platforms,
		).length,
		[ProjectFilter.OnChain]: filterProjects(projects, ProjectFilter.OnChain)
			.length,
	};
}

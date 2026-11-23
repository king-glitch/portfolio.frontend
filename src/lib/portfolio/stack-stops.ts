import type { ProjectSummary, StackStop } from "@/api/types/portfolio/project";

/** Whether any `stack` entry of the project contains `term` (case-insensitive). */
const uses = (project: ProjectSummary, term: string) =>
	project.stack.some((item) =>
		item.toLowerCase().includes(term.toLowerCase()),
	);

/** Projects whose `stack` keywords touch this stop. */
export function projectsForStop(
	stop: StackStop,
	projects: ProjectSummary[],
): ProjectSummary[] {
	return projects.filter((p) => stop.keywords.some((k) => uses(p, k)));
}

/** How many projects list `tool` in their stack (toolkit hover count). */
export function projectCountFor(
	tool: string,
	projects: ProjectSummary[],
): number {
	return projects.filter((p) => uses(p, tool)).length;
}

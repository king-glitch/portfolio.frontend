import type { ParseKeys } from "i18next";
import { ProjectLifecycle } from "@/api/types/portfolio/enums";
import type { Project } from "@/api/types/portfolio/project";

const LIFECYCLE_KEYS: Record<ProjectLifecycle, ParseKeys> = {
	[ProjectLifecycle.Live]: "projects.lifecycles.live",
	[ProjectLifecycle.Ended]: "projects.lifecycles.ended",
	[ProjectLifecycle.Research]: "projects.lifecycles.research",
};

export const lifecycleKey = (lifecycle: ProjectLifecycle): ParseKeys =>
	LIFECYCLE_KEYS[lifecycle];

export interface ProjectFact {
	id: string;
	labelKey: ParseKeys;
	/** Data, shown as is; translated only for `lifecycle` (see `lifecycleKey`). */
	value: string;
}

/** The overview's fact sheet, in reading order; empty facts are left out. */
export function projectFacts(project: Project): ProjectFact[] {
	const facts: ProjectFact[] = [
		{
			id: "position",
			labelKey: "projects.facts.position",
			value: project.position,
		},
		{
			id: "period",
			labelKey: "projects.facts.period",
			value: project.period,
		},
		{ id: "team", labelKey: "projects.facts.team", value: project.team },
		{
			id: "platforms",
			labelKey: "projects.facts.platforms",
			value: project.platforms.join(" · "),
		},
		{
			id: "chains",
			labelKey: "projects.facts.chains",
			value: project.chains.join(" · "),
		},
		{
			id: "stack",
			labelKey: "projects.facts.stack",
			value: project.tags.join(" · "),
		},
	];
	return facts.filter((fact) => fact.value);
}

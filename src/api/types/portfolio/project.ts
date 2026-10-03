import type { Block } from "@/api/types/portfolio/block";
import type { MotifKind, ProjectSide } from "@/api/types/portfolio/enums";

export interface ProjectSummary {
	id: string;
	num: string;
	name: string;
	full: string;
	kind: MotifKind;
	side: ProjectSide;
	tags: string[];
	/** Category slugs (see `ProjectCategory`); never "all". */
	categories: string[];
	stack: string[];
	about: string;
	role: string[];
	/** Uploaded art; the motif drawn from `kind` is the fallback. */
	artUrl?: string;
}

export interface Project extends ProjectSummary {
	blocks: Block[];
}

/** One entry of the `project_categories` setting: `slug` is stored on projects, `label` is shown (data, not translated). */
export interface ProjectCategory {
	slug: string;
	label: string;
}

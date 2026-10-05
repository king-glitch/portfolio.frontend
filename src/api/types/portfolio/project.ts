import type { Block } from "@/api/types/portfolio/block";
import type {
	MotifKind,
	ProjectLifecycle,
	ProjectSide,
} from "@/api/types/portfolio/enums";

export interface ProjectLink {
	label: string;
	url: string;
}

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
	/** The job title on this project ("Software Engineer"). */
	position: string;
	/** Free text: "9 months", "Jun 2022 – Jun 2023". */
	period: string;
	team: string;
	/** Unset on projects saved before content version 2. */
	lifecycle?: ProjectLifecycle;
	platforms: string[];
	chains: string[];
	links: ProjectLink[];
}

export interface Project extends ProjectSummary {
	blocks: Block[];
}

/** One entry of the `project_categories` setting: `slug` is stored on projects, `label` is shown (data, not translated). */
export interface ProjectCategory {
	slug: string;
	label: string;
}

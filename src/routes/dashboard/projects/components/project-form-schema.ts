import type { TFunction } from "i18next";
import { z } from "zod";
import type {
	AdminProjectDetail,
	ProjectInput,
} from "@/api/types/admin/content";
import { ContentStatus } from "@/api/types/admin/enums";
import {
	MotifKind,
	ProjectLifecycle,
	ProjectSide,
} from "@/api/types/portfolio/enums";
import type { ProjectLink } from "@/api/types/portfolio/project";
import { projectBlockSpecs } from "@/lib/dynamic-form/specs";
import { blocksHaveMissing, normalizeBlocks } from "@/lib/dynamic-form/values";
import { cleanList } from "@/lib/forms";

/** One link per line, written `Label | https://…`. */
const LINK_LINE = /^(.+?)\s*\|\s*(https?:\/\/\S+)$/;

const linkLine = (link: ProjectLink): string => `${link.label} | ${link.url}`;

function parseLinks(lines: string[]): ProjectLink[] {
	return cleanList(lines).flatMap((line) => {
		const match = LINK_LINE.exec(line);
		return match?.[1] && match[2]
			? [{ label: match[1], url: match[2] }]
			: [];
	});
}

export const projectFormSchema = (t: TFunction) =>
	z.object({
		name: z.string().trim().min(1, t("dashboard.errors.required")),
		full: z.string().trim().min(1, t("dashboard.errors.required")),
		kind: z.enum(MotifKind),
		artUrl: z.string(),
		side: z.enum(ProjectSide),
		status: z.enum(ContentStatus),
		categories: z.array(z.string()),
		tags: z.array(z.string()),
		stack: z.array(z.string()),
		role: z.array(z.string()),
		about: z.string(),
		position: z.string(),
		period: z.string(),
		team: z.string(),
		lifecycle: z.enum(ProjectLifecycle),
		platforms: z.array(z.string()),
		chains: z.array(z.string()),
		links: z
			.array(z.string())
			.refine(
				(lines) =>
					cleanList(lines).every((line) => LINK_LINE.test(line)),
				t("dashboard.errors.link"),
			),
		blocks: z
			.array(z.record(z.string(), z.unknown()))
			.refine(
				(blocks) => !blocksHaveMissing(blocks, projectBlockSpecs, true),
				t("dashboard.errors.block"),
			),
	});

export type ProjectFormValues = z.infer<ReturnType<typeof projectFormSchema>>;

export const emptyProjectForm: ProjectFormValues = {
	name: "",
	full: "",
	kind: MotifKind.Radar,
	artUrl: "",
	side: ProjectSide.OnScreen,
	status: ContentStatus.Draft,
	categories: [],
	tags: [],
	stack: [],
	role: [],
	about: "",
	position: "",
	period: "",
	team: "",
	lifecycle: ProjectLifecycle.Live,
	platforms: [],
	chains: [],
	links: [],
	blocks: [],
};

export const toProjectForm = (
	project: AdminProjectDetail,
): ProjectFormValues => ({
	name: project.name,
	full: project.full,
	kind: project.kind,
	artUrl: project.artUrl,
	side: project.side,
	status: project.status,
	categories: project.categories,
	tags: project.tags,
	stack: project.stack,
	// role entries are sentences that contain commas: a row each, never split on commas
	role: project.role,
	about: project.about,
	position: project.position,
	period: project.period,
	team: project.team,
	lifecycle: project.lifecycle || ProjectLifecycle.Live,
	platforms: project.platforms,
	chains: project.chains,
	links: project.links.map(linkLine),
	blocks: project.blocks,
});

export const toProjectInput = (values: ProjectFormValues): ProjectInput => ({
	...values,
	tags: cleanList(values.tags),
	stack: cleanList(values.stack),
	role: cleanList(values.role),
	position: values.position.trim(),
	period: values.period.trim(),
	team: values.team.trim(),
	platforms: cleanList(values.platforms),
	chains: cleanList(values.chains),
	links: parseLinks(values.links),
	blocks: normalizeBlocks(values.blocks, projectBlockSpecs, true),
});

/** Field names the backend may reject by name (its snake_case keys are matched to these camelCase names). */
export const projectFieldNames = Object.keys(emptyProjectForm).filter(
	(key): key is keyof ProjectFormValues => key in emptyProjectForm,
);

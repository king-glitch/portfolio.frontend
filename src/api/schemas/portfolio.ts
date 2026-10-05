import { z } from "zod";
import type { Block } from "@/api/types/portfolio/block";
import {
	BlockType,
	ExperienceKind,
	MediaFit,
	MediaTone,
	MotifKind,
	PostBlockType,
	ProjectLifecycle,
	ProjectSide,
} from "@/api/types/portfolio/enums";
import type { GalleryPage } from "@/api/types/portfolio/gallery";
import type { Post, PostSummary } from "@/api/types/portfolio/post";
import type { Profile } from "@/api/types/portfolio/profile";
import type {
	Project,
	ProjectCategory,
	ProjectSummary,
} from "@/api/types/portfolio/project";
import { SettingKey } from "@/api/types/admin/setting";
import { config } from "@/config";

/**
 * The backend contract (snake_case, `docs/plan/11-frontend-contract.md`) parsed into the models
 * the UI uses. Every response goes through here, so a drifted backend fails as one `Invalid`
 * error instead of crashing a component. Backend `slug` is the model `id` (it is the URL key).
 */

const items = z.array(z.string());

const mediaAsset = z.object({
	url: z.string(),
	alt: z.string(),
	caption: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	fit: z.enum(MediaFit),
	tone: z.enum(MediaTone),
});

const block = <T extends BlockType>(type: T) => z.literal(type);

/** Blocks whose only param is a label (their content is the project's own fields). */
const labelBlock = <
	T extends BlockType.Overview | BlockType.Contributions | BlockType.Links,
>(
	type: T,
) => z.object({ type: block(type), params: z.object({ label: z.string() }) });

const blockSchema: z.ZodType<Block> = z.discriminatedUnion("type", [
	z.object({
		type: block(BlockType.ProjectHeader),
		params: z.object({ tagline: z.string() }),
	}),
	labelBlock(BlockType.Overview),
	z.object({
		type: block(BlockType.Filmstrip),
		params: z.object({
			label: z.string(),
			caption: z.string().optional(),
			items: z.array(mediaAsset),
		}),
	}),
	z.object({
		type: block(BlockType.Showcase),
		params: mediaAsset.extend({ label: z.string().optional() }),
	}),
	labelBlock(BlockType.Contributions),
	z.object({
		type: block(BlockType.Challenge),
		params: z.object({
			label: z.string(),
			items: z.array(
				z.object({
					problem: z.string(),
					approach: z.string().optional(),
				}),
			),
		}),
	}),
	z.object({
		type: block(BlockType.Statement),
		params: z.object({ text: z.string() }),
	}),
	z.object({
		type: block(BlockType.FeatureGrid),
		params: z.object({ label: z.string(), items }),
	}),
	labelBlock(BlockType.Links),
	z.object({
		type: block(BlockType.Architecture),
		params: z.object({
			label: z.string(),
			nodes: z.array(
				z.object({ name: z.string(), description: z.string() }),
			),
		}),
	}),
	z.object({
		type: block(BlockType.Lineage),
		params: z
			.object({
				label: z.string(),
				from: z.string(),
				to: z.string(),
				text: z.string(),
				from_id: z.string().optional(),
			})
			// from_id is the linked project's document id here; the service swaps it for its slug.
			.transform(({ from_id, ...rest }) => ({
				...rest,
				fromId: from_id,
			})),
	}),
]);

const summaryFields = {
	slug: z.string(),
	num: z.string(),
	name: z.string(),
	full: z.string(),
	kind: z.enum(MotifKind),
	side: z.enum(ProjectSide),
	tags: items,
	categories: z.array(z.string()),
	stack: items,
	about: z.string(),
	role: items,
	art_url: z.string().optional(),
	// absent on projects saved before content version 2
	position: z.string().default(""),
	period: z.string().default(""),
	team: z.string().default(""),
	lifecycle: z.enum(ProjectLifecycle).optional().catch(undefined),
	platforms: items.default([]),
	chains: items.default([]),
	links: z
		.array(z.object({ label: z.string(), url: z.string() }))
		.default([]),
};

const toSummary = ({
	slug,
	art_url,
	...rest
}: z.output<typeof projectSummary>) => ({
	...rest,
	id: slug,
	artUrl: art_url || undefined,
});

const projectSummary = z.object({ id: z.string(), ...summaryFields });

export const projectListSchema: z.ZodType<ProjectSummary[]> = z
	.object({ projects: z.array(projectSummary) })
	.transform(({ projects }) => projects.map(toSummary));

/** Document id -> slug of every public project, to resolve lineage links. */
export const projectSlugsSchema = z
	.object({
		projects: z.array(z.object({ id: z.string(), slug: z.string() })),
	})
	.transform(({ projects }) => new Map(projects.map((p) => [p.id, p.slug])));

export const projectSchema: z.ZodType<Project> = projectSummary
	.extend({ blocks: z.array(blockSchema) })
	.transform((project) => ({
		...toSummary(project),
		blocks: project.blocks,
	}));

const formatDate = (iso: string | null): string => {
	const date = iso ? new Date(iso) : null;
	return date && !Number.isNaN(date.getTime())
		? date.toLocaleDateString(config.i18n.defaultLocale, config.dateFormat)
		: "";
};

const noteFields = {
	slug: z.string(),
	num: z.string(),
	title: z.string(),
	published_at: z.string().nullable(),
	tags: items,
	kind: z.enum(MotifKind),
	excerpt: z.string(),
	read_minutes: z.number(),
	sample: z.boolean(),
	art_url: z.string().optional(),
};

const toPostSummary = ({
	published_at,
	read_minutes,
	art_url,
	...rest
}: z.output<z.ZodObject<typeof noteFields>>): PostSummary => ({
	...rest,
	date: formatDate(published_at),
	readMinutes: read_minutes,
	artUrl: art_url || undefined,
});

export const postListSchema = z
	.object({ notes: z.array(z.object(noteFields)) })
	.transform(({ notes }) => notes.map(toPostSummary));

const text = <T extends PostBlockType>(type: T) =>
	z.object({ type: z.literal(type), text: z.string() });

const postBlockSchema = z.discriminatedUnion("type", [
	text(PostBlockType.Paragraph),
	text(PostBlockType.Heading),
	text(PostBlockType.Quote),
	text(PostBlockType.Callout),
	z.object({ type: z.literal(PostBlockType.List), items }),
	text(PostBlockType.Code).extend({ lang: z.string() }),
]);

export const postSchema: z.ZodType<Post> = z
	.object({ ...noteFields, blocks: z.array(postBlockSchema) })
	.transform(({ blocks, ...rest }) => ({ ...toPostSummary(rest), blocks }));

const experience = z.object({
	id: z.string(),
	title: z.string(),
	period: z.string(),
	notes: items,
	kind: z.enum(ExperienceKind),
	start: z.string(),
	end: z.string().nullable(),
});

/** `data` is null until the owner has saved a profile: that parse failure is an `Invalid` error. */
export const profileSchema: z.ZodType<Profile> = z.object({
	name: z.string(),
	headline: z.string(),
	about: z.string(),
	skills: z.array(z.object({ label: z.string(), items })),
	core: z.array(z.object({ label: z.string(), text: z.string() })),
	experience: z.array(experience),
	education: z.array(experience),
	contact: z.object({
		email: z.string(),
		github: z.string(),
		linkedin: z.string(),
		discord: z.string(),
	}),
});

export const galleryPageSchema: z.ZodType<GalleryPage> = z
	.object({
		items: z.array(
			z.object({
				id: z.string(),
				project: z
					.object({ slug: z.string(), name: z.string() })
					.nullable(),
				tags: items,
				width: z.number(),
				height: z.number(),
				image_url: z.string(),
			}),
		),
		next_cursor: z.string().nullable(),
	})
	.transform(({ items: frames, next_cursor }) => ({
		frames: frames.map(({ project, image_url, ...rest }) => ({
			...rest,
			projectSlug: project?.slug ?? null,
			projectName: project?.name ?? null,
			imageUrl: image_url,
		})),
		nextCursor: next_cursor,
	}));

export const galleryTagsSchema = z.object({
	total: z.number(),
	tags: z.array(z.object({ tag: z.string(), count: z.number() })),
});

/** The `project_categories` setting value. */
export const projectCategoriesSchema: z.ZodType<ProjectCategory[]> = z.array(
	z.object({ slug: z.string(), label: z.string() }),
);

/** Public settings are a `{ key: value }` map; a key the owner never saved reads as no categories. */
export const publicCategoriesSchema = z
	.object({
		[SettingKey.ProjectCategories]: projectCategoriesSchema.optional(),
	})
	.transform((settings) => settings[SettingKey.ProjectCategories] ?? []);

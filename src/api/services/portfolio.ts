import type { z } from "zod";
import { get } from "@/api/client";
import { parseBody } from "@/api/parse";
import {
	galleryPageSchema,
	galleryTagsSchema,
	postListSchema,
	postSchema,
	profileSchema,
	projectListSchema,
	projectSchema,
	projectSlugsSchema,
} from "@/api/schemas/portfolio";
import { BlockType } from "@/api/types/portfolio/enums";
import type {
	GalleryPage,
	GalleryParams,
	GalleryTags,
} from "@/api/types/portfolio/gallery";
import type { Post, PostSummary } from "@/api/types/portfolio/post";
import type { Profile } from "@/api/types/portfolio/profile";
import type { Project, ProjectSummary } from "@/api/types/portfolio/project";
import { config } from "@/config";

const { paths, params } = config.api;

/** GET `path` and parse the body against the contract. */
async function fetchParsed<S extends z.ZodType>(
	schema: S,
	path: string,
	query?: Record<string, string | number | undefined>,
): Promise<z.output<S>> {
	return parseBody(schema, path, await get(path, query));
}

const segment = encodeURIComponent;

export const getProfile = (): Promise<Profile> =>
	fetchParsed(profileSchema, paths.profile);

export const listProjects = (): Promise<ProjectSummary[]> =>
	fetchParsed(projectListSchema, paths.projects);

/** `id` is the project's slug. Lineage links arrive as document ids and leave as slugs. */
export async function getProject(id: string): Promise<Project> {
	const project = await fetchParsed(
		projectSchema,
		`${paths.projects}/${segment(id)}`,
	);
	if (
		!project.blocks.some(
			(b) => b.type === BlockType.Lineage && b.params.fromId,
		)
	)
		return project;
	const slugs = await fetchParsed(projectSlugsSchema, paths.projects);
	return {
		...project,
		blocks: project.blocks.map((b) =>
			b.type === BlockType.Lineage && b.params.fromId
				? {
						...b,
						params: {
							...b.params,
							// a deleted or unpublished target leaves the name as plain text
							fromId: slugs.get(b.params.fromId),
						},
					}
				: b,
		),
	};
}

export const listPosts = (): Promise<PostSummary[]> =>
	fetchParsed(postListSchema, paths.notes);

export const getPost = (slug: string): Promise<Post> =>
	fetchParsed(postSchema, `${paths.notes}/${segment(slug)}`);

/** One page of frames, optionally of one tag. `cursor` is the backend's opaque `next_cursor`. */
export const listGallery = ({
	tag,
	cursor,
	limit,
}: GalleryParams): Promise<GalleryPage> =>
	fetchParsed(galleryPageSchema, paths.galleryFrames, {
		[params.tag]: tag,
		[params.cursor]: cursor,
		[params.limit]: limit,
	});

/** The most used tags with their frame counts, for the filter chips. */
export const listGalleryTags = (): Promise<GalleryTags> =>
	fetchParsed(galleryTagsSchema, paths.galleryTags, {
		[params.limit]: config.gallery.tagLimit,
	});

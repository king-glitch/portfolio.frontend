import { NotFoundError } from "@/api/errors";
import { buildGalleryFrames } from "@/api/mocks/portfolio/gallery";
import { posts } from "@/api/mocks/portfolio/posts";
import { profile } from "@/api/mocks/portfolio/profile";
import { projects } from "@/api/mocks/portfolio/projects";
import { sleep } from "@/api/mocks/sleep";
import type {
	GalleryPage,
	GalleryParams,
	GalleryTags,
} from "@/api/types/portfolio/gallery";
import type { Post, PostSummary } from "@/api/types/portfolio/post";
import type { Profile } from "@/api/types/portfolio/profile";
import type { Project, ProjectSummary } from "@/api/types/portfolio/project";
import { config } from "@/config";

// ponytail: mock seam. Swap each body for an HTTP call (and add the Axios client) when a backend exists.

export async function getProfile(): Promise<Profile> {
	await sleep();
	return profile;
}

export async function listProjects(): Promise<ProjectSummary[]> {
	await sleep();
	return projects.map(({ blocks: _blocks, ...summary }) => summary);
}

export async function getProject(id: string): Promise<Project> {
	await sleep();
	const project = projects.find((p) => p.id === id);
	if (!project) throw new NotFoundError("project", id);
	return project;
}

export async function listPosts(): Promise<PostSummary[]> {
	await sleep();
	return posts.map(({ blocks: _blocks, ...summary }) => summary);
}

export async function getPost(slug: string): Promise<Post> {
	await sleep();
	const post = posts.find((p) => p.slug === slug);
	if (!post) throw new NotFoundError("post", slug);
	return post;
}

/** One page of frames, optionally of one tag. `cursor` is opaque to the client (here: an offset). */
export async function listGallery({
	tag,
	cursor,
	limit,
}: GalleryParams): Promise<GalleryPage> {
	await sleep();
	const all = buildGalleryFrames(projects);
	const matching = tag ? all.filter((f) => f.tags.includes(tag)) : all;
	const from = cursor ? Number(cursor) : 0;
	const to = from + limit;
	return {
		frames: matching.slice(from, to),
		nextCursor: to < matching.length ? String(to) : null,
	};
}

/** The most used tags with their frame counts, for the filter chips. */
export async function listGalleryTags(): Promise<GalleryTags> {
	await sleep();
	const all = buildGalleryFrames(projects);
	const counts = new Map<string, number>();
	for (const tag of all.flatMap((f) => f.tags))
		counts.set(tag, (counts.get(tag) ?? 0) + 1);
	const tags = [...counts]
		.sort((a, b) => b[1] - a[1])
		.slice(0, config.gallery.tagLimit)
		.map(([tag, count]) => ({ tag, count }));
	return { total: all.length, tags };
}

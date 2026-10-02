import { NotFoundError } from "@/api/errors";
import { posts } from "@/api/mocks/portfolio/posts";
import { profile } from "@/api/mocks/portfolio/profile";
import { projects } from "@/api/mocks/portfolio/projects";
import { sleep } from "@/api/mocks/sleep";
import type { Post, PostSummary } from "@/api/types/portfolio/post";
import type { Profile } from "@/api/types/portfolio/profile";
import type { Project, ProjectSummary } from "@/api/types/portfolio/project";

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

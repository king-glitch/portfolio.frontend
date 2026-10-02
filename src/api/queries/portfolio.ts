import { queryOptions } from "@tanstack/react-query";
import { NotFoundError } from "@/api/errors";
import {
	getPost,
	getProfile,
	getProject,
	listPosts,
	listProjects,
} from "@/api/services/portfolio";
import { config } from "@/config";

const keys = config.queryKeys.portfolio;

/** An unknown id/slug is final: no retry, the page shows its not-found state. */
const retryUnlessMissing = (failures: number, error: Error) =>
	!(error instanceof NotFoundError) && failures < config.query.retry;

/** Query options shared by the hooks and the route loaders (same key = one cache entry). */
export const profileQuery = () =>
	queryOptions({ queryKey: [keys.profile], queryFn: getProfile });

export const projectsQuery = () =>
	queryOptions({ queryKey: [keys.projects.list], queryFn: listProjects });

export const projectQuery = (id: string) =>
	queryOptions({
		queryKey: [keys.projects.detail, id],
		queryFn: () => getProject(id),
		retry: retryUnlessMissing,
	});

/** Always the full list; filter by tag in render so the tag list stays complete. */
export const postsQuery = () =>
	queryOptions({ queryKey: [keys.posts.list], queryFn: listPosts });

export const postQuery = (slug: string) =>
	queryOptions({
		queryKey: [keys.posts.detail, slug],
		queryFn: () => getPost(slug),
		retry: retryUnlessMissing,
	});

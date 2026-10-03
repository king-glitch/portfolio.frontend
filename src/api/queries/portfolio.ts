import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
	getPost,
	getProfile,
	getProject,
	listGallery,
	listGalleryTags,
	listPosts,
	listProjects,
} from "@/api/services/portfolio";
import { config } from "@/config";

const keys = config.queryKeys.portfolio;

/** Query options shared by the hooks and the route loaders (same key = one cache entry). */
export const profileQuery = () =>
	queryOptions({ queryKey: [keys.profile], queryFn: getProfile });

export const projectsQuery = () =>
	queryOptions({ queryKey: [keys.projects.list], queryFn: listProjects });

export const projectQuery = (id: string) =>
	queryOptions({
		queryKey: [keys.projects.detail, id],
		queryFn: () => getProject(id),
	});

/** Always the full list; filter by tag in render so the tag list stays complete. */
export const postsQuery = () =>
	queryOptions({ queryKey: [keys.posts.list], queryFn: listPosts });

export const postQuery = (slug: string) =>
	queryOptions({
		queryKey: [keys.posts.detail, slug],
		queryFn: () => getPost(slug),
	});

/** Infinite list of frames; each tag is its own cache entry and the server hands out the cursor. */
export const galleryQuery = (tag: string | undefined) =>
	infiniteQueryOptions({
		queryKey: [keys.gallery.list, tag],
		queryFn: ({ pageParam }) =>
			listGallery({
				tag,
				cursor: pageParam,
				limit: config.gallery.pageSize,
			}),
		/** The first page has an empty cursor. */
		initialPageParam: "",
		getNextPageParam: (page) => page.nextCursor,
	});

export const galleryTagsQuery = () =>
	queryOptions({ queryKey: [keys.gallery.tags], queryFn: listGalleryTags });

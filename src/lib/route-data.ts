import {
	postQuery,
	postsQuery,
	projectQuery,
	projectsQuery,
} from "@/api/queries/portfolio";
import { queryClient } from "@/lib/query-client";

/** Flipped once the shell has mounted; before that we are on the first page load. */
let interactive = false;

export function markInteractive(): void {
	interactive = true;
}

/**
 * Route `clientLoader` helper. On client navigations it waits for the page's queries, so the
 * page transition lands on a loaded page instead of a skeleton. On the first load it only starts
 * them (the page shows its skeleton under the preloader). Failures are left to the page's error state.
 */
export async function preloadQueries(
	...pending: Promise<unknown>[]
): Promise<null> {
	const all = Promise.allSettled(pending);
	if (interactive) await all;
	return null;
}

/**
 * Warms every project and note detail once the shell is idle, so a click never waits on a fetch
 * before its page transition starts.
 * ponytail: fine for a portfolio-sized list; switch to hover/focus intent prefetch if lists grow.
 */
export async function prefetchDetails(): Promise<void> {
	const [projects, posts] = await Promise.all([
		queryClient.ensureQueryData(projectsQuery()),
		queryClient.ensureQueryData(postsQuery()),
	]);
	await Promise.allSettled([
		...projects.map((p) => queryClient.prefetchQuery(projectQuery(p.id))),
		...posts.map((p) => queryClient.prefetchQuery(postQuery(p.slug))),
	]);
}

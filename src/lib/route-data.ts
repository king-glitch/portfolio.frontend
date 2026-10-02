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

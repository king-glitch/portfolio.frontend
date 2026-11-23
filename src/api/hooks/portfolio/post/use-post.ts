import { useQuery } from "@tanstack/react-query";
import { postQuery } from "@/api/queries/portfolio";

/** `isNotFound(error)` means "unknown slug": render the empty state, no retry. */
export function usePost(slug: string) {
	return useQuery(postQuery(slug));
}

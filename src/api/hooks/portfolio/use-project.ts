import { useQuery } from "@tanstack/react-query";
import { projectQuery } from "@/api/queries/portfolio";

/** `isNotFound(error)` means "unknown slug": render the empty state, no retry. */
export function useProject(id: string) {
	return useQuery(projectQuery(id));
}

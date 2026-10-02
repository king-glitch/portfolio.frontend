import { useQuery } from "@tanstack/react-query";
import { projectQuery } from "@/api/queries/portfolio";

/** `error instanceof NotFoundError` means "unknown id": render the empty state, no retry. */
export function useProject(id: string) {
	return useQuery(projectQuery(id));
}

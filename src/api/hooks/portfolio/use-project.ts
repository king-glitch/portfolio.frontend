import { useQuery } from "@tanstack/react-query";
import { NotFoundError } from "@/api/errors";
import { getProject } from "@/api/services/portfolio";
import { config } from "@/config";

/** `error instanceof NotFoundError` means "unknown id": render the empty state, no retry. */
export function useProject(id: string) {
	return useQuery({
		queryKey: [config.queryKeys.portfolio.projects.detail, id],
		queryFn: () => getProject(id),
		retry: (failures, error) =>
			!(error instanceof NotFoundError) && failures < config.query.retry,
	});
}

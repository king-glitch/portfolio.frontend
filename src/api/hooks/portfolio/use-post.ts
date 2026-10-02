import { useQuery } from "@tanstack/react-query";
import { NotFoundError } from "@/api/errors";
import { getPost } from "@/api/services/portfolio";
import { config } from "@/config";

/** `error instanceof NotFoundError` means "unknown slug": render the empty state, no retry. */
export function usePost(slug: string) {
	return useQuery({
		queryKey: [config.queryKeys.portfolio.posts.detail, slug],
		queryFn: () => getPost(slug),
		retry: (failures, error) =>
			!(error instanceof NotFoundError) && failures < config.query.retry,
	});
}

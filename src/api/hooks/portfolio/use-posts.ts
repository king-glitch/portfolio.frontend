import { useQuery } from "@tanstack/react-query";
import { listPosts } from "@/api/services/portfolio";
import { config } from "@/config";

/** Always the full list; filter by tag in render so the tag list stays complete. */
export function usePosts() {
	return useQuery({
		queryKey: [config.queryKeys.portfolio.posts.list],
		queryFn: listPosts,
	});
}

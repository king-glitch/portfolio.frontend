import { useQuery } from "@tanstack/react-query";
import { postsQuery } from "@/api/queries/portfolio";

export function usePosts() {
	return useQuery(postsQuery());
}

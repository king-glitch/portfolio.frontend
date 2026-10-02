import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/api/services/portfolio";
import { config } from "@/config";

export function useProjects() {
	return useQuery({
		queryKey: [config.queryKeys.portfolio.projects.list],
		queryFn: listProjects,
	});
}

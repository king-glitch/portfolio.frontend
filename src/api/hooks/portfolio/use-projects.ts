import { useQuery } from "@tanstack/react-query";
import { projectsQuery } from "@/api/queries/portfolio";

export function useProjects() {
	return useQuery(projectsQuery());
}

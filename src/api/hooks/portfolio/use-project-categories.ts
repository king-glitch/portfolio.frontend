import { useQuery } from "@tanstack/react-query";
import { projectCategoriesQuery } from "@/api/queries/portfolio";

/** The owner-defined project categories (public `project_categories` setting). */
export function useProjectCategories() {
	return useQuery(projectCategoriesQuery());
}

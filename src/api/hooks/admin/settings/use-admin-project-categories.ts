import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/api/queries/admin";
import { projectCategoriesSchema } from "@/api/schemas/portfolio";
import { SettingKey, type Setting } from "@/api/types/admin/setting";

/** Shares the settings cache; a missing or malformed value reads as no categories. */
const categoriesOf = (settings: Setting[]) =>
	projectCategoriesSchema
		.catch([])
		.parse(
			settings.find((s) => s.key === SettingKey.ProjectCategories)?.value,
		);

/** The `project_categories` setting for the dashboard (admin endpoint). */
export const useAdminProjectCategories = () =>
	useQuery({ ...settingsQuery(), select: categoriesOf });

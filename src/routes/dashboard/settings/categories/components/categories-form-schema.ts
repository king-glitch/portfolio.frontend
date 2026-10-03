import type { TFunction } from "i18next";
import { z } from "zod";
import { projectCategoriesSchema } from "@/api/schemas/portfolio";
import {
	SettingKey,
	type Setting,
	type SettingUpdate,
} from "@/api/types/admin/setting";
import {
	settingValue,
	update,
} from "@/routes/dashboard/settings/components/settings-values";

/** Backend schema of `project_categories`: slug `^[a-z0-9-]{2,32}$`, label 1..40. */
const SLUG = /^[a-z0-9-]{2,32}$/;
const LABEL_MAX = 40;

export const categoriesFormSchema = (t: TFunction) =>
	z.object({
		categories: z
			.array(
				z.object({
					slug: z
						.string()
						.regex(
							SLUG,
							t("dashboard.settings.categories.slug.invalid"),
						),
					label: z
						.string()
						.trim()
						.min(1, t("dashboard.errors.required"))
						.max(
							LABEL_MAX,
							t("dashboard.errors.max", { max: LABEL_MAX }),
						),
					/** Loaded from the backend: its slug is what projects store, so it stays. */
					saved: z.boolean(),
				}),
			)
			.refine(
				(rows) =>
					new Set(rows.map((row) => row.slug)).size === rows.length,
				t("dashboard.settings.categories.unique"),
			),
	});

export type CategoriesValues = z.infer<ReturnType<typeof categoriesFormSchema>>;

/** A stored value of the wrong shape falls back to no categories. */
export const toCategoriesValues = (settings: Setting[]): CategoriesValues => ({
	categories: projectCategoriesSchema
		.catch([])
		.parse(settingValue(settings, SettingKey.ProjectCategories))
		.map((category) => ({ ...category, saved: true })),
});

export const toCategoriesUpdates = ({
	categories,
}: CategoriesValues): SettingUpdate[] => [
	update(
		SettingKey.ProjectCategories,
		categories.map(({ slug, label }) => ({ slug, label })),
	),
];

import React from "react";
import { useSettings } from "@/api/hooks/admin/settings/use-settings";
import i18n from "@/lib/i18n";
import { CategoriesForm } from "@/routes/dashboard/settings/categories/components/categories-form";

export function meta() {
	return [{ title: i18n.t("dashboard.settings.categories.meta.title") }];
}

interface CategoriesProps {}

/** The settings layout already handles loading, error and empty; this only renders the loaded form. */
const Categories: React.FC<CategoriesProps> = () => {
	const { data } = useSettings();
	return data ? <CategoriesForm settings={data} /> : null;
};

export default Categories;

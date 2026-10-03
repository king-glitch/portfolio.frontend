import React from "react";
import { useSettings } from "@/api/hooks/admin/settings/use-settings";
import i18n from "@/lib/i18n";
import { SeoForm } from "@/routes/dashboard/settings/seo/components/seo-form";

export function meta() {
	return [{ title: i18n.t("dashboard.settings.seo.meta.title") }];
}

interface SeoProps {}

/** The settings layout already handles loading, error and empty; this only renders the loaded form. */
const Seo: React.FC<SeoProps> = () => {
	const { data } = useSettings();
	return data ? <SeoForm settings={data} /> : null;
};

export default Seo;

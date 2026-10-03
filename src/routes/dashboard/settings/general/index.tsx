import React from "react";
import { useSettings } from "@/api/hooks/admin/settings/use-settings";
import i18n from "@/lib/i18n";
import { GeneralForm } from "@/routes/dashboard/settings/general/components/general-form";

export function meta() {
	return [{ title: i18n.t("dashboard.settings.general.meta.title") }];
}

interface GeneralProps {}

/** The settings layout already handles loading, error and empty; this only renders the loaded form. */
const General: React.FC<GeneralProps> = () => {
	const { data } = useSettings();
	return data ? <GeneralForm settings={data} /> : null;
};

export default General;

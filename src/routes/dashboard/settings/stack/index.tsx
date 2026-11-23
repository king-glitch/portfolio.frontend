import React from "react";
import { useSettings } from "@/api/hooks/admin/settings/use-settings";
import i18n from "@/lib/i18n";
import { StackForm } from "@/routes/dashboard/settings/stack/components/stack-form";

export function meta() {
	return [{ title: i18n.t("dashboard.settings.stack.meta.title") }];
}

interface StackProps {}

/** The settings layout already handles loading, error and empty; this only renders the loaded form. */
const Stack: React.FC<StackProps> = () => {
	const { data } = useSettings();
	return data ? <StackForm settings={data} /> : null;
};

export default Stack;

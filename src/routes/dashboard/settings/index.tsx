import { redirect } from "react-router";
import { config } from "@/config";

/** `/dashboard/settings` opens the first tab. */
export function clientLoader() {
	throw redirect(config.routes.dashboardSettingsGeneral);
}

export default function SettingsIndex() {
	return null;
}

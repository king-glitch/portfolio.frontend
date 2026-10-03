import { redirect } from "react-router";
import { config } from "@/config";

/** `/dashboard` has no page of its own: it opens the first section. */
export function clientLoader() {
	throw redirect(config.routes.dashboardProjects);
}

export default function DashboardIndex() {
	return null;
}

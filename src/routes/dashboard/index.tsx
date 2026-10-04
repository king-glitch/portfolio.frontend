import { redirect } from "react-router";
import { config } from "@/config";

/** `/dashboard` has no page of its own: it opens the overview. */
export function clientLoader() {
	throw redirect(config.routes.dashboardOverview);
}

export default function DashboardIndex() {
	return null;
}

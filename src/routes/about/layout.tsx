import React from "react";
import { Outlet, redirect } from "react-router";
import { config } from "@/config";
import type { Route } from "./+types/layout";

/** `/about` has no page of its own: it lands on Explore. Exact-path match only. */
export function clientLoader({ request }: Route.ClientLoaderArgs) {
	const pathname = new URL(request.url).pathname.replace(/\/+$/, "");
	if (pathname === config.routes.about)
		return redirect(config.routes.aboutExplore);
	return null;
}

interface AboutLayoutProps {}

/** Shared parent of Explore and Resume; each view owns its own query states and mode switch. */
const AboutLayout: React.FC<AboutLayoutProps> = () => {
	return <Outlet />;
};

export default AboutLayout;

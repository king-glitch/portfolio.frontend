import React from "react";
import { Outlet, redirect, useLocation } from "react-router";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import { ModeSwitch } from "@/routes/about/components/mode-switch";
import { ResumeSkeleton } from "@/routes/about/components/resume-skeleton";
import { WallSkeleton } from "@/routes/about/components/wall/wall-skeleton";
import type { Route } from "./+types/layout";

/** `/about` has no page of its own: it lands on Explore. Exact-path match only. */
export function clientLoader({ request }: Route.ClientLoaderArgs) {
	const pathname = new URL(request.url).pathname.replace(/\/+$/, "");
	if (pathname === config.routes.about)
		return redirect(config.routes.aboutExplore);
	return null;
}

interface AboutLayoutProps {}

/**
 * Shared shell of Explore and Resume: owns the loading, error and empty states of
 * the profile and project queries (children read the same cached queries) and the
 * mode switch, which stays usable in every state.
 */
const AboutLayout: React.FC<AboutLayoutProps> = () => {
	const profile = useProfile();
	const projects = useProjects();
	const { pathname } = useLocation();
	const isResume = pathname.startsWith(config.routes.aboutResume);

	let content: React.ReactNode = <Outlet />;
	if (profile.isPending || projects.isPending) {
		content = isResume ? <ResumeSkeleton /> : <WallSkeleton />;
	} else if (profile.isError || projects.isError) {
		content = (
			<div className="mx-auto flex min-h-svh max-w-md items-center p-6">
				<QueryErrorAlert
					onRetry={() => {
						void profile.refetch();
						void projects.refetch();
					}}
				/>
			</div>
		);
	} else if (!projects.data.length) {
		content = (
			<div className="flex min-h-svh items-center justify-center p-6">
				<QueryEmpty titleKey="about.empty.title" />
			</div>
		);
	}

	return (
		<div className="relative min-h-svh">
			{content}
			<ModeSwitch />
		</div>
	);
};

export default AboutLayout;

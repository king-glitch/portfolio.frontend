import React from "react";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { profileQuery, projectsQuery } from "@/api/queries/portfolio";
import i18n from "@/lib/i18n";
import { queryClient } from "@/lib/query-client";
import { preloadQueries } from "@/lib/route-data";
import { AboutFallback } from "@/routes/about/components/about-fallback";
import { ResumeSkeleton } from "@/routes/about/resume/components/resume-skeleton";
import { ModeSwitch } from "@/routes/about/components/mode-switch";
import { ResumePrintButton } from "@/routes/about/resume/components/resume-print-button";
import { ResumeSheet } from "@/routes/about/resume/components/resume-sheet";
import type { Route } from "./+types/index";

/** Client navigations wait for this page's data, so the transition lands on the loaded page. */
export function clientLoader() {
	return preloadQueries(
		queryClient.ensureQueryData(profileQuery()),
		queryClient.ensureQueryData(projectsQuery()),
	);
}

export function meta(_args: Route.MetaArgs) {
	return [{ title: i18n.t("about.meta.title") }];
}

interface AboutResumeProps {}

/** `/about/resume`: one printable white sheet. */
const AboutResume: React.FC<AboutResumeProps> = () => {
	const profile = useProfile();
	const projects = useProjects();
	if (!profile.data || !projects.data?.length)
		return (
			<AboutFallback
				pending={profile.isPending || projects.isPending}
				failed={profile.isError || projects.isError}
				onRetry={() => {
					void profile.refetch();
					void projects.refetch();
				}}
				skeleton={<ResumeSkeleton />}
			/>
		);
	return (
		<main className="px-[clamp(12px,4vw,40px)] pt-28 pb-30 print:p-0">
			<ResumeSheet profile={profile.data} projects={projects.data} />
			<ModeSwitch>
				<ResumePrintButton />
			</ModeSwitch>
		</main>
	);
};

export default AboutResume;

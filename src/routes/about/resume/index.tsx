// style-lint-ignore-file query-states -- AboutLayout owns loading/error/empty/retry for these same cached queries
import React from "react";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import i18n from "@/lib/i18n";
import { ResumePrintButton } from "@/routes/about/resume/components/resume-print-button";
import { ResumeSheet } from "@/routes/about/resume/components/resume-sheet";
import type { Route } from "./+types/index";

export function meta(_args: Route.MetaArgs) {
	return [{ title: i18n.t("about.meta.title") }];
}

interface AboutResumeProps {}

/** `/about/resume`: one printable white sheet. The layout has already handled loading/error/empty. */
const AboutResume: React.FC<AboutResumeProps> = () => {
	const { data: profile } = useProfile();
	const { data: projects } = useProjects();
	if (!profile || !projects) return null;
	return (
		<main className="px-[clamp(12px,4vw,40px)] pt-28 pb-30 print:p-0">
			<ResumeSheet profile={profile} projects={projects} />
			<ResumePrintButton />
		</main>
	);
};

export default AboutResume;

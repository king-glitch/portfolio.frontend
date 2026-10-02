import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "@/api/types/portfolio/profile";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { eagerSentence } from "@/lib/portfolio/about-stats";
import { ResumeAside } from "@/routes/about/resume/components/resume-aside";
import { ResumeExperience } from "@/routes/about/resume/components/resume-experience";
import { ResumeHeader } from "@/routes/about/resume/components/resume-header";
import { ResumeProjects } from "@/routes/about/resume/components/resume-projects";

interface ResumeSheetProps {
	profile: Profile;
	projects: ProjectSummary[];
}

/** The printable sheet: always white on near-black (print tokens), any theme. */
export const ResumeSheet: React.FC<ResumeSheetProps> = ({
	profile,
	projects,
}) => {
	const { t } = useTranslation();
	return (
		<article className="print-sheet mx-auto box-border max-w-220 rounded-[20px] bg-print-background p-[clamp(24px,5vw,56px)] text-print-foreground shadow-2xl">
			<ResumeHeader profile={profile} />
			<div className="mt-6.5 grid grid-cols-1 gap-9 sm:grid-cols-[minmax(0,1fr)_220px]">
				<div className="flex flex-col gap-6.5">
					<section>
						<h2 className="resume-heading">
							{t("about.resume.summary.title")}
						</h2>
						<p className="m-0 text-sm leading-relaxed">
							{t("about.resume.summary.body")}{" "}
							{eagerSentence(profile.about)}
						</p>
					</section>
					<ResumeExperience profile={profile} />
					<ResumeProjects projects={projects} />
				</div>
				<ResumeAside profile={profile} />
			</div>
		</article>
	);
};

export default ResumeSheet;

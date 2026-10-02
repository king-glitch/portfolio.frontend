import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "@/api/types/portfolio/profile";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { ResumeAside } from "@/routes/about/resume/components/resume-aside";
import { ResumeExperience } from "@/routes/about/resume/components/resume-experience";
import { ResumeHeader } from "@/routes/about/resume/components/resume-header";
import { ResumeProjects } from "@/routes/about/resume/components/resume-projects";
import { ResumeHeading } from "@/routes/about/resume/components/resume-heading";

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
		<article className="mx-auto box-border max-w-220 rounded-[20px] bg-print-background p-[clamp(24px,5vw,56px)] text-print-foreground shadow-2xl print:m-0 print:max-w-none print:rounded-none print:p-0 print:shadow-none">
			<ResumeHeader profile={profile} />
			<div className="mt-6.5 grid grid-cols-1 gap-9 sm:grid-cols-[minmax(0,1fr)_220px]">
				<div className="flex flex-col gap-6.5">
					<section>
						<ResumeHeading>
							{t("about.resume.summary.title")}
						</ResumeHeading>
						<p className="m-0 text-sm leading-relaxed">
							{t("about.resume.summary.body")}
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

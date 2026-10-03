import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "@/api/types/portfolio/profile";
import { splitRole } from "@/lib/portfolio/about-stats";
import { ResumeHeading } from "@/routes/about/resume/components/resume-heading";
import { ResumeEntry } from "@/routes/about/resume/components/resume-entry";

interface ResumeExperienceProps {
	profile: Profile;
}

/** Jobs, newest first, each a bullet list of notes. */
export const ResumeExperience: React.FC<ResumeExperienceProps> = ({
	profile,
}) => {
	const { t } = useTranslation();
	return (
		<section>
			<ResumeHeading>{t("about.resume.experience.title")}</ResumeHeading>
			{[...profile.experience]
				.sort((a, b) => b.start.localeCompare(a.start))
				.map((job) => {
					const { name, role } = splitRole(job.title);
					return (
						<ResumeEntry key={job.id}>
							<div className="flex flex-wrap justify-between gap-3">
								<span className="text-[15px] font-extrabold tracking-[-0.01em]">
									{role ? `${name} — ${role}` : name}
								</span>
								<span className="text-[13px] text-print-muted tabular-nums">
									{job.period}
								</span>
							</div>
							<ul className="mt-1.5 mb-0 list-disc pl-4.5 text-[13.5px] leading-relaxed">
								{job.notes.map((note) => (
									<li key={note} className="mt-0.75">
										{note}
									</li>
								))}
							</ul>
						</ResumeEntry>
					);
				})}
		</section>
	);
};

export default ResumeExperience;

import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "@/api/types/portfolio/profile";
import { splitRole } from "@/lib/portfolio/about-stats";

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
			<h2 className="resume-heading">
				{t("about.resume.experience.title")}
			</h2>
			{[...profile.experience].reverse().map((job) => {
				const { name, role } = splitRole(job.title);
				return (
					<div key={job.id} className="print-entry">
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
					</div>
				);
			})}
		</section>
	);
};

export default ResumeExperience;

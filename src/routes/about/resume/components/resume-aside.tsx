import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "@/api/types/portfolio/profile";
import { resumeSkills } from "@/lib/portfolio/about-stats";

interface ResumeAsideProps {
	profile: Profile;
}

/** Skill groups and education. */
export const ResumeAside: React.FC<ResumeAsideProps> = ({ profile }) => {
	const { t } = useTranslation();
	const education = profile.education[0];
	return (
		<aside className="flex flex-col gap-5.5">
			{resumeSkills(profile).map((group) => (
				<section key={group.label} className="break-inside-avoid">
					<h2 className="resume-heading">{group.label}</h2>
					<p className="m-0 text-[13px] leading-relaxed">
						{group.list}
					</p>
				</section>
			))}
			<section>
				<h2 className="resume-heading">
					{t("about.resume.education.title")}
				</h2>
				<p className="m-0 text-[13px] leading-relaxed">
					<b>{t("about.resume.education.degree")}</b>
					<br />
					{education?.title} · {education?.period}
					<br />
					{t("about.resume.education.focus")}
				</p>
			</section>
		</aside>
	);
};

export default ResumeAside;

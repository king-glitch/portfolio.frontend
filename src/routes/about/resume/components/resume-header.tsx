import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "@/api/types/portfolio/profile";
import { employerOf } from "@/lib/portfolio/about-stats";

interface ResumeHeaderProps {
	profile: Profile;
}

/** Name, role at the current employer, contact placeholders. */
export const ResumeHeader: React.FC<ResumeHeaderProps> = ({ profile }) => {
	const { t } = useTranslation();
	const { email, github, linkedin } = profile.contact;
	return (
		<header className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-print-foreground pb-5.5">
			<div>
				<h1 className="m-0 text-[clamp(34px,5vw,52px)] leading-[0.95] font-extrabold tracking-tighter">
					{profile.name}
				</h1>
				<p className="mt-2 mb-0 text-base font-semibold">
					{t("about.resume.header.role", {
						employer: employerOf(profile),
					})}
				</p>
			</div>
			<div className="text-right text-[13px] leading-relaxed text-print-muted">
				{email}
				<br />
				{github} · {linkedin}
			</div>
		</header>
	);
};

export default ResumeHeader;

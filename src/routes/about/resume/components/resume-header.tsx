import React from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "@/api/types/portfolio/profile";
import { employerOf } from "@/lib/portfolio/about-stats";
import { displayUrl } from "@/lib/utils";

interface ResumeHeaderProps {
	profile: Profile;
}

/** Name, role at the current employer, contact links. */
export const ResumeHeader: React.FC<ResumeHeaderProps> = ({ profile }) => {
	const { t } = useTranslation();
	const { email, github, linkedin, discord } = profile.contact;
	const lines = [
		{ id: "email", href: `mailto:${email}`, text: email },
		{ id: "github", href: github, text: displayUrl(github) },
		{ id: "linkedin", href: linkedin, text: displayUrl(linkedin) },
		{
			id: "discord",
			href: undefined,
			text: t("common.contact.discord.value", { handle: discord }),
		},
	];
	return (
		<header className="flex flex-col gap-4 border-b-2 border-print-foreground pb-5.5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
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
			<ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-[13px] leading-relaxed text-print-muted sm:text-right">
				{lines.map(({ id, href, text }) => (
					<li key={id}>{href ? <a href={href}>{text}</a> : text}</li>
				))}
			</ul>
		</header>
	);
};

export default ResumeHeader;

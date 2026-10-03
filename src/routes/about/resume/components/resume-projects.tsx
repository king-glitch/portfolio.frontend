import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { ProjectSide } from "@/api/types/portfolio/enums";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { config } from "@/config";
import { clip, firstSentence } from "@/lib/portfolio/about-stats";
import { ResumeHeading } from "@/routes/about/resume/components/resume-heading";
import { ResumeEntry } from "@/routes/about/resume/components/resume-entry";

const SIDES: Record<ProjectSide, ParseKeys> = {
	[ProjectSide.BehindTheScenes]:
		"about.resume.projects.side.behind-the-scenes",
	[ProjectSide.OnScreen]: "about.resume.projects.side.on-screen",
};

interface ResumeProjectsProps {
	projects: ProjectSummary[];
}

/** Every project: name, type · side · on-chain, what it is, "My part:". */
export const ResumeProjects: React.FC<ResumeProjectsProps> = ({ projects }) => {
	const { t } = useTranslation();
	return (
		<section>
			<ResumeHeading>{t("about.resume.projects.title")}</ResumeHeading>
			{projects.map((p) => {
				const meta = [
					p.categories.includes(config.portfolio.categorySlugs.games)
						? t("about.resume.projects.type.game")
						: t("about.resume.projects.type.platform"),
					t(SIDES[p.side]),
					p.categories.includes(
						config.portfolio.categorySlugs.onChain,
					)
						? t("about.resume.projects.on-chain")
						: null,
				].filter(Boolean);
				return (
					<ResumeEntry key={p.id}>
						<div className="flex flex-wrap justify-between gap-3">
							<span className="text-[15px] font-extrabold">
								{p.name}
							</span>
							<span className="text-xs font-semibold text-print-muted">
								{meta.join(" · ")}
							</span>
						</div>
						<p className="mt-1 mb-0 text-[13.5px] leading-normal">
							{firstSentence(p.about)}
						</p>
						<p className="mt-1 mb-0 text-[13px] leading-normal text-print-muted">
							<b className="text-print-foreground">
								{t("about.resume.projects.part")}
							</b>{" "}
							{clip(p.role[0] ?? "", 190)}
						</p>
					</ResumeEntry>
				);
			})}
		</section>
	);
};

export default ResumeProjects;

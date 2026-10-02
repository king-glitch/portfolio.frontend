import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { ProjectFilter, ProjectSide } from "@/api/types/portfolio/enums";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { clip, firstSentence } from "@/lib/portfolio/about-stats";

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
			<h2 className="resume-heading">
				{t("about.resume.projects.title")}
			</h2>
			{projects.map((p) => {
				const meta = [
					p.categories.includes(ProjectFilter.Games)
						? t("about.resume.projects.type.game")
						: t("about.resume.projects.type.platform"),
					t(SIDES[p.side]),
					p.categories.includes(ProjectFilter.OnChain)
						? t("about.resume.projects.on-chain")
						: null,
				].filter(Boolean);
				return (
					<div key={p.id} className="print-entry">
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
					</div>
				);
			})}
		</section>
	);
};

export default ResumeProjects;

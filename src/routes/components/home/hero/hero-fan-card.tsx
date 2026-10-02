import React from "react";
import { useTranslation } from "react-i18next";
import { cva } from "class-variance-authority";
import { Link } from "react-router";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { ProjectPreviewCard } from "@/components/shared/projects/project-preview-card";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import { workPath } from "@/lib/routes";
import { CursorLabel } from "@/types/cursor";

const fanCardVariants = cva(
	"group/fan relative aspect-4/3 w-[78vw] flex-none snap-center outline-none desk:absolute desk:top-0 desk:left-1/2 desk:w-[clamp(200px,24vw,390px)] max-desk:translate-none! max-desk:rotate-none! hover:z-40!",
);

interface HeroFanCardProps {
	/** Missing = loading placeholder in the same fan position. */
	project?: ProjectSummary;
	index: number;
	total: number;
}

/** One card of the hero deck: fanned and rotated from the centre on desktop, a snap-scroll tile on mobile. */
export const HeroFanCard: React.FC<HeroFanCardProps> = ({
	project,
	index,
	total,
}) => {
	const { t } = useTranslation();
	const { fan } = config.home.hero;
	const offset = index - (total - 1) / 2;
	const style = {
		translate: `calc(-50% + ${(offset * fan.stepVw).toFixed(2)}vw) ${(fan.baseYPx - offset * offset * fan.curveYPx).toFixed(1)}px`,
		rotate: `${(offset * fan.rotateDeg).toFixed(2)}deg`,
		zIndex: index + 1,
	};
	const body = (
		<span
			className="gated block size-full animate-fan-in motion-reduce:animate-none"
			style={{ animationDelay: `${(fan.delayBaseS + index * fan.delayStepS).toFixed(2)}s` }}
		>
			{project ? (
				<ProjectPreviewCard
					project={project}
					className="shadow-2xl transition-transform duration-800 ease-(--ease-out-expo) group-hover/fan:-translate-y-8 group-hover/fan:scale-105 group-focus-visible/fan:-translate-y-8 group-focus-visible/fan:scale-105 group-focus-visible/fan:ring-3 group-focus-visible/fan:ring-foreground"
				/>
			) : (
				<Skeleton className="size-full rounded-2xl" />
			)}
		</span>
	);
	return project ? (
		<Link
			to={workPath(project.id)}
			viewTransition
			data-cursor={CursorLabel.Open}
			aria-label={t("home.hero.cards.open.aria-label", { name: project.name })}
			className={fanCardVariants()}
			style={style}
		>
			{body}
		</Link>
	) : (
		<div className={fanCardVariants()} style={style}>
			{body}
		</div>
	);
};

export default HeroFanCard;

import React from "react";
import { RiArrowRightLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { PillButton } from "@/components/common/buttons/pill-button";
import { Panel } from "@/components/common/layout/panel";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { PillVariant } from "@/types/ui";

interface NextProjectCoverProps {
	next?: ProjectSummary;
	vertical: boolean;
	onNext: () => void;
	/** The scroller writes `--pull` (0..1) here; every progress visual reads it in CSS. */
	coverRef: React.Ref<HTMLElement>;
	percentRef: React.Ref<HTMLSpanElement>;
}

/**
 * Last own panel, always dark (`dark` scopes the tokens): only the next project's name. Scrolling
 * on fills the outlined name left to right, leans it forward and fills the meter and percentage,
 * so the visitor sees how much more to push. The button is the click/keyboard alternative.
 */
export const NextProjectCover: React.FC<NextProjectCoverProps> = ({
	next,
	vertical,
	onNext,
	coverRef,
	percentRef,
}) => {
	const { t } = useTranslation();
	const hintKey = vertical
		? "projects.end.touch.hint"
		: "projects.end.scroll.hint";
	return (
		<Panel
			ref={coverRef}
			className="dark flex flex-col justify-between gap-8 border-r-0 bg-background text-foreground [--pull:0] in-data-[flow=vertical]:min-h-svh"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex gap-4">
					<Eyebrow>{t("projects.end.eyebrow")}</Eyebrow>
					<Eyebrow className="tabular-nums">{next?.num}</Eyebrow>
				</div>
			</div>
			{next ? (
				<div className="relative translate-x-[calc(var(--pull)*-3vw)] skew-x-[calc(var(--pull)*-6deg)]">
					<DisplayHeading className="text-[clamp(64px,13vw,240px)] leading-[0.86] wrap-anywhere text-outline">
						{next.name}
					</DisplayHeading>
					<DisplayHeading
						render={<div aria-hidden="true" />}
						className="absolute inset-0 text-[clamp(64px,13vw,240px)] leading-[0.86] wrap-anywhere [clip-path:inset(0_calc((1-var(--pull))*100%)_0_0)] in-data-[flow=vertical]:[clip-path:none]"
					>
						{next.name}
					</DisplayHeading>
				</div>
			) : (
				<Skeleton className="h-[clamp(64px,13vw,240px)] w-3/4" />
			)}
			<div className="flex flex-col gap-5">
				<div className="flex items-end justify-between gap-6 in-data-[flow=vertical]:hidden">
					<span className="text-[clamp(40px,5vw,88px)] leading-[0.8] font-black tracking-[-0.06em] tabular-nums">
						<span ref={percentRef}>00</span>
						<span className="text-muted-foreground">%</span>
					</span>
					<span className="max-w-70 text-right text-sm text-muted-foreground">
						{t(hintKey)}
					</span>
				</div>
				<div
					aria-hidden="true"
					className="h-0.5 overflow-hidden bg-border in-data-[flow=vertical]:hidden"
				>
					<div className="h-full origin-left scale-x-(--pull) bg-foreground" />
				</div>
				<PillButton
					variant={PillVariant.Outline}
					magnetic
					disabled={!next}
					onClick={onNext}
					className="gap-3 self-start in-data-[flow=vertical]:h-14 in-data-[flow=vertical]:w-full"
				>
					{t("projects.end.button")}
					<RiArrowRightLine data-icon="inline-end" />
				</PillButton>
			</div>
		</Panel>
	);
};

export default NextProjectCover;

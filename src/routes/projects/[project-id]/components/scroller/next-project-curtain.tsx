import React from "react";
import { RiArrowRightLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { PillButton } from "@/components/common/buttons/pill-button";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { PillSize, PillVariant } from "@/types/ui";

interface NextProjectCurtainProps {
	next?: ProjectSummary;
	vertical: boolean;
	onNext: () => void;
	meterRef: React.Ref<HTMLDivElement>;
	curtainRef: React.Ref<HTMLDivElement>;
}

/** Inverted cover over the next project's first panel; the scroller slides it left as you pull. */
export const NextProjectCurtain: React.FC<NextProjectCurtainProps> = ({
	next,
	vertical,
	onNext,
	meterRef,
	curtainRef,
}) => {
	const { t } = useTranslation();
	const hintKey = vertical
		? "projects.end.touch.hint"
		: "projects.end.scroll.hint";
	return (
		<div
			ref={curtainRef}
			className="absolute inset-0 z-1 flex flex-col justify-between gap-8 bg-foreground px-[clamp(16px,5vw,80px)] pt-30 pb-18 text-background shadow-[40px_0_90px_-30px_rgb(0_0_0/0.6)] will-change-[translate] max-desk:px-4 max-desk:pt-23 max-desk:pb-20"
		>
			<div className="flex items-baseline justify-between gap-4 border-b border-background/20 pb-4.5">
				<Eyebrow className="text-background/60">
					{t("projects.end.eyebrow")}
				</Eyebrow>
				<Eyebrow className="text-background/60 tabular-nums">
					{next?.num}
				</Eyebrow>
			</div>
			<div className="flex min-w-0 flex-col gap-6">
				{next ? (
					<>
						<Eyebrow className="text-background/60">
							{t(`common.sides.${next.side}`)}
						</Eyebrow>
						<DisplayHeading className="text-[clamp(56px,10vw,190px)] leading-[0.88] wrap-anywhere">
							{next.name}
						</DisplayHeading>
						<p className="m-0 line-clamp-2 max-w-170 text-[clamp(16px,1.4vw,20px)] leading-normal text-background/70">
							{next.about}
						</p>
					</>
				) : (
					<Skeleton className="h-[clamp(56px,10vw,190px)] w-3/4 bg-background/15" />
				)}
			</div>
			<div className="flex flex-col gap-5">
				<div className="flex items-center gap-6">
					<div
						aria-hidden="true"
						className="h-0.5 grow overflow-hidden bg-background/20 max-desk:hidden"
					>
						<div
							ref={meterRef}
							className="h-full origin-left bg-background"
							style={{ transform: "scaleX(0)" }}
						/>
					</div>
					<PillButton
						variant={PillVariant.Invert}
						size={PillSize.Xl}
						magnetic
						disabled={!next}
						onClick={onNext}
						className="gap-3 max-desk:w-full"
					>
						{t("projects.end.button")}
						<RiArrowRightLine data-icon="inline-end" />
					</PillButton>
				</div>
				<span className="text-sm text-background/60">{t(hintKey)}</span>
			</div>
		</div>
	);
};

export default NextProjectCurtain;

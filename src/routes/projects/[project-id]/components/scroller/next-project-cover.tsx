import React from "react";
import { RiArrowRightLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { PillButton } from "@/components/common/buttons/pill-button";
import { Panel } from "@/components/common/layout/panel";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { Skeleton } from "@/components/ui/skeleton";
import { PillSize } from "@/types/ui";

interface NextProjectCoverProps {
	next?: ProjectSummary;
	vertical: boolean;
	onNext: () => void;
}

/**
 * Last own panel: always dark (`dark` scopes the dark tokens), the next project's number, name,
 * one-line pitch and motif, plus the push hint and a Next button.
 */
export const NextProjectCover: React.FC<NextProjectCoverProps> = ({
	next,
	vertical,
	onNext,
}) => {
	const { t } = useTranslation();
	const hintKey = vertical
		? "projects.end.touch.hint"
		: "projects.end.scroll.hint";
	return (
		<Panel className="dark grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] gap-x-[4vw] gap-y-8 border-r-0 bg-background text-foreground in-data-[flow=vertical]:min-h-svh max-desk:grid-cols-1">
			<div className="col-span-full flex items-baseline justify-between gap-4 border-b border-border pb-4.5">
				<Eyebrow>{t("projects.end.eyebrow")}</Eyebrow>
				<Eyebrow className="tabular-nums">{next?.num}</Eyebrow>
			</div>
			<div className="flex min-w-0 flex-col justify-center gap-6">
				{next ? (
					<>
						<Eyebrow>{t(`common.sides.${next.side}`)}</Eyebrow>
						<DisplayHeading className="text-[clamp(56px,9vw,170px)] leading-[0.88] wrap-anywhere">
							{next.name}
						</DisplayHeading>
						<p className="m-0 line-clamp-3 max-w-150 text-[clamp(16px,1.3vw,19px)] leading-normal text-muted-foreground">
							{next.about}
						</p>
					</>
				) : (
					<Skeleton className="h-[clamp(56px,9vw,170px)] w-3/4" />
				)}
			</div>
			<div
				data-speed="1.15"
				className="relative min-h-55 overflow-hidden rounded-[28px] ring-1 ring-border max-desk:hidden"
			>
				{next ? <ProjectMotif kind={next.kind} /> : null}
			</div>
			<div className="col-span-full flex flex-wrap items-center justify-between gap-5">
				<span className="flex items-center gap-3 text-sm text-muted-foreground">
					<span
						aria-hidden="true"
						className="size-2 animate-pulse rounded-full bg-foreground motion-reduce:animate-none"
					/>
					{t(hintKey)}
				</span>
				<PillButton
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
		</Panel>
	);
};

export default NextProjectCover;

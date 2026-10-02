import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { SectionBlurb } from "@/components/common/typography/section-blurb";
import { config } from "@/config";
import { buildTimeline } from "@/lib/portfolio/timeline";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomeSectionHead } from "@/routes/components/home/home-section-head";
import { TimelineBar } from "@/routes/components/home/timeline/timeline-bar";
import { TimelineDetail } from "@/routes/components/home/timeline/timeline-detail";
import { TimelineSkeleton } from "@/routes/components/home/timeline/timeline-skeleton";
import { HomePad } from "@/types/home";

interface TimelineProps {}

/** Career ruler: bars positioned by date, the selected one inverts and its notes show below. */
export const Timeline: React.FC<TimelineProps> = () => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProfile();
	const [selected, setSelected] = useState(0);
	const model = data
		? buildTimeline(data, new Date(), config.home.timeline.minBarFraction)
		: null;
	const entry = model?.entries[selected] ?? model?.entries[0];

	const renderBody = () => {
		if (isPending) return <TimelineSkeleton />;
		if (isError) return <QueryErrorAlert onRetry={() => void refetch()} />;
		if (!model || !entry)
			return <QueryEmpty titleKey="home.timeline.empty.title" />;
		return (
			<>
				<div role="presentation" className="relative h-7 border-b">
					{model.ticks.map((tick) => (
						<span
							key={tick.year}
							style={{ left: `${tick.leftPct}%` }}
							className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center gap-1.5 text-xs font-semibold text-muted-foreground tabular-nums"
						>
							{tick.year}
							<span className="h-2 w-px bg-border" />
						</span>
					))}
				</div>
				<div
					role="group"
					aria-label={t("home.timeline.bars.aria-label")}
					className="mt-4.5 flex flex-col gap-2.5"
				>
					{model.entries.map((item, i) => (
						<TimelineBar
							key={item.id}
							entry={item}
							selected={item.id === entry.id}
							onPick={() => setSelected(i)}
						/>
					))}
				</div>
				<TimelineDetail entry={entry} />
			</>
		);
	};

	return (
		<HomeSection id={config.sections.timeline} pad={HomePad.Both}>
			<HomeSectionHead
				index={6}
				label={t("home.timeline.eyebrow")}
				title={model?.spanLabel ?? t("home.timeline.eyebrow")}
				aside={<SectionBlurb>{t("home.timeline.hint")}</SectionBlurb>}
			/>
			<div className="relative mt-14">{renderBody()}</div>
		</HomeSection>
	);
};

export default Timeline;

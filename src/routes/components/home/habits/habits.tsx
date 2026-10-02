import React, { useRef } from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { PillButton } from "@/components/common/buttons/pill-button";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { SectionLabel } from "@/components/common/typography/section-label";
import { config } from "@/config";
import { usePinnedTrack } from "@/hooks/scroll/use-pinned-track";
import { HabitCard } from "@/routes/components/home/habits/habit-card";
import { HabitsSkeleton } from "@/routes/components/home/habits/habits-skeleton";
import { HomeTitle } from "@/routes/components/home/home-title";
import { CursorLabel } from "@/types/cursor";
import { DisplayVariant, PillSize, PillVariant } from "@/types/ui";
import { HabitTone } from "@/types/home";

const TONES = [HabitTone.Solid, HabitTone.Card, HabitTone.Outline];

const stageVariants = cva("", {
	variants: {
		pinned: {
			true: "sticky top-0 flex h-svh items-center overflow-hidden",
			false: "px-[clamp(16px,4vw,48px)] py-[clamp(96px,12vw,180px)]",
		},
	},
});

const trackVariants = cva("flex gap-6", {
	variants: {
		pinned: {
			true: "w-max items-center px-[clamp(16px,4vw,48px)] will-change-transform",
			false: "mx-auto max-w-340 flex-col",
		},
	},
});

interface HabitsProps {}

/** "Five habits": a sticky stage that scrolls its cards sideways (desktop, motion allowed); a vertical stack otherwise. */
export const Habits: React.FC<HabitsProps> = () => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProfile();
	const outerRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const pinned = usePinnedTrack(outerRef, trackRef);
	const core = data?.core ?? [];

	const renderCards = () => {
		if (isPending) return <HabitsSkeleton pinned={pinned} />;
		if (isError) return <QueryErrorAlert onRetry={() => void refetch()} />;
		if (!core.length)
			return <QueryEmpty titleKey="home.habits.empty.title" />;
		return core.map((habit, i) => (
			<HabitCard
				key={habit.label}
				habit={habit}
				index={i}
				total={core.length}
				tone={TONES[i % TONES.length] ?? HabitTone.Card}
				pinned={pinned}
			/>
		));
	};

	return (
		<section
			ref={outerRef}
			id={config.sections.process}
			className="relative"
		>
			<div className={stageVariants({ pinned })}>
				<div ref={trackRef} className={trackVariants({ pinned })}>
					<div className="flex w-[min(560px,80vw)] flex-col gap-6 pr-10 max-desk:w-auto max-desk:pr-0">
						<SectionLabel index={5}>
							{t("home.habits.eyebrow")}
						</SectionLabel>
						<DisplayHeading variant={DisplayVariant.Habits}>
							<HomeTitle
								lines={[
									t("home.habits.lines.1"),
									t("home.habits.lines.2"),
									t("home.habits.lines.3"),
								]}
							/>
						</DisplayHeading>
						<span className="text-[15px] text-muted-foreground">
							{t("home.habits.hint")}
						</span>
					</div>
					{renderCards()}
					<PillButton
						variant={PillVariant.Outline}
						size={PillSize.Xl}
						magnetic
						cursor={CursorLabel.Next}
						nativeButton={false}
						render={<a href={`#${config.sections.timeline}`} />}
						className="mr-[8vw] ml-10 size-55 shrink-0 text-lg max-desk:m-0 max-desk:h-11.5 max-desk:w-full"
					>
						{t("home.habits.next")}
					</PillButton>
				</div>
			</div>
		</section>
	);
};

export default Habits;

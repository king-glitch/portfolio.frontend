import React from "react";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { PillButton } from "@/components/common/buttons/pill-button";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { SectionLabel } from "@/components/common/typography/section-label";
import { config } from "@/config";
import { HabitCard } from "@/routes/components/home/habits/habit-card";
import { HabitsSkeleton } from "@/routes/components/home/habits/habits-skeleton";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomeTitle } from "@/routes/components/home/home-title";
import { HomePad } from "@/types/home";
import { DisplayVariant, PillVariant } from "@/types/ui";

interface HabitsProps {}

/** "Rules I build by": asymmetric sticky-left editorial ledger. */
export const Habits: React.FC<HabitsProps> = () => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProfile();
	const core = data?.core ?? [];

	const renderRows = () => {
		if (isPending) return <HabitsSkeleton />;
		if (isError) return <QueryErrorAlert onRetry={() => void refetch()} />;
		if (!core.length)
			return <QueryEmpty titleKey="home.habits.empty.title" />;
		return core.map((habit, i) => (
			<HabitCard
				key={habit.label}
				habit={habit}
				index={i}
				total={core.length}
			/>
		));
	};

	return (
		<HomeSection id={config.sections.process} pad={HomePad.Both}>
			<div className="grid gap-12 desk:grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)] desk:gap-16">
				<div className="flex flex-col items-start gap-6 self-start desk:sticky desk:top-28">
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
					<PillButton
						variant={PillVariant.Outline}
						magnetic
						nativeButton={false}
						render={<a href={`#${config.sections.timeline}`} />}
					>
						{t("home.habits.next")}
					</PillButton>
				</div>
				<div className="min-w-0 border-t">{renderRows()}</div>
			</div>
		</HomeSection>
	);
};

export default Habits;

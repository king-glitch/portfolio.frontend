import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { PillButton } from "@/components/common/buttons/pill-button";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { SectionLabel } from "@/components/common/typography/section-label";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import { yearsSince } from "@/lib/portfolio/time";
import { HelloStat } from "@/routes/components/home/hello/hello-stat";
import { HelloWords } from "@/routes/components/home/hello/hello-words";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomePad } from "@/types/home";
import { PillSize, PillVariant } from "@/types/ui";

interface StatDef {
	id: string;
	labelKey: ParseKeys;
	pad: number;
}

const STATS: StatDef[] = [
	{ id: "projects", labelKey: "home.hello.stats.projects.label", pad: 2 },
	{ id: "languages", labelKey: "home.hello.stats.languages.label", pad: 2 },
	{ id: "years", labelKey: "home.hello.stats.years.label", pad: 2 },
	{ id: "pins", labelKey: "home.hello.stats.pins.label", pad: 1 },
];

interface HelloProps {}

/** About section: scroll-revealed paragraph plus four counted stats, all derived (no invented numbers except the 4k+ pins). */
export const Hello: React.FC<HelloProps> = () => {
	const { t } = useTranslation();
	const profile = useProfile();
	const projects = useProjects();
	const pending = profile.isPending || projects.isPending;
	const failed = profile.isError || projects.isError;
	const about = profile.data?.about ?? "";

	const retry = () => {
		void profile.refetch();
		void projects.refetch();
	};

	const values = (): Record<string, { value: number; suffix?: string }> => {
		const skills = profile.data?.skills[0]?.items.length ?? 0;
		const experience = profile.data?.experience ?? [];
		const start =
			experience.find((e) => /x10/i.test(e.title))?.start ?? experience[0]?.start;
		return {
			projects: { value: projects.data?.length ?? 0 },
			languages: { value: skills },
			years: {
				value: start ? yearsSince(start) : 0,
				suffix: t("home.hello.stats.years.suffix"),
			},
			pins: {
				value: config.home.hello.pinsStat.value,
				suffix: config.home.hello.pinsStat.suffix,
			},
		};
	};

	const renderWords = () => {
		if (failed) return <QueryErrorAlert onRetry={retry} />;
		if (pending)
			return (
				<div className="flex flex-col gap-3">
					{Array.from({ length: 4 }, (_, i) => (
						<Skeleton
							key={i}
							className={i === 3 ? "h-[clamp(26px,3.4vw,54px)] w-2/3" : "h-[clamp(26px,3.4vw,54px)] w-full"}
						/>
					))}
				</div>
			);
		if (!about) return <QueryEmpty titleKey="home.hello.empty.title" />;
		return <HelloWords text={about} />;
	};

	const renderStats = () => {
		if (failed || (!pending && !about)) return null;
		const map = values();
		return STATS.map(({ id, labelKey, pad }) => {
			const stat = map[id];
			if (pending || !stat)
				return (
					<div key={id} className="flex flex-col gap-3.5 border-b py-7 pr-6 desk:border-r desk:border-b-0">
						<Skeleton className="h-[clamp(54px,6.8vw,109px)] w-40" />
						<Skeleton className="h-3.5 w-44" />
					</div>
				);
			return (
				<HelloStat key={id} value={stat.value} pad={pad} suffix={stat.suffix} label={t(labelKey)} />
			);
		});
	};

	return (
		<HomeSection id={config.sections.about} pad={HomePad.Top}>
			<div className="grid gap-12 desk:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)]">
				<div className="flex flex-col items-start gap-6">
					<SectionLabel index={1}>{t("home.hello.eyebrow")}</SectionLabel>
					<PillButton
						variant={PillVariant.Outline}
						size={PillSize.Lg}
						magnetic
						nativeButton={false}
						render={<Link to={config.routes.about} viewTransition />}
					>
						{t("home.hello.cta")}
					</PillButton>
				</div>
				<div className="min-w-0">{renderWords()}</div>
			</div>
			<div className="mt-[clamp(72px,9vw,140px)] grid grid-cols-1 border-t desk:grid-cols-4">
				{renderStats()}
			</div>
		</HomeSection>
	);
};

export default Hello;

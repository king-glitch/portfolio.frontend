import React, { useRef, useState } from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { MetaCode } from "@/components/common/typography/meta-code";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { projectCountFor } from "@/lib/portfolio/stack-stops";
import { morph } from "@/lib/motion/view-transition";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomeSectionHead } from "@/routes/components/home/home-section-head";
import { HomeTitle } from "@/routes/components/home/home-title";
import { ToolkitSkeleton } from "@/routes/components/home/toolkit/toolkit-skeleton";
import { ToolkitTool } from "@/routes/components/home/toolkit/toolkit-tool";
import { HomePad } from "@/types/home";

const ALL_DISCIPLINE = "__all__";

const tabVariants = cva(
	"relative h-auto rounded-none border-0 bg-transparent px-0 pb-3 text-sm font-medium transition-colors duration-200 hover:bg-transparent dark:hover:bg-transparent",
	{
		variants: {
			active: {
				true: "text-foreground hover:text-foreground",
				false: "text-muted-foreground hover:text-foreground",
			},
		},
	},
);

interface ToolkitProps {}

/**
 * Interactive typographic discipline matrix. Switching the filter runs a View Transition:
 * every tool word and the tab underline carry a stable name, so they glide (FLIP) to their
 * new places. Hovering a tool isolates it and lifts how many projects use it.
 */
export const Toolkit: React.FC<ToolkitProps> = () => {
	const { t } = useTranslation();
	const reduced = useReducedMotion();
	const { data, isPending, isError, refetch } = useProfile();
	// Counts are an enhancement: while projects load or fail, tools simply show no count.
	const { data: projects = [] } = useProjects();
	const [active, setActive] = useState(ALL_DISCIPLINE);
	const tabsRef = useRef<HTMLDivElement>(null);
	const groups = (data?.skills ?? []).slice(0, config.home.toolkit.groups);
	const total = groups.reduce((sum, group) => sum + group.items.length, 0);
	const tabs = [
		{ id: ALL_DISCIPLINE, label: t("home.toolkit.all"), count: total },
		...groups.map((group) => ({
			id: group.label,
			label: group.label,
			count: group.items.length,
		})),
	];
	// Keep each group's original index: it numbers the row and names its morph targets.
	const visible = groups
		.map((group, gi) => ({ group, gi }))
		.filter(
			({ group }) => active === ALL_DISCIPLINE || active === group.label,
		);
	const pick = (id: string) =>
		morph("toolkit", () => setActive(id), reduced, tabsRef.current);

	const renderBody = () => {
		if (isPending) return <ToolkitSkeleton />;
		if (isError) return <QueryErrorAlert onRetry={() => void refetch()} />;
		if (!groups.length)
			return <QueryEmpty titleKey="home.toolkit.empty.title" />;
		return (
			<>
				<div
					ref={tabsRef}
					role="group"
					aria-label={t("home.toolkit.aria-label")}
					className="flex flex-wrap items-baseline gap-x-7 gap-y-3 border-b"
				>
					{tabs.map((tab) => (
						<Button
							key={tab.id}
							type="button"
							variant="ghost"
							aria-pressed={active === tab.id}
							onClick={() => pick(tab.id)}
							className={tabVariants({
								active: active === tab.id,
							})}
						>
							<span>{tab.label}</span>
							<span className="ml-1.5 font-mono text-xs tabular-nums opacity-55">
								{String(tab.count).padStart(2, "0")}
							</span>
							{active === tab.id ? (
								<span
									aria-hidden="true"
									className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground"
									style={{ viewTransitionName: "tk-tab" }}
								/>
							) : null}
						</Button>
					))}
				</div>
				<div className="divide-y divide-border border-b">
					{visible.map(({ group, gi }) => (
						<div
							key={group.label}
							className="grid gap-6 py-9 desk:grid-cols-[240px_minmax(0,1fr)] desk:items-baseline desk:gap-12"
						>
							<div
								className="flex items-baseline justify-between gap-4 desk:flex-col desk:gap-2"
								style={{ viewTransitionName: `tk-g-${gi}` }}
							>
								<MetaCode>
									{String(gi + 1).padStart(2, "0")}
								</MetaCode>
								<h3 className="m-0 text-lg font-semibold tracking-tight">
									{group.label}
								</h3>
							</div>
							<div className="flex flex-wrap items-baseline gap-x-5 gap-y-2.5 [&:hover_[data-tool]:not(:hover)]:opacity-25">
								{group.items.map((item, ii) => (
									<React.Fragment key={item}>
										{ii > 0 ? (
											<span
												aria-hidden="true"
												className="text-lg font-light text-border select-none"
											>
												/
											</span>
										) : null}
										<ToolkitTool
											name={item}
											count={projectCountFor(
												item,
												projects,
											)}
											morphName={`tk-${gi}-${ii}`}
										/>
									</React.Fragment>
								))}
							</div>
						</div>
					))}
				</div>
			</>
		);
	};

	return (
		<HomeSection id={config.sections.skills} pad={HomePad.Bottom}>
			<HomeSectionHead
				index={7}
				label={t("home.toolkit.eyebrow")}
				title={
					<HomeTitle
						lines={[
							t("home.toolkit.lines.1"),
							t("home.toolkit.lines.2"),
						]}
					/>
				}
				aside={
					<MetaCode>
						{t("home.toolkit.count", { count: total })}
					</MetaCode>
				}
			/>
			<div className="mt-14">{renderBody()}</div>
		</HomeSection>
	);
};

export default Toolkit;

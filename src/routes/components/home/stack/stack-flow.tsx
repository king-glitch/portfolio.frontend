import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { useStackStops } from "@/api/hooks/portfolio/use-stack-stops";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { MetaCode } from "@/components/common/typography/meta-code";
import { SectionBlurb } from "@/components/common/typography/section-blurb";
import { config } from "@/config";
import { usePinnedSteps } from "@/hooks/scroll/use-pinned-steps";
import { projectsForStop } from "@/lib/portfolio/stack-stops";
import { cn } from "@/lib/utils";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomeSectionHead } from "@/routes/components/home/home-section-head";
import { HomeTitle } from "@/routes/components/home/home-title";
import { StackFlowSkeleton } from "@/routes/components/home/stack/stack-flow-skeleton";
import { StackRail } from "@/routes/components/home/stack/stack-rail";
import { StackStage } from "@/routes/components/home/stack/stack-stage";
import { StackStop } from "@/routes/components/home/stack/stack-stop";
import { HomePad } from "@/types/home";

interface StackFlowProps {}

/**
 * "Under the hood": on desktop the stage pins while scrolling walks a tap down five stops
 * (screen → line → brain → memory → ledger); a wire with a packet tracks the active stop and
 * the inverted stage wipes in its copy. Clicking a stop scrolls to it. Touch, narrow and
 * reduced-motion visitors get the same list + stage without pinning, driven by hover/tap.
 */
export const StackFlow: React.FC<StackFlowProps> = () => {
	const { t } = useTranslation();
	const stops = useStackStops();
	const { data, isPending, isError, refetch } = useProjects();
	const trackRef = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(0);
	const list = stops.data ?? [];
	const { pinned, goTo } = usePinnedSteps(trackRef, list.length, setIndex);
	const select = (i: number) => (pinned ? goTo(i) : setIndex(i));
	const countFor = (i: number) =>
		isPending || !data ? undefined : projectsForStop(list[i], data).length;

	const renderStage = () => {
		if (stops.isPending) return <StackFlowSkeleton />;
		if (stops.isError)
			return <QueryErrorAlert onRetry={() => void stops.refetch()} />;
		if (!list.length)
			return <QueryEmpty titleKey="home.stack.empty.title" />;
		const active = Math.min(index, list.length - 1);
		const count = countFor(active);
		return (
			<div className="grid gap-10 desk:grid-cols-12 desk:gap-12">
				<div className="flex flex-col gap-6 desk:col-span-5">
					<div className="relative pl-7">
						<StackRail index={active} count={list.length} />
						<div
							role="group"
							aria-label={t("home.stack.flow.aria-label")}
							className="flex flex-col border-t"
						>
							{list.map((item, i) => (
								<StackStop
									key={item.id}
									stop={item}
									index={i}
									count={countFor(i)}
									selected={i === active}
									onSelect={() => select(i)}
									onHover={
										pinned ? undefined : () => setIndex(i)
									}
								/>
							))}
						</div>
					</div>
					{isError ? (
						<QueryErrorAlert onRetry={() => void refetch()} />
					) : null}
					{pinned ? (
						<MetaCode>{t("home.stack.scroll.hint")}</MetaCode>
					) : null}
				</div>
				<StackStage
					stop={list[active]}
					index={active}
					total={list.length}
					count={
						count === undefined
							? "--"
							: String(count).padStart(2, "0")
					}
					className="desk:col-span-7"
				/>
			</div>
		);
	};

	return (
		<HomeSection id={config.sections.stack} pad={HomePad.Bottom}>
			<HomeSectionHead
				index={4}
				label={t("home.stack.eyebrow")}
				title={
					<HomeTitle
						lines={[
							t("home.stack.lines.1"),
							t("home.stack.lines.2"),
						]}
					/>
				}
				aside={
					<SectionBlurb>{t("home.stack.description")}</SectionBlurb>
				}
			/>
			<div ref={trackRef} className={cn("mt-14", pinned && "h-[400svh]")}>
				<div
					className={cn(
						pinned &&
							"sticky top-0 flex h-svh flex-col justify-center pt-20",
					)}
				>
					{renderStage()}
				</div>
			</div>
		</HomeSection>
	);
};

export default StackFlow;

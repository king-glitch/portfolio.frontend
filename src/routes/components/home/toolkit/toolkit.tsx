import React, { useRef } from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { PillButton } from "@/components/common/buttons/pill-button";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useBubblePhysics } from "@/hooks/physics/use-bubble-physics";
import { bubbleDiameter, bubbleFontSize } from "@/lib/motion/physics";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomeSectionHead } from "@/routes/components/home/home-section-head";
import { HomeTitle } from "@/routes/components/home/home-title";
import { ToolkitBubble } from "@/routes/components/home/toolkit/toolkit-bubble";
import { ToolkitSkeleton } from "@/routes/components/home/toolkit/toolkit-skeleton";
import { CursorLabel } from "@/types/cursor";
import { BubbleGroup, HomePad } from "@/types/home";
import { PillSize, PillVariant } from "@/types/ui";

const GROUPS = [
	BubbleGroup.Solid,
	BubbleGroup.Outline,
	BubbleGroup.Muted,
	BubbleGroup.Ringed,
];

const playVariants = cva(
	"relative mt-10 h-[clamp(520px,62vh,640px)] touch-pan-y overflow-hidden rounded-[32px] bg-card shadow-[inset_0_0_0_1px_var(--border)]",
	{
		variants: {
			physics: {
				true: "",
				false: "flex flex-wrap content-start gap-3 p-6 pt-14",
			},
		},
	},
);

interface ToolkitProps {}

/** Skills as bubbles that drop, bounce and can be thrown (gravity engine). Static wrapped grid under reduced motion. */
export const Toolkit: React.FC<ToolkitProps> = () => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProfile();
	const reduced = useReducedMotion();
	const playRef = useRef<HTMLDivElement>(null);
	const bubbles = (data?.skills ?? [])
		.slice(0, config.home.toolkit.groups)
		.flatMap((group, g) =>
			group.items.map((label) => {
				const diameter = bubbleDiameter(label, config.home.toolkit);
				return {
					label,
					group: GROUPS[g % GROUPS.length] ?? BubbleGroup.Solid,
					diameter,
					fontSize: bubbleFontSize(diameter, config.home.toolkit),
				};
			}),
		);
	const physics = !reduced && bubbles.length > 0;
	const { shake } = useBubblePhysics(playRef, bubbles.length, physics);

	const renderPlay = () => {
		if (isPending) return <ToolkitSkeleton />;
		if (isError)
			return (
				<QueryErrorAlert
					onRetry={() => void refetch()}
					className="m-6"
				/>
			);
		if (!bubbles.length)
			return <QueryEmpty titleKey="home.toolkit.empty.title" />;
		return (
			<>
				{bubbles.map((bubble) => (
					<ToolkitBubble
						key={bubble.label}
						{...bubble}
						physics={physics}
					/>
				))}
				<span className="pointer-events-none absolute top-5 left-6 text-[13px] text-muted-foreground">
					{t("home.toolkit.count", { count: bubbles.length })}
				</span>
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
					<PillButton
						variant={PillVariant.Outline}
						size={PillSize.Xl}
						magnetic
						disabled={!physics}
						onClick={shake}
					>
						{t("home.toolkit.shake")}
					</PillButton>
				}
			/>
			<div
				ref={playRef}
				role="group"
				data-cursor={CursorLabel.Drag}
				aria-label={t("home.toolkit.aria-label")}
				className={playVariants({ physics })}
			>
				{renderPlay()}
			</div>
		</HomeSection>
	);
};

export default Toolkit;

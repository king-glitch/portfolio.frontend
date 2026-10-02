import React from "react";
import { cva } from "class-variance-authority";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import { DisplayVariant } from "@/types/ui";
import { FeatureCellTone, type BlockProps } from "@/types/work";
import { PanelHeading } from "@/routes/work/[project-id]/components/blocks/panel-heading";

const cellVariants = cva(
	"box-border flex flex-col justify-between gap-4 rounded-3xl p-5.5 shadow-[inset_0_0_0_1px_var(--border)]",
	{
		variants: {
			tone: {
				[FeatureCellTone.Hero]:
					"col-span-2 row-span-2 bg-foreground text-background mob:col-span-1 mob:row-span-1",
				[FeatureCellTone.Muted]: "bg-muted",
				[FeatureCellTone.Card]: "bg-card",
			},
		},
	},
);

function cellTone(i: number): FeatureCellTone {
	if (i === 0) return FeatureCellTone.Hero;
	return i % 3 === 2 ? FeatureCellTone.Muted : FeatureCellTone.Card;
}

interface BlockFeatureGridProps extends BlockProps<BlockType.FeatureGrid> {}

/** Bento grid: the first item is a double-size hero cell. */
export const BlockFeatureGrid: React.FC<BlockFeatureGridProps> = ({
	label,
	items,
	index,
}) => {
	return (
		<Panel className="flex w-auto flex-col gap-7">
			<PanelHeading index={index}>{label}</PanelHeading>
			<div className="grid min-h-0 grow auto-cols-[min(300px,78vw)] grid-flow-col-dense grid-rows-2 gap-3.5 mob:auto-cols-auto mob:grid-flow-row mob:grid-cols-1 mob:grid-rows-none mob:overflow-y-auto">
				{items.map((item, i) => (
					<div
						key={item}
						className={cellVariants({ tone: cellTone(i) })}
					>
						<span className="text-xs font-bold tracking-widest opacity-60">
							{padCount(i + 1)}
						</span>
						<p
							className={
								i === 0
									? "m-0 text-[clamp(28px,2.8vw,44px)] leading-tight font-semibold tracking-[-0.02em]"
									: "m-0 text-lg leading-tight font-semibold tracking-[-0.02em]"
							}
						>
							{item}
						</p>
					</div>
				))}
			</div>
		</Panel>
	);
};

export default BlockFeatureGrid;

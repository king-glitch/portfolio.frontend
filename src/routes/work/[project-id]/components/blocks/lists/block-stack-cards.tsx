import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import { cn } from "@/lib/utils";
import { DisplayVariant } from "@/types/ui";
import type { BlockProps } from "@/types/work";
import { PanelHeading } from "@/routes/work/[project-id]/components/blocks/panel-heading";

interface BlockStackCardsProps extends BlockProps<BlockType.StackCards> {}

/** Overlapping tilted cards; each lifts straight on hover. */
export const BlockStackCards: React.FC<BlockStackCardsProps> = ({
	label,
	items,
	index,
}) => {
	return (
		<Panel className="flex min-w-[80vw] flex-col justify-between gap-8 mob:overflow-y-auto">
			<PanelHeading index={index} variant={DisplayVariant.Panel}>
				{label}
			</PanelHeading>
			<div className="flex items-center py-5 pr-10 pl-0 mob:flex-col mob:items-stretch">
				{items.map((item, i) => {
					const odd = i % 2 === 1;
					return (
						<article
							key={item}
							className={cn(
								"relative box-border flex min-h-[min(52vh,440px)] w-[min(360px,78vw)] shrink-0 flex-col justify-between gap-6 rounded-[26px] p-6.5 shadow-[0_0_0_1px_var(--border),0_30px_60px_-24px_rgba(0,0,0,0.7)] transition-transform duration-800 ease-(--ease-out-expo) hover:z-5 hover:-translate-y-6 hover:rotate-0 mob:w-auto mob:translate-y-0 mob:rotate-0",
								odd
									? "translate-y-6.5 rotate-3 bg-card"
									: "-translate-y-3.5 rotate-[-2.5deg] bg-foreground text-background",
								i > 0 && "-ml-10 mob:ml-0",
							)}
						>
							<span className="text-[64px] leading-[0.8] font-black tracking-[-0.07em]">
								{padCount(i + 1)}
							</span>
							<p className="m-0 text-base leading-[1.55]">
								{item}
							</p>
						</article>
					);
				})}
			</div>
		</Panel>
	);
};

export default BlockStackCards;

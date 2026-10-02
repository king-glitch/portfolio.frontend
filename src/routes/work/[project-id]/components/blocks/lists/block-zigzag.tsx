import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import { cn } from "@/lib/utils";
import type { BlockProps } from "@/types/work";
import { PanelHeading } from "@/routes/work/[project-id]/components/blocks/panel-heading";

interface BlockZigzagProps extends BlockProps<BlockType.Zigzag> {}

/** Outlined numbers stepping up and down. */
export const BlockZigzag: React.FC<BlockZigzagProps> = ({
	label,
	items,
	index,
}) => {
	return (
		<Panel className="flex w-auto flex-col gap-6 mob:overflow-y-auto">
			<PanelHeading index={index}>{label}</PanelHeading>
			<ol className="m-0 flex min-h-0 grow list-none gap-12 p-0 mob:flex-col">
				{items.map((item, i) => {
					const odd = i % 2 === 1;
					return (
						<li
							key={item}
							data-speed={odd ? "1.12" : "0.92"}
							className={cn(
								"flex w-[min(400px,80vw)] shrink-0 flex-col gap-4 mob:w-full mob:self-stretch",
								odd ? "self-end" : "self-start",
							)}
						>
							<span className="work-outline text-[clamp(110px,12vw,200px)] leading-[0.78] font-black tracking-[-0.08em]">
								{padCount(i + 1)}
							</span>
							<p className="m-0 text-[17px] leading-[1.55]">
								{item}
							</p>
						</li>
					);
				})}
			</ol>
		</Panel>
	);
};

export default BlockZigzag;

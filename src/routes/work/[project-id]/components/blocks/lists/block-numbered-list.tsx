import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { DisplayVariant } from "@/types/ui";
import { padCount } from "@/lib/portfolio/project-nav";
import type { BlockProps } from "@/types/work";
import { PanelHeading } from "@/routes/work/[project-id]/components/blocks/panel-heading";

interface BlockNumberedListProps extends BlockProps<BlockType.NumberedList> {}

/** Two rows of numbered columns. */
export const BlockNumberedList: React.FC<BlockNumberedListProps> = ({
	label,
	items,
	index,
}) => {
	return (
		<Panel className="flex flex-col gap-10">
			<PanelHeading index={index} variant={DisplayVariant.Panel}>
				{label}
			</PanelHeading>
			<ol
				data-speed="1.05"
				className="m-0 grid min-h-0 grow list-none auto-cols-[min(360px,78vw)] grid-flow-col grid-rows-[repeat(2,minmax(0,auto))] content-start gap-x-10 gap-y-7 p-0 max-desk:auto-cols-auto max-desk:grid-flow-row max-desk:grid-cols-1 max-desk:grid-rows-none max-desk:overflow-y-auto"
			>
				{items.map((item, i) => (
					<li
						key={item}
						className="flex flex-col gap-3.5 border-t border-border pt-4"
					>
						<span className="text-[13px] font-semibold text-muted-foreground tabular-nums">
							{padCount(i + 1)}
						</span>
						<p className="m-0 text-[17px] leading-[1.55]">{item}</p>
					</li>
				))}
			</ol>
		</Panel>
	);
};

export default BlockNumberedList;

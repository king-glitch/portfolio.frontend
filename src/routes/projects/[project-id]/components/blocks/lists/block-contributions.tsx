import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { ItemNumber } from "@/components/common/typography/item-number";
import { DisplayVariant } from "@/types/ui";
import type { BlockProps } from "@/types/work";
import { PanelHeading } from "@/routes/projects/[project-id]/components/blocks/panel-heading";

interface BlockContributionsProps extends BlockProps<BlockType.Contributions> {}

/** What I built (`project.role`): two rows of numbered columns, as wide as the list. */
export const BlockContributions: React.FC<BlockContributionsProps> = ({
	label,
	index,
	project,
}) => {
	return (
		<Panel className="flex w-auto flex-col gap-10">
			<PanelHeading index={index} variant={DisplayVariant.Panel}>
				{label}
			</PanelHeading>
			<ol className="m-0 grid min-h-0 list-none auto-cols-[min(380px,78vw)] grid-flow-col grid-rows-[repeat(2,minmax(0,auto))] content-start gap-x-12 gap-y-9 p-0 max-desk:auto-cols-auto max-desk:grid-flow-row max-desk:grid-cols-1 max-desk:grid-rows-none">
				{project.role.map((item, i) => (
					<li
						key={item}
						className="flex flex-col gap-3.5 border-t border-border pt-4"
					>
						<ItemNumber n={i + 1} />
						<p className="m-0 text-[clamp(17px,1.3vw,20px)] leading-normal">
							{item}
						</p>
					</li>
				))}
			</ol>
		</Panel>
	);
};

export default BlockContributions;

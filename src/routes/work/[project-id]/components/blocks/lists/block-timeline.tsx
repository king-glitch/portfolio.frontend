import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import type { BlockProps } from "@/types/work";
import { PanelHeading } from "@/routes/work/[project-id]/components/blocks/panel-heading";

interface BlockTimelineProps extends BlockProps<BlockType.Timeline> {}

/** Alternating above/below entries on a centre line. */
export const BlockTimeline: React.FC<BlockTimelineProps> = ({
	label,
	items,
	index,
}) => {
	return (
		<Panel className="flex w-auto flex-col max-desk:overflow-y-auto">
			<PanelHeading index={index}>{label}</PanelHeading>
			<ol className="relative m-0 flex grow list-none items-stretch p-0 max-desk:flex-col">
				<li
					aria-hidden="true"
					className="absolute inset-x-0 top-1/2 h-px bg-foreground opacity-40 max-desk:hidden"
				/>
				{items.map((item, i) => {
					const entry = (
						<>
							<span className="text-5xl leading-none font-black tracking-[-0.06em]">
								{padCount(i + 1)}
							</span>
							<p className="mt-2.5 mb-0 text-base leading-[1.55]">
								{item}
							</p>
						</>
					);
					const up = i % 2 === 0;
					return (
						<li
							key={item}
							className="relative grid w-[min(380px,80vw)] shrink-0 grid-rows-[minmax(0,1fr)_20px_minmax(0,1fr)] pr-10"
						>
							<div className="flex flex-col justify-end pb-5">
								{up ? entry : null}
							</div>
							<div className="flex items-center">
								<span className="size-5 rounded-full bg-background shadow-[inset_0_0_0_2px_var(--foreground)]" />
							</div>
							<div className="pt-5">{up ? null : entry}</div>
						</li>
					);
				})}
			</ol>
		</Panel>
	);
};

export default BlockTimeline;

import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import type { BlockProps } from "@/types/work";
import { ArtFrame } from "@/routes/work/[project-id]/components/blocks/art-frame";
import { Eyebrow } from "@/components/common/typography/eyebrow";

interface BlockAboutSplitProps extends BlockProps<BlockType.AboutSplit> {}

/** Statement on the left; a numbered list or the project motif on the right. */
export const BlockAboutSplit: React.FC<BlockAboutSplitProps> = ({
	label,
	text,
	kind,
	list,
	index,
	projectKind,
}) => {
	return (
		<Panel className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-[5vw] max-desk:grid-cols-1">
			<div className="flex flex-col justify-between gap-8">
				<Eyebrow>
					({padCount(index)}) {label}
				</Eyebrow>
				<p
					data-speed="1.05"
					className="m-0 text-[clamp(22px,2.5vw,40px)] leading-[1.22] font-semibold tracking-[-0.032em]"
				>
					{text}
				</p>
			</div>
			{list?.length ? (
				<ul
					data-speed="1.15"
					className="m-0 flex list-none flex-col self-end p-0"
				>
					{list.map((item, i) => (
						<li
							key={item}
							className="flex items-baseline gap-5 border-t border-border py-4 text-[clamp(18px,1.7vw,26px)] font-semibold tracking-[-0.02em]"
						>
							<span className="text-xs text-muted-foreground tabular-nums">
								{padCount(i + 1)}
							</span>
							{item}
						</li>
					))}
				</ul>
			) : (
				<ArtFrame kind={kind ?? projectKind} data-speed="1.2" />
			)}
		</Panel>
	);
};

export default BlockAboutSplit;

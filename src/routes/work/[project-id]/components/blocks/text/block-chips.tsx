import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import { PanelTone, type BlockProps } from "@/types/work";
import { PanelLabel } from "@/routes/work/[project-id]/components/blocks/panel-label";

interface BlockChipsProps extends BlockProps<BlockType.Chips> {}

/** Inverted panel: giant title, blurb and outlined chips. */
export const BlockChips: React.FC<BlockChipsProps> = ({
	label,
	title,
	text,
	items,
	index,
}) => {
	return (
		<Panel
			tone={PanelTone.Invert}
			className="flex flex-col justify-between gap-8"
		>
			<PanelLabel className="text-inherit opacity-60">
				({padCount(index)}) {label}
			</PanelLabel>
			<div
				data-speed="0.86"
				className="text-[clamp(110px,20vw,380px)] leading-[0.78] font-black tracking-[-0.085em] whitespace-nowrap"
			>
				{title}
			</div>
			<div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-end gap-[4vw] mob:grid-cols-1">
				<p className="m-0 text-[clamp(17px,1.5vw,22px)] leading-normal">
					{text}
				</p>
				<ul className="m-0 flex list-none flex-wrap justify-end gap-2.5 p-0">
					{items.map((item) => (
						<li
							key={item}
							className="rounded-pill px-5 py-3 text-[clamp(16px,1.4vw,22px)] font-bold shadow-[inset_0_0_0_1.5px_currentColor]"
						>
							{item}
						</li>
					))}
				</ul>
			</div>
		</Panel>
	);
};

export default BlockChips;

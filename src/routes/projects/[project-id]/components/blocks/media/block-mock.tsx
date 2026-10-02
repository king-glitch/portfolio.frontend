import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { ProjectMedia } from "@/components/common/art/project-media";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import { PanelTone, type BlockProps } from "@/types/work";
import { Eyebrow } from "@/components/common/typography/eyebrow";

interface BlockMockProps extends BlockProps<BlockType.Mock> {}

/** One centred device mock on a card panel. */
export const BlockMock: React.FC<BlockMockProps> = ({
	label,
	index,
	...item
}) => {
	return (
		<Panel
			tone={PanelTone.Card}
			className="flex flex-col gap-6 overflow-hidden"
		>
			<div
				data-speed="0.85"
				className="flex flex-wrap items-baseline justify-between gap-6"
			>
				<Eyebrow>
					({padCount(index)}) {label}
				</Eyebrow>
				<span className="text-[13px] text-muted-foreground">
					{item.caption}
				</span>
			</div>
			<div
				data-speed="1.12"
				className="flex min-h-0 grow items-center justify-center"
			>
				<div className="size-full max-w-275 drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)]">
					<ProjectMedia
						item={item}
						className="aspect-auto size-full"
					/>
				</div>
			</div>
		</Panel>
	);
};

export default BlockMock;

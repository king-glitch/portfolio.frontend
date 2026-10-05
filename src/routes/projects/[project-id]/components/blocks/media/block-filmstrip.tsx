import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { MediaFrame } from "@/components/common/art/media-frame";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import type { BlockProps } from "@/types/work";
import { PanelHeading } from "@/routes/projects/[project-id]/components/blocks/panel-heading";

interface BlockFilmstripProps extends BlockProps<BlockType.Filmstrip> {}

/**
 * Filmstrip at one height: every frame takes its width from the image's own ratio, so nothing is
 * cropped to a device shape. Frames never move relative to each other (parallax stays inside each).
 */
export const BlockFilmstrip: React.FC<BlockFilmstripProps> = ({
	label,
	caption,
	items,
	index,
}) => {
	return (
		<Panel className="flex w-auto flex-col gap-6">
			<div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
				<PanelHeading index={index}>{label}</PanelHeading>
				{caption ? (
					<span className="text-[13px] text-muted-foreground">
						{caption}
					</span>
				) : null}
			</div>
			<div className="flex min-h-0 grow items-stretch gap-[clamp(20px,2.4vw,44px)] max-desk:-mx-4 max-desk:snap-x max-desk:snap-mandatory max-desk:overflow-x-auto max-desk:px-4 max-desk:pb-2">
				{items.map((item, i) => (
					<figure
						key={item.url}
						className="m-0 flex shrink-0 snap-start flex-col gap-3"
					>
						<MediaFrame
							asset={item}
							className="h-[calc(100svh-22rem)] max-h-180 w-auto max-desk:h-[52svh]"
						/>
						{item.caption ? (
							<figcaption className="text-[13px] text-muted-foreground">
								{padCount(i + 1)} — {item.caption}
							</figcaption>
						) : null}
					</figure>
				))}
			</div>
		</Panel>
	);
};

export default BlockFilmstrip;

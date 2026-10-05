import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { MediaFrame } from "@/components/common/art/media-frame";
import { Panel } from "@/components/common/layout/panel";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { padCount } from "@/lib/portfolio/project-nav";
import type { BlockProps } from "@/types/work";

interface BlockShowcaseProps extends BlockProps<BlockType.Showcase> {}

/** One image at full panel height; the panel is as wide as the image's ratio (capped). */
export const BlockShowcase: React.FC<BlockShowcaseProps> = ({
	label,
	index,
	project: _project,
	...asset
}) => {
	return (
		<Panel className="flex w-auto flex-col gap-4">
			<figure className="m-0 flex flex-col gap-4">
				<MediaFrame
					asset={asset}
					className="h-[calc(100svh-15rem)] w-auto max-w-[88vw] max-desk:h-auto max-desk:max-h-[70svh] max-desk:w-full"
				/>
				<figcaption className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
					{label ? (
						<Eyebrow>
							({padCount(index)}) {label}
						</Eyebrow>
					) : null}
					{asset.caption ? (
						<span className="text-[13px] text-muted-foreground">
							{asset.caption}
						</span>
					) : null}
				</figcaption>
			</figure>
		</Panel>
	);
};

export default BlockShowcase;

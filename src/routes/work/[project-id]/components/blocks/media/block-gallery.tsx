import React from "react";
import { cva } from "class-variance-authority";
import { BlockType, DeviceView } from "@/api/types/portfolio/enums";
import { ProjectMedia } from "@/components/common/art/project-media";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import { cn } from "@/lib/utils";
import type { BlockProps } from "@/types/work";
import { PanelHeading } from "@/routes/work/[project-id]/components/blocks/panel-heading";

const figureVariants = cva(
	"m-0 flex shrink-0 flex-col gap-3 max-desk:aspect-auto max-desk:h-auto max-desk:w-full",
	{
		variants: {
			view: {
				[DeviceView.Phone]: "aspect-[1/2.1] h-[92%]",
				[DeviceView.Desktop]: "aspect-[16/10.8] h-[64%]",
			},
		},
	},
);

interface BlockGalleryProps extends BlockProps<BlockType.Gallery> {}

/** Staggered device mocks with captions. */
export const BlockGallery: React.FC<BlockGalleryProps> = ({
	label,
	items,
	caption,
	index,
}) => {
	return (
		<Panel className="flex w-auto flex-col gap-6 max-desk:overflow-y-auto">
			<div className="flex flex-wrap items-baseline gap-5">
				<PanelHeading index={index}>{label}</PanelHeading>
				<span className="text-[13px] text-muted-foreground">
					{caption}
				</span>
			</div>
			<div className="flex min-h-0 grow items-center gap-12 max-desk:flex-col max-desk:items-stretch max-desk:overflow-y-auto">
				{items.map((item, i) => {
					const odd = i % 2 === 1;
					return (
						<figure
							key={`${item.kind}-${item.screen}-${item.view}`}
							data-speed={odd ? "1.15" : "0.95"}
							className={cn(
								figureVariants({ view: item.view }),
								odd ? "self-end" : "self-start",
							)}
						>
							<div className="min-h-0 grow">
								<ProjectMedia
									item={item}
									className="aspect-auto size-full"
								/>
							</div>
							<figcaption className="text-[13px] text-muted-foreground">
								{padCount(i + 1)} — {item.caption}
							</figcaption>
						</figure>
					);
				})}
			</div>
		</Panel>
	);
};

export default BlockGallery;

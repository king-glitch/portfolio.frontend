import React, { useState } from "react";
import { cva } from "class-variance-authority";
import type { MediaItem } from "@/api/types/portfolio/block";
import { DeviceView } from "@/api/types/portfolio/enums";
import { ProjectMock } from "@/components/common/art/project-mock";
import { cn } from "@/lib/utils";

const mediaVariants = cva("block overflow-hidden", {
	variants: {
		view: {
			[DeviceView.Desktop]: "aspect-8/5",
			[DeviceView.Phone]: "aspect-1/2",
		},
	},
});

interface ProjectMediaProps {
	item: MediaItem;
	className?: string;
}

/** Real screenshot when `imageUrl` loads, otherwise the illustrative mock. */
export const ProjectMedia: React.FC<ProjectMediaProps> = ({
	item,
	className,
}) => {
	const [failed, setFailed] = useState(false);
	const showImage = Boolean(item.imageUrl) && !failed;

	return (
		<div className={cn(mediaVariants({ view: item.view }), className)}>
			{showImage ? (
				<img
					src={item.imageUrl}
					alt={item.caption}
					loading="lazy"
					onError={() => setFailed(true)}
					className="size-full object-cover"
				/>
			) : (
				<ProjectMock kind={item.kind} screen={item.screen} />
			)}
		</div>
	);
};

export default ProjectMedia;

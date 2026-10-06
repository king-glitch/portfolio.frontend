import React, { useState } from "react";
import type { MotifKind } from "@/api/types/portfolio/enums";
import { MockScreen } from "@/api/types/portfolio/enums";
import { ProjectMock } from "@/components/common/art/project-mock";
import { mockMeta } from "@/lib/art/mock-meta";
import { cn } from "@/lib/utils";
import { ArtFit } from "@/types/ui";

interface ProjectPreviewMockProps {
	kind: MotifKind;
	/** The project's uploaded art; the mock screen is the fallback. */
	imageUrl?: string;
	/** Shown because the visitor points at it (index row, menu item): eases into colour after a short dwell. */
	active?: boolean;
	className?: string;
}

/**
 * A project's main screen filling its box: cropped for desktop mocks, contained (with top room) for phone mocks.
 * Uploaded art is monochrome like the rest of the site; it turns to colour on hover or while `active`.
 */
export const ProjectPreviewMock: React.FC<ProjectPreviewMockProps> = ({
	kind,
	imageUrl,
	active,
	className,
}) => {
	const [failedUrl, setFailedUrl] = useState<string | null>(null);
	const phone = mockMeta(kind, MockScreen.Main).phone;
	return (
		<span
			data-active={active ? "" : undefined}
			className={cn(
				"group/media absolute inset-0 block",
				phone && !imageUrl && "pt-2.5",
				className,
			)}
		>
			{imageUrl && imageUrl !== failedUrl ? (
				<img
					src={imageUrl}
					alt=""
					loading="lazy"
					onError={() => setFailedUrl(imageUrl)}
					className="size-full object-cover grayscale transition-[filter] duration-700 ease-out group-hover/media:grayscale-0 group-data-active/media:grayscale-0 group-data-active/media:delay-300 motion-reduce:transition-none starting:grayscale"
				/>
			) : (
				<ProjectMock
					kind={kind}
					fit={phone ? ArtFit.Meet : ArtFit.Slice}
				/>
			)}
		</span>
	);
};

export default ProjectPreviewMock;

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
	className?: string;
}

/** A project's main screen filling its box: cropped for desktop mocks, contained (with top room) for phone mocks. */
export const ProjectPreviewMock: React.FC<ProjectPreviewMockProps> = ({
	kind,
	imageUrl,
	className,
}) => {
	const [failedUrl, setFailedUrl] = useState<string | null>(null);
	const phone = mockMeta(kind, MockScreen.Main).phone;
	return (
		<span
			className={cn(
				"absolute inset-0 block",
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
					className="size-full object-cover"
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

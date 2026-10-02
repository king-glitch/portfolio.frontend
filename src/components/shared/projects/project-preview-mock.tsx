import React from "react";
import type { MotifKind } from "@/api/types/portfolio/enums";
import { MockScreen } from "@/api/types/portfolio/enums";
import { ProjectMock } from "@/components/common/art/project-mock";
import { mockMeta } from "@/lib/art/mock-meta";
import { cn } from "@/lib/utils";
import { ArtFit } from "@/types/ui";

interface ProjectPreviewMockProps {
	kind: MotifKind;
	className?: string;
}

/** A project's main screen filling its box: cropped for desktop mocks, contained (with top room) for phone mocks. */
export const ProjectPreviewMock: React.FC<ProjectPreviewMockProps> = ({
	kind,
	className,
}) => {
	const phone = mockMeta(kind, MockScreen.Main).phone;
	return (
		<span
			className={cn(
				"absolute inset-0 block",
				phone && "pt-2.5",
				className,
			)}
		>
			<ProjectMock kind={kind} fit={phone ? ArtFit.Meet : ArtFit.Slice} />
		</span>
	);
};

export default ProjectPreviewMock;

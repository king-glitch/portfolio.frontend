import React from "react";
import { BlockType, HeaderVariant } from "@/api/types/portfolio/enums";
import type { BlockParams } from "@/types/work";
import { HeaderCenter } from "@/routes/projects/[project-id]/components/blocks/header/header-center";
import { HeaderOutline } from "@/routes/projects/[project-id]/components/blocks/header/header-outline";
import { HeaderSplit } from "@/routes/projects/[project-id]/components/blocks/header/header-split";
import { HeaderVertical } from "@/routes/projects/[project-id]/components/blocks/header/header-vertical";

type HeaderProps = BlockParams<BlockType.ProjectHeader>;

const HEADERS: Record<HeaderVariant, React.FC<HeaderProps>> = {
	[HeaderVariant.Split]: HeaderSplit,
	[HeaderVariant.SplitRev]: HeaderSplit,
	[HeaderVariant.Center]: HeaderCenter,
	[HeaderVariant.Outline]: HeaderOutline,
	[HeaderVariant.Vertical]: HeaderVertical,
};

interface BlockProjectHeaderProps extends HeaderProps {
	projectArtUrl?: string;
}

/** First panel of a project; `variant` picks one of five layouts. */
export const BlockProjectHeader: React.FC<BlockProjectHeaderProps> = ({
	projectArtUrl,
	...params
}) => {
	const Header = HEADERS[params.variant];
	// the header's own art wins, then the project's, then the drawing of `kind`
	return <Header {...params} imageUrl={params.imageUrl || projectArtUrl} />;
};

export default BlockProjectHeader;

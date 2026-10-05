import React from "react";
import type { Block } from "@/api/types/portfolio/block";
import { BlockType } from "@/api/types/portfolio/enums";
import type { Project } from "@/api/types/portfolio/project";
import { blockChapter } from "@/lib/portfolio/chapters";
import type { BlockExtras } from "@/types/work";

import { BlockProjectHeader } from "@/routes/projects/[project-id]/components/blocks/block-project-header";
import { BlockArchitecture } from "@/routes/projects/[project-id]/components/blocks/diagram/block-architecture";
import { BlockLineage } from "@/routes/projects/[project-id]/components/blocks/diagram/block-lineage";
import { BlockChallenge } from "@/routes/projects/[project-id]/components/blocks/lists/block-challenge";
import { BlockContributions } from "@/routes/projects/[project-id]/components/blocks/lists/block-contributions";
import { BlockFeatureGrid } from "@/routes/projects/[project-id]/components/blocks/lists/block-feature-grid";
import { BlockShowcase } from "@/routes/projects/[project-id]/components/blocks/media/block-showcase";
import { BlockFilmstrip } from "@/routes/projects/[project-id]/components/blocks/media/block-filmstrip";
import { BlockLinks } from "@/routes/projects/[project-id]/components/blocks/text/block-links";
import { BlockOverview } from "@/routes/projects/[project-id]/components/blocks/text/block-overview";
import { BlockStatement } from "@/routes/projects/[project-id]/components/blocks/text/block-statement";

interface BlockRendererProps {
	block: Block;
	/** 1-based position among non-header blocks. */
	index: number;
	project: Project;
}

/**
 * Exhaustive over the `Block` union: each case narrows `block.params` to its component's props,
 * and a new `BlockType` member fails typecheck at the `never` check below.
 */
function renderBlock(block: Block, extra: BlockExtras): React.ReactNode {
	switch (block.type) {
		case BlockType.ProjectHeader:
			return <BlockProjectHeader {...block.params} {...extra} />;
		case BlockType.Overview:
			return <BlockOverview {...block.params} {...extra} />;
		case BlockType.Filmstrip:
			return <BlockFilmstrip {...block.params} {...extra} />;
		case BlockType.Showcase:
			return <BlockShowcase {...block.params} {...extra} />;
		case BlockType.Contributions:
			return <BlockContributions {...block.params} {...extra} />;
		case BlockType.Architecture:
			return <BlockArchitecture {...block.params} {...extra} />;
		case BlockType.Challenge:
			return <BlockChallenge {...block.params} {...extra} />;
		case BlockType.Statement:
			return <BlockStatement {...block.params} {...extra} />;
		case BlockType.FeatureGrid:
			return <BlockFeatureGrid {...block.params} {...extra} />;
		case BlockType.Lineage:
			return <BlockLineage {...block.params} {...extra} />;
		case BlockType.Links:
			return <BlockLinks {...block.params} {...extra} />;
		default: {
			const unhandled: never = block;
			return unhandled;
		}
	}
}

interface BlockRendererImplProps extends BlockRendererProps {}

const BlockRendererImpl: React.FC<BlockRendererImplProps> = ({
	block,
	index,
	project,
}) => (
	// `contents` adds no box; the viewport reads the chapter off it and watches its panel
	<div className="contents" data-chapter={blockChapter(block)}>
		{renderBlock(block, { index, project })}
	</div>
);

/** Memoised: scrolling re-renders the viewport, never the panels. */
export const BlockRenderer = React.memo(BlockRendererImpl);

export default BlockRenderer;

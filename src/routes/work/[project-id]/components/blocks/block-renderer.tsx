import React from "react";
import type { Block } from "@/api/types/portfolio/block";
import { BlockType, type MotifKind } from "@/api/types/portfolio/enums";
import type { BlockExtras } from "@/types/work";

import { BlockArchitecture } from "@/routes/work/[project-id]/components/blocks/diagram/block-architecture";
import { BlockLineage } from "@/routes/work/[project-id]/components/blocks/diagram/block-lineage";
import { BlockProjectHeader } from "@/routes/work/[project-id]/components/blocks/header/block-project-header";
import { BlockFeatureGrid } from "@/routes/work/[project-id]/components/blocks/lists/block-feature-grid";
import { BlockNumberedList } from "@/routes/work/[project-id]/components/blocks/lists/block-numbered-list";
import { BlockStackCards } from "@/routes/work/[project-id]/components/blocks/lists/block-stack-cards";
import { BlockTimeline } from "@/routes/work/[project-id]/components/blocks/lists/block-timeline";
import { BlockZigzag } from "@/routes/work/[project-id]/components/blocks/lists/block-zigzag";
import { BlockGallery } from "@/routes/work/[project-id]/components/blocks/media/block-gallery";
import { BlockMock } from "@/routes/work/[project-id]/components/blocks/media/block-mock";
import { BlockMotifFull } from "@/routes/work/[project-id]/components/blocks/media/block-motif-full";
import { BlockAboutSplit } from "@/routes/work/[project-id]/components/blocks/text/block-about-split";
import { BlockBigNumber } from "@/routes/work/[project-id]/components/blocks/text/block-big-number";
import { BlockChips } from "@/routes/work/[project-id]/components/blocks/text/block-chips";
import { BlockQuote } from "@/routes/work/[project-id]/components/blocks/text/block-quote";

interface BlockRendererProps {
	block: Block;
	/** 1-based position among non-header blocks. */
	index: number;
	projectKind: MotifKind;
}

/**
 * Exhaustive over the `Block` union: each case narrows `block.params` to its component's props,
 * and a new `BlockType` member fails typecheck at the `never` check below.
 */
function renderBlock(block: Block, extra: BlockExtras): React.ReactNode {
	switch (block.type) {
		case BlockType.ProjectHeader:
			return <BlockProjectHeader {...extra} {...block.params} />;
		case BlockType.Quote:
			return <BlockQuote {...block.params} {...extra} />;
		case BlockType.BigNumber:
			return <BlockBigNumber {...block.params} {...extra} />;
		case BlockType.AboutSplit:
			return <BlockAboutSplit {...block.params} {...extra} />;
		case BlockType.NumberedList:
			return <BlockNumberedList {...block.params} {...extra} />;
		case BlockType.StackCards:
			return <BlockStackCards {...block.params} {...extra} />;
		case BlockType.FeatureGrid:
			return <BlockFeatureGrid {...block.params} {...extra} />;
		case BlockType.Timeline:
			return <BlockTimeline {...block.params} {...extra} />;
		case BlockType.Zigzag:
			return <BlockZigzag {...block.params} {...extra} />;
		case BlockType.MotifFull:
			return <BlockMotifFull {...block.params} {...extra} />;
		case BlockType.Chips:
			return <BlockChips {...block.params} {...extra} />;
		case BlockType.Mock:
			return <BlockMock {...block.params} {...extra} />;
		case BlockType.Gallery:
			return <BlockGallery {...block.params} {...extra} />;
		case BlockType.Architecture:
			return <BlockArchitecture {...block.params} {...extra} />;
		case BlockType.Lineage:
			return <BlockLineage {...block.params} {...extra} />;
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
	projectKind,
}) => renderBlock(block, { index, projectKind });

/** Memoised: scrolling re-renders the viewport, never the panels. */
export const BlockRenderer = React.memo(BlockRendererImpl);

export default BlockRenderer;

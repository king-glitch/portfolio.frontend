import React from "react";
import type { Block } from "@/api/types/portfolio/block";
import { BlockType, type MotifKind } from "@/api/types/portfolio/enums";
import type { BlockProps } from "@/types/work";
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

/** Block registry: a new `BlockType` member fails typecheck until it has a component. */
const BLOCKS: { [T in BlockType]: React.FC<BlockProps<T>> } = {
	[BlockType.ProjectHeader]: BlockProjectHeader,
	[BlockType.Quote]: BlockQuote,
	[BlockType.BigNumber]: BlockBigNumber,
	[BlockType.AboutSplit]: BlockAboutSplit,
	[BlockType.NumberedList]: BlockNumberedList,
	[BlockType.StackCards]: BlockStackCards,
	[BlockType.FeatureGrid]: BlockFeatureGrid,
	[BlockType.Timeline]: BlockTimeline,
	[BlockType.Zigzag]: BlockZigzag,
	[BlockType.MotifFull]: BlockMotifFull,
	[BlockType.Chips]: BlockChips,
	[BlockType.Mock]: BlockMock,
	[BlockType.Gallery]: BlockGallery,
	[BlockType.Architecture]: BlockArchitecture,
	[BlockType.Lineage]: BlockLineage,
};

interface BlockRendererProps {
	block: Block;
	/** 1-based position among non-header blocks. */
	index: number;
	projectKind: MotifKind;
}

// ponytail: TS cannot correlate BLOCKS[block.type] with block.params; one widening cast, the Record above keeps every type covered.
function renderBlock(block: Block, index: number, projectKind: MotifKind) {
	// style-lint-ignore-next-line no-as-cast -- TS cannot correlate BLOCKS[block.type] with block.params; the Record above covers every BlockType
	const Component = BLOCKS[block.type] as React.FC<BlockProps<BlockType>>;
	return (
		<Component {...block.params} index={index} projectKind={projectKind} />
	);
}

interface BlockRendererImplProps extends BlockRendererProps {}

const BlockRendererImpl: React.FC<BlockRendererImplProps> = ({
	block,
	index,
	projectKind,
}) => renderBlock(block, index, projectKind);

/** Memoised: scrolling re-renders the viewport (active dot), never the panels. */
export const BlockRenderer = React.memo(BlockRendererImpl);

export default BlockRenderer;

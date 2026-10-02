import React from "react";
import { BlockTone, BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import { PanelTone, PanelWidth, type BlockProps } from "@/types/work";

const QUOTE_TONE: Record<BlockTone, PanelTone> = {
	[BlockTone.Default]: PanelTone.Default,
	[BlockTone.Invert]: PanelTone.Invert,
};

interface BlockQuoteProps extends BlockProps<BlockType.Quote> {}

/** Large pull quote; `tone: invert` flips the panel colours. */
export const BlockQuote: React.FC<BlockQuoteProps> = ({
	text,
	cite,
	tone = BlockTone.Default,
	index,
}) => {
	return (
		<Panel
			width={PanelWidth.Card}
			tone={QUOTE_TONE[tone]}
			className="flex flex-col justify-center gap-8 border-r-0 px-[clamp(16px,6vw,110px)]"
		>
			<svg
				data-speed="0.8"
				width="72"
				height="56"
				viewBox="0 0 72 56"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M0 56V32C0 14 10 3 28 0l3 8C20 11 15 18 15 28h13v28H0zm41 0V32C41 14 51 3 69 0l3 8C61 11 56 18 56 28h13v28H41z" />
			</svg>
			<blockquote
				data-speed="1.06"
				className="m-0 text-[clamp(28px,3.6vw,60px)] leading-[1.12] font-light tracking-[-0.04em]"
			>
				{text}
			</blockquote>
			<cite className="text-[13px] font-semibold tracking-[0.16em] uppercase not-italic opacity-60">
				({padCount(index)}) {cite}
			</cite>
		</Panel>
	);
};

export default BlockQuote;

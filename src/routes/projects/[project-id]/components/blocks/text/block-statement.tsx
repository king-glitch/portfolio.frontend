import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import type { BlockProps } from "@/types/work";

interface BlockStatementProps extends BlockProps<BlockType.Statement> {}

/** One line, very large: the breath between two dense panels. */
export const BlockStatement: React.FC<BlockStatementProps> = ({ text }) => {
	return (
		<Panel className="flex w-[min(78vw,1280px)] items-center">
			<p className="m-0 text-[clamp(44px,7vw,128px)] leading-[0.92] font-extrabold tracking-[-0.06em] text-balance">
				{text}
			</p>
		</Panel>
	);
};

export default BlockStatement;

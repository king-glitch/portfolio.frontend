import type { Block } from "@/api/types/portfolio/block";
import { BlockType } from "@/api/types/portfolio/enums";

/** The top bar's section name for a block; the cover and statements keep the previous one. */
export function blockChapter(block: Block): string | undefined {
	switch (block.type) {
		case BlockType.ProjectHeader:
		case BlockType.Statement:
			return undefined;
		case BlockType.Showcase:
			return block.params.label || undefined;
		default:
			return block.params.label;
	}
}

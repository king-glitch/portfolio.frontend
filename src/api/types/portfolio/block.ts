import type {
	BlockType,
	MediaFit,
	MediaTone,
} from "@/api/types/portfolio/enums";

interface BlockBase<T extends BlockType, P> {
	type: T;
	params: P;
}

/** One image of a project page. `width`/`height` are intrinsic pixels (they reserve the box). */
export interface MediaAsset {
	url: string;
	alt: string;
	caption?: string;
	width?: number;
	height?: number;
	fit: MediaFit;
	tone: MediaTone;
}

export interface ArchitectureNode {
	name: string;
	description: string;
}

export interface ChallengeItem {
	problem: string;
	approach?: string;
}

/**
 * Header, overview, contributions and links carry only their labels: their content is the
 * project's own fields (`name`, `about`, `role`, `links` …), so it is written once.
 */
export type Block =
	| BlockBase<BlockType.ProjectHeader, { tagline: string }>
	| BlockBase<BlockType.Overview, { label: string }>
	| BlockBase<
			BlockType.Filmstrip,
			{ label: string; caption?: string; items: MediaAsset[] }
	  >
	| BlockBase<BlockType.Showcase, MediaAsset & { label?: string }>
	| BlockBase<BlockType.Contributions, { label: string }>
	| BlockBase<
			BlockType.Architecture,
			{ label: string; nodes: ArchitectureNode[] }
	  >
	| BlockBase<BlockType.Challenge, { label: string; items: ChallengeItem[] }>
	| BlockBase<BlockType.Statement, { text: string }>
	| BlockBase<BlockType.FeatureGrid, { label: string; items: string[] }>
	| BlockBase<
			BlockType.Lineage,
			{
				label: string;
				from: string;
				/** Project id of `from`, when it is one of the listed projects. */
				fromId?: string;
				to: string;
				text: string;
			}
	  >
	| BlockBase<BlockType.Links, { label: string }>;

/** Params of one block type, e.g. `BlockProps<BlockType.Statement>`. */
export type BlockProps<T extends BlockType> = Extract<
	Block,
	{ type: T }
>["params"];

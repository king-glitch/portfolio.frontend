import type {
	BlockTone,
	BlockType,
	DeviceView,
	HeaderVariant,
	MockScreen,
	MotifKind,
	ProjectSide,
} from "@/api/types/portfolio/enums";

interface BlockBase<T extends BlockType, P> {
	type: T;
	params: P;
}

export interface MediaItem {
	kind: MotifKind;
	screen: MockScreen;
	view: DeviceView;
	caption: string;
	imageUrl?: string;
}

export interface ArchitectureNode {
	name: string;
	description: string;
}

export type Block =
	| BlockBase<
			BlockType.ProjectHeader,
			{
				variant: HeaderVariant;
				title: string;
				subtitle: string;
				index: string;
				discipline: ProjectSide;
				tags: string[];
				kind: MotifKind;
			}
	  >
	| BlockBase<
			BlockType.Quote,
			{ text: string; cite: string; tone?: BlockTone }
	  >
	| BlockBase<
			BlockType.BigNumber,
			{ value: string; label: string; caption: string }
	  >
	| BlockBase<
			BlockType.AboutSplit,
			{ label: string; text: string; kind?: MotifKind; list?: string[] }
	  >
	| BlockBase<BlockType.NumberedList, { label: string; items: string[] }>
	| BlockBase<BlockType.StackCards, { label: string; items: string[] }>
	| BlockBase<BlockType.FeatureGrid, { label: string; items: string[] }>
	| BlockBase<BlockType.Timeline, { label: string; items: string[] }>
	| BlockBase<BlockType.Zigzag, { label: string; items: string[] }>
	| BlockBase<BlockType.MotifFull, { kind: MotifKind; label?: string }>
	| BlockBase<
			BlockType.Chips,
			{ label: string; title: string; text: string; items: string[] }
	  >
	| BlockBase<BlockType.Mock, MediaItem & { label: string }>
	| BlockBase<
			BlockType.Gallery,
			{ label: string; items: MediaItem[]; caption: string }
	  >
	| BlockBase<
			BlockType.Architecture,
			{ label: string; nodes: ArchitectureNode[] }
	  >
	| BlockBase<
			BlockType.Lineage,
			{ label: string; from: string; to: string; text: string }
	  >;

/** Params of one block type, e.g. `BlockProps<BlockType.Quote>`. */
export type BlockProps<T extends BlockType> = Extract<
	Block,
	{ type: T }
>["params"];

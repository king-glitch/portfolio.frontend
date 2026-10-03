import type { Block, MediaItem } from "@/api/types/portfolio/block";
import {
	BlockTone,
	BlockType,
	DeviceView,
	HeaderVariant,
	MockScreen,
	MotifKind,
} from "@/api/types/portfolio/enums";
import type { ParsedProject } from "./parse";

const MOCK_CAPTION = "Illustrative mock";

/** First sentence of a text (design/me-data.js first()). */
function first(s: string): string {
	return s.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? s;
}

const last = (a: string[]) => a[a.length - 1] ?? "";

const nodes = (...pairs: [string, string][]) =>
	pairs.map(([name, description]) => ({ name, description }));

const media = (
	kind: MotifKind,
	screen: MockScreen,
	view: DeviceView,
	caption: string,
): MediaItem => ({ kind, screen, view, caption });

function header(p: ParsedProject, variant: HeaderVariant): Block {
	return {
		type: BlockType.ProjectHeader,
		params: {
			variant,
			title: p.name,
			subtitle: p.full,
			index: p.num,
			discipline: p.side,
			tags: p.tags,
			kind: p.kind,
		},
	};
}

/** Per-project page layout: the same `[{ type, params }]` a backend would send (design/me-data.js layout()). */
export function layoutBlocks(p: ParsedProject): Block[] {
	const aboutFirst = first(p.about);
	switch (p.kind) {
		case MotifKind.Radar:
			return [
				header(p, HeaderVariant.Split),
				{
					type: BlockType.Quote,
					params: { text: aboutFirst, cite: "Brief" },
				},
				{
					type: BlockType.Mock,
					params: {
						label: "Operator console",
						...media(
							MotifKind.Radar,
							MockScreen.Main,
							DeviceView.Desktop,
							MOCK_CAPTION,
						),
					},
				},
				{
					type: BlockType.Architecture,
					params: {
						label: "How it works",
						nodes: nodes(
							["Surveillance radars", "Encoded track messages"],
							["Decoder", "TRML · DR127ADV → readable"],
							[
								"Node.js socket server",
								"Real-time state, both ways",
							],
							["Operator UI", "Map, voice, messaging, alerts"],
						),
					},
				},
				{
					type: BlockType.FeatureGrid,
					params: { label: "What it does", items: p.features },
				},
				{
					type: BlockType.Timeline,
					params: { label: "What I did", items: p.role },
				},
				{
					type: BlockType.Zigzag,
					params: { label: "What was hard", items: p.challenges },
				},
			];
		case MotifKind.Moon:
			return [
				header(p, HeaderVariant.Center),
				{
					type: BlockType.AboutSplit,
					params: {
						label: "About",
						text: p.about,
						kind: MotifKind.Moon,
					},
				},
				{
					type: BlockType.Mock,
					params: {
						label: "Farm & shop",
						...media(
							MotifKind.Moon,
							MockScreen.Main,
							DeviceView.Desktop,
							MOCK_CAPTION,
						),
					},
				},
				{
					type: BlockType.StackCards,
					params: { label: "What I did", items: p.role },
				},
				{
					type: BlockType.Architecture,
					params: {
						label: "How it works",
						nodes: nodes(
							["Game client", "3D farming game"],
							["Game server", "Shop, resource spawning"],
							["Smart contracts", "Solidity — DeFi, NFTs"],
						),
					},
				},
				{
					type: BlockType.Quote,
					params: {
						text: last(p.challenges),
						cite: "Hardest part",
						tone: BlockTone.Invert,
					},
				},
				{
					type: BlockType.NumberedList,
					params: { label: "What was hard", items: p.challenges },
				},
			];
		case MotifKind.Pixel:
			return [
				header(p, HeaderVariant.Vertical),
				{
					type: BlockType.Chips,
					params: {
						label: "The brief",
						title: "Rebuilt.",
						text: "The whole server side, rebuilt for mobile and for global players on the Soneium chain.",
						items: ["Golang", "MongoDB", "Solidity", "Soneium"],
					},
				},
				{
					type: BlockType.Lineage,
					params: {
						label: "Lineage",
						from: "Morning Moon Village",
						fromId: "morning-moon-village",
						to: "Morning Moon Pocket",
						text: "Same farming loop, new pocket-sized client, a rebuilt server side and rewritten contracts underneath.",
					},
				},
				{
					type: BlockType.Gallery,
					params: {
						label: "Screens",
						items: [
							media(
								MotifKind.Pixel,
								MockScreen.Main,
								DeviceView.Phone,
								"Farm",
							),
							media(
								MotifKind.Pixel,
								MockScreen.Alt,
								DeviceView.Phone,
								"Missions",
							),
						],
						caption: MOCK_CAPTION,
					},
				},
				{
					type: BlockType.NumberedList,
					params: { label: "What I did", items: p.role },
				},
				{
					type: BlockType.Architecture,
					params: {
						label: "How it works",
						nodes: nodes(
							["Mobile client", "Pocket-sized farm"],
							["Go services", "Shop, missions, more"],
							["MongoDB", "Players and progress"],
							["Solidity on Soneium", "Rewritten DeFi contracts"],
						),
					},
				},
				{
					type: BlockType.StackCards,
					params: { label: "What was hard", items: p.challenges },
				},
			];
		case MotifKind.Hex:
			return [
				header(p, HeaderVariant.Outline),
				{
					type: BlockType.AboutSplit,
					params: {
						label: "About",
						text: p.about,
						kind: MotifKind.Hex,
					},
				},
				{
					type: BlockType.Gallery,
					params: {
						label: "Screens",
						items: [
							media(
								MotifKind.Hex,
								MockScreen.Main,
								DeviceView.Desktop,
								"Capture",
							),
							media(
								MotifKind.Hex,
								MockScreen.Alt,
								DeviceView.Desktop,
								"Bridge website",
							),
						],
						caption: MOCK_CAPTION,
					},
				},
				{
					type: BlockType.Architecture,
					params: {
						label: "How it works",
						nodes: nodes(
							["Game client", "Explore, capture, train"],
							["Socket server", "Real-time, many players"],
							["Shared MongoDB", "One state for sockets and API"],
							["Core mechanics", "Capture & training system"],
							[
								"Bridge site + backend",
								"Game items ↔ chain assets",
							],
							["Smart contracts", "Solidity — DeFi, NFTs"],
						),
					},
				},
				{
					type: BlockType.Timeline,
					params: { label: "What I did", items: p.role },
				},
				{
					type: BlockType.Zigzag,
					params: { label: "What was hard", items: p.challenges },
				},
			];
		case MotifKind.Orbit:
			return [
				header(p, HeaderVariant.Center),
				{
					type: BlockType.Chips,
					params: {
						label: "About",
						title: "$EVM",
						text: p.about,
						items: [
							"Monthly quests",
							"Social tasks",
							"Moon Power XP",
							"NFT rewards",
						],
					},
				},
				{
					type: BlockType.Mock,
					params: {
						label: "Quest board",
						...media(
							MotifKind.Orbit,
							MockScreen.Main,
							DeviceView.Desktop,
							MOCK_CAPTION,
						),
					},
				},
				{
					type: BlockType.Quote,
					params: { text: p.role[0] ?? "", cite: "What I did" },
				},
				{
					type: BlockType.Architecture,
					params: {
						label: "How it works",
						nodes: nodes(
							["Platform", "Tasks and activities"],
							["Mission system", "Quests, social tasks, XP"],
							["Rewards", "$EVM tokens, NFTs"],
						),
					},
				},
				{
					type: BlockType.Quote,
					params: {
						text: p.challenges[0] ?? "",
						cite: "Challenge",
						tone: BlockTone.Invert,
					},
				},
			];
		case MotifKind.Pins: {
			const featureText = p.about.match(
				/features such as (.+?)\.?$/i,
			)?.[1];
			const feats = featureText
				? featureText
						.replace(/,?\s+and\s+/, ", ")
						.split(/,\s*/)
						.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
				: [];
			return [
				header(p, HeaderVariant.SplitRev),
				{
					type: BlockType.Gallery,
					params: {
						label: "Screens",
						items: [
							media(
								MotifKind.Pins,
								MockScreen.Main,
								DeviceView.Desktop,
								"Map search",
							),
							media(
								MotifKind.Pins,
								MockScreen.Alt,
								DeviceView.Phone,
								"Conversation",
							),
						],
						caption: MOCK_CAPTION,
					},
				},
				{
					type: BlockType.AboutSplit,
					params: {
						label: "About",
						text: `${aboutFirst} ${p.about.split(". ")[1] ?? ""}`,
						list: feats,
					},
				},
				{
					type: BlockType.StackCards,
					params: { label: "What I did", items: p.role },
				},
				{
					type: BlockType.NumberedList,
					params: { label: "What was hard", items: p.challenges },
				},
			];
		}
	}
}

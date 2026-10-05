import type { Block, MediaAsset } from "@/api/types/portfolio/block";
import {
	BlockType,
	MediaFit,
	MediaTone,
	MotifKind,
	ProjectLifecycle,
	ProjectSide,
} from "@/api/types/portfolio/enums";
import type { ProjectLink } from "@/api/types/portfolio/project";
import { CATEGORY_SLUGS, type ParsedProject } from "./parse";

/** Everything about a project page that is not prose in content/ME.md. */
export interface ProjectPage {
	side: ProjectSide;
	categories: string[];
	tags: string[];
	stack: string[];
	artUrl?: string;
	position: string;
	period: string;
	team: string;
	lifecycle: ProjectLifecycle;
	platforms: string[];
	chains: string[];
	links: ProjectLink[];
	blocks: Block[];
}

/** Images ship with the site under public/projects/<slug>/ (sizes measured when they were exported). */
function image(
	slug: string,
	file: string,
	[width, height]: [number, number],
	alt: string,
	caption: string,
	fit = MediaFit.Cover,
	tone = MediaTone.Photo,
): MediaAsset {
	return {
		url: `/projects/${slug}/${file}`,
		alt,
		caption,
		width,
		height,
		fit,
		tone,
	};
}

const header = (tagline: string): Block => ({
	type: BlockType.ProjectHeader,
	params: { tagline },
});
const overview: Block = {
	type: BlockType.Overview,
	params: { label: "Overview" },
};
const built: Block = {
	type: BlockType.Contributions,
	params: { label: "What I built" },
};
const links: Block = { type: BlockType.Links, params: { label: "See it" } };
const statement = (text: string): Block => ({
	type: BlockType.Statement,
	params: { text },
});
const nodes = (...pairs: [string, string][]): Block => ({
	type: BlockType.Architecture,
	params: {
		label: "How it works",
		nodes: pairs.map(([name, description]) => ({ name, description })),
	},
});
const hard = (...items: [string, string][]): Block => ({
	type: BlockType.Challenge,
	params: {
		label: "The hard part",
		items: items.map(([problem, approach]) => ({ problem, approach })),
	},
});
const strip = (label: string, caption: string, items: MediaAsset[]): Block => ({
	type: BlockType.Filmstrip,
	params: { label, caption, items },
});
const feature = (label: string, asset: MediaAsset): Block => ({
	type: BlockType.Showcase,
	params: { label, ...asset },
});

const GAMES_ON_CHAIN = [CATEGORY_SLUGS.games, CATEGORY_SLUGS.onChain];
const X10 = "X10 Interactive";
const SOFTWARE_ENGINEER = "Software Engineer";

const POCKET = "morning-moon-pocket";
const METAL = "metal-valley";
const EVERMOON = "evermoon-socialfi";
const VILLAGE = "morning-moon-village";
const AADS = "aads";

const PAGES: Record<MotifKind, ProjectPage> = {
	[MotifKind.Pixel]: {
		side: ProjectSide.BehindTheScenes,
		categories: GAMES_ON_CHAIN,
		tags: ["Golang", "MongoDB", "Solidity", "Soneium", "Mini app"],
		stack: ["golang", "mongodb", "solidity", "soneium"],
		artUrl: `/projects/${POCKET}/cover.webp`,
		position: SOFTWARE_ENGINEER,
		period: "9 months",
		team: X10,
		lifecycle: ProjectLifecycle.Live,
		platforms: ["Startale App mini app", "Web browser"],
		chains: ["Soneium"],
		links: [
			{
				label: "morningmoonpocket.com",
				url: "https://morningmoonpocket.com",
			},
			{ label: "@MMPgame on X", url: "https://x.com/MMPgame" },
		],
		blocks: [
			header("The farm, rebuilt for phones."),
			overview,
			strip("Screens", "Real captures from the live mini app", [
				image(
					POCKET,
					"farm.webp",
					[925, 1190],
					"A farmhouse with barrels and a tomato patch",
					"Your farm",
					MediaFit.Cover,
					MediaTone.Ui,
				),
				image(
					POCKET,
					"crops.webp",
					[970, 1910],
					"Farm management panel for a tomato plot",
					"Farm management",
					MediaFit.Cover,
					MediaTone.Ui,
				),
				image(
					POCKET,
					"gather.webp",
					[960, 1860],
					"A player chopping a tree in the forest",
					"Gathering",
					MediaFit.Cover,
					MediaTone.Ui,
				),
				image(
					POCKET,
					"shop.webp",
					[970, 1420],
					"The Mayor's shop with potions, soups and tools",
					"The shop I built",
					MediaFit.Cover,
					MediaTone.Ui,
				),
			]),
			built,
			nodes(
				["Mini app", "Startale App and the browser"],
				["Go services", "Farm loop, shop, missions"],
				["MongoDB", "New schema for players and items"],
				["Soneium", "Solidity contracts for yield and items"],
			),
			hard([
				"More players, the same feel, and a short deadline.",
				"Ported feature by feature onto the new schema, with the old behaviour as the spec, agreed with the client team before each switch. The farm plays the same on new plumbing.",
			]),
			statement("Same farm. New plumbing."),
			feature(
				"The logo",
				image(
					POCKET,
					"logo.webp",
					[711, 667],
					"Morning Moon Pocket logo",
					"Morning Moon Pocket",
					MediaFit.Contain,
				),
			),
			{
				type: BlockType.Lineage,
				params: {
					label: "Lineage",
					from: "Morning Moon Village",
					fromId: "morning-moon-village",
					to: "Morning Moon Pocket",
					text: "Same farming loop, a pocket-sized client, and a server side rewritten from the ground up.",
				},
			},
			links,
		],
	},
	[MotifKind.Hex]: {
		side: ProjectSide.BehindTheScenes,
		categories: GAMES_ON_CHAIN,
		tags: ["Golang", "WebSocket", "MongoDB", "Solidity", "Bridge"],
		stack: ["golang", "websocket", "mongodb", "solidity", "bitkub"],
		artUrl: `/projects/${METAL}/cover.webp`,
		position: SOFTWARE_ENGINEER,
		period: "2 years",
		team: X10,
		lifecycle: ProjectLifecycle.Live,
		platforms: ["Windows", "Android", "iOS"],
		chains: ["Bitkub Chain"],
		links: [
			{
				label: "metalvalleygame.com",
				url: "https://metalvalleygame.com",
			},
			{ label: "x10.games", url: "https://x10.games" },
		],
		blocks: [
			header("Mech hunters, on-chain."),
			overview,
			feature(
				"The world",
				image(
					METAL,
					"city.webp",
					[2559, 960],
					"A purple robot chasing a hunter through a city street",
					"Hunts run from the archipelago into the city",
				),
			),
			built,
			nodes(
				["Game client", "Explore, capture, train"],
				["Socket server", "Go, real-time, many players"],
				["API server", "Go, accounts and inventory"],
				["MongoDB", "One shared state for both servers"],
				["Bridge", "Game items to chain assets and back"],
			),
			strip("Screens", "In-game captures", [
				image(
					METAL,
					"coast.webp",
					[1920, 1080],
					"Hunters with their mechs on a sunny coast",
					"The coast",
				),
				image(
					METAL,
					"lake.webp",
					[1700, 955],
					"A hunter on a raft in a glowing lake",
					"The lake",
				),
				image(
					METAL,
					"meadow.webp",
					[1700, 955],
					"A hunter resting in a meadow beside a robot",
					"Downtime",
				),
				image(
					METAL,
					"flight.webp",
					[2556, 957],
					"A green mech flying over a floating island",
					"Flight",
				),
			]),
			hard(
				[
					"Real-time sockets for many players at once, without opening holes.",
					"The socket server owns the state and clients only send intent, so it stays fast, authoritative and hard to cheat.",
				],
				[
					"The socket server and the API server must agree on the game state.",
					"Both read and write the same MongoDB: one source of truth, no sync protocol to break.",
				],
				[
					"Moving items between a game database and a chain.",
					"The bridge backend checks ownership on both sides before it mints or releases anything.",
				],
			),
			statement("Two servers. One truth."),
			feature(
				"The hunters",
				image(
					METAL,
					"hunters.webp",
					[1541, 1600],
					"A hunter with a hammer and three robot companions",
					"A hunter and the Autometa he caught",
					MediaFit.Contain,
				),
			),
			links,
		],
	},
	[MotifKind.Orbit]: {
		side: ProjectSide.BehindTheScenes,
		categories: [CATEGORY_SLUGS.platforms, CATEGORY_SLUGS.onChain],
		tags: ["Golang", "MongoDB", "Quest engine", "SocialFi"],
		stack: ["golang", "mongodb"],
		artUrl: `/projects/${EVERMOON}/cover.webp`,
		position: "Backend developer",
		period: "2 months",
		team: "Evermoon",
		lifecycle: ProjectLifecycle.Ended,
		platforms: ["Web"],
		chains: [],
		links: [{ label: "evermoon.games", url: "https://evermoon.games" }],
		blocks: [
			header("Quests, Moon Power, two months."),
			overview,
			feature(
				"The mascot",
				image(
					EVERMOON,
					"axolt.webp",
					[1381, 1600],
					"Axolt, Evermoon's pink axolotl mascot",
					"Axolt, who handed out the quests",
					MediaFit.Contain,
				),
			),
			built,
			nodes(
				["Portal", "Quests, tasks, rewards"],
				["Quest engine", "Go: monthly quests, social-task checks"],
				["MongoDB", "Progress and Moon Power"],
			),
			hard([
				"Two months, many quest types, and a client team building at the same time.",
				"One general quest model with many task kinds, and test cases agreed with the client team up front. It shipped on time for the season.",
			]),
			statement("Two months. One engine. Many quests."),
			feature(
				"The reward",
				image(
					EVERMOON,
					"moon-chest.webp",
					[1920, 1080],
					"A glowing capsule in a ring of light",
					"The Moon Chest that quests filled up",
				),
			),
			links,
		],
	},
	[MotifKind.Pins]: {
		side: ProjectSide.OnScreen,
		categories: [CATEGORY_SLUGS.platforms],
		tags: ["React", "TypeScript", "Leaflet", "Maps", "AI search"],
		stack: ["react", "typescript", "leaflet"],
		position: "Frontend developer (freelance)",
		period: "1 year",
		team: "Tetragram",
		lifecycle: ProjectLifecycle.Live,
		platforms: ["Web"],
		chains: [],
		links: [{ label: "estic.ai", url: "https://estic.ai" }],
		blocks: [
			header("Find a home by talking."),
			overview,
			built,
			hard(
				[
					"4,000+ pins on one map when you zoom all the way out.",
					"The map asks the search API only for pins inside the current view and clusters them on the client (Leaflet + markercluster). Zoom in and it drops to about 1,000.",
				],
				[
					"A new product with new patterns.",
					"Laid the UI groundwork first, so features plug in instead of piling up.",
				],
			),
			statement("4,000 pins. One smooth map."),
			nodes(
				["Map and chat", "React, TypeScript, Leaflet"],
				["Search API", "AI search over listings"],
				["Data", "Homes, livability, climate risk"],
			),
			links,
		],
	},
	[MotifKind.Moon]: {
		side: ProjectSide.BehindTheScenes,
		categories: GAMES_ON_CHAIN,
		tags: ["Golang", "MongoDB", "Solidity", "DeFi", "NFTs"],
		stack: ["golang", "mongodb", "solidity", "bitkub"],
		artUrl: `/projects/${VILLAGE}/cover.webp`,
		position: SOFTWARE_ENGINEER,
		period: "~3 years",
		team: X10,
		lifecycle: ProjectLifecycle.Live,
		platforms: ["Web (3D)"],
		chains: ["Bitkub Chain"],
		links: [
			{
				label: "morningmoonvillage.com",
				url: "https://morningmoonvillage.com",
			},
		],
		blocks: [
			header("Farming meets DeFi."),
			overview,
			strip("Screens", "In-game captures", [
				image(
					VILLAGE,
					"screen-1.webp",
					[1280, 720],
					"A farm with crops beside a red-roofed house",
					"Home farm",
					MediaFit.Cover,
					MediaTone.Ui,
				),
				image(
					VILLAGE,
					"screen-2.webp",
					[1280, 720],
					"Farm management with a cow pen",
					"Farm management",
					MediaFit.Cover,
					MediaTone.Ui,
				),
				image(
					VILLAGE,
					"screen-6.webp",
					[1280, 720],
					"A crowd of players in the town square",
					"The town square",
					MediaFit.Cover,
					MediaTone.Ui,
				),
				image(
					VILLAGE,
					"marketplace.webp",
					[1280, 720],
					"The NFT marketplace page",
					"The marketplace",
					MediaFit.Cover,
					MediaTone.Ui,
				),
			]),
			built,
			nodes(
				["Game client", "3D farming and exploring"],
				["Go game server", "Shop, resource spawning"],
				["MongoDB", "Players, items, farms"],
				["Bitkub Chain", "Solidity: DeFi and NFTs"],
			),
			hard(
				[
					"Five years of server code written by other people.",
					"Read it until new features fit its grain instead of fighting it, then shipped new systems without breaking a live economy.",
				],
				[
					"Real value moves through NFTs and DeFi.",
					"Tested how each feature works and how it could be abused, before every release.",
				],
				[
					"Server features had to land in step with the client team.",
					"Agreed the contract between server and client first, then built to it.",
				],
			),
			statement(
				"Reading five years of someone else's code is a skill. I have it now.",
			),
			feature(
				"The hunters",
				image(
					VILLAGE,
					"hunting.webp",
					[821, 503],
					"Three villagers ready to hunt with a snake on a shoulder",
					"Into the wild zone",
					MediaFit.Contain,
				),
			),
			links,
		],
	},
	[MotifKind.Radar]: {
		side: ProjectSide.BehindTheScenes,
		categories: [CATEGORY_SLUGS.platforms],
		tags: [
			"TypeScript",
			"Node.js",
			"Electron",
			"Socket.io",
			"Radar protocols",
		],
		stack: ["typescript", "node.js", "electron", "socket.io", "mysql"],
		artUrl: `/projects/${AADS}/operator-console.webp`,
		position: "Full-stack developer (intern)",
		period: "Jun 2022 – Jun 2023",
		team: "Bangkok University research lab",
		lifecycle: ProjectLifecycle.Research,
		platforms: ["Desktop"],
		chains: [],
		links: [],
		blocks: [
			header("Radar, decoded."),
			overview,
			feature(
				"Operator console",
				image(
					AADS,
					"operator-console.webp",
					[1280, 724],
					"Dark map of Thailand with radar rings and aircraft tracks",
					"The operator map: radar coverage rings and live tracks",
					MediaFit.Cover,
					MediaTone.Ui,
				),
			),
			{
				type: BlockType.FeatureGrid,
				params: { label: "What it does", items: [] },
			},
			built,
			nodes(
				["Radars", "TRML and DR127ADV feeds"],
				["Decoder", "One thread per radar"],
				["Socket.io", "Tracks and controls, both ways"],
				["Operator consoles", "Map, alerts, voice, messages"],
				["MySQL", "Sites, settings, history"],
			),
			feature(
				"Server console",
				image(
					AADS,
					"server-console.webp",
					[998, 599],
					"Server log listing registered commands and radar threads",
					"The server I built, starting a thread per radar",
					MediaFit.Cover,
					MediaTone.Ui,
				),
			),
			hard(
				[
					"Dense binary protocols, and the data never stops.",
					"A streaming decoder per radar on its own thread, so every feed decodes exactly and on time.",
				],
				[
					"The socket link must stay private.",
					"IP-based access in front of every console connection.",
				],
			),
			statement("Binary in. Air picture out."),
		],
	},
};

/** The page of a project: its facts and blocks. AADS' "What it does" grid takes the ME.md features. */
export function pageFor(p: ParsedProject): ProjectPage {
	const page = PAGES[p.kind];
	return {
		...page,
		blocks: page.blocks.map((block) =>
			block.type === BlockType.FeatureGrid
				? { ...block, params: { ...block.params, items: p.features } }
				: block,
		),
	};
}

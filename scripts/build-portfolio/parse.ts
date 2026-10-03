import {
	ExperienceKind,
	MotifKind,
	ProjectFilter,
	ProjectSide,
} from "@/api/types/portfolio/enums";
import type {
	CoreSkill,
	Experience,
	SkillGroup,
} from "@/api/types/portfolio/profile";
import { padNum, slugify } from "@/lib/portfolio/ids";

/** Keyword -> tag label, in prototype order (design/me-data.js KW). */
const TAG_KEYWORDS: readonly (readonly [string, string])[] = [
	["Golang", "golang"],
	["MongoDB", "mongodb"],
	["Solidity", "solidity"],
	["Real-time", "socket"],
	["Radar protocols", "trml"],
	["Encryption", "encrypt"],
	["DeFi", "defi"],
	["NFTs", "nft"],
	["Web3", "web3"],
	["Soneium", "soneium"],
	["Missions", "mission system"],
	["In-game shop", "shop system"],
	["Generative AI", "generative ai"],
	["Maps", "map"],
];

/** Keywords of the "How a tap becomes a thing" stops (design/Main.dc.html ARCH). */
const STACK_STOP_KEYWORDS = [
	"client",
	"socket",
	"real-time",
	"golang",
	"server-side",
	"backend",
	"mongodb",
	"data",
	"solidity",
	"smart contract",
	"soneium",
	"blockchain",
	"on-chain",
];

export interface ParsedProject {
	title: string;
	about: string;
	role: string[];
	features: string[];
	challenges: string[];
	id: string;
	name: string;
	full: string;
	num: string;
	kind: MotifKind;
	hay: string;
	tags: string[];
	stack: string[];
	side: ProjectSide;
	categories: ProjectFilter[];
}

export interface ParsedMe {
	about: string;
	skills: SkillGroup[];
	core: CoreSkill[];
	experience: Experience[];
	education: Experience[];
	projects: ParsedProject[];
}

export function kindFor(title: string): MotifKind {
	const s = title.toLowerCase();
	if (s.includes("aads") || s.includes("defense")) return MotifKind.Radar;
	if (s.includes("pocket")) return MotifKind.Pixel;
	if (s.includes("village")) return MotifKind.Moon;
	if (s.includes("metal")) return MotifKind.Hex;
	if (s.includes("evermoon")) return MotifKind.Orbit;
	if (s.includes("estic")) return MotifKind.Pins;
	return MotifKind.Hex;
}

/** `All` is never stored; a project is a game or a platform, and may also be on-chain. */
export function categoriesFor(hay: string): ProjectFilter[] {
	const categories = [
		/ game/.test(hay) ? ProjectFilter.Games : ProjectFilter.Platforms,
	];
	if (/web3|solidity|nft|defi|blockchain/.test(hay))
		categories.push(ProjectFilter.OnChain);
	return categories;
}

const MONTHS = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec",
];

/** "June 2022" -> "2022-06"; "2023" -> "2023-01"; "Present" -> null. */
export function toYearMonth(text: string): string | null {
	if (/present/i.test(text)) return null;
	const year = text.match(/\d{4}/)?.[0] ?? "";
	const month = MONTHS.findIndex((m) =>
		text.trim().toLowerCase().startsWith(m),
	);
	return `${year}-${String(month >= 0 ? month + 1 : 1).padStart(2, "0")}`;
}

function parseEntry(
	title: string,
	period: string,
	kind: ExperienceKind,
): Experience {
	const [from = "", to] = period.split(" - ");
	return {
		id: slugify(title),
		title,
		period: period.replace(" - ", " — "),
		notes: [],
		kind,
		start: toYearMonth(from) ?? "",
		end: toYearMonth(to ?? from),
	};
}

type ListKey = "role" | "features" | "challenges";
const isListKey = (s: string): s is ListKey =>
	s === "role" || s === "features" || s === "challenges";

/** Word-start match: the prototype's plain substring test tagged "permission system" as Missions. */
export function hasKeyword(hay: string, key: string): boolean {
	return new RegExp(
		`\\b${key.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}`,
	).test(hay);
}

function derive(p: ParsedProject): void {
	const roleText = p.role.join(" ").toLowerCase();
	p.hay = [p.about, ...p.role, ...p.features, ...p.challenges]
		.join(" ")
		.toLowerCase();
	p.tags = TAG_KEYWORDS.filter(([, key]) => hasKeyword(p.hay, key))
		.map(([label]) => label)
		.slice(0, 5);
	const keys = [
		...TAG_KEYWORDS.map(([, key]) => key),
		...STACK_STOP_KEYWORDS,
	];
	p.stack = [...new Set(keys.filter((key) => hasKeyword(p.hay, key)))];
	p.side = roleText.includes("developed the client-side")
		? ProjectSide.OnScreen
		: ProjectSide.BehindTheScenes;
	p.categories = categoriesFor(p.hay);
}

export function parseMe(raw: string): ParsedMe {
	const out: ParsedMe = {
		about: "",
		skills: [],
		core: [],
		experience: [],
		education: [],
		projects: [],
	};
	let section = "";
	let project: ParsedProject | null = null;
	let sub = "";
	let entry: Experience | null = null;

	for (const rawLine of raw.split("\n")) {
		const line = rawLine.replace(/\s+$/, "");
		let m = line.match(/^## (.+)/);
		if (m?.[1]) {
			section = m[1].trim().toLowerCase();
			project = null;
			sub = "";
			entry = null;
			continue;
		}
		if (section === "projects") {
			m = line.match(/^\d+\.\s+\*\*(.+?)\*\*/);
			if (m?.[1]) {
				const title = m[1];
				const pm = title.match(/^(.+?)\s*\((.+)\)\s*$/);
				const name = pm?.[1] ?? title;
				project = {
					title,
					about: "",
					role: [],
					features: [],
					challenges: [],
					id: slugify(name),
					name,
					full: pm?.[2] ?? title,
					num: padNum(out.projects.length, 4),
					kind: kindFor(title),
					hay: "",
					tags: [],
					stack: [],
					side: ProjectSide.BehindTheScenes,
					categories: [],
				};
				out.projects.push(project);
				sub = "";
				continue;
			}
			m = line.match(/^#\s+(.+)/);
			if (m?.[1]) {
				sub = m[1].trim().toLowerCase();
				continue;
			}
			if (!project || !sub) continue;
			m = line.match(/^\s*-\s+(.+)/);
			if (m?.[1]) {
				if (isListKey(sub)) project[sub].push(m[1].trim());
				continue;
			}
			if (sub === "about" && line.trim())
				project.about += (project.about ? " " : "") + line.trim();
			continue;
		}
		if (section === "about me") {
			if (line.trim()) out.about += (out.about ? " " : "") + line.trim();
			continue;
		}
		if (section === "skills") {
			m = line.match(/^-\s+([^:]+):\s*(.+)/);
			if (m?.[1] && m[2])
				out.skills.push({
					label: m[1].trim(),
					items: m[2]
						.replace(/\.$/, "")
						.split(",")
						.map((s) => s.trim())
						.filter(Boolean),
				});
			continue;
		}
		if (section === "core skills") {
			m = line.match(/^-\s+([^:]+):\s*(.+)/);
			if (m?.[1] && m[2])
				out.core.push({ label: m[1].trim(), text: m[2].trim() });
			continue;
		}
		if (section === "experience" || section === "education") {
			m = line.match(/^-\s+\*\*(.+?)\*\*\s*\((.+?)\)/);
			if (m?.[1] && m[2]) {
				entry = parseEntry(
					m[1].trim(),
					m[2].trim(),
					section === "education"
						? ExperienceKind.Education
						: ExperienceKind.Work,
				);
				out[section].push(entry);
				continue;
			}
			m = line.match(/^\s+-\s+(.+)/);
			if (m?.[1] && entry) entry.notes.push(m[1].trim());
		}
	}

	out.projects.forEach(derive);
	return out;
}

import { ProjectFilter, ProjectSide } from "@/api/types/portfolio/enums";
import type { Experience, Profile } from "@/api/types/portfolio/profile";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { toFractionalYear, yearsSince } from "@/lib/portfolio/time";
import { topWords } from "@/lib/portfolio/word-freq";
import type { BarRow } from "@/types/about";

export interface AboutStats {
	total: number;
	behind: number;
	onChain: number;
	games: number;
	/** Employer of the current job ("X10 Interactive"). */
	employer: string;
	yearsInProduction: number;
	languages: string[];
	tools: string[];
	soft: string[];
	timeline: BarRow[];
	words: { word: string; pct: number }[];
}

const ROLE_PREFIX =
	/^(?:Software (?:Developer|Engineer)|Full-?stack Developer(?: Intern)?)\s*/i;

/** "Software Engineer X10 Interactive" -> { name: "X10 Interactive", role: "Software Engineer" }. */
export function splitRole(title: string): {
	name: string;
	role: string | null;
} {
	const role = title.match(ROLE_PREFIX)?.[0].trim() || null;
	return { name: title.replace(ROLE_PREFIX, ""), role };
}

/** First sentence of a text (up to . ! ?). */
export function firstSentence(text: string): string {
	return text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
}

/** Cut at a word boundary under `max` chars, with an ellipsis. */
export function clip(text: string, max: number): string {
	if (text.length <= max) return text;
	return `${text.slice(0, text.lastIndexOf(" ", max))}…`;
}

function currentJob(profile: Profile): Experience | undefined {
	return profile.experience.find((e) => e.end === null);
}

export function employerOf(profile: Profile): string {
	return currentJob(profile)?.title.replace(ROLE_PREFIX, "") ?? "";
}

function timelineLabel(title: string): string {
	return title
		.replace(ROLE_PREFIX, "")
		.replace(" Multimedia Intelligent Technology", " lab")
		.replace("Bangkok University lab", "University lab");
}

function timelineBars(profile: Profile, now: Date): BarRow[] {
	const nowY = now.getFullYear() + now.getMonth() / 12;
	const entries = [...profile.education, ...profile.experience]
		.map((e) => ({
			label: timelineLabel(e.title),
			a: toFractionalYear(e.start),
			b: e.end ? toFractionalYear(e.end) : nowY,
		}))
		.sort((x, y) => x.a - y.a);
	if (!entries.length) return [];
	const min = Math.floor(Math.min(...entries.map((e) => e.a)));
	const span = Math.max(1, nowY - min);
	return entries.map((e) => ({
		label: e.label,
		left: ((e.a - min) / span) * 100,
		width: Math.max(0.05, (e.b - e.a) / span) * 100,
	}));
}

/** Everything the wall and the resume count, derived at render. No baked numbers. */
export function buildAboutStats(
	profile: Profile,
	projects: ProjectSummary[],
	now: Date = new Date(),
): AboutStats {
	const job = currentJob(profile);
	// ponytail: skill groups by position (languages, frameworks, tools, soft); match by label if the source reorders
	const group = (i: number) => profile.skills[i]?.items ?? [];
	return {
		total: projects.length,
		behind: projects.filter((p) => p.side === ProjectSide.BehindTheScenes)
			.length,
		onChain: projects.filter((p) =>
			p.categories.includes(ProjectFilter.OnChain),
		).length,
		games: projects.filter((p) =>
			p.categories.includes(ProjectFilter.Games),
		).length,
		employer: employerOf(profile),
		yearsInProduction: job ? yearsSince(job.start, now) : 0,
		languages: group(0),
		tools: group(2),
		soft: group(3),
		timeline: timelineBars(profile, now),
		words: topWords(projects.flatMap((p) => [p.about, ...p.role])),
	};
}

const SKILL_LABELS: Record<string, string> = { Hardskills: "Strengths" };

/** Resume aside: skill groups as `label` + comma list ("Hardskills" reads "Strengths"). */
export function resumeSkills(profile: Profile) {
	return profile.skills.map((g) => ({
		label: SKILL_LABELS[g.label] ?? g.label,
		list: g.items.join(", "),
	}));
}

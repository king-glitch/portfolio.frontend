import type { ExperienceKind } from "@/api/types/portfolio/enums";
import type { Experience, Profile } from "@/api/types/portfolio/profile";
import { toFractionalYear } from "@/lib/portfolio/time";

export interface TimelineEntry {
	id: string;
	/** Compact title for the bar. */
	shortTitle: string;
	title: string;
	kind: ExperienceKind;
	period: string;
	notes: string[];
	/** Percent of the ruler. */
	leftPct: number;
	widthPct: number;
}

export interface TimelineTick {
	year: number;
	leftPct: number;
}

export interface TimelineModel {
	entries: TimelineEntry[];
	ticks: TimelineTick[];
	/** e.g. "2019—26". */
	spanLabel: string;
}

/** Bar label of the prototype: drops the "Software Developer" role prefix, shortens the lab name. */
export function shortTitle(title: string): string {
	return title
		.replace(/^Software Developer\s*/i, "")
		.replace(" Multimedia Intelligent Technology", " — MIT lab");
}

/**
 * Ruler model (design/Main.dc.html lines 1296-1303): education + experience sorted by start,
 * positioned by `(a - minYear) / span`. `end: null` means "now". Computed at render, never baked into fixtures.
 */
export function buildTimeline(
	profile: Pick<Profile, "experience" | "education">,
	now: Date = new Date(),
	minBarFraction = 0.06,
): TimelineModel {
	const year = now.getFullYear();
	const nowYear = year + now.getMonth() / 12;
	const dated = [...profile.education, ...profile.experience]
		.map((e: Experience) => ({
			e,
			a: toFractionalYear(e.start),
			b: e.end ? toFractionalYear(e.end) : nowYear,
		}))
		.sort((x, y) => x.a - y.a);
	const minYear = dated.length
		? Math.floor(Math.min(...dated.map((d) => d.a)))
		: year;
	const maxYear = Math.floor(nowYear) + 1;
	const span = maxYear - minYear;
	const entries = dated.map(({ e, a, b }) => ({
		id: e.id,
		shortTitle: shortTitle(e.title),
		title: e.title,
		kind: e.kind,
		period: e.period,
		notes: e.notes,
		leftPct: ((a - minYear) / span) * 100,
		widthPct: Math.max(minBarFraction, (b - a) / span) * 100,
	}));
	const ticks = Array.from({ length: span + 1 }, (_, i) => ({
		year: minYear + i,
		leftPct: (i / span) * 100,
	}));
	return {
		entries,
		ticks,
		spanLabel: `${minYear}—${String(year).slice(2)}`,
	};
}

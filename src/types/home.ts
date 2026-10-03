import type { ParseKeys } from "i18next";

/** The two layers of the spotlight section; also the `home.spotlight.<side>.*` i18n key segment. */
export enum SpotlightSide {
	See = "see",
	Reveal = "reveal",
}

/** Toolkit bubble look, chosen by the skill group index (0 solid, 1 outline, 2 muted, 3 ringed). */
export enum BubbleGroup {
	Solid = "solid",
	Outline = "outline",
	Muted = "muted",
	Ringed = "ringed",
}

/** Habit card look, cycled by card index. */
export enum HabitTone {
	Solid = "solid",
	Card = "card",
	Outline = "outline",
}

/** One stop of "How a tap becomes a thing": copy keys plus the keywords matched against `ProjectSummary.stack`. */
export interface StackStop {
	id: string;
	nameKey: ParseKeys;
	descriptionKey: ParseKeys;
	keywords: string[];
}

/** The three floating hero tags; also the `home.hero.tags.<tag>` i18n key segment. */
export enum HeroTag {
	Scalable = "scalable",
	Optimized = "optimized",
	Secure = "secure",
}

/** Vertical padding of a home section (the next/previous section supplies the other side). */
export enum HomePad {
	Top = "top",
	Bottom = "bottom",
	Both = "both",
}

/** Hero words of the owner-only dashboard gesture, clicked in this order before holding "behind". */
export enum SecretWord {
	Quiet = "quiet",
	Loud = "loud",
}

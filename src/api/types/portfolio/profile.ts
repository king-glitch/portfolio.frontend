import type { ExperienceKind } from "@/api/types/portfolio/enums";

export interface Experience {
	id: string;
	title: string;
	period: string;
	notes: string[];
	kind: ExperienceKind;
	/** "YYYY-MM" */
	start: string;
	/** "YYYY-MM", null = present */
	end: string | null;
}

export interface SkillGroup {
	label: string;
	items: string[];
}

export interface CoreSkill {
	label: string;
	text: string;
}

export interface Contact {
	email: string;
	github: string;
	linkedin: string;
}

export interface Profile {
	name: string;
	headline: string;
	about: string;
	skills: SkillGroup[];
	core: CoreSkill[];
	experience: Experience[];
	education: Experience[];
	contact: Contact;
}

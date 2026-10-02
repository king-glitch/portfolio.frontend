import { matchPath } from "react-router";
import type { ParseKeys } from "i18next";
import { config } from "@/config";
import { CompanionPlace } from "@/types/ui";

/** Which page the companion is on. */
export function companionPlace(pathname: string): CompanionPlace {
	const { routes } = config;
	if (matchPath(routes.project, pathname)) return CompanionPlace.Project;
	if (matchPath(routes.note, pathname)) return CompanionPlace.Note;
	if (matchPath(routes.notes, pathname)) return CompanionPlace.Notes;
	if (matchPath({ path: routes.about, end: false }, pathname))
		return CompanionPlace.About;
	return CompanionPlace.Home;
}

/** Lines per page, in order: the first greets on arrival, clicks step through the rest. */
export const COMPANION_LINES: Record<CompanionPlace, ParseKeys[]> = {
	[CompanionPlace.Home]: [
		"shell.companion.places.home.1",
		"shell.companion.places.home.2",
		"shell.companion.places.home.3",
		"shell.companion.places.home.4",
	],
	[CompanionPlace.Project]: [
		"shell.companion.places.project.1",
		"shell.companion.places.project.2",
		"shell.companion.places.project.3",
	],
	[CompanionPlace.Notes]: [
		"shell.companion.places.notes.1",
		"shell.companion.places.notes.2",
	],
	[CompanionPlace.Note]: [
		"shell.companion.places.note.1",
		"shell.companion.places.note.2",
	],
	[CompanionPlace.About]: [
		"shell.companion.places.about.1",
		"shell.companion.places.about.2",
	],
};

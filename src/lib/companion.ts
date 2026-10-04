import { matchPath } from "react-router";
import type { ParseKeys } from "i18next";
import { ContentStatus } from "@/api/types/admin/enums";
import { config } from "@/config";
import { CompanionEvent, CompanionPlace } from "@/types/ui";

/** Which page the companion is on. */
export function companionPlace(pathname: string): CompanionPlace {
	const { routes } = config;
	if (matchPath({ path: routes.dashboard, end: false }, pathname))
		return CompanionPlace.Dashboard;
	if (matchPath(routes.project, pathname)) return CompanionPlace.Project;
	if (matchPath(routes.note, pathname)) return CompanionPlace.Note;
	if (matchPath(routes.notes, pathname)) return CompanionPlace.Notes;
	if (matchPath(routes.gallery, pathname)) return CompanionPlace.Gallery;
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
	[CompanionPlace.Gallery]: [
		"shell.companion.places.gallery.1",
		"shell.companion.places.gallery.2",
	],
	[CompanionPlace.About]: [
		"shell.companion.places.about.1",
		"shell.companion.places.about.2",
	],
	[CompanionPlace.Dashboard]: [
		"shell.companion.places.dashboard.1",
		"shell.companion.places.dashboard.2",
		"shell.companion.places.dashboard.3",
		"shell.companion.places.dashboard.4",
	],
};

/** How hard Void flinches and what it says for each event (`null` = silent squash). */
export const COMPANION_EVENTS: Record<
	CompanionEvent,
	{ strength: number; key: ParseKeys | null }
> = {
	[CompanionEvent.Saved]: {
		strength: 6,
		key: "shell.companion.events.saved",
	},
	[CompanionEvent.Published]: {
		strength: 7,
		key: "shell.companion.events.published",
	},
	[CompanionEvent.Uploaded]: {
		strength: 6,
		key: "shell.companion.events.uploaded",
	},
	[CompanionEvent.Reordered]: {
		strength: 5,
		key: "shell.companion.events.reordered",
	},
	[CompanionEvent.Deleted]: {
		strength: 5,
		key: "shell.companion.events.deleted",
	},
	[CompanionEvent.Error]: {
		strength: 9,
		key: "shell.companion.events.error",
	},
	[CompanionEvent.Anticipate]: { strength: 9, key: null },
};

const isCompanionEvent = (value: unknown): value is CompanionEvent =>
	Object.values(CompanionEvent).some((event) => event === value);

/** True when a save request puts the item live. */
const publishes = (variables: unknown): boolean =>
	typeof variables === "object" &&
	variables !== null &&
	"status" in variables &&
	variables.status === ContentStatus.Published;

/**
 * The event a succeeded mutation shows, from its `meta` (see `config.companion.metaKey`);
 * a save that publishes becomes Published. Undefined = Void stays quiet.
 */
export function companionEventOf(
	meta: Record<string, unknown> | undefined,
	variables: unknown,
): CompanionEvent | undefined {
	const named = meta?.[config.companion.metaKey];
	if (!isCompanionEvent(named)) return undefined;
	if (named === CompanionEvent.Saved && publishes(variables))
		return CompanionEvent.Published;
	return named;
}

type CompanionListener = (event: CompanionEvent) => void;
const listeners = new Set<CompanionListener>();

/** Tells Void something happened from outside React (the mutation cache). No listener = nobody hears it. */
export const announceCompanion: CompanionListener = (event) => {
	for (const listener of listeners) listener(event);
};

/** Listens for `announceCompanion`; returns the unsubscribe. */
export function onCompanion(listener: CompanionListener): () => void {
	listeners.add(listener);
	return () => void listeners.delete(listener);
}

import type { ParseKeys } from "i18next";
import { MotifKind } from "@/api/types/portfolio/enums";
import { config } from "@/config";

export interface MenuPage {
	id: string;
	titleKey: ParseKeys;
	subKey: ParseKeys;
	/** Motif shown in the preview card while this page is hovered. */
	kind: MotifKind;
	/** Route to open. Omit for in-page targets (`section`). */
	to?: string;
	/** Home section id to scroll to (navigates home first elsewhere). */
	section?: string;
	isCurrent: (pathname: string) => boolean;
}

const never = () => false;

export const MENU_PAGES: MenuPage[] = [
	{
		id: "home",
		titleKey: "shell.menu.pages.home.title",
		subKey: "shell.menu.pages.home.sub",
		kind: MotifKind.Orbit,
		section: config.sections.top,
		isCurrent: (pathname) => pathname === config.routes.home,
	},
	{
		id: "work",
		titleKey: "shell.menu.pages.work.title",
		subKey: "shell.menu.pages.work.sub",
		kind: MotifKind.Hex,
		section: config.sections.work,
		isCurrent: never,
	},
	{
		id: "about",
		titleKey: "shell.menu.pages.about.title",
		subKey: "shell.menu.pages.about.sub",
		kind: MotifKind.Radar,
		to: config.routes.about,
		isCurrent: (pathname) => pathname.startsWith(config.routes.about),
	},
	{
		id: "notes",
		titleKey: "shell.menu.pages.notes.title",
		subKey: "shell.menu.pages.notes.sub",
		kind: MotifKind.Pins,
		to: config.routes.notes,
		isCurrent: (pathname) => pathname.startsWith(config.routes.notes),
	},
	{
		id: "contact",
		titleKey: "shell.menu.pages.contact.title",
		subKey: "shell.menu.pages.contact.sub",
		kind: MotifKind.Moon,
		section: config.sections.contact,
		isCurrent: never,
	},
];

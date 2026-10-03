import type { ParseKeys } from "i18next";
import type { MotifKind } from "@/api/types/portfolio/enums";
import type { Contact, Profile } from "@/api/types/portfolio/profile";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import type { AboutStats } from "@/lib/portfolio/about-stats";
import type { CursorLabel } from "@/types/cursor";

export enum AboutTileKind {
	Mock = "mock",
	Stat = "stat",
	Words = "words",
	Icon = "icon",
	Timeline = "timeline",
	Mono = "mono",
	Chat = "chat",
	Motif = "motif",
	Chips = "chips",
	Donut = "donut",
	Hero = "hero",
	Tall = "tall",
	Habits = "habits",
	Bars = "bars",
	Soft = "soft",
	Hello = "hello",
}

export enum TileTone {
	Card = "card",
	Invert = "invert",
}

export enum TileIcon {
	Socket = "socket",
	Education = "education",
	Gamepad = "gamepad",
	Notes = "notes",
}

/** One grid cell of the 10x7 wall (static layout, no data). */
export interface WallCell {
	id: string;
	col: number;
	row: number;
	cols: number;
	rows: number;
	kind: AboutTileKind;
	tone?: TileTone;
}

export interface BarRow {
	label: string;
	/** Percent strings are built at render; these are 0..100. */
	left: number;
	width: number;
}

export type TileValues = Record<string, string | number>;

export interface TileLink {
	to: string;
	labelKey: ParseKeys;
	labelValues?: TileValues;
	cursor: CursorLabel;
}

/** Everything a tile may show, derived from Profile + ProjectSummary[] at render. */
export interface TileData {
	/** Raw data text (a project name). */
	caption?: string;
	captionKey?: ParseKeys;
	captionValues?: TileValues;
	eyebrowKey?: ParseKeys;
	value?: string;
	valueKey?: ParseKeys;
	unit?: string;
	motif?: MotifKind;
	/** Uploaded art of the project behind `motif`. */
	motifUrl?: string;
	art?: MotifKind;
	icon?: TileIcon;
	iconTone?: TileTone;
	mono?: string;
	items?: string[];
	/** 0..1 */
	ratio?: number;
	bars?: BarRow[];
	contact?: Contact;
	title?: string;
	unitKey?: ParseKeys;
	link?: TileLink;
}

export interface WallTile extends WallCell {
	tone: TileTone;
	data: TileData;
}

export interface WallBuildContext {
	profile: Profile;
	projects: ProjectSummary[];
	stats: AboutStats;
	/** null until the posts query has data. */
	notesCount: number | null;
}

export interface TileProps {
	data: TileData;
}

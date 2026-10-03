import type { ProjectSummary } from "@/api/types/portfolio/project";

export enum PillVariant {
	/** Filled with the foreground colour (prototype `--pill`). */
	Solid = "solid",
	/** Hairline ring (`--border`); inverts on hover (prototype `.tap`). */
	Outline = "outline",
	/** Foreground ring; inverts on hover. */
	Strong = "strong",
	/** Neutral grey ring that reads on any surface (menu chips). */
	Muted = "muted",
	/** No chrome, no hover fill (nav links, text actions). */
	Ghost = "ghost",
	/** Filled with the background colour (close button on the inverted menu). */
	Invert = "invert",
}

export enum ArtFit {
	Meet = "meet",
	Slice = "slice",
}

/** Pill heights from the prototype: sm 40, md 44, lg 48, xl 64. */
export enum PillSize {
	Sm = "sm",
	Md = "md",
	Lg = "lg",
	Xl = "xl",
}

export enum DisplayVariant {
	Hero = "hero",
	Section = "section",
	Habits = "habits",
	Contact = "contact",
	Notes = "notes",
	Post = "post",
	ProjectTitle = "project-title",
	Panel = "panel",
	PanelSm = "panel-sm",
	Subhead = "subhead",
}

export enum PostCardVariant {
	Teaser = "teaser",
	Grid = "grid",
}

export interface FilterOption<T extends string> {
	id: T;
	/** Already translated chip text (tags are data and render as is). */
	label: string;
	count?: number;
}

export enum Theme {
	Light = "light",
	Dark = "dark",
}

/** What the menu preview shows: a page by id, or a hovered project. */
export interface MenuHover {
	id: string;
	project?: ProjectSummary;
}

/** Mascot faces (prototype `living-mascot.html`); Brackets is the site's default. */
export enum MascotDesign {
	Brackets = "brackets",
	Terminal = "terminal",
}

/** Where the mascot keeps its gaze: `Auto` picks a corner itself every few seconds. */
export enum MascotZone {
	Auto = "auto",
	Center = "center",
	Bottom = "bottom",
	TopRight = "top-right",
	TopLeft = "top-left",
	BottomRight = "bottom-right",
	BottomLeft = "bottom-left",
}

/** One shape on the face sphere: x, y in -1..1 (y up), w, h in % of the head width. */
export interface MascotPart {
	x: number;
	y: number;
	w: number;
	h: number;
	/** Degrees. */
	rot?: number;
	/** > 1 floats above the surface (moves more). */
	lift?: number;
	/** Takes part in blinks (default true). */
	blink?: boolean;
	/** Blinks by flattening toward a horizontal line (chevrons). */
	squash?: boolean;
	/** Flashes on and off: [speed, phase]. */
	flash?: [number, number];
}

export interface MascotFace {
	/** CSS colours: theme tokens, so the head follows light/dark. */
	skull: string;
	ring?: string;
	ink: string;
	parts: MascotPart[];
}

export interface MascotOptions {
	stiffness: number;
	damping: number;
	/** Gaze area size (1 = full face). */
	range: number;
	zone: MascotZone;
	idle: boolean;
	blink: boolean;
}

/** Imperative handle of `<Mascot ref>`: react to page events. */
export interface MascotHandle {
	poke: (strength?: number) => void;
	setZone: (zone: MascotZone, range?: number) => void;
}

/** Side of a mascot speech bubble's tail. */
export enum BubbleSide {
	Left = "left",
	Right = "right",
	Top = "top",
}

/** Page the companion mascot is on; picks its lines. */
export enum CompanionPlace {
	Home = "home",
	Project = "project",
	Notes = "notes",
	Note = "note",
	About = "about",
	Gallery = "gallery",
}

/** Top-level pages of the owner dashboard, in sidebar order. Values are the URL segments. */
export enum DashboardSection {
	Projects = "projects",
	Notes = "notes",
	Gallery = "gallery",
	Files = "files",
	Settings = "settings",
	Account = "account",
}

/** Which property of a stored file a file field keeps as its value. */
export enum FileValueKey {
	Id = "id",
	Url = "url",
}

/** Where one file of an upload batch stands. */
export enum UploadStatus {
	Idle = "idle",
	Pending = "pending",
	Done = "done",
	Failed = "failed",
}

/** Tabs of the dashboard settings; each is its own route. Values are the URL segments. */
export enum SettingsTab {
	General = "general",
	Seo = "seo",
	Profile = "profile",
	Categories = "categories",
}

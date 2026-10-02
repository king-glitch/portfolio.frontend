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

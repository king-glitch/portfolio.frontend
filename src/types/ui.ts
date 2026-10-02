export enum PillVariant {
	Solid = "solid",
	Outline = "outline",
	Ghost = "ghost",
	Invert = "invert",
}

export enum ArtFit {
	Meet = "meet",
	Slice = "slice",
}

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

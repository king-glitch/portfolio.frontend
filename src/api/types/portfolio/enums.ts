export enum BlockType {
	ProjectHeader = "project-header",
	Overview = "overview",
	Filmstrip = "filmstrip",
	Showcase = "showcase",
	Contributions = "contributions",
	Architecture = "architecture",
	Challenge = "challenge",
	Statement = "statement",
	FeatureGrid = "feature-grid",
	Lineage = "lineage",
	Links = "links",
}

/** How an image fills its frame: `cover` crops to the frame, `contain` floats a cut-out (no frame). */
export enum MediaFit {
	Cover = "cover",
	Contain = "contain",
}

/** How an image goes monochrome: `ink` (flat single-colour art) also inverts on the dark theme. */
export enum MediaTone {
	Photo = "photo",
	Ui = "ui",
	Ink = "ink",
}

export enum ProjectLifecycle {
	Live = "live",
	Ended = "ended",
	Research = "research",
}

export enum MotifKind {
	Radar = "radar",
	Moon = "moon",
	Pixel = "pixel",
	Hex = "hex",
	Orbit = "orbit",
	Pins = "pins",
}

export enum MockScreen {
	Main = "main",
	Alt = "alt",
}

export enum DeviceView {
	Desktop = "desktop",
	Phone = "phone",
}

export enum ProjectSide {
	BehindTheScenes = "behind-the-scenes",
	OnScreen = "on-screen",
}

export enum BlockTone {
	Default = "default",
	Invert = "invert",
}

export enum PostBlockType {
	Paragraph = "p",
	Heading = "h",
	List = "list",
	Code = "code",
	Quote = "quote",
	Callout = "callout",
}

export enum ExperienceKind {
	Work = "work",
	Education = "education",
}

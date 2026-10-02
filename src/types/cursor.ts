/** Values are kebab-case: used as `data-cursor` and as the `common.cursor.*` i18n key. */
export enum CursorLabel {
	Open = "open",
	View = "view",
	Read = "read",
	Drag = "drag",
	Next = "next",
	LookCloser = "look-closer",
}

/** What the pointer is over; decides the ring's shape and fill. */
export enum CursorMode {
	/** Hollow ring + dot. */
	Idle = "idle",
	/** Filled circle over a link or button (never the element's own box). */
	Hover = "hover",
	/** Big filled circle with a word (`data-cursor`). */
	Label = "label",
	/** Thin I-beam over a text field. */
	Text = "text",
}

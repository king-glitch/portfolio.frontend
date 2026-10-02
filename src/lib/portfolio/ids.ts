/** "Morning Moon Village" -> "morning-moon-village". */
export function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** Zero-padded running number: (0, 4) -> "0001". */
export function padNum(index: number, width: number): string {
	return String(index + 1).padStart(width, "0");
}

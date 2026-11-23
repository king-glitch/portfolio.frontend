/** Prose split into sentences: each ends at `.`, `!` or `?` followed by whitespace ("3.90" stays whole). */
export const sentences = (text: string): string[] =>
	text
		.trim()
		.split(/(?<=[.!?])\s+/)
		.filter(Boolean);

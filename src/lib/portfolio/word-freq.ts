export interface WordFreq {
	word: string;
	/** 0..100, relative to the most used word. */
	pct: number;
}

const STOP = new Set(
	"the and of to a in for with that as was is on by while also it be which required using such from an this their its into all can like more most new other were has have had our my i we let them not but about between both well through user users game games system systems ensure ensuring including careful consideration various significant complex task deep understanding seamless optimized".split(
		" ",
	),
);

/** Most used words (> 3 letters, no stop words) across `texts`, top `limit`. */
export function topWords(texts: string[], limit = 3): WordFreq[] {
	const counts = new Map<string, number>();
	for (const word of texts
		.join(" ")
		.toLowerCase()
		.split(/[^a-z0-9-]+/)) {
		if (word.length > 3 && !STOP.has(word))
			counts.set(word, (counts.get(word) ?? 0) + 1);
	}
	const top = [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit);
	const max = top[0]?.[1] ?? 1;
	return top.map(([word, n]) => ({ word, pct: Math.round((n / max) * 100) }));
}

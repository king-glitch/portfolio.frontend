import { expect, test } from "bun:test";
import { topWords } from "@/lib/portfolio/word-freq";

test("counts, drops stop words and short words, scales to the top", () => {
	const out = topWords(["Socket socket the system socket radar", "radar go"]);
	expect(out).toEqual([
		{ word: "socket", pct: 100 },
		{ word: "radar", pct: 67 },
	]);
});

test("empty input", () => {
	expect(topWords([])).toEqual([]);
});

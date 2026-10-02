import { expect, test } from "bun:test";
import { config } from "@/config";
import { WALL_CELLS } from "@/routes/about/components/wall/layout";

test("27 tiles fill the 10x7 grid without overlap", () => {
	const taken = new Set<string>();
	for (const c of WALL_CELLS) {
		for (let x = c.col; x < c.col + c.cols; x++)
			for (let y = c.row; y < c.row + c.rows; y++) {
				const key = `${x},${y}`;
				expect(taken.has(key)).toBe(false);
				taken.add(key);
				expect(x).toBeLessThan(config.about.wall.cols);
				expect(y).toBeLessThan(config.about.wall.rows);
			}
	}
	expect(WALL_CELLS).toHaveLength(27);
	expect(taken.size).toBe(70);
});

test("hero tile sits at col 3 row 2, 3x2", () => {
	const hero = WALL_CELLS.find((c) => c.id === "hero");
	expect([hero?.col, hero?.row, hero?.cols, hero?.rows]).toEqual([
		3, 2, 3, 2,
	]);
});

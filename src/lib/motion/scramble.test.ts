import { expect, test } from "bun:test";
import { scrambleFrame } from "@/lib/motion/scramble";

const chars = "#@";

test("last frame is the original text", () => {
	expect(scrambleFrame("(01) Hello", 16, 16, chars, () => 0)).toBe(
		"(01) Hello",
	);
});

test("keeps length and spaces while scrambling", () => {
	const out = scrambleFrame("Say hi", 1, 16, chars, () => 0);
	expect(out).toHaveLength(6);
	expect(out[3]).toBe(" ");
	expect(out).not.toBe("Say hi");
});

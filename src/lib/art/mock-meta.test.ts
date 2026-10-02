import { expect, test } from "bun:test";
import { MockScreen, MotifKind } from "@/api/types/portfolio/enums";
import { mockMeta } from "@/lib/art/mock-meta";

test("phone screens: pixel (both) and pins alt", () => {
	expect(mockMeta(MotifKind.Pixel, MockScreen.Main).phone).toBe(true);
	expect(mockMeta(MotifKind.Pixel, MockScreen.Alt).phone).toBe(true);
	expect(mockMeta(MotifKind.Pins, MockScreen.Alt).phone).toBe(true);
	expect(mockMeta(MotifKind.Pins, MockScreen.Main).phone).toBe(false);
	expect(mockMeta(MotifKind.Radar, MockScreen.Alt).phone).toBe(false);
});

test("hex has distinct urls per screen", () => {
	expect(mockMeta(MotifKind.Hex, MockScreen.Main).url).toBe(
		"metalvalley / capture",
	);
	expect(mockMeta(MotifKind.Hex, MockScreen.Alt).url).toBe(
		"metalvalley / bridge",
	);
});

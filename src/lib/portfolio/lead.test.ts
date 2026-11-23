import { expect, test } from "bun:test";
import { sentences } from "@/lib/portfolio/lead";

test("sentences split on end punctuation only", () => {
	expect(
		sentences(" I build servers. Hi, I’m William! GPA 3.90 here? "),
	).toEqual(["I build servers.", "Hi, I’m William!", "GPA 3.90 here?"]);
	expect(sentences("")).toEqual([]);
});

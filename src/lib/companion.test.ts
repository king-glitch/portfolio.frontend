import { expect, test } from "bun:test";
import { companionPlace } from "@/lib/companion";
import { CompanionPlace } from "@/types/ui";

test("companion knows which page it is on", () => {
	expect(companionPlace("/")).toBe(CompanionPlace.Home);
	expect(companionPlace("/projects/aads")).toBe(CompanionPlace.Project);
	expect(companionPlace("/notes")).toBe(CompanionPlace.Notes);
	expect(companionPlace("/notes/x")).toBe(CompanionPlace.Note);
	expect(companionPlace("/about/resume")).toBe(CompanionPlace.About);
});

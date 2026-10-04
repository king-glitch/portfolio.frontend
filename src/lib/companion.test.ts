import { expect, test } from "bun:test";
import { ContentStatus } from "@/api/types/admin/enums";
import { companionEventOf, companionPlace } from "@/lib/companion";
import { CompanionEvent, CompanionPlace } from "@/types/ui";

test("companion knows which page it is on", () => {
	expect(companionPlace("/")).toBe(CompanionPlace.Home);
	expect(companionPlace("/projects/aads")).toBe(CompanionPlace.Project);
	expect(companionPlace("/notes")).toBe(CompanionPlace.Notes);
	expect(companionPlace("/notes/x")).toBe(CompanionPlace.Note);
	expect(companionPlace("/about/resume")).toBe(CompanionPlace.About);
	expect(companionPlace("/dashboard/notes/new")).toBe(
		CompanionPlace.Dashboard,
	);
});

test("a save that publishes is a Published event", () => {
	const meta = { companion: CompanionEvent.Saved };
	expect(companionEventOf(meta, { status: ContentStatus.Draft })).toBe(
		CompanionEvent.Saved,
	);
	expect(companionEventOf(meta, { status: ContentStatus.Published })).toBe(
		CompanionEvent.Published,
	);
	expect(companionEventOf(undefined, {})).toBeUndefined();
});

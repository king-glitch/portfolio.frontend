import { describe, expect, it } from "bun:test";
import { FileKind, type AdminFile } from "@/api/types/admin/storage";
import { FileValueKey } from "@/types/ui";
import {
	FileProblem,
	acceptOf,
	checkFile,
	externalFile,
	formatBytes,
	isExternal,
	kindOfMime,
	parseFileParams,
	resolveFile,
} from "@/lib/storage/files";

const file = (type: string, size = 10) =>
	new File([new Uint8Array(size)], "f", { type });

describe("storage files", () => {
	it("formats sizes", () => {
		expect(formatBytes(0)).toBe("0 B");
		expect(formatBytes(1536)).toBe("1.5 KB");
		expect(formatBytes(2 * 1024 * 1024)).toBe("2 MB");
	});

	it("maps a MIME type to its kind, nothing for a type the backend refuses", () => {
		expect(kindOfMime("image/png")).toBe(FileKind.Image);
		expect(kindOfMime("application/pdf")).toBe(FileKind.Document);
		expect(kindOfMime("image/webp")).toBeUndefined();
		expect(kindOfMime("image/svg+xml")).toBeUndefined();
	});

	it("builds the accept value of the allowed kinds", () => {
		expect(acceptOf([FileKind.Image])).toBe("image/jpeg,image/png");
		expect(acceptOf([])).toContain("application/zip");
	});

	it("rejects a type outside the field's kinds and a file over the limit", () => {
		expect(checkFile(file("image/png"), [FileKind.Image])).toBeNull();
		expect(checkFile(file("application/pdf"), [FileKind.Image])).toBe(
			FileProblem.Type,
		);
		expect(checkFile(file("application/pdf"), [])).toBeNull();
		expect(
			checkFile(file("image/png", 11 * 1024 * 1024), [FileKind.Image]),
		).toBe(FileProblem.Size);
	});

	it("marks an unknown stored URL as external", () => {
		expect(
			isExternal(externalFile("https://x/y.png", FileKind.Image)),
		).toBe(true);
	});

	it("resolves a value to a known file by id or URL, else to an external stand-in", () => {
		const known: AdminFile = {
			...externalFile("https://x/a.png", FileKind.Image),
			id: "f1",
		};
		expect(
			resolveFile("f1", FileValueKey.Id, [known], FileKind.Image),
		).toBe(known);
		expect(
			resolveFile(
				"https://x/a.png",
				FileValueKey.Url,
				[known],
				FileKind.Image,
			),
		).toBe(known);
		const stray = resolveFile(
			"https://y/b.png",
			FileValueKey.Url,
			[known],
			FileKind.Image,
		);
		expect(stray && isExternal(stray)).toBe(true);
		expect(
			resolveFile("", FileValueKey.Id, [known], FileKind.Image),
		).toBeNull();
	});

	it("reads the files page filters from the URL, falling back to all / empty", () => {
		expect(parseFileParams(new URLSearchParams("kind=image&q=cv"))).toEqual(
			{
				kind: FileKind.Image,
				q: "cv",
			},
		);
		expect(parseFileParams(new URLSearchParams("kind=nope"))).toEqual({
			kind: undefined,
			q: "",
		});
		expect(parseFileParams(new URLSearchParams(""))).toEqual({
			kind: undefined,
			q: "",
		});
	});
});

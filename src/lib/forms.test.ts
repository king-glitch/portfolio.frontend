import { describe, expect, it } from "bun:test";
import { ApiError, ApiErrorKind } from "@/api/errors";
import {
	applyViolations,
	cleanList,
	joinLines,
	splitLines,
	toCamelPath,
} from "@/lib/forms";

const rejected = (violations: Record<string, string>) =>
	new ApiError({
		kind: ApiErrorKind.Validation,
		message: "bad",
		violations: Object.fromEntries(
			Object.entries(violations).map(([key, message]) => [
				key,
				{ code: "invalid", message },
			]),
		),
	});

describe("violations", () => {
	it("converts snake_case keys per path segment", () => {
		expect(toCamelPath("project_id")).toBe("projectId");
		expect(toCamelPath("contact.github_url")).toBe("contact.githubUrl");
		expect(toCamelPath("name")).toBe("name");
	});

	it("puts a snake_case violation on the camelCase field", () => {
		const seen: [string, string][] = [];
		const applied = applyViolations(
			rejected({ project_id: "unknown project", nope: "x" }),
			(name, error) => seen.push([name, String(error.message)]),
			["name", "projectId"],
		);
		expect(applied).toBe(true);
		expect(seen).toEqual([["projectId", "unknown project"]]);
	});

	it("routes blocks.<n>.… violations to the block callback", () => {
		const blocks: [number, string][] = [];
		const applied = applyViolations(
			rejected({ "blocks.3.params.title": "too long" }),
			() => undefined,
			["name"],
			(index, message) => blocks.push([index, message]),
		);
		expect(applied).toBe(true);
		expect(blocks).toEqual([[3, "too long"]]);
	});

	it("reports nothing applied for a non-API error or unknown keys", () => {
		expect(applyViolations(new Error("x"), () => undefined, [])).toBe(
			false,
		);
		expect(
			applyViolations(rejected({ other: "x" }), () => undefined, [
				"name",
			]),
		).toBe(false);
	});
});

describe("lines", () => {
	it("keeps sentences with commas whole across a round trip", () => {
		const role = [
			"Designed the API, the schema, and the deploy",
			"Led two engineers",
		];
		expect(splitLines(joinLines(role))).toEqual(role);
	});

	it("drops blank lines and trims", () => {
		expect(splitLines(" a \n\n  \n b ")).toEqual(["a", "b"]);
	});
});

describe("cleanList", () => {
	it("trims rows and drops blanks, keeping commas inside a row", () => {
		expect(cleanList([" a, b ", "", "  ", "c"])).toEqual(["a, b", "c"]);
	});
});

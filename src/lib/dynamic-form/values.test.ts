import { describe, expect, it, test } from "bun:test";
import { BlockType, PostBlockType } from "@/api/types/portfolio/enums";
import {
	noteBlockSpecs,
	projectBlockSpecs,
	timelineSpecs,
} from "@/lib/dynamic-form/specs";
import {
	ITEM_KEY,
	blockParams,
	blockSummary,
	blocksHaveMissing,
	emptyRecord,
	invalidBlockIndexes,
	normalize,
	normalizeBlocks,
	withBlockParams,
} from "@/lib/dynamic-form/values";
import { FieldKind, FieldName } from "@/types/dynamic-form";

const statementFields = projectBlockSpecs[BlockType.Statement];

describe("dynamic form values", () => {
	it("starts a block with empty required fields and no optional ones", () => {
		expect(emptyRecord(statementFields)).toEqual({ text: "" });
	});

	it("starts required selects on their first choice and lists empty", () => {
		const feature = emptyRecord(projectBlockSpecs[BlockType.Showcase]);
		expect(feature.fit).toBe("cover");
		expect(feature.tone).toBe("photo");
		expect(feature.url).toBe("");
		expect(feature).not.toHaveProperty("width");
		const strip = emptyRecord(projectBlockSpecs[BlockType.Filmstrip]);
		expect(strip.items).toEqual([]);
	});

	it("gives a new entry an id and keeps the defaults it is given", () => {
		const entry = emptyRecord(timelineSpecs, { kind: "work" });
		expect(typeof entry.id).toBe("string");
		expect(entry.id).not.toBe("");
		expect(entry.kind).toBe("work");
	});

	it("trims lines, drops blank ones and removes empty optional keys", () => {
		const fields = projectBlockSpecs[BlockType.FeatureGrid];
		const cleaned = normalize(
			{ label: " A ", items: ["  x ", "", "  "] },
			fields,
		);
		expect(cleaned).toEqual({ label: "A", items: ["x"] });
		const feature = normalize(
			{ label: "", url: "/a.webp", alt: "a", fit: "cover", tone: "ui" },
			projectBlockSpecs[BlockType.Showcase],
		);
		expect(feature).toEqual({
			url: "/a.webp",
			alt: "a",
			fit: "cover",
			tone: "ui",
		});
	});

	it("cleans nested records of an image strip and keeps stored sizes", () => {
		const fields = projectBlockSpecs[BlockType.Filmstrip];
		const cleaned = normalize(
			{
				label: "S",
				caption: "",
				items: [
					{
						url: "/a.webp",
						alt: " a ",
						caption: "",
						fit: "contain",
						tone: "ink",
						width: 800,
						height: 600,
					},
				],
			},
			fields,
		);
		expect(cleaned).toEqual({
			label: "S",
			items: [
				{
					url: "/a.webp",
					alt: "a",
					fit: "contain",
					tone: "ink",
					width: 800,
					height: 600,
				},
			],
		});
	});

	it("flags a blank required field, even in a nested record", () => {
		expect(
			blocksHaveMissing(
				[{ type: BlockType.Statement, params: { text: "" } }],
				projectBlockSpecs,
				true,
			),
		).toBe(true);
		expect(
			blocksHaveMissing(
				[{ type: BlockType.Statement, params: { text: "t" } }],
				projectBlockSpecs,
				true,
			),
		).toBe(false);
		expect(
			blocksHaveMissing(
				[
					{
						type: BlockType.Architecture,
						params: {
							label: "A",
							nodes: [{ name: "", description: "" }],
						},
					},
				],
				projectBlockSpecs,
				true,
			),
		).toBe(true);
	});

	it("reads and writes fields in params (project) or beside type (note)", () => {
		expect(
			blockParams({ type: "quote", params: { text: "t" } }, true),
		).toEqual({ text: "t" });
		expect(blockParams({ type: "p", text: "t" }, false)).toEqual({
			text: "t",
		});
		expect(withBlockParams("quote", { text: "t" }, true)).toEqual({
			type: "quote",
			params: { text: "t" },
		});
		expect(withBlockParams("p", { text: "t" }, false)).toEqual({
			type: "p",
			text: "t",
		});
	});

	it("passes a block of an unknown type through untouched", () => {
		const unknown = { type: "future", params: { a: 1 } };
		expect(normalizeBlocks([unknown], projectBlockSpecs, true)).toEqual([
			unknown,
		]);
	});

	it("drops an unchecked optional switch from a note list", () => {
		const out = normalizeBlocks(
			[{ type: PostBlockType.List, items: [" a ", ""], ordered: false }],
			noteBlockSpecs,
			false,
		);
		expect(out).toEqual([{ type: "list", items: ["a"] }]);
	});

	it("removes the client-only item keys, in nested records too", () => {
		const fields = projectBlockSpecs[BlockType.Architecture];
		const cleaned = normalize(
			{
				label: "A",
				nodes: [{ [ITEM_KEY]: "k-0", name: "n", description: "d" }],
				[ITEM_KEY]: "x",
			},
			fields,
		);
		expect(cleaned).toEqual({
			label: "A",
			nodes: [{ name: "n", description: "d" }],
		});
	});
});

test("blockSummary is the first filled text field, cut short", () => {
	const fields = [
		{ name: FieldName.Label, kind: FieldKind.Text },
		{ name: FieldName.Title, kind: FieldKind.Text },
	];
	expect(blockSummary({ label: " ", title: "Hello" }, fields)).toBe("Hello");
	expect(blockSummary({}, fields)).toBe("");
	expect(blockSummary({ label: "x".repeat(80) }, fields)).toBe(
		`${"x".repeat(60)}...`,
	);
});

test("invalidBlockIndexes lists the blocks with a blank required field", () => {
	const specs = { quote: [{ name: FieldName.Text, kind: FieldKind.Text }] };
	expect(
		invalidBlockIndexes(
			[
				{ type: "quote", text: "a" },
				{ type: "quote", text: " " },
				{ type: "unknown" },
			],
			specs,
			false,
		),
	).toEqual([1]);
});

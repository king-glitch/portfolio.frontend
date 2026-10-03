import { describe, expect, it } from "bun:test";
import { BlockType, PostBlockType } from "@/api/types/portfolio/enums";
import {
	noteBlockSpecs,
	projectBlockSpecs,
	timelineSpecs,
} from "@/lib/dynamic-form/specs";
import {
	blockParams,
	blocksHaveMissing,
	emptyRecord,
	normalize,
	normalizeBlocks,
	withBlockParams,
} from "@/lib/dynamic-form/values";

const quoteFields = projectBlockSpecs[BlockType.Quote];

describe("dynamic form values", () => {
	it("starts a block with empty required fields and no optional ones", () => {
		expect(emptyRecord(quoteFields)).toEqual({ text: "", cite: "" });
	});

	it("starts required selects on their first choice and lists empty", () => {
		const header = emptyRecord(projectBlockSpecs[BlockType.ProjectHeader]);
		expect(header.variant).toBe("split");
		expect(header.tags).toEqual([]);
		expect(header.subtitle).toBe("");
	});

	it("gives a new entry an id and keeps the defaults it is given", () => {
		const entry = emptyRecord(timelineSpecs, { kind: "work" });
		expect(typeof entry.id).toBe("string");
		expect(entry.id).not.toBe("");
		expect(entry.kind).toBe("work");
	});

	it("trims lines, drops blank ones and removes empty optional keys", () => {
		const fields = projectBlockSpecs[BlockType.AboutSplit];
		const cleaned = normalize(
			{ label: " A ", text: "t", list: ["  x ", "", "  "], kind: "" },
			fields,
		);
		expect(cleaned).toEqual({ label: "A", text: "t", list: ["x"] });
		// a list that ends up empty leaves the record, so the backend never sees an empty optional list
		expect(
			normalize({ label: "A", text: "t", list: ["", " "] }, fields),
		).toEqual({ label: "A", text: "t" });
	});

	it("cleans nested records of a gallery block", () => {
		const fields = projectBlockSpecs[BlockType.Gallery];
		const cleaned = normalize(
			{
				label: "G",
				caption: "",
				items: [
					{
						kind: "pins",
						screen: "main",
						view: "phone",
						caption: "c",
						image_url: "",
					},
				],
			},
			fields,
		);
		expect(cleaned.items).toEqual([
			{ kind: "pins", screen: "main", view: "phone", caption: "c" },
		]);
	});

	it("flags a blank required field, even in a nested record", () => {
		expect(
			blocksHaveMissing(
				[{ type: BlockType.Quote, params: { text: "", cite: "c" } }],
				projectBlockSpecs,
				true,
			),
		).toBe(true);
		expect(
			blocksHaveMissing(
				[{ type: BlockType.Quote, params: { text: "t", cite: "c" } }],
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
});

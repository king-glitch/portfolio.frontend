import { optionSets } from "@/lib/dynamic-form/options";
import {
	FieldKind,
	type FieldSpec,
	type FormRecord,
} from "@/types/dynamic-form";

export const isRecord = (value: unknown): value is FormRecord =>
	typeof value === "object" && value !== null && !Array.isArray(value);

export const asString = (value: unknown): string =>
	typeof value === "string" ? value : "";

export const asStrings = (value: unknown): string[] =>
	Array.isArray(value)
		? value.filter((item): item is string => typeof item === "string")
		: [];

export const asBool = (value: unknown): boolean => value === true;

export const asRecords = (value: unknown): FormRecord[] =>
	Array.isArray(value) ? value.filter(isRecord) : [];

/** Client-only key of a list item (React key). Never saved: `normalize` removes it. */
export const ITEM_KEY = "_key";

/** The items with a key each; items that have none get one derived from their position, so a later removal keeps the others' keys. */
export const withItemKeys = (items: FormRecord[]): FormRecord[] =>
	items.map((item, index) =>
		asString(item[ITEM_KEY]) ? item : { ...item, [ITEM_KEY]: `k-${index}` },
	);

export const newItemKey = (): string => crypto.randomUUID();

const isEmpty = (value: unknown): boolean =>
	value === undefined ||
	value === "" ||
	value === false ||
	(Array.isArray(value) && value.length === 0);

/** The record with `spec`'s field set; an empty optional field leaves the record instead. */
export function setField(
	record: FormRecord,
	spec: FieldSpec,
	value: unknown,
): FormRecord {
	const { [spec.name]: _old, ...rest } = record;
	return spec.optional && isEmpty(value)
		? rest
		: { ...rest, [spec.name]: value };
}

/** A fresh record: empty strings and lists, the first choice of required selects, a new id for hidden text. */
export function emptyRecord(
	fields: FieldSpec[],
	defaults: FormRecord = {},
): FormRecord {
	const record: FormRecord = {};
	for (const spec of fields) {
		if (spec.optional) continue;
		if (spec.kind === FieldKind.Select)
			record[spec.name] = spec.options
				? (optionSets[spec.options][0]?.value ?? "")
				: "";
		else if (
			spec.kind === FieldKind.Lines ||
			spec.kind === FieldKind.Objects
		)
			record[spec.name] = [];
		else if (spec.kind === FieldKind.Switch) record[spec.name] = false;
		else record[spec.name] = spec.hidden ? crypto.randomUUID() : "";
	}
	return { ...record, ...defaults };
}

/** Ready to save: list lines trimmed and emptied lines dropped, nested records cleaned, empty optional keys and client-only item keys removed. */
export function normalize(record: FormRecord, fields: FieldSpec[]): FormRecord {
	const { [ITEM_KEY]: _key, ...clean } = record;
	let out = clean;
	for (const spec of fields) {
		const value = record[spec.name];
		let cleaned = value;
		if (spec.kind === FieldKind.Lines)
			cleaned = asStrings(value)
				.map((line) => line.trim())
				.filter(Boolean);
		else if (spec.kind === FieldKind.Objects)
			cleaned = asRecords(value).map((item) =>
				normalize(item, spec.fields ?? []),
			);
		else if (typeof value === "string") cleaned = value.trim();
		out = setField(out, spec, cleaned);
	}
	return out;
}

/** True when a required field (text that may not be empty) is blank, in the record or any nested record. */
export function hasMissing(record: FormRecord, fields: FieldSpec[]): boolean {
	return fields.some((spec) => {
		const value = record[spec.name];
		if (spec.kind === FieldKind.Objects)
			return asRecords(value).some((item) =>
				hasMissing(item, spec.fields ?? []),
			);
		const needsText =
			!spec.optional &&
			!spec.allowEmpty &&
			!spec.hidden &&
			spec.kind !== FieldKind.Switch &&
			spec.kind !== FieldKind.Lines;
		return needsText && asString(value).trim() === "";
	});
}

/** The editable fields of a block: `params` of a project block, or the keys beside `type` of a note block. */
export function blockParams(block: FormRecord, nested: boolean): FormRecord {
	if (nested) return isRecord(block.params) ? block.params : {};
	const { type: _type, ...rest } = block;
	return rest;
}

export const withBlockParams = (
	type: string,
	params: FormRecord,
	nested: boolean,
): FormRecord => (nested ? { type, params } : { type, ...params });

type BlockSpecs = Record<string, FieldSpec[]>;

/** Blocks ready to save. A block of a type this form does not know passes through untouched. */
export function normalizeBlocks(
	blocks: FormRecord[],
	specs: BlockSpecs,
	nested: boolean,
): FormRecord[] {
	return blocks.map((block) => {
		const type = asString(block.type);
		const fields = specs[type];
		return fields
			? withBlockParams(
					type,
					normalize(blockParams(block, nested), fields),
					nested,
				)
			: block;
	});
}

/** True when the block has a blank required field. A block of an unknown type has none. */
export const blockHasMissing = (
	block: FormRecord,
	specs: BlockSpecs,
	nested: boolean,
): boolean => {
	const fields = specs[asString(block.type)];
	return fields ? hasMissing(blockParams(block, nested), fields) : false;
};

export const blocksHaveMissing = (
	blocks: FormRecord[],
	specs: BlockSpecs,
	nested: boolean,
): boolean => blocks.some((block) => blockHasMissing(block, specs, nested));

/** Positions of the blocks with a blank required field. */
export const invalidBlockIndexes = (
	blocks: FormRecord[],
	specs: BlockSpecs,
	nested: boolean,
): number[] =>
	blocks.flatMap((block, index) =>
		blockHasMissing(block, specs, nested) ? [index] : [],
	);

const SUMMARY_MAX = 60;

/** The first filled text field of a block, cut short: what a collapsed card shows next to its type. */
export function blockSummary(params: FormRecord, fields: FieldSpec[]): string {
	for (const spec of fields) {
		if (spec.kind !== FieldKind.Text && spec.kind !== FieldKind.Textarea)
			continue;
		const text = asString(params[spec.name]).trim();
		if (text)
			return text.length > SUMMARY_MAX
				? `${text.slice(0, SUMMARY_MAX)}...`
				: text;
	}
	return "";
}

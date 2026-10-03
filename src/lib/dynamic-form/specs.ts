import { FileKind } from "@/api/types/admin/storage";
import { BlockType, PostBlockType } from "@/api/types/portfolio/enums";
import {
	FieldKind,
	FieldName,
	OptionSet,
	type FieldSpec,
} from "@/types/dynamic-form";

type Flags = Pick<FieldSpec, "optional" | "allowEmpty" | "hidden">;

const text = (name: FieldName, flags: Flags = {}): FieldSpec => ({
	name,
	kind: FieldKind.Text,
	...flags,
});
const area = (name: FieldName, flags: Flags = {}): FieldSpec => ({
	name,
	kind: FieldKind.Textarea,
	...flags,
});
const select = (
	name: FieldName,
	options: OptionSet,
	flags: Flags = {},
): FieldSpec => ({ name, kind: FieldKind.Select, options, ...flags });
const lines = (name: FieldName, flags: Flags = {}): FieldSpec => ({
	name,
	kind: FieldKind.Lines,
	// a list may be empty
	allowEmpty: true,
	...flags,
});
const file = (
	name: FieldName,
	accept: FileKind[],
	flags: Flags = {},
): FieldSpec => ({ name, kind: FieldKind.File, accept, ...flags });
/** Motif preset (`kind`) with its optional uploaded image (`image_url`) as one control. */
const art = (flags: Flags = {}): FieldSpec => ({
	name: FieldName.Kind,
	kind: FieldKind.Art,
	imageName: FieldName.ImageUrl,
	...flags,
});
const objects = (name: FieldName, fields: FieldSpec[]): FieldSpec => ({
	name,
	kind: FieldKind.Objects,
	fields,
});

const labelAndItems = [text(FieldName.Label), lines(FieldName.Items)];

const media = [
	select(FieldName.Kind, OptionSet.Kind),
	select(FieldName.Screen, OptionSet.Screen),
	select(FieldName.View, OptionSet.View),
	text(FieldName.Caption, { allowEmpty: true }),
	file(FieldName.ImageUrl, [FileKind.Image], { optional: true }),
];

/** Fields of each project block (`params`), mirroring the backend's JSON schema for that block. */
export const projectBlockSpecs: Record<BlockType, FieldSpec[]> = {
	[BlockType.ProjectHeader]: [
		select(FieldName.Variant, OptionSet.Variant),
		text(FieldName.Title),
		text(FieldName.Subtitle, { allowEmpty: true }),
		text(FieldName.Index, { allowEmpty: true }),
		select(FieldName.Discipline, OptionSet.Side),
		lines(FieldName.Tags),
		art(),
	],
	[BlockType.Quote]: [
		area(FieldName.Text),
		text(FieldName.Cite),
		select(FieldName.Tone, OptionSet.Tone, { optional: true }),
	],
	[BlockType.BigNumber]: [
		text(FieldName.Value),
		text(FieldName.Label),
		text(FieldName.Caption),
	],
	[BlockType.AboutSplit]: [
		text(FieldName.Label),
		area(FieldName.Text),
		art({ optional: true }),
		lines(FieldName.List, { optional: true }),
	],
	[BlockType.NumberedList]: labelAndItems,
	[BlockType.StackCards]: labelAndItems,
	[BlockType.FeatureGrid]: labelAndItems,
	[BlockType.Timeline]: labelAndItems,
	[BlockType.Zigzag]: labelAndItems,
	[BlockType.MotifFull]: [art(), text(FieldName.Label, { optional: true })],
	[BlockType.Chips]: [
		text(FieldName.Label),
		text(FieldName.Title),
		area(FieldName.Text, { allowEmpty: true }),
		lines(FieldName.Items),
	],
	[BlockType.Mock]: [text(FieldName.Label), ...media],
	[BlockType.Gallery]: [
		text(FieldName.Label),
		text(FieldName.Caption, { allowEmpty: true }),
		objects(FieldName.Items, media),
	],
	[BlockType.Architecture]: [
		text(FieldName.Label),
		objects(FieldName.Nodes, [
			text(FieldName.Name),
			text(FieldName.Description, { allowEmpty: true }),
		]),
	],
	[BlockType.Lineage]: [
		text(FieldName.Label),
		text(FieldName.From),
		text(FieldName.To),
		area(FieldName.Text, { allowEmpty: true }),
		{ name: FieldName.FromId, kind: FieldKind.Project, optional: true },
	],
};

/** Fields of each note block (flat: they sit beside `type`). */
export const noteBlockSpecs: Record<PostBlockType, FieldSpec[]> = {
	[PostBlockType.Paragraph]: [area(FieldName.Text)],
	[PostBlockType.Heading]: [text(FieldName.Text)],
	[PostBlockType.List]: [
		lines(FieldName.Items),
		{ name: FieldName.Ordered, kind: FieldKind.Switch, optional: true },
	],
	[PostBlockType.Code]: [text(FieldName.Lang), area(FieldName.Text)],
	[PostBlockType.Quote]: [
		area(FieldName.Text),
		text(FieldName.Cite, { optional: true }),
	],
	[PostBlockType.Callout]: [
		area(FieldName.Text),
		select(FieldName.Tone, OptionSet.Tone, { optional: true }),
	],
};

/** One experience or education entry; `id` and `kind` are kept, not edited. */
export const timelineSpecs: FieldSpec[] = [
	text(FieldName.Id, { hidden: true }),
	select(FieldName.Kind, OptionSet.Experience, { hidden: true }),
	text(FieldName.Title),
	text(FieldName.Period, { allowEmpty: true }),
	{ name: FieldName.Start, kind: FieldKind.Month },
	{ name: FieldName.End, kind: FieldKind.Month, optional: true },
	lines(FieldName.Notes),
];

export const skillSpecs: FieldSpec[] = [
	text(FieldName.Label),
	lines(FieldName.Items),
];

export const coreSpecs: FieldSpec[] = [
	text(FieldName.Label),
	area(FieldName.Text),
];

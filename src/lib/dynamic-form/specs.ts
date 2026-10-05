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
const objects = (name: FieldName, fields: FieldSpec[]): FieldSpec => ({
	name,
	kind: FieldKind.Objects,
	fields,
});

const labelOnly = [text(FieldName.Label)];

/** One image: `width`/`height` are kept as loaded (they reserve the frame; none = a 16:10 frame). */
const asset = [
	file(FieldName.Url, [FileKind.Image]),
	text(FieldName.Alt, { allowEmpty: true }),
	text(FieldName.Caption, { optional: true }),
	select(FieldName.Fit, OptionSet.Fit),
	select(FieldName.Tone, OptionSet.MediaTone),
	text(FieldName.Width, { optional: true, hidden: true }),
	text(FieldName.Height, { optional: true, hidden: true }),
];

/** Fields of each project block (`params`), mirroring the backend's JSON schema for that block. */
export const projectBlockSpecs: Record<BlockType, FieldSpec[]> = {
	[BlockType.ProjectHeader]: [text(FieldName.Tagline, { allowEmpty: true })],
	[BlockType.Overview]: labelOnly,
	[BlockType.Filmstrip]: [
		text(FieldName.Label),
		text(FieldName.Caption, { optional: true }),
		objects(FieldName.Items, asset),
	],
	[BlockType.Showcase]: [text(FieldName.Label, { optional: true }), ...asset],
	[BlockType.Contributions]: labelOnly,
	[BlockType.Architecture]: [
		text(FieldName.Label),
		objects(FieldName.Nodes, [
			text(FieldName.Name),
			text(FieldName.Description, { allowEmpty: true }),
		]),
	],
	[BlockType.Challenge]: [
		text(FieldName.Label),
		objects(FieldName.Items, [
			area(FieldName.Problem),
			area(FieldName.Approach, { optional: true }),
		]),
	],
	[BlockType.Statement]: [area(FieldName.Text)],
	[BlockType.FeatureGrid]: [text(FieldName.Label), lines(FieldName.Items)],
	[BlockType.Lineage]: [
		text(FieldName.Label),
		text(FieldName.From),
		text(FieldName.To),
		area(FieldName.Text, { allowEmpty: true }),
		{ name: FieldName.FromId, kind: FieldKind.Project, optional: true },
	],
	[BlockType.Links]: labelOnly,
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

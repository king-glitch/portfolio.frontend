import type { FileKind } from "@/api/types/admin/storage";
import type { MotifKind } from "@/api/types/portfolio/enums";

/** How a field of a schema-driven form is edited. */
export enum FieldKind {
	Text = "text",
	Textarea = "textarea",
	/** `YYYY-MM` month picker. */
	Month = "month",
	Select = "select",
	/** A list of strings, one per line. */
	Lines = "lines",
	Switch = "switch",
	/** A list of records, each with the field's own `fields`. */
	Objects = "objects",
	/** A project of the dashboard, stored as its document id. */
	Project = "project",
	/** A stored file of the library, kept as its URL. */
	File = "file",
	/** Motif preset (`name`) plus optional uploaded image (`imageName`), edited as one control. */
	Art = "art",
}

/** Option lists a `Select` field draws from. */
export enum OptionSet {
	Kind = "kind",
	Side = "side",
	Variant = "variant",
	Screen = "screen",
	View = "view",
	Tone = "tone",
	Experience = "experience",
}

/** Every field name a dynamic form uses; also the JSON key and the i18n key (`dashboard.fields.<name>`). */
export enum FieldName {
	Variant = "variant",
	Title = "title",
	Subtitle = "subtitle",
	Index = "index",
	Discipline = "discipline",
	Tags = "tags",
	Kind = "kind",
	Text = "text",
	Cite = "cite",
	Tone = "tone",
	Value = "value",
	Label = "label",
	Caption = "caption",
	List = "list",
	Items = "items",
	Screen = "screen",
	View = "view",
	ImageUrl = "image_url",
	Nodes = "nodes",
	Name = "name",
	Description = "description",
	From = "from",
	To = "to",
	FromId = "from_id",
	Lang = "lang",
	Ordered = "ordered",
	Id = "id",
	Period = "period",
	Notes = "notes",
	Start = "start",
	End = "end",
	Skills = "skills",
	Core = "core",
	Experience = "experience",
	Education = "education",
}

export interface FieldSpec {
	name: FieldName;
	kind: FieldKind;
	/** Options of a `Select`. */
	options?: OptionSet;
	/** Kinds a `File` field takes (the picker and its upload are limited to them). */
	accept?: FileKind[];
	/** `Art` only: the field that holds the uploaded image next to the preset in `name`. */
	imageName?: FieldName;
	/** Sub-fields of an `Objects` list. */
	fields?: FieldSpec[];
	/** Dropped from the saved JSON while empty (the backend rejects some empty optional values). */
	optional?: boolean;
	/** Must be present but may be an empty string. */
	allowEmpty?: boolean;
	/** Hidden from the form; kept as it was loaded. */
	hidden?: boolean;
}

/** One block, list item or profile entry: plain JSON the backend validates. */
export type FormRecord = Record<string, unknown>;

/** The part of a project or note form the block editor works on. */
export interface BlocksFormValues {
	blocks: FormRecord[];
}

/** What a form needs to hold to use the art control: the motif preset and the uploaded image URL ("" = none). */
export interface ArtFormValues {
	kind: MotifKind;
	artUrl: string;
}

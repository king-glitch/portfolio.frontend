import type { ParseKeys, TFunction } from "i18next";
import {
	BlockTone,
	DeviceView,
	ExperienceKind,
	HeaderVariant,
	MockScreen,
	MotifKind,
	ProjectSide,
} from "@/api/types/portfolio/enums";
import { FieldName, OptionSet } from "@/types/dynamic-form";

export interface SelectOption {
	value: string;
	labelKey: ParseKeys;
}

const kinds: Record<MotifKind, ParseKeys> = {
	[MotifKind.Radar]: "dashboard.options.kinds.radar",
	[MotifKind.Moon]: "dashboard.options.kinds.moon",
	[MotifKind.Pixel]: "dashboard.options.kinds.pixel",
	[MotifKind.Hex]: "dashboard.options.kinds.hex",
	[MotifKind.Orbit]: "dashboard.options.kinds.orbit",
	[MotifKind.Pins]: "dashboard.options.kinds.pins",
};

const sides: Record<ProjectSide, ParseKeys> = {
	[ProjectSide.BehindTheScenes]: "dashboard.options.sides.behind-the-scenes",
	[ProjectSide.OnScreen]: "dashboard.options.sides.on-screen",
};

const variants: Record<HeaderVariant, ParseKeys> = {
	[HeaderVariant.Split]: "dashboard.options.variants.split",
	[HeaderVariant.SplitRev]: "dashboard.options.variants.split-rev",
	[HeaderVariant.Center]: "dashboard.options.variants.center",
	[HeaderVariant.Outline]: "dashboard.options.variants.outline",
	[HeaderVariant.Vertical]: "dashboard.options.variants.vertical",
};

const screens: Record<MockScreen, ParseKeys> = {
	[MockScreen.Main]: "dashboard.options.screens.main",
	[MockScreen.Alt]: "dashboard.options.screens.alt",
};

const views: Record<DeviceView, ParseKeys> = {
	[DeviceView.Desktop]: "dashboard.options.views.desktop",
	[DeviceView.Phone]: "dashboard.options.views.phone",
};

const tones: Record<BlockTone, ParseKeys> = {
	[BlockTone.Default]: "dashboard.options.tones.default",
	[BlockTone.Invert]: "dashboard.options.tones.invert",
};

const experiences: Record<ExperienceKind, ParseKeys> = {
	[ExperienceKind.Work]: "dashboard.options.experiences.work",
	[ExperienceKind.Education]: "dashboard.options.experiences.education",
};

const toOptions = (keys: Record<string, ParseKeys>): SelectOption[] =>
	Object.entries(keys).map(([value, labelKey]) => ({ value, labelKey }));

/** Choices of every `Select` field; typed per enum so a new member without copy fails typecheck. */
export const optionSets: Record<OptionSet, SelectOption[]> = {
	[OptionSet.Kind]: toOptions(kinds),
	[OptionSet.Side]: toOptions(sides),
	[OptionSet.Variant]: toOptions(variants),
	[OptionSet.Screen]: toOptions(screens),
	[OptionSet.View]: toOptions(views),
	[OptionSet.Tone]: toOptions(tones),
	[OptionSet.Experience]: toOptions(experiences),
};

/** The choices of `set` as `{ value, label }` for the react-hook-form select and toggle fields. */
export const selectItems = (set: OptionSet, t: TFunction) =>
	optionSets[set].map(({ value, labelKey }) => ({
		value,
		label: t(labelKey),
	}));

/** Label of every dynamic-form field. */
export const fieldLabels: Record<FieldName, ParseKeys> = {
	[FieldName.Variant]: "dashboard.fields.variant",
	[FieldName.Title]: "dashboard.fields.title",
	[FieldName.Subtitle]: "dashboard.fields.subtitle",
	[FieldName.Index]: "dashboard.fields.index",
	[FieldName.Discipline]: "dashboard.fields.discipline",
	[FieldName.Tags]: "dashboard.fields.tags",
	[FieldName.Kind]: "dashboard.fields.kind",
	[FieldName.Text]: "dashboard.fields.text",
	[FieldName.Cite]: "dashboard.fields.cite",
	[FieldName.Tone]: "dashboard.fields.tone",
	[FieldName.Value]: "dashboard.fields.value",
	[FieldName.Label]: "dashboard.fields.label",
	[FieldName.Caption]: "dashboard.fields.caption",
	[FieldName.List]: "dashboard.fields.list",
	[FieldName.Items]: "dashboard.fields.items",
	[FieldName.Screen]: "dashboard.fields.screen",
	[FieldName.View]: "dashboard.fields.view",
	[FieldName.ImageUrl]: "dashboard.fields.image-url",
	[FieldName.Nodes]: "dashboard.fields.nodes",
	[FieldName.Name]: "dashboard.fields.name",
	[FieldName.Description]: "dashboard.fields.description",
	[FieldName.From]: "dashboard.fields.from",
	[FieldName.To]: "dashboard.fields.to",
	[FieldName.FromId]: "dashboard.fields.from-id",
	[FieldName.Lang]: "dashboard.fields.lang",
	[FieldName.Ordered]: "dashboard.fields.ordered",
	[FieldName.Id]: "dashboard.fields.id",
	[FieldName.Period]: "dashboard.fields.period",
	[FieldName.Notes]: "dashboard.fields.notes",
	[FieldName.Start]: "dashboard.fields.start",
	[FieldName.End]: "dashboard.fields.end",
	[FieldName.Skills]: "dashboard.fields.skills",
	[FieldName.Core]: "dashboard.fields.core",
	[FieldName.Experience]: "dashboard.fields.experience",
	[FieldName.Education]: "dashboard.fields.education",
};

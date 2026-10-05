import type { ParseKeys, TFunction } from "i18next";
import {
	BlockTone,
	ExperienceKind,
	MediaFit,
	MediaTone,
	MotifKind,
	ProjectLifecycle,
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

const tones: Record<BlockTone, ParseKeys> = {
	[BlockTone.Default]: "dashboard.options.tones.default",
	[BlockTone.Invert]: "dashboard.options.tones.invert",
};

const fits: Record<MediaFit, ParseKeys> = {
	[MediaFit.Cover]: "dashboard.options.fits.cover",
	[MediaFit.Contain]: "dashboard.options.fits.contain",
};

const mediaTones: Record<MediaTone, ParseKeys> = {
	[MediaTone.Photo]: "dashboard.options.media-tones.photo",
	[MediaTone.Ui]: "dashboard.options.media-tones.ui",
	[MediaTone.Ink]: "dashboard.options.media-tones.ink",
};

const lifecycles: Record<ProjectLifecycle, ParseKeys> = {
	[ProjectLifecycle.Live]: "dashboard.options.lifecycles.live",
	[ProjectLifecycle.Ended]: "dashboard.options.lifecycles.ended",
	[ProjectLifecycle.Research]: "dashboard.options.lifecycles.research",
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
	[OptionSet.Tone]: toOptions(tones),
	[OptionSet.Fit]: toOptions(fits),
	[OptionSet.MediaTone]: toOptions(mediaTones),
	[OptionSet.Lifecycle]: toOptions(lifecycles),
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
	[FieldName.Tagline]: "dashboard.fields.tagline",
	[FieldName.Kind]: "dashboard.fields.kind",
	[FieldName.Text]: "dashboard.fields.text",
	[FieldName.Cite]: "dashboard.fields.cite",
	[FieldName.Tone]: "dashboard.fields.tone",
	[FieldName.Label]: "dashboard.fields.label",
	[FieldName.Caption]: "dashboard.fields.caption",
	[FieldName.Items]: "dashboard.fields.items",
	[FieldName.Url]: "dashboard.fields.url",
	[FieldName.Alt]: "dashboard.fields.alt",
	[FieldName.Width]: "dashboard.fields.width",
	[FieldName.Height]: "dashboard.fields.height",
	[FieldName.Fit]: "dashboard.fields.fit",
	[FieldName.Problem]: "dashboard.fields.problem",
	[FieldName.Approach]: "dashboard.fields.approach",
	[FieldName.Nodes]: "dashboard.fields.nodes",
	[FieldName.Name]: "dashboard.fields.name",
	[FieldName.Description]: "dashboard.fields.description",
	[FieldName.From]: "dashboard.fields.from",
	[FieldName.To]: "dashboard.fields.to",
	[FieldName.FromId]: "dashboard.fields.from-id",
	[FieldName.Lang]: "dashboard.fields.lang",
	[FieldName.Ordered]: "dashboard.fields.ordered",
	[FieldName.Id]: "dashboard.fields.id",
	[FieldName.Title]: "dashboard.fields.title",
	[FieldName.Period]: "dashboard.fields.period",
	[FieldName.Notes]: "dashboard.fields.notes",
	[FieldName.Start]: "dashboard.fields.start",
	[FieldName.End]: "dashboard.fields.end",
	[FieldName.Skills]: "dashboard.fields.skills",
	[FieldName.Core]: "dashboard.fields.core",
	[FieldName.Experience]: "dashboard.fields.experience",
	[FieldName.Education]: "dashboard.fields.education",
};

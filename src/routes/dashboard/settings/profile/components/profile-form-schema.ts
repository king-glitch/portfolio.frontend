import type { TFunction } from "i18next";
import { z } from "zod";
import { profileSchema } from "@/api/schemas/portfolio";
import { SettingKey, type Setting } from "@/api/types/admin/setting";
import { ExperienceKind } from "@/api/types/portfolio/enums";
import type { Experience, Profile } from "@/api/types/portfolio/profile";
import { coreSpecs, skillSpecs, timelineSpecs } from "@/lib/dynamic-form/specs";
import { hasMissing, normalize } from "@/lib/dynamic-form/values";
import { settingValue } from "@/routes/dashboard/settings/components/settings-values";
import type { FieldSpec, FormRecord } from "@/types/dynamic-form";

const NAME_MAX = 200;
const HEADLINE_MAX = 300;
const ABOUT_MAX = 5000;
const DISCORD_MAX = 100;

/** A list of records; no required field may be left blank. */
const records = (specs: FieldSpec[], t: TFunction) =>
	z
		.array(z.record(z.string(), z.unknown()))
		.refine(
			(list) => !list.some((record) => hasMissing(record, specs)),
			t("dashboard.errors.block"),
		);

const optionalUrl = (t: TFunction) =>
	z.union([
		z.literal(""),
		z
			.url(t("dashboard.errors.url"))
			.startsWith("https://", t("dashboard.errors.https")),
	]);

const profileFields = (t: TFunction) =>
	z.object({
		name: z
			.string()
			.max(NAME_MAX, t("dashboard.errors.max", { max: NAME_MAX })),
		headline: z
			.string()
			.max(
				HEADLINE_MAX,
				t("dashboard.errors.max", { max: HEADLINE_MAX }),
			),
		about: z
			.string()
			.max(ABOUT_MAX, t("dashboard.errors.max", { max: ABOUT_MAX })),
		contact: z.object({
			email: z.union([
				z.literal(""),
				z.email(t("dashboard.errors.email")),
			]),
			github: optionalUrl(t),
			linkedin: optionalUrl(t),
			discord: z
				.string()
				.max(
					DISCORD_MAX,
					t("dashboard.errors.max", { max: DISCORD_MAX }),
				),
		}),
		skills: records(skillSpecs, t),
		core: records(coreSpecs, t),
		experience: records(timelineSpecs, t),
		education: records(timelineSpecs, t),
	});

export type ProfileValues = z.infer<ReturnType<typeof profileFields>>;

const cleanEntries = (list: FormRecord[]): FormRecord[] =>
	list.map((entry) => {
		const cleaned = normalize(entry, timelineSpecs);
		return { ...cleaned, end: cleaned.end ?? null };
	});

/** The form's lists cleaned up and checked against the stored profile's contract. */
const contractOf = (values: ProfileValues) =>
	profileSchema.safeParse({
		...values,
		skills: values.skills.map((skill) => normalize(skill, skillSpecs)),
		core: values.core.map((item) => normalize(item, coreSpecs)),
		experience: cleanEntries(values.experience),
		education: cleanEntries(values.education),
	});

/**
 * The form's own rules plus the profile contract, so a value the backend would not take fails on
 * its field here instead of as a generic toast after submit.
 */
export const profileFormSchema = (t: TFunction) =>
	profileFields(t).superRefine((values, ctx) => {
		const parsed = contractOf(values);
		if (parsed.success) return;
		for (const issue of parsed.error.issues)
			ctx.addIssue({
				code: "custom",
				path: issue.path,
				message: t("dashboard.errors.invalid"),
			});
	});

/** The profile to store. Only for values that passed `profileFormSchema`, which holds the same contract. */
export function toProfile(values: ProfileValues): Profile {
	const parsed = contractOf(values);
	if (!parsed.success) throw parsed.error;
	return parsed.data;
}

const emptyProfile: Profile = {
	name: "",
	headline: "",
	about: "",
	skills: [],
	core: [],
	experience: [],
	education: [],
	contact: { email: "", github: "", linkedin: "", discord: "" },
};

const entryRecord = (entry: Experience): FormRecord => ({
	...entry,
	end: entry.end ?? "",
});

/** A stored profile of the wrong shape starts the form empty rather than failing. */
export function toProfileValues(settings: Setting[]): ProfileValues {
	const parsed = profileSchema.safeParse(
		settingValue(settings, SettingKey.Profile),
	);
	const profile = parsed.success ? parsed.data : emptyProfile;
	return {
		name: profile.name,
		headline: profile.headline,
		about: profile.about,
		contact: profile.contact,
		skills: profile.skills.map((skill) => ({ ...skill })),
		core: profile.core.map((item) => ({ ...item })),
		experience: profile.experience.map(entryRecord),
		education: profile.education.map(entryRecord),
	};
}

/** Entry kind a new item of each timeline list starts with. */
export const timelineDefaults: Record<"experience" | "education", FormRecord> =
	{
		experience: { kind: ExperienceKind.Work },
		education: { kind: ExperienceKind.Education },
	};

import type { TFunction } from "i18next";
import { z } from "zod";
import {
	SettingKey,
	type Setting,
	type SettingUpdate,
} from "@/api/types/admin/setting";
import { joinList, splitList } from "@/lib/forms";
import {
	settingValue,
	update,
} from "@/routes/dashboard/settings/components/settings-values";

const DESCRIPTION_MAX = 500;
const KEYWORD_MAX = 100;
const KEYWORDS_MAX = 50;

export const seoFormSchema = (t: TFunction) =>
	z.object({
		seoDescription: z
			.string()
			.max(
				DESCRIPTION_MAX,
				t("dashboard.errors.max", { max: DESCRIPTION_MAX }),
			),
		seoKeywords: z.string().refine(
			(text) =>
				splitList(text).length <= KEYWORDS_MAX &&
				splitList(text).every((word) => word.length <= KEYWORD_MAX),
			t("dashboard.settings.seo.keywords.invalid", {
				count: KEYWORDS_MAX,
				max: KEYWORD_MAX,
			}),
		),
		socialPreviewImage: z.union([
			z.literal(""),
			z.url(t("dashboard.errors.url")),
		]),
	});

export type SeoValues = z.infer<ReturnType<typeof seoFormSchema>>;

export const toSeoValues = (settings: Setting[]): SeoValues => ({
	seoDescription: z
		.string()
		.catch("")
		.parse(settingValue(settings, SettingKey.SeoDescription)),
	seoKeywords: joinList(
		z
			.array(z.string())
			.catch([])
			.parse(settingValue(settings, SettingKey.SeoKeywords)),
	),
	socialPreviewImage: z
		.string()
		.catch("")
		.parse(settingValue(settings, SettingKey.SocialPreviewImage)),
});

export const toSeoUpdates = (values: SeoValues): SettingUpdate[] => [
	update(SettingKey.SeoDescription, values.seoDescription),
	update(SettingKey.SeoKeywords, splitList(values.seoKeywords)),
	update(SettingKey.SocialPreviewImage, values.socialPreviewImage),
];

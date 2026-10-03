import type { TFunction } from "i18next";
import { z } from "zod";
import {
	SettingKey,
	ThemeDefault,
	type Setting,
	type SettingUpdate,
} from "@/api/types/admin/setting";
import {
	settingValue,
	update,
} from "@/routes/dashboard/settings/components/settings-values";

const SITE_TITLE_MAX = 200;

export const generalFormSchema = (t: TFunction) =>
	z.object({
		siteTitle: z
			.string()
			.max(
				SITE_TITLE_MAX,
				t("dashboard.errors.max", { max: SITE_TITLE_MAX }),
			),
		themeDefault: z.enum(ThemeDefault),
		maintenanceMode: z.boolean(),
		featureToggles: z
			.array(
				z.object({
					name: z
						.string()
						.trim()
						.min(1, t("dashboard.errors.required")),
					enabled: z.boolean(),
				}),
			)
			.refine(
				(rows) =>
					new Set(rows.map((row) => row.name)).size === rows.length,
				t("dashboard.settings.general.toggles.unique"),
			),
	});

export type GeneralValues = z.infer<ReturnType<typeof generalFormSchema>>;

/** The form's starting values; a stored value of the wrong shape falls back to the default. */
export const toGeneralValues = (settings: Setting[]): GeneralValues => ({
	siteTitle: z
		.string()
		.catch("")
		.parse(settingValue(settings, SettingKey.SiteTitle)),
	themeDefault: z
		.enum(ThemeDefault)
		.catch(ThemeDefault.System)
		.parse(settingValue(settings, SettingKey.ThemeDefault)),
	maintenanceMode: z
		.boolean()
		.catch(false)
		.parse(settingValue(settings, SettingKey.MaintenanceMode)),
	featureToggles: Object.entries(
		z
			.record(z.string(), z.boolean())
			.catch({})
			.parse(settingValue(settings, SettingKey.FeatureToggles)),
	).map(([name, enabled]) => ({ name, enabled })),
});

export const toGeneralUpdates = (values: GeneralValues): SettingUpdate[] => [
	update(SettingKey.SiteTitle, values.siteTitle),
	update(SettingKey.ThemeDefault, values.themeDefault),
	update(SettingKey.MaintenanceMode, values.maintenanceMode),
	update(
		SettingKey.FeatureToggles,
		Object.fromEntries(
			values.featureToggles.map((row) => [row.name, row.enabled]),
		),
	),
];

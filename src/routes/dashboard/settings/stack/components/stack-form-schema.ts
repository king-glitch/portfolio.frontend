import type { TFunction } from "i18next";
import { z } from "zod";
import { stackStopsSchema } from "@/api/schemas/portfolio";
import {
	SettingKey,
	type Setting,
	type SettingUpdate,
} from "@/api/types/admin/setting";
import {
	settingValue,
	update,
} from "@/routes/dashboard/settings/components/settings-values";

/** Backend schema of `stack_stops` (content/schemas/setting/stack_stops.json). */
const ID = /^[a-z0-9-]{2,32}$/;
const NAME_MAX = 40;
const DESCRIPTION_MAX = 160;
const KEYWORDS_MAX = 12;
const STOPS_MAX = 8;

export const stackFormSchema = (t: TFunction) =>
	z.object({
		stops: z
			.array(
				z.object({
					id: z
						.string()
						.regex(ID, t("dashboard.settings.stack.id.invalid")),
					name: z
						.string()
						.trim()
						.min(1, t("dashboard.errors.required"))
						.max(
							NAME_MAX,
							t("dashboard.errors.max", { max: NAME_MAX }),
						),
					description: z
						.string()
						.trim()
						.min(1, t("dashboard.errors.required"))
						.max(
							DESCRIPTION_MAX,
							t("dashboard.errors.max", { max: DESCRIPTION_MAX }),
						),
					keywords: z
						.array(z.string().trim().min(1))
						.min(1, t("dashboard.settings.stack.keywords.required"))
						.max(
							KEYWORDS_MAX,
							t("dashboard.settings.stack.keywords.max", {
								max: KEYWORDS_MAX,
							}),
						),
					/** Loaded from the backend: its id stays read-only. */
					saved: z.boolean(),
				}),
			)
			.max(
				STOPS_MAX,
				t("dashboard.settings.stack.max", { max: STOPS_MAX }),
			)
			.refine(
				(rows) =>
					new Set(rows.map((row) => row.id)).size === rows.length,
				t("dashboard.settings.stack.unique"),
			),
	});

export type StackValues = z.infer<ReturnType<typeof stackFormSchema>>;

/** A stored value of the wrong shape falls back to no stops. */
export const toStackValues = (settings: Setting[]): StackValues => ({
	stops: stackStopsSchema
		.catch([])
		.parse(settingValue(settings, SettingKey.StackStops))
		.map((stop) => ({ ...stop, saved: true })),
});

export const toStackUpdates = ({ stops }: StackValues): SettingUpdate[] => [
	update(
		SettingKey.StackStops,
		stops.map(({ id, name, description, keywords }) => ({
			id,
			name,
			description,
			keywords,
		})),
	),
];

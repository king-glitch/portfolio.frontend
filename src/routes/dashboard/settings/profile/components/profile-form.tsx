import { UnsavedChangesDialog } from "@/components/common/forms/unsaved-changes-dialog";
import { useUnsavedGuard } from "@/hooks/use-unsaved-guard";
import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ParseKeys } from "i18next";
import { useForm, type Path } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSaveSettings } from "@/api/hooks/admin/settings/use-save-settings";
import type { Setting } from "@/api/types/admin/setting";
import { FormTextField } from "@/components/common/fields/form/form-text-field";
import { FormTextareaField } from "@/components/common/fields/form/form-textarea-field";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { SettingKey } from "@/api/types/admin/setting";
import { coreSpecs, skillSpecs, timelineSpecs } from "@/lib/dynamic-form/specs";
import { update } from "@/routes/dashboard/settings/components/settings-values";
import { SettingsSaveButton } from "@/routes/dashboard/settings/components/settings-save-button";
import { ProfileSection } from "@/routes/dashboard/settings/profile/components/profile-section";
import {
	profileFormSchema,
	timelineDefaults,
	toProfile,
	toProfileValues,
	type ProfileValues,
} from "@/routes/dashboard/settings/profile/components/profile-form-schema";
import { FieldKind, FieldName, type FieldSpec } from "@/types/dynamic-form";

const objectsOf = (name: FieldName, fields: FieldSpec[]): FieldSpec => ({
	name,
	kind: FieldKind.Objects,
	fields,
});

const sections = [
	{
		name: "skills",
		spec: objectsOf(FieldName.Skills, skillSpecs),
	},
	{
		name: "core",
		spec: objectsOf(FieldName.Core, coreSpecs),
	},
	{
		name: "experience",
		spec: objectsOf(FieldName.Experience, timelineSpecs),
		defaults: timelineDefaults.experience,
	},
	{
		name: "education",
		spec: objectsOf(FieldName.Education, timelineSpecs),
		defaults: timelineDefaults.education,
	},
] as const;

interface ContactField {
	name: Path<ProfileValues>;
	labelKey: ParseKeys;
	hintKey?: ParseKeys;
	type: string;
}

const contactFields: ContactField[] = [
	{
		name: "contact.email",
		labelKey: "dashboard.settings.profile.contact.email.label",
		type: "email",
	},
	{
		name: "contact.github",
		labelKey: "dashboard.settings.profile.contact.github.label",
		type: "url",
	},
	{
		name: "contact.linkedin",
		labelKey: "dashboard.settings.profile.contact.linkedin.label",
		type: "url",
	},
	{
		name: "contact.discord",
		labelKey: "dashboard.settings.profile.contact.discord.label",
		hintKey: "dashboard.settings.profile.contact.discord.hint",
		type: "text",
	},
];

interface ProfileFormProps {
	settings: Setting[];
}

/** The site's profile: basics, contact and the repeating sections, saved as one setting. */
export const ProfileForm: React.FC<ProfileFormProps> = ({ settings }) => {
	const { t } = useTranslation();
	const save = useSaveSettings();
	const schema = useMemo(() => profileFormSchema(t), [t]);
	const form = useForm<ProfileValues>({
		resolver: zodResolver(schema),
		defaultValues: toProfileValues(settings),
	});
	const { blocker } = useUnsavedGuard(form.formState.isDirty);

	const onSubmit = form.handleSubmit((values) =>
		save.mutate([update(SettingKey.Profile, toProfile(values))], {
			onSuccess: () => {
				form.reset(form.getValues());
				toast.add({
					type: "success",
					title: t("dashboard.settings.saved"),
				});
			},
		}),
	);

	return (
		<>
			<form noValidate onSubmit={onSubmit} className="max-w-3xl">
				<FieldGroup>
					<FormTextField
						control={form.control}
						name="name"
						label={t("dashboard.settings.profile.name.label")}
					/>
					<FormTextField
						control={form.control}
						name="headline"
						label={t("dashboard.settings.profile.headline.label")}
					/>
					<FormTextareaField
						control={form.control}
						name="about"
						label={t("dashboard.settings.profile.about.label")}
						rows={6}
					/>
					<FieldSet>
						<FieldLegend>
							{t("dashboard.settings.profile.contact.legend")}
						</FieldLegend>
						<FieldGroup>
							{contactFields.map((field) => (
								<FormTextField
									key={field.name}
									control={form.control}
									name={field.name}
									label={t(field.labelKey)}
									description={
										field.hintKey
											? t(field.hintKey)
											: undefined
									}
									type={field.type}
								/>
							))}
						</FieldGroup>
					</FieldSet>
					{sections.map((section) => (
						<ProfileSection
							key={section.name}
							control={form.control}
							name={section.name}
							spec={section.spec}
							defaults={
								"defaults" in section
									? section.defaults
									: undefined
							}
						/>
					))}
					<SettingsSaveButton
						pending={save.isPending}
						clean={!form.formState.isDirty}
					/>
				</FieldGroup>
			</form>
			<UnsavedChangesDialog blocker={blocker} />
		</>
	);
};

export default ProfileForm;

import React from "react";
import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { fieldLabels } from "@/lib/dynamic-form/options";
import { DynamicObjectsField } from "@/routes/dashboard/components/dynamic-form/dynamic-objects-field";
import type { ProfileValues } from "@/routes/dashboard/settings/profile/components/profile-form-schema";
import type { FieldSpec, FormRecord } from "@/types/dynamic-form";

interface ProfileSectionProps {
	control: Control<ProfileValues>;
	name: "skills" | "core" | "experience" | "education";
	spec: FieldSpec;
	defaults?: FormRecord;
}

/** One repeating part of the profile (skills, core skills, experience, education) as add/remove cards. */
export const ProfileSection: React.FC<ProfileSectionProps> = ({
	control,
	name,
	spec,
	defaults,
}) => {
	const { t } = useTranslation();
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<DynamicObjectsField
					spec={spec}
					label={t(fieldLabels[spec.name])}
					value={field.value}
					onChange={field.onChange}
					invalid={fieldState.invalid}
					defaults={defaults}
				/>
			)}
		/>
	);
};

export default ProfileSection;

import React from "react";
import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { useFieldArray, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormSwitchField } from "@/components/common/fields/form-switch-field";
import { FormTextField } from "@/components/common/fields/form-text-field";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import type { GeneralValues } from "@/routes/dashboard/settings/general/components/general-form-schema";

interface FeatureTogglesProps {
	control: Control<GeneralValues>;
}

/** Named on/off flags: add a flag, name it, switch it, remove it. */
export const FeatureToggles: React.FC<FeatureTogglesProps> = ({ control }) => {
	const { t } = useTranslation();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "featureToggles",
	});
	return (
		<Field>
			<FieldLabel>
				{t("dashboard.settings.general.toggles.label")}
			</FieldLabel>
			<FieldDescription>
				{t("dashboard.settings.general.toggles.hint")}
			</FieldDescription>
			{fields.map((row, index) => (
				<div key={row.id} className="flex items-end gap-3">
					<div className="grow">
						<FormTextField
							control={control}
							name={`featureToggles.${index}.name`}
							label={t("dashboard.settings.general.toggles.name")}
						/>
					</div>
					<FormSwitchField
						control={control}
						name={`featureToggles.${index}.enabled`}
						label={t("dashboard.settings.general.toggles.enabled")}
					/>
					<Button
						variant="ghost"
						size="icon"
						aria-label={t(
							"dashboard.settings.general.toggles.remove",
							{
								name: row.name,
							},
						)}
						onClick={() => remove(index)}
					>
						<RiDeleteBinLine />
					</Button>
				</div>
			))}
			<Button
				variant="outline"
				className="self-start"
				onClick={() => append({ name: "", enabled: true })}
			>
				<RiAddLine data-icon="inline-start" />
				{t("dashboard.settings.general.toggles.add")}
			</Button>
		</Field>
	);
};

export default FeatureToggles;

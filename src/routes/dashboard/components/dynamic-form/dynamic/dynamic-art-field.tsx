import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { Field, FieldLabel } from "@/components/ui/field";
import { FieldKind, FieldName } from "@/types/dynamic-form";
import { asString, setField } from "@/lib/dynamic-form/values";
import { ArtField } from "@/routes/dashboard/components/art/art-field";
import type { FieldSpec, FormRecord } from "@/types/dynamic-form";

interface DynamicArtFieldProps {
	spec: FieldSpec;
	record: FormRecord;
	onChange: (record: FormRecord) => void;
	invalid: boolean;
}

/** Preset + uploaded image of a block: writes the two keys the spec names (`name` and `imageName`). */
export const DynamicArtField: React.FC<DynamicArtFieldProps> = ({
	spec,
	record,
	onChange,
	invalid,
}) => {
	const { t } = useTranslation();
	const id = useId();
	const imageSpec: FieldSpec = {
		name: spec.imageName ?? FieldName.ImageUrl,
		kind: FieldKind.File,
		optional: true,
	};
	const kind = asString(record[spec.name]);
	return (
		<Field data-invalid={invalid && !spec.optional && !kind}>
			<FieldLabel>{t("dashboard.art.label")}</FieldLabel>
			<ArtField
				id={id}
				kind={kind}
				imageUrl={asString(record[imageSpec.name])}
				optionalKind={spec.optional}
				onKindChange={(next) => onChange(setField(record, spec, next))}
				onImageChange={(url) =>
					onChange(setField(record, imageSpec, url))
				}
			/>
		</Field>
	);
};

export default DynamicArtField;

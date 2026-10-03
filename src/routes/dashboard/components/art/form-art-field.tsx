import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { ArtField } from "@/routes/dashboard/components/art/art-field";
import type { ArtFormValues } from "@/types/dynamic-form";

interface FormArtFieldProps {}

/** `ArtField` bound to the `kind` and `artUrl` of the enclosing form (must sit in a `FormProvider`). */
export const FormArtField: React.FC<FormArtFieldProps> = () => {
	const { t } = useTranslation();
	const { control } = useFormContext<ArtFormValues>();
	const kind = useController({ control, name: "kind" });
	const url = useController({ control, name: "artUrl" });
	const error = kind.fieldState.error ?? url.fieldState.error;
	return (
		<Field data-invalid={Boolean(error)}>
			<FieldLabel htmlFor="artUrl">{t("dashboard.art.label")}</FieldLabel>
			<ArtField
				id="artUrl"
				kind={kind.field.value}
				imageUrl={url.field.value}
				invalid={Boolean(error)}
				onKindChange={kind.field.onChange}
				onImageChange={url.field.onChange}
			/>
			{error ? <FieldError errors={[error]} /> : null}
		</Field>
	);
};

export default FormArtField;

// style-lint-ignore-file common-reuse -- the react-hook-form field of the project form; it belongs with the other form fields
import React from "react";
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";
import { LinesEditor } from "@/components/common/fields/lines-editor";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";

interface FormLinesFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	description?: string;
}

/** shadcn `Field` + `LinesEditor` bound to react-hook-form (string-array values). */
export function FormLinesField<T extends FieldValues>({
	control,
	name,
	label,
	description,
}: FormLinesFieldProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<LinesEditor
						id={field.name}
						value={field.value}
						onChange={field.onChange}
						invalid={fieldState.invalid}
					/>
					{description ? (
						<FieldDescription>{description}</FieldDescription>
					) : null}
					{fieldState.invalid ? (
						<FieldError errors={[fieldState.error]} />
					) : null}
				</Field>
			)}
		/>
	);
}

export default FormLinesField;

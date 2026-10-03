import React from "react";
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { ProjectSelect } from "@/routes/dashboard/components/fields/project-select";

interface FormProjectSelectFieldProps<T extends FieldValues> {
	control: Control<T>;
	/** A string field holding the project's document id, "" for none. */
	name: Path<T>;
	label: string;
	description?: string;
}

/** shadcn `Field` + `ProjectSelect` bound to react-hook-form. */
export function FormProjectSelectField<T extends FieldValues>({
	control,
	name,
	label,
	description,
}: FormProjectSelectFieldProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<ProjectSelect
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

export default FormProjectSelectField;

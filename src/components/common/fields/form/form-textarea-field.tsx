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
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaFieldProps<T extends FieldValues> extends Omit<
	React.ComponentProps<typeof Textarea>,
	"name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref"
> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	description?: string;
}

/** shadcn `Field` + `Textarea` bound to react-hook-form. */
export function FormTextareaField<T extends FieldValues>({
	control,
	name,
	label,
	description,
	...props
}: FormTextareaFieldProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<Textarea
						{...props}
						{...field}
						id={field.name}
						aria-invalid={fieldState.invalid}
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

export default FormTextareaField;

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
import { Input } from "@/components/ui/input";

interface FormTextFieldProps<T extends FieldValues> extends Omit<
	React.ComponentProps<typeof Input>,
	"name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref"
> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	description?: string;
}

/** shadcn `Field` + `Input` bound to react-hook-form; shows the field's validation message. */
export function FormTextField<T extends FieldValues>({
	control,
	name,
	label,
	description,
	...props
}: FormTextFieldProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<Input
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

export default FormTextField;

import React from "react";
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

interface FormSwitchFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	description?: string;
}

/** shadcn horizontal `Field` + `Switch` bound to react-hook-form (boolean values). */
export function FormSwitchField<T extends FieldValues>({
	control,
	name,
	label,
	description,
}: FormSwitchFieldProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field
					orientation="horizontal"
					data-invalid={fieldState.invalid}
				>
					<FieldContent>
						<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
						{description ? (
							<FieldDescription>{description}</FieldDescription>
						) : null}
						{fieldState.invalid ? (
							<FieldError errors={[fieldState.error]} />
						) : null}
					</FieldContent>
					<Switch
						id={field.name}
						name={field.name}
						checked={field.value}
						onCheckedChange={field.onChange}
						aria-invalid={fieldState.invalid}
					/>
				</Field>
			)}
		/>
	);
}

export default FormSwitchField;

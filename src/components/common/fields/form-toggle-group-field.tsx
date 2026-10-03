// style-lint-ignore-file common-reuse -- one form uses it today; it belongs with the other react-hook-form fields
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface FormToggleGroupFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	/** `label` is already translated. */
	options: { value: string; label: string }[];
	description?: string;
}

/** shadcn `Field` + multi-select `ToggleGroup` bound to react-hook-form (string-array values). */
export function FormToggleGroupField<T extends FieldValues>({
	control,
	name,
	label,
	options,
	description,
}: FormToggleGroupFieldProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel>{label}</FieldLabel>
					<ToggleGroup
						multiple
						variant="outline"
						value={field.value}
						onValueChange={field.onChange}
						className="flex-wrap"
					>
						{options.map((option) => (
							<ToggleGroupItem
								key={option.value}
								value={option.value}
							>
								{option.label}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
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

export default FormToggleGroupField;

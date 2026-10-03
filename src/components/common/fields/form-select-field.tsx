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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface FormSelectFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	/** `label` is already translated. */
	options: { value: string; label: string }[];
	placeholder?: string;
	description?: string;
	disabled?: boolean;
}

/** shadcn `Field` + `Select` bound to react-hook-form; the value is the option's `value` string. */
export function FormSelectField<T extends FieldValues>({
	control,
	name,
	label,
	options,
	placeholder,
	description,
	disabled,
}: FormSelectFieldProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<Select
						items={options}
						name={field.name}
						disabled={disabled}
						value={field.value}
						onValueChange={field.onChange}
					>
						<SelectTrigger
							id={field.name}
							aria-invalid={fieldState.invalid}
							className="w-full"
						>
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent>
							{options.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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

export default FormSelectField;

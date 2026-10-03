// style-lint-ignore-file query-states -- suggestions are an extra; while loading or if they fail the field still takes typed tags
import React from "react";
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from "react-hook-form";
import { TagsField } from "@/components/common/fields/tags-field";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { useTagSuggestions } from "@/api/hooks/admin/use-tag-suggestions";

interface FormTagsFieldProps<T extends FieldValues> {
	control: Control<T>;
	/** A string-array field. */
	name: Path<T>;
	label: string;
	description?: string;
}

/** shadcn `Field` + `TagsField` bound to react-hook-form, suggesting the tags the dashboard already uses. */
export function FormTagsField<T extends FieldValues>({
	control,
	name,
	label,
	description,
}: FormTagsFieldProps<T>) {
	const suggestions = useTagSuggestions();
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<TagsField
						id={field.name}
						value={field.value}
						onChange={field.onChange}
						suggestions={suggestions}
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

export default FormTagsField;

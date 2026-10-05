import React from "react";
import { FieldGroup } from "@/components/ui/field";
import { setField } from "@/lib/dynamic-form/values";
import { DynamicField } from "@/routes/dashboard/components/dynamic-form/dynamic/dynamic-field";
import {
	FieldKind,
	type FieldSpec,
	type FormRecord,
} from "@/types/dynamic-form";

interface DynamicFieldsProps {
	specs: FieldSpec[];
	record: FormRecord;
	onChange: (record: FormRecord) => void;
	/** The form was rejected: required fields that are still empty show it. */
	invalid: boolean;
}

/** The fields of one record, from its specs: block params, a list item, a profile entry. */
export const DynamicFields: React.FC<DynamicFieldsProps> = ({
	specs,
	record,
	onChange,
	invalid,
}) => {
	return (
		<FieldGroup>
			{specs
				.filter((spec) => !spec.hidden)
				.map((spec) => (
					<DynamicField
						key={spec.name}
						spec={spec}
						value={record[spec.name]}
						invalid={invalid}
						onChange={(value) =>
							onChange(setField(record, spec, value))
						}
					/>
				))}
		</FieldGroup>
	);
};

export default DynamicFields;

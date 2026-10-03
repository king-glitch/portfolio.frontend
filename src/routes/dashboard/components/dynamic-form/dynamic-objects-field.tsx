import React from "react";
import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { asRecords, emptyRecord } from "@/lib/dynamic-form/values";
import { DynamicFields } from "@/routes/dashboard/components/dynamic-form/dynamic-fields";
import type { FieldSpec, FormRecord } from "@/types/dynamic-form";

interface DynamicObjectsFieldProps {
	spec: FieldSpec;
	label: string;
	value: unknown;
	onChange: (records: FormRecord[]) => void;
	invalid: boolean;
	/** Values a new item starts with (e.g. the `kind` of a profile entry). */
	defaults?: FormRecord;
}

/** A list of records edited as cards with their own fields; add and remove items. */
export const DynamicObjectsField: React.FC<DynamicObjectsFieldProps> = ({
	spec,
	label,
	value,
	onChange,
	invalid,
	defaults,
}) => {
	const { t } = useTranslation();
	const fields = spec.fields ?? [];
	const records = asRecords(value);

	return (
		<Field>
			<FieldLabel>{label}</FieldLabel>
			{records.map((record, index) => (
				<Card key={index} size="sm">
					<CardContent className="flex flex-col gap-4">
						<DynamicFields
							specs={fields}
							record={record}
							invalid={invalid}
							onChange={(next) =>
								onChange(
									records.map((item, i) =>
										i === index ? next : item,
									),
								)
							}
						/>
						<Button
							variant="ghost"
							size="sm"
							className="self-end"
							onClick={() =>
								onChange(records.filter((_, i) => i !== index))
							}
						>
							<RiDeleteBinLine data-icon="inline-start" />
							{t("dashboard.dynamic.remove", { name: label })}
						</Button>
					</CardContent>
				</Card>
			))}
			<Button
				variant="outline"
				className="self-start"
				onClick={() =>
					onChange([...records, emptyRecord(fields, defaults)])
				}
			>
				<RiAddLine data-icon="inline-start" />
				{t("dashboard.dynamic.add", { name: label })}
			</Button>
		</Field>
	);
};

export default DynamicObjectsField;

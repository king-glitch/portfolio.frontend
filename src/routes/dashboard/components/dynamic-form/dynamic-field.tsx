import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { config } from "@/config";
import { fieldLabels, optionSets } from "@/lib/dynamic-form/options";
import { asBool, asString, asStrings } from "@/lib/dynamic-form/values";
import { DynamicObjectsField } from "@/routes/dashboard/components/dynamic-form/dynamic-objects-field";
import { DynamicProjectSelect } from "@/routes/dashboard/components/dynamic-form/dynamic-project-select";
import { FieldKind, type FieldSpec } from "@/types/dynamic-form";

const LINE_BREAK = "\n";

interface DynamicFieldProps {
	spec: FieldSpec;
	value: unknown;
	onChange: (value: unknown) => void;
	invalid: boolean;
}

/** One field of a schema-driven form, edited with the shadcn control its kind calls for. */
export const DynamicField: React.FC<DynamicFieldProps> = ({
	spec,
	value,
	onChange,
	invalid,
}) => {
	const { t } = useTranslation();
	const id = useId();
	const label = t(fieldLabels[spec.name]);
	const text = asString(value);
	const missing =
		invalid && !spec.optional && !spec.allowEmpty && text.trim() === "";

	const renderControl = () => {
		switch (spec.kind) {
			case FieldKind.Textarea:
				return (
					<Textarea
						id={id}
						value={text}
						rows={4}
						aria-invalid={missing}
						onChange={(event) => onChange(event.target.value)}
					/>
				);
			case FieldKind.Month:
				return (
					<Input
						id={id}
						type="month"
						value={text}
						aria-invalid={missing}
						onChange={(event) => onChange(event.target.value)}
					/>
				);
			case FieldKind.Lines:
				return (
					<Textarea
						id={id}
						value={asStrings(value).join(LINE_BREAK)}
						rows={4}
						onChange={(event) =>
							onChange(event.target.value.split(LINE_BREAK))
						}
					/>
				);
			case FieldKind.Switch:
				return (
					<Switch
						id={id}
						checked={asBool(value)}
						onCheckedChange={onChange}
					/>
				);
			case FieldKind.Select: {
				const choices = spec.options ? optionSets[spec.options] : [];
				const items = [
					...(spec.optional
						? [
								{
									value: config.dashboard.noValue,
									label: t("dashboard.dynamic.none"),
								},
							]
						: []),
					...choices.map((choice) => ({
						value: choice.value,
						label: t(choice.labelKey),
					})),
				];
				return (
					<Select
						items={items}
						value={text || config.dashboard.noValue}
						onValueChange={(next) =>
							onChange(
								next === config.dashboard.noValue ? "" : next,
							)
						}
					>
						<SelectTrigger id={id} className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{items.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);
			}
			case FieldKind.Project:
				return (
					<DynamicProjectSelect
						id={id}
						value={text}
						onChange={onChange}
					/>
				);
			case FieldKind.Objects:
				return null;
			case FieldKind.Text:
				return (
					<Input
						id={id}
						value={text}
						aria-invalid={missing}
						onChange={(event) => onChange(event.target.value)}
					/>
				);
		}
	};

	if (spec.kind === FieldKind.Objects)
		return (
			<DynamicObjectsField
				spec={spec}
				label={label}
				value={value}
				invalid={invalid}
				onChange={onChange}
			/>
		);

	return (
		<Field
			orientation={
				spec.kind === FieldKind.Switch ? "horizontal" : "vertical"
			}
			data-invalid={missing}
		>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			{renderControl()}
			{spec.kind === FieldKind.Lines ? (
				<FieldDescription>
					{t("dashboard.dynamic.lines.hint")}
				</FieldDescription>
			) : null}
		</Field>
	);
};

export default DynamicField;

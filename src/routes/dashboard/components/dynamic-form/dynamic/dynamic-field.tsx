import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import { Field, FieldLabel } from "@/components/ui/field";
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
import { DynamicObjectsField } from "@/routes/dashboard/components/dynamic-form/dynamic/dynamic-objects-field";
import { FileSelectField } from "@/routes/dashboard/components/storage/file/select/file-select-field";
import { ProjectSelect } from "@/routes/dashboard/components/fields/project-select";
import { LinesEditor } from "@/components/common/fields/lines-editor";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FieldKind, type FieldSpec } from "@/types/dynamic-form";
import { FileValueKey } from "@/types/ui";

/** Choices up to this many read better as visible options than as a dropdown. */
const TOGGLE_MAX = 3;

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
	const required =
		!spec.optional &&
		!spec.allowEmpty &&
		(spec.kind === FieldKind.Text ||
			spec.kind === FieldKind.Textarea ||
			spec.kind === FieldKind.Month);
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
					<LinesEditor
						id={id}
						value={asStrings(value)}
						onChange={onChange}
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
				if (choices.length <= TOGGLE_MAX)
					return (
						<ToggleGroup
							variant="outline"
							value={text ? [text] : []}
							onValueChange={([next]) => {
								// an optional choice can be switched off; a required one stays chosen
								if (next || spec.optional) onChange(next ?? "");
							}}
						>
							{choices.map((choice) => (
								<ToggleGroupItem
									key={choice.value}
									value={choice.value}
								>
									{t(choice.labelKey)}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					);
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
					<ProjectSelect id={id} value={text} onChange={onChange} />
				);
			case FieldKind.File:
				return (
					<FileSelectField
						id={id}
						accept={spec.accept ?? []}
						by={FileValueKey.Url}
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
			<FieldLabel htmlFor={id}>
				{label}
				{required ? (
					<span aria-hidden="true" className="text-destructive">
						*
					</span>
				) : null}
			</FieldLabel>
			{renderControl()}
		</Field>
	);
};

export default DynamicField;

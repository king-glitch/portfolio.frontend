import React from "react";
import {
	RiArrowDownLine,
	RiArrowUpLine,
	RiDeleteBinLine,
} from "@remixicon/react";
import {
	Controller,
	type Control,
	type UseFormSetValue,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/portfolio/ids";
import type { CategoriesValues } from "@/routes/dashboard/settings/categories/components/categories-form-schema";

interface CategoryRowProps {
	control: Control<CategoriesValues>;
	setValue: UseFormSetValue<CategoriesValues>;
	index: number;
	total: number;
	/** Already stored: the slug is read-only. */
	saved: boolean;
	/** Label as loaded, for the buttons' accessible names. */
	name: string;
	onMove: (delta: number) => void;
	onRemove: () => void;
}

/** One category: label, slug (derived from the label until saved), move and remove. */
export const CategoryRow: React.FC<CategoryRowProps> = ({
	control,
	setValue,
	index,
	total,
	saved,
	name,
	onMove,
	onRemove,
}) => {
	const { t } = useTranslation();
	const actions = [
		{
			id: "up",
			icon: RiArrowUpLine,
			label: t("dashboard.settings.categories.move.up", { name }),
			disabled: index === 0,
			onClick: () => onMove(-1),
		},
		{
			id: "down",
			icon: RiArrowDownLine,
			label: t("dashboard.settings.categories.move.down", { name }),
			disabled: index === total - 1,
			onClick: () => onMove(1),
		},
		{
			id: "remove",
			icon: RiDeleteBinLine,
			label: t("dashboard.settings.categories.remove", { name }),
			disabled: false,
			onClick: onRemove,
		},
	];
	return (
		<div className="flex flex-wrap items-start gap-3">
			<Controller
				control={control}
				name={`categories.${index}.label`}
				render={({ field, fieldState }) => (
					<Field
						data-invalid={fieldState.invalid}
						className="min-w-40 flex-1"
					>
						<FieldLabel htmlFor={field.name}>
							{t("dashboard.settings.categories.name.label")}
						</FieldLabel>
						<Input
							{...field}
							id={field.name}
							aria-invalid={fieldState.invalid}
							onChange={(event) => {
								field.onChange(event);
								if (!saved)
									setValue(
										`categories.${index}.slug`,
										slugify(event.target.value),
									);
							}}
						/>
						{fieldState.invalid ? (
							<FieldError errors={[fieldState.error]} />
						) : null}
					</Field>
				)}
			/>
			<Controller
				control={control}
				name={`categories.${index}.slug`}
				render={({ field, fieldState }) => (
					<Field
						data-invalid={fieldState.invalid}
						className="min-w-40 flex-1"
					>
						<FieldLabel htmlFor={field.name}>
							{t("dashboard.settings.categories.slug.label")}
						</FieldLabel>
						<Input
							{...field}
							id={field.name}
							readOnly={saved}
							aria-invalid={fieldState.invalid}
						/>
						{fieldState.invalid ? (
							<FieldError errors={[fieldState.error]} />
						) : null}
					</Field>
				)}
			/>
			<div className="flex gap-1 self-end">
				{actions.map(({ id, icon: Icon, label, disabled, onClick }) => (
					<Button
						key={id}
						variant="ghost"
						size="icon"
						aria-label={label}
						disabled={disabled}
						onClick={onClick}
					>
						<Icon />
					</Button>
				))}
			</div>
		</div>
	);
};

export default CategoryRow;

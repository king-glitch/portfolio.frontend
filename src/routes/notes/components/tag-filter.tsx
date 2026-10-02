import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/** Value of the "All" chip; real tags are never blank (see `parseTagParam`). */
const ALL = "";

interface TagFilterProps {
	tags: string[];
	/** Active tag, undefined = all. */
	value: string | undefined;
	onChange: (tag: string | undefined) => void;
	className?: string;
}

/** Topic chips bound to `?tag=`. Re-pressing the active chip keeps it selected. */
export const TagFilter: React.FC<TagFilterProps> = ({
	tags,
	value,
	onChange,
	className,
}) => {
	const { t } = useTranslation();
	const options = [
		{ id: ALL, label: t("notes.list.filter.all") },
		...tags.map((tag) => ({ id: tag, label: tag })),
	];
	return (
		<ToggleGroup
			aria-label={t("notes.list.filter.aria-label")}
			variant="outline"
			value={[value ?? ALL]}
			onValueChange={([next]) => {
				if (next !== undefined)
					onChange(next === ALL ? undefined : next);
			}}
			className={cn(
				"max-w-full flex-nowrap overflow-x-auto md:max-w-115 md:flex-wrap md:justify-end",
				className,
			)}
		>
			{options.map((option) => (
				<ToggleGroupItem
					key={option.id}
					value={option.id}
					className="shrink-0 rounded-pill px-4"
				>
					{option.label}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
};

export default TagFilter;

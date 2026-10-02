import React from "react";
import { useTranslation } from "react-i18next";
import { FilterToggle } from "@/components/common/filters/filter-toggle";
import { cn } from "@/lib/utils";
import type { FilterOption } from "@/types/ui";

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
	const options: FilterOption<string>[] = [
		{ id: ALL, label: t("notes.list.filter.all") },
		...tags.map((tag) => ({ id: tag, label: tag })),
	];
	return (
		<FilterToggle
			ariaLabel={t("notes.list.filter.aria-label")}
			value={value ?? ALL}
			options={options}
			onChange={(next) => onChange(next === ALL ? undefined : next)}
			className={cn(
				"max-w-full flex-nowrap overflow-x-auto md:max-w-115 md:flex-wrap md:justify-end",
				className,
			)}
		/>
	);
};

export default TagFilter;

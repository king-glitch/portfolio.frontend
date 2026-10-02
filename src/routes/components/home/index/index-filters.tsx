import React from "react";
import { useTranslation } from "react-i18next";
import { ProjectFilter } from "@/api/types/portfolio/enums";
import { FilterToggle } from "@/components/common/filters/filter-toggle";
import type { FilterOption } from "@/types/ui";

interface IndexFiltersProps {
	value: ProjectFilter;
	/** Per-filter project counts; undefined while loading. */
	counts?: Record<ProjectFilter, number>;
	onChange: (value: ProjectFilter) => void;
}

/** Project filter chips (All / Games / Platforms / On-chain) with counts; scrolls sideways on narrow screens. */
export const IndexFilters: React.FC<IndexFiltersProps> = ({
	value,
	counts,
	onChange,
}) => {
	const { t } = useTranslation();
	const options: FilterOption<ProjectFilter>[] = Object.values(ProjectFilter).map(
		(id) => ({
			id,
			labelKey: `common.filters.${id}`,
			count: counts?.[id],
		}),
	);
	return (
		<FilterToggle
			value={value}
			options={options}
			onChange={onChange}
			ariaLabel={t("home.index.filters.aria-label")}
			className="max-w-full overflow-x-auto"
		/>
	);
};

export default IndexFilters;

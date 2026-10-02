import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { ProjectFilter } from "@/api/types/portfolio/enums";
import { FilterToggle } from "@/components/common/filters/filter-toggle";
import type { FilterOption } from "@/types/ui";

const LABELS: Record<ProjectFilter, ParseKeys> = {
	[ProjectFilter.All]: "common.filters.all",
	[ProjectFilter.Games]: "common.filters.games",
	[ProjectFilter.Platforms]: "common.filters.platforms",
	[ProjectFilter.OnChain]: "common.filters.on-chain",
};

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
	const options: FilterOption<ProjectFilter>[] = Object.values(
		ProjectFilter,
	).map((id) => ({
		id,
		label: t(LABELS[id]),
		count: counts?.[id],
	}));
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

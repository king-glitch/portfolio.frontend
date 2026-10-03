import React from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { ProjectCategory } from "@/api/types/portfolio/project";
import { FilterToggle } from "@/components/common/filters/filter-toggle";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import type { FilterOption } from "@/types/ui";

interface IndexFiltersProps {
	/** The owner-defined categories; chips follow it. */
	categories: UseQueryResult<ProjectCategory[]>;
	/** A category slug or the "all" constant. */
	value: string;
	/** Per-filter project counts; undefined while loading. */
	counts?: Record<string, number>;
	onChange: (value: string) => void;
}

const SKELETON_CHIPS = 3;

/** Project filter chips ("All" plus one per category) with counts; skeleton while loading, retry alert on error. */
export const IndexFilters: React.FC<IndexFiltersProps> = ({
	categories,
	value,
	counts,
	onChange,
}) => {
	const { t } = useTranslation();
	if (categories.isPending)
		return (
			<div className="flex flex-wrap gap-2">
				{Array.from({ length: SKELETON_CHIPS }, (_, index) => (
					<Skeleton key={index} className="h-10 w-28 rounded-pill" />
				))}
			</div>
		);
	if (categories.isError)
		return (
			<QueryErrorAlert
				onRetry={() => void categories.refetch()}
				error={categories.error}
			/>
		);
	// category labels are data (owner-defined), so they render as they are
	const options: FilterOption<string>[] = [
		{
			id: config.portfolio.defaultFilter,
			label: t("common.filters.all"),
			count: counts?.[config.portfolio.defaultFilter],
		},
		...categories.data.map(({ slug, label }) => ({
			id: slug,
			label,
			count: counts?.[slug],
		})),
	];
	return (
		<FilterToggle
			value={value}
			options={options}
			onChange={onChange}
			ariaLabel={t("home.index.filters.aria-label")}
			className="flex-wrap"
		/>
	);
};

export default IndexFilters;

import React, { useState } from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { useProjectCategories } from "@/api/hooks/portfolio/use-project-categories";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import { countByFilter, filterProjects } from "@/lib/portfolio/filter";
import { HomePad } from "@/types/home";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomeSectionHead } from "@/routes/components/home/home-section-head";
import { IndexFilters } from "@/routes/components/home/index/index-filters";
import { IndexPreview } from "@/routes/components/home/index/index-preview";
import { ProjectIndexRow } from "@/routes/components/home/index/project-index-row";
import { ProjectIndexSkeleton } from "@/routes/components/home/index/project-index-skeleton";

const COLUMNS: ParseKeys[] = [
	"home.index.columns.number",
	"home.index.columns.project",
	"home.index.columns.stack",
	"home.index.columns.side",
];

interface ProjectIndexProps {}

/** "Selected work" index: filterable rows bound to `?filter=`, with a cursor-following screen preview. */
export const ProjectIndex: React.FC<ProjectIndexProps> = () => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProjects();
	const categories = useProjectCategories();
	const [params, setParams] = useSearchParams();
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const filterKey = config.portfolio.searchParams.filter;
	const requested = params.get(filterKey) ?? config.portfolio.defaultFilter;
	// an unknown or removed category silently becomes the default (checked once the categories are known)
	const filter =
		categories.data &&
		requested !== config.portfolio.defaultFilter &&
		!categories.data.some((c) => c.slug === requested)
			? config.portfolio.defaultFilter
			: requested;

	const onFilter = (next: string) => {
		const nextParams = new URLSearchParams(params);
		if (next === config.portfolio.defaultFilter)
			nextParams.delete(filterKey);
		else nextParams.set(filterKey, next);
		setParams(nextParams, { preventScrollReset: true });
	};

	const shown = data ? filterProjects(data, filter) : [];

	const renderRows = () => {
		if (isError)
			return (
				<QueryErrorAlert
					onRetry={() => void refetch()}
					className="mt-8"
				/>
			);
		if (isPending) return <ProjectIndexSkeleton />;
		if (!shown.length)
			return (
				<QueryEmpty
					titleKey={
						data?.length
							? "home.index.empty.filtered.title"
							: "home.index.empty.title"
					}
					className="py-16"
				/>
			);
		return shown.map((project) => (
			<ProjectIndexRow
				key={project.id}
				project={project}
				onHover={setHoveredId}
			/>
		));
	};

	return (
		<HomeSection id={config.sections.work} pad={HomePad.Both}>
			<HomeSectionHead
				index={3}
				label={t("home.index.eyebrow")}
				title={
					<>
						{t("home.index.title")}
						{data ? (
							<sup className="ml-2 align-top text-[0.26em] tracking-normal text-muted-foreground tabular-nums">
								{String(shown.length).padStart(2, "0")}
							</sup>
						) : null}
					</>
				}
				aside={
					<IndexFilters
						categories={categories}
						value={filter}
						counts={
							data && categories.data
								? countByFilter(
										data,
										categories.data.map((c) => c.slug),
									)
								: undefined
						}
						onChange={onFilter}
					/>
				}
			/>
			<div
				aria-hidden="true"
				className="mt-10 hidden grid-cols-[96px_minmax(0,1fr)_minmax(0,0.9fr)_130px_40px] gap-6 px-1 pb-3 text-[11px] font-medium tracking-widest text-muted-foreground uppercase desk:grid"
			>
				{COLUMNS.map((key) => (
					<span key={key}>{t(key)}</span>
				))}
				<span />
			</div>
			<div className="border-t max-desk:mt-7 [&:hover_a:not(:hover):not(:focus-visible)]:opacity-30">
				{renderRows()}
			</div>
			<IndexPreview projects={data ?? []} hoveredId={hoveredId} />
		</HomeSection>
	);
};

export default ProjectIndex;

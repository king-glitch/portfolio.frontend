import React from "react";
import {
	RiCloseLine,
	RiLayoutGridLine,
	RiListCheck2,
	RiSearchLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FrameSortOption, ViewMode } from "@/types/ui";

interface ProjectOption {
	id: string;
	name: string;
}

interface GalleryToolbarProps {
	search: string;
	projectFilter: string;
	tagFilter: string;
	sort: FrameSortOption;
	mode: ViewMode;
	projects: ProjectOption[];
	tags: string[];
	onChange: (next: {
		search: string;
		projectFilter: string;
		tagFilter: string;
		sort: FrameSortOption;
		mode: ViewMode;
	}) => void;
}

const ALL_SENTINEL = "__all__";
const UNLINKED_SENTINEL = "__unlinked__";

/** Controls toolbar for dashboard gallery: search, project and tag filters, sort order and view toggle. */
export const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
	search,
	projectFilter,
	tagFilter,
	sort,
	mode,
	projects,
	tags,
	onChange,
}) => {
	const { t } = useTranslation();

	const sortOptions = [
		{
			value: FrameSortOption.Newest,
			label: t("dashboard.gallery.sort.newest"),
		},
		{
			value: FrameSortOption.Oldest,
			label: t("dashboard.gallery.sort.oldest"),
		},
		{
			value: FrameSortOption.Project,
			label: t("dashboard.gallery.sort.project"),
		},
	];

	return (
		<div className="flex flex-col gap-4 pb-6">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-1 flex-wrap items-center gap-2">
					<InputGroup className="w-full sm:w-64">
						<InputGroupAddon>
							<RiSearchLine />
						</InputGroupAddon>
						<InputGroupInput
							type="search"
							value={search}
							aria-label={t(
								"dashboard.gallery.toolbar.search.aria-label",
							)}
							placeholder={t(
								"dashboard.gallery.toolbar.search.placeholder",
							)}
							onChange={(event) =>
								onChange({
									search: event.target.value,
									projectFilter,
									tagFilter,
									sort,
									mode,
								})
							}
						/>
						{search ? (
							<InputGroupAddon align="inline-end">
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label={t("dashboard.form.cancel")}
									onClick={() =>
										onChange({
											search: "",
											projectFilter,
											tagFilter,
											sort,
											mode,
										})
									}
								>
									<RiCloseLine />
								</Button>
							</InputGroupAddon>
						) : null}
					</InputGroup>

					{projects.length ? (
						<Select
							value={projectFilter}
							onValueChange={(next) => {
								if (next)
									onChange({
										search,
										projectFilter: next,
										tagFilter,
										sort,
										mode,
									});
							}}
						>
							<SelectTrigger
								className="w-40"
								aria-label={t(
									"dashboard.gallery.form.project.label",
								)}
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value={ALL_SENTINEL}>
										{t(
											"dashboard.gallery.toolbar.projects.all",
										)}
									</SelectItem>
									<SelectItem value={UNLINKED_SENTINEL}>
										{t(
											"dashboard.gallery.toolbar.projects.unlinked",
										)}
									</SelectItem>
									{projects.map((project) => (
										<SelectItem
											key={project.id}
											value={project.id}
										>
											{project.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					) : null}

					{tags.length ? (
						<Select
							value={tagFilter}
							onValueChange={(next) => {
								if (next)
									onChange({
										search,
										projectFilter,
										tagFilter: next,
										sort,
										mode,
									});
							}}
						>
							<SelectTrigger
								className="w-36"
								aria-label={t(
									"dashboard.gallery.form.tags.label",
								)}
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value={ALL_SENTINEL}>
										{t(
											"dashboard.gallery.toolbar.tags.all",
										)}
									</SelectItem>
									{tags.map((tag) => (
										<SelectItem key={tag} value={tag}>
											{tag}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					) : null}
				</div>

				<div className="flex items-center gap-2">
					<Select
						value={sort}
						onValueChange={(next) => {
							if (!next) return;
							const matched = Object.values(FrameSortOption).find(
								(option) => option === next,
							);
							if (matched)
								onChange({
									search,
									projectFilter,
									tagFilter,
									sort: matched,
									mode,
								});
						}}
					>
						<SelectTrigger
							className="w-36"
							aria-label={t("dashboard.gallery.sort.label")}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent align="end">
							<SelectGroup>
								{sortOptions.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
									>
										{option.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>

					<ToggleGroup
						value={[mode]}
						onValueChange={(next) => {
							const chosen = next[0];
							if (
								chosen === ViewMode.Grid ||
								chosen === ViewMode.Table
							) {
								onChange({
									search,
									projectFilter,
									tagFilter,
									sort,
									mode: chosen,
								});
							}
						}}
						variant="outline"
						size="sm"
					>
						<ToggleGroupItem
							value={ViewMode.Grid}
							aria-label={t("dashboard.gallery.views.grid")}
						>
							<RiLayoutGridLine />
						</ToggleGroupItem>
						<ToggleGroupItem
							value={ViewMode.Table}
							aria-label={t("dashboard.gallery.views.table")}
						>
							<RiListCheck2 />
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</div>
		</div>
	);
};

export default GalleryToolbar;

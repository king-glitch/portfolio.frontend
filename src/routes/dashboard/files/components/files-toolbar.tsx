import React from "react";
import {
	RiCloseLine,
	RiLayoutGridLine,
	RiListCheck2,
	RiSearchLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { FileKind } from "@/api/types/admin/storage";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { config } from "@/config";
import { FileSortOption, ViewMode } from "@/types/ui";

interface FilesToolbarProps {
	kind: FileKind | undefined;
	q: string;
	sort: FileSortOption;
	mode: ViewMode;
	counts?: Record<string, number>;
	onChange: (next: {
		kind: FileKind | undefined;
		q: string;
		sort: FileSortOption;
		mode: ViewMode;
	}) => void;
}

/** Controls toolbar: kind tabs with counters, live search, sort selector and grid/table toggle. */
export const FilesToolbar: React.FC<FilesToolbarProps> = ({
	kind,
	q,
	sort,
	mode,
	counts,
	onChange,
}) => {
	const { t } = useTranslation();
	const all = config.dashboard.fileKindAll;

	const sortOptions = [
		{
			value: FileSortOption.Newest,
			label: t("dashboard.files.sort.newest"),
		},
		{
			value: FileSortOption.Oldest,
			label: t("dashboard.files.sort.oldest"),
		},
		{
			value: FileSortOption.Name,
			label: t("dashboard.files.sort.name"),
		},
		{
			value: FileSortOption.Size,
			label: t("dashboard.files.sort.size"),
		},
	];

	return (
		<div className="flex flex-col gap-4 pb-6">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="overflow-x-auto">
					<Tabs
						value={kind ?? all}
						onValueChange={(next) =>
							onChange({
								kind: Object.values(FileKind).find(
									(value) => value === next,
								),
								q,
								sort,
								mode,
							})
						}
					>
						<TabsList
							aria-label={t("dashboard.files.tabs.aria-label")}
						>
							<TabsTrigger value={all} className="gap-1.5">
								<span>{t("dashboard.files.tabs.all")}</span>
								{counts?.all !== undefined ? (
									<span className="py-0.2 rounded-full bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
										{counts.all}
									</span>
								) : null}
							</TabsTrigger>
							{Object.values(FileKind).map((value) => {
								const count = counts?.[value];
								return (
									<TabsTrigger
										key={value}
										value={value}
										className="gap-1.5"
									>
										<span>
											{t(
												`dashboard.storage.kinds.${value}`,
											)}
										</span>
										{count !== undefined ? (
											<span className="py-0.2 rounded-full bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
												{count}
											</span>
										) : null}
									</TabsTrigger>
								);
							})}
						</TabsList>
					</Tabs>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<InputGroup className="w-full sm:w-64">
						<InputGroupAddon>
							<RiSearchLine />
						</InputGroupAddon>
						<InputGroupInput
							type="search"
							value={q}
							aria-label={t("dashboard.files.search.aria-label")}
							placeholder={t(
								"dashboard.files.search.placeholder",
							)}
							onChange={(event) =>
								onChange({
									kind,
									q: event.target.value,
									sort,
									mode,
								})
							}
						/>
						{q ? (
							<InputGroupAddon align="inline-end">
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label={t("dashboard.form.cancel")}
									onClick={() =>
										onChange({ kind, q: "", sort, mode })
									}
								>
									<RiCloseLine />
								</Button>
							</InputGroupAddon>
						) : null}
					</InputGroup>
					<Select
						value={sort}
						onValueChange={(next) => {
							if (!next) return;
							const matched = Object.values(FileSortOption).find(
								(option) => option === next,
							);
							if (matched)
								onChange({ kind, q, sort: matched, mode });
						}}
					>
						<SelectTrigger
							className="w-36"
							aria-label={t("dashboard.files.sort.label")}
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
								onChange({ kind, q, sort, mode: chosen });
							}
						}}
						variant="outline"
						size="sm"
					>
						<ToggleGroupItem
							value={ViewMode.Grid}
							aria-label={t("dashboard.files.views.grid")}
						>
							<RiLayoutGridLine />
						</ToggleGroupItem>
						<ToggleGroupItem
							value={ViewMode.Table}
							aria-label={t("dashboard.files.views.table")}
						>
							<RiListCheck2 />
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</div>
		</div>
	);
};

export default FilesToolbar;

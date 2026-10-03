import React from "react";
import { RiSearchLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { FileKind } from "@/api/types/admin/storage";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { config } from "@/config";

interface FilesToolbarProps {
	kind: FileKind | undefined;
	q: string;
	/** Writes the filters to the URL. */
	onChange: (next: { kind: FileKind | undefined; q: string }) => void;
}

/** Kind tabs and search box; both live in the URL (`?kind=image&q=cv`). */
export const FilesToolbar: React.FC<FilesToolbarProps> = ({
	kind,
	q,
	onChange,
}) => {
	const { t } = useTranslation();
	const all = config.dashboard.fileKindAll;
	return (
		<div className="flex flex-col gap-3 pb-6 md:flex-row md:items-center md:justify-between">
			<div className="overflow-x-auto">
				<Tabs
					value={kind ?? all}
					onValueChange={(next) =>
						onChange({
							kind: Object.values(FileKind).find(
								(value) => value === next,
							),
							q,
						})
					}
				>
					<TabsList aria-label={t("dashboard.files.tabs.aria-label")}>
						<TabsTrigger value={all}>
							{t("dashboard.files.tabs.all")}
						</TabsTrigger>
						{Object.values(FileKind).map((value) => (
							<TabsTrigger key={value} value={value}>
								{t(`dashboard.storage.kinds.${value}`)}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>
			<InputGroup className="md:max-w-xs">
				<InputGroupAddon>
					<RiSearchLine />
				</InputGroupAddon>
				<InputGroupInput
					type="search"
					value={q}
					aria-label={t("dashboard.files.search.aria-label")}
					placeholder={t("dashboard.files.search.placeholder")}
					onChange={(event) =>
						onChange({ kind, q: event.target.value })
					}
				/>
			</InputGroup>
		</div>
	);
};

export default FilesToolbar;

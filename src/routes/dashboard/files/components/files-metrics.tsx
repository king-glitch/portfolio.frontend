import React from "react";
import {
	RiFileTextLine,
	RiFileZipLine,
	RiHardDriveLine,
	RiImageLine,
	RiVideoLine,
	type RemixiconComponentType,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { FileKind, type AdminFile } from "@/api/types/admin/storage";
import { Card, CardContent } from "@/components/ui/card";
import { formatBytes } from "@/lib/storage/files";

interface FilesMetricsProps {
	files: AdminFile[];
}

interface MetricSummary {
	id: string;
	label: string;
	count: number;
	bytes: number;
	icon: RemixiconComponentType;
}

/** Storage overview ribbon: total bytes, count and per-kind distribution. */
export const FilesMetrics: React.FC<FilesMetricsProps> = ({ files }) => {
	const { t } = useTranslation();

	const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
	const totalCount = files.length;

	const bytesOf = (targetKind: FileKind) =>
		files
			.filter((file) => file.kind === targetKind)
			.reduce((sum, file) => sum + file.size, 0);

	const countOf = (targetKind: FileKind) =>
		files.filter((file) => file.kind === targetKind).length;

	const imageBytes = bytesOf(FileKind.Image);
	const videoBytes = bytesOf(FileKind.Video);
	const docBytes = bytesOf(FileKind.Document);
	const archiveBytes = bytesOf(FileKind.Archive);

	const items: MetricSummary[] = [
		{
			id: "total",
			label: t("dashboard.files.metrics.total"),
			count: totalCount,
			bytes: totalBytes,
			icon: RiHardDriveLine,
		},
		{
			id: "images",
			label: t("dashboard.storage.kinds.image"),
			count: countOf(FileKind.Image),
			bytes: imageBytes,
			icon: RiImageLine,
		},
		{
			id: "videos",
			label: t("dashboard.storage.kinds.video"),
			count: countOf(FileKind.Video),
			bytes: videoBytes,
			icon: RiVideoLine,
		},
		{
			id: "documents",
			label: t("dashboard.storage.kinds.document"),
			count: countOf(FileKind.Document),
			bytes: docBytes,
			icon: RiFileTextLine,
		},
		{
			id: "archives",
			label: t("dashboard.storage.kinds.archive"),
			count: countOf(FileKind.Archive),
			bytes: archiveBytes,
			icon: RiFileZipLine,
		},
	];

	return (
		<Card size="sm" className="mb-6 overflow-hidden">
			<CardContent className="flex flex-col gap-4 p-4">
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
					{items.map((item) => {
						const Icon = item.icon;
						return (
							<div
								key={item.id}
								className="flex flex-col gap-1 rounded-lg border bg-muted/40 p-3"
							>
								<div className="flex items-center justify-between text-muted-foreground">
									<span className="truncate text-xs font-medium">
										{item.label}
									</span>
									<Icon className="size-4 shrink-0" />
								</div>
								<div className="flex items-baseline gap-1.5 pt-1">
									<span className="text-lg font-semibold tracking-tight">
										{formatBytes(item.bytes)}
									</span>
								</div>
								<span className="text-xs text-muted-foreground">
									{t("dashboard.files.details", {
										kind: item.label,
										size: `${item.count} files`,
									})}
								</span>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
};

export default FilesMetrics;

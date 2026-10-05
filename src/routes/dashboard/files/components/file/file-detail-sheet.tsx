import React from "react";
import {
	RiCheckLine,
	RiDeleteBinLine,
	RiEditLine,
	RiExternalLinkLine,
	RiFileCopyLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { AdminFile } from "@/api/types/admin/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import { formatBytes } from "@/lib/storage/files";
import { FileThumb } from "@/routes/dashboard/components/storage/file/file-thumb";

interface FileDetailSheetProps {
	file: AdminFile | undefined;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onEdit: (file: AdminFile) => void;
	onDelete: (file: AdminFile) => void;
}

/** Slide-out panel inspecting full file properties and public URL. */
export const FileDetailSheet: React.FC<FileDetailSheetProps> = ({
	file,
	open,
	onOpenChange,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();
	const [copied, setCopied] = React.useState(false);

	const copyUrl = async () => {
		if (!file) return;
		try {
			await navigator.clipboard.writeText(file.url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			toast.add({
				type: "success",
				title: t("dashboard.files.copy.success"),
			});
		} catch {
			toast.add({
				type: "error",
				title: t("dashboard.files.copy.error"),
			});
		}
	};

	const hasDimensions = Boolean(file && file.width > 0 && file.height > 0);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-md">
				<SheetHeader>
					<SheetTitle>{t("dashboard.files.detail.title")}</SheetTitle>
					<SheetDescription>
						{t("dashboard.files.detail.description")}
					</SheetDescription>
				</SheetHeader>
				{file ? (
					<div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
						<div className="overflow-hidden rounded-xl border bg-muted/40">
							<FileThumb
								file={file}
								className="aspect-video w-full"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-base font-semibold break-all">
								{file.name}
							</span>
							<div className="flex items-center gap-2 pt-1">
								<Badge variant="secondary">
									{t(`dashboard.storage.kinds.${file.kind}`)}
								</Badge>
								{file.mime ? (
									<span className="text-xs text-muted-foreground">
										{file.mime}
									</span>
								) : null}
							</div>
						</div>
						<div className="flex flex-col gap-3 rounded-lg border bg-card p-3 text-sm">
							<div className="flex items-center justify-between gap-2 border-b pb-2">
								<span className="text-muted-foreground">
									{t("dashboard.files.detail.size")}
								</span>
								<span className="font-medium">
									{formatBytes(file.size)}
								</span>
							</div>
							{file.mime ? (
								<div className="flex items-center justify-between gap-2 border-b pb-2">
									<span className="text-muted-foreground">
										{t("dashboard.files.detail.mime")}
									</span>
									<span className="font-mono text-xs">
										{file.mime}
									</span>
								</div>
							) : null}
							{hasDimensions ? (
								<div className="flex items-center justify-between gap-2 border-b pb-2">
									<span className="text-muted-foreground">
										{t("dashboard.files.detail.dimensions")}
									</span>
									<span className="font-mono text-xs">
										{file.width} × {file.height}
									</span>
								</div>
							) : null}
							{file.createdAt ? (
								<div className="flex items-center justify-between gap-2 border-b pb-2">
									<span className="text-muted-foreground">
										{t("dashboard.files.detail.created")}
									</span>
									<span className="text-xs">
										{new Date(
											file.createdAt,
										).toLocaleDateString()}
									</span>
								</div>
							) : null}
							<div className="flex flex-col gap-1.5 pt-1">
								<span className="text-xs text-muted-foreground">
									{t("dashboard.files.detail.url")}
								</span>
								<div className="flex items-center gap-2">
									<Input
										readOnly
										value={file.url}
										aria-label={t(
											"dashboard.files.detail.url",
										)}
										className="h-8 font-mono text-xs"
									/>
									<Button
										size="icon-sm"
										variant="outline"
										aria-label={t(
											"dashboard.files.copy.aria-label",
											{
												name: file.name,
											},
										)}
										onClick={() => void copyUrl()}
									>
										{copied ? (
											<RiCheckLine />
										) : (
											<RiFileCopyLine />
										)}
									</Button>
									<Button
										size="icon-sm"
										variant="outline"
										aria-label={t(
											"dashboard.files.open.aria-label",
											{
												name: file.name,
											},
										)}
										nativeButton={false}
										render={
											<a
												href={file.url}
												target="_blank"
												rel="noreferrer"
											/>
										}
									>
										<RiExternalLinkLine />
									</Button>
								</div>
							</div>
							{file.alt ? (
								<div className="flex flex-col gap-1 border-t pt-2">
									<span className="text-xs text-muted-foreground">
										{t("dashboard.files.detail.alt")}
									</span>
									<p className="text-xs italic">{file.alt}</p>
								</div>
							) : null}
						</div>
					</div>
				) : null}
				<SheetFooter className="flex-row gap-2">
					<Button
						variant="outline"
						className="flex-1"
						onClick={() => {
							if (file) onEdit(file);
						}}
					>
						<RiEditLine data-icon="inline-start" />
						{t("dashboard.files.edit.title")}
					</Button>
					<Button
						variant="destructive"
						className="flex-1"
						onClick={() => {
							if (file) onDelete(file);
						}}
					>
						<RiDeleteBinLine data-icon="inline-start" />
						{t("dashboard.delete.confirm")}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default FileDetailSheet;

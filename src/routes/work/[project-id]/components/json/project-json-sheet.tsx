import React from "react";
import { RiCloseLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { Project } from "@/api/types/portfolio/project";
import { IconButton } from "@/components/common/buttons/icon-button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { config } from "@/config";
import { blocksJson } from "@/routes/work/[project-id]/components/json/block-json";

interface ProjectJsonSheetProps {
	project: Project;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// ponytail: nothing to reset on close (read-only view); add onOpenChangeComplete(false) cleanup if the sheet ever gets inputs.
/** Side sheet with the project's block JSON, always mounted so it animates in and out. */
export const ProjectJsonSheet: React.FC<ProjectJsonSheetProps> = ({
	project,
	open,
	onOpenChange,
}) => {
	const { t } = useTranslation();
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				showCloseButton={false}
				className="gap-0 p-0"
				style={{
					width: `min(${config.work.jsonSheet.widthPx}px, 100vw)`,
					maxWidth: "none",
				}}
			>
				<SheetHeader className="flex-row items-center justify-between gap-4 border-b border-border px-5.5 py-4.5">
					<SheetTitle className="text-[13px] font-bold">
						{t("work.json.title", { num: project.num })}
					</SheetTitle>
					<span className="ml-auto text-[13px] text-muted-foreground">
						{t("work.json.blocks.count", {
							count: project.blocks.length,
						})}
					</span>
					<SheetClose
						render={
							<IconButton
								label={t("work.json.close")}
								icon={RiCloseLine}
							/>
						}
					/>
				</SheetHeader>
				<SheetDescription className="sr-only">
					{t("work.json.description")}
				</SheetDescription>
				<pre className="m-0 grow overflow-auto px-5.5 py-5 font-mono text-xs leading-[1.6] whitespace-pre-wrap">
					{blocksJson(project.blocks)}
				</pre>
			</SheetContent>
		</Sheet>
	);
};

export default ProjectJsonSheet;

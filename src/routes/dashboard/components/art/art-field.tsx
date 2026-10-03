import React from "react";
import { useTranslation } from "react-i18next";
import { FileKind } from "@/api/types/admin/storage";
import { MotifKind } from "@/api/types/portfolio/enums";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileSelectField } from "@/routes/dashboard/components/storage/file/select/file-select-field";
import { FileValueKey } from "@/types/ui";

interface ArtFieldProps {
	id: string;
	/** Chosen preset; "" = none (only when `optionalKind`). */
	kind: string;
	/** Uploaded image URL; "" = none. */
	imageUrl: string;
	/** The preset may be switched off (the block then falls back to the project's). */
	optionalKind?: boolean;
	invalid?: boolean;
	onKindChange: (kind: string) => void;
	onImageChange: (url: string) => void;
}

/**
 * Art of a project, note or block: one of the six drawn presets (live thumbnails) and an optional
 * uploaded image that wins over it, with a preview of what the site will show.
 */
export const ArtField: React.FC<ArtFieldProps> = ({
	id,
	kind,
	imageUrl,
	optionalKind,
	invalid,
	onKindChange,
	onImageChange,
}) => {
	const { t } = useTranslation();
	const presets = Object.values(MotifKind);
	const previewKind = presets.find((preset) => preset === kind);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<FieldLabel>{t("dashboard.art.preset.label")}</FieldLabel>
				<ToggleGroup
					variant="outline"
					spacing={2}
					value={kind ? [kind] : []}
					onValueChange={([next]) => {
						if (next || optionalKind) onKindChange(next ?? "");
					}}
					className="flex-wrap"
				>
					{presets.map((preset) => (
						<ToggleGroupItem
							key={preset}
							value={preset}
							aria-label={t(`dashboard.options.kinds.${preset}`)}
							className="h-auto flex-col gap-1 p-1"
						>
							<span className="block h-15 w-20 overflow-hidden rounded-md">
								<ProjectMotif kind={preset} />
							</span>
							<span className="text-xs">
								{t(`dashboard.options.kinds.${preset}`)}
							</span>
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</div>
			<div className="flex flex-col gap-2">
				<FieldLabel htmlFor={id}>
					{t("dashboard.art.image.label")}
				</FieldLabel>
				<FileSelectField
					id={id}
					accept={[FileKind.Image]}
					by={FileValueKey.Url}
					value={imageUrl}
					onChange={onImageChange}
					invalid={invalid}
				/>
				<FieldDescription>
					{t("dashboard.art.image.hint")}
				</FieldDescription>
				{imageUrl ? (
					<Button
						variant="ghost"
						size="sm"
						className="self-start"
						onClick={() => onImageChange("")}
					>
						{t("dashboard.art.image.clear")}
					</Button>
				) : null}
			</div>
			{previewKind || imageUrl ? (
				<div className="flex flex-col gap-2">
					<FieldLabel>{t("dashboard.art.preview.label")}</FieldLabel>
					<div className="aspect-4/3 w-48 overflow-hidden rounded-xl ring-1 ring-border">
						<ProjectMotif
							kind={previewKind ?? MotifKind.Radar}
							imageUrl={imageUrl || undefined}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default ArtField;

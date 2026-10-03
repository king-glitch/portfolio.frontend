import { isApiError } from "@/api/errors";
import { toast } from "@/components/ui/toast";
import i18n from "@/lib/i18n";

/** Error toast of a failed mutation; the copy depends on what failed (offline, rate limit, rejected input, ...). */
export function toastApiError(error: unknown): void {
	const kind = isApiError(error) ? error.kind : undefined;
	toast.add({
		type: "error",
		title: kind
			? i18n.t(`common.errors.kinds.${kind}.title`)
			: i18n.t("common.errors.load.title"),
		description: kind
			? i18n.t(`common.errors.kinds.${kind}.description`)
			: i18n.t("common.errors.load.description"),
	});
}

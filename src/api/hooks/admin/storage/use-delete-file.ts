import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFile } from "@/api/services/admin";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

export const useDeleteFile = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteFile,
		// 409: the file is used by a gallery frame; the page says so itself
		meta: {
			[config.query.ownConflictMeta]: true,
			[config.companion.metaKey]: CompanionEvent.Deleted,
		},
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [config.queryKeys.admin.storage.files],
			}),
	});
};

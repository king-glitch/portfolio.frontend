import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/api/services/admin";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

export const useUploadFile = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: uploadFile,
		meta: { [config.companion.metaKey]: CompanionEvent.Uploaded },
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [config.queryKeys.admin.storage.files],
			}),
	});
};

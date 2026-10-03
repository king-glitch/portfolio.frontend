import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/api/services/admin";
import { config } from "@/config";

export const useUploadFile = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: uploadFile,
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [config.queryKeys.admin.storage.files],
			}),
	});
};

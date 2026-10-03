import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFrame } from "@/api/services/admin";

export const useUploadFrame = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: uploadFrame,
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

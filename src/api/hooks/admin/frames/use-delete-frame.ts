import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFrame } from "@/api/services/admin";

export const useDeleteFrame = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteFrame,
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

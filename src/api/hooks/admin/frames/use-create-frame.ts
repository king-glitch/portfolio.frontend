import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFrame } from "@/api/services/admin";

export const useCreateFrame = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createFrame,
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

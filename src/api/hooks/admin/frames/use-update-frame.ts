import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFrame } from "@/api/services/admin";
import type { FrameUpdateInput } from "@/api/types/admin/gallery";

export const useUpdateFrame = (id: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: FrameUpdateInput) => updateFrame(id, input),
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

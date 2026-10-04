import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFrame } from "@/api/services/admin";
import type { FrameUpdateInput } from "@/api/types/admin/gallery";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

export const useUpdateFrame = (id: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: FrameUpdateInput) => updateFrame(id, input),
		meta: { [config.companion.metaKey]: CompanionEvent.Saved },
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

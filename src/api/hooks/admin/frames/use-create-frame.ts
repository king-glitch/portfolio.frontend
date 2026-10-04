import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFrame } from "@/api/services/admin";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

export const useCreateFrame = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createFrame,
		meta: { [config.companion.metaKey]: CompanionEvent.Uploaded },
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

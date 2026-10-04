import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFrame } from "@/api/services/admin";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

export const useDeleteFrame = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteFrame,
		meta: { [config.companion.metaKey]: CompanionEvent.Deleted },
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderProjects } from "@/api/services/admin";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

export const useReorderProjects = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: reorderProjects,
		meta: { [config.companion.metaKey]: CompanionEvent.Reordered },
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

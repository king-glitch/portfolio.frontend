import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "@/api/services/admin";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

export const useDeleteProject = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteProject,
		meta: { [config.companion.metaKey]: CompanionEvent.Deleted },
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

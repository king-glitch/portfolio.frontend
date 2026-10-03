import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "@/api/services/admin";

export const useDeleteProject = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteProject,
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

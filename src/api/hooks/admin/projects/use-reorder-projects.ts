import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderProjects } from "@/api/services/admin";

export const useReorderProjects = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: reorderProjects,
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

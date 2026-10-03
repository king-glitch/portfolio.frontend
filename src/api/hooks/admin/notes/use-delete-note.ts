import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/api/services/admin";

export const useDeleteNote = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteNote,
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

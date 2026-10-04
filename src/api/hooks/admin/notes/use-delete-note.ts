import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/api/services/admin";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

export const useDeleteNote = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteNote,
		meta: { [config.companion.metaKey]: CompanionEvent.Deleted },
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

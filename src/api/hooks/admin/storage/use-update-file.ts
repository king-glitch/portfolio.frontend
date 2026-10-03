import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFile } from "@/api/services/admin";
import type { FileUpdateInput } from "@/api/types/admin/storage";

export const useUpdateFile = (id: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: FileUpdateInput) => updateFile(id, input),
		// a file's alt shows in frames too
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

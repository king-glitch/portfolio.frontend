import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFile } from "@/api/services/admin";
import type { FileUpdateInput } from "@/api/types/admin/storage";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

export const useUpdateFile = (id: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: FileUpdateInput) => updateFile(id, input),
		// a file's alt shows in frames too
		meta: { [config.companion.metaKey]: CompanionEvent.Saved },
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

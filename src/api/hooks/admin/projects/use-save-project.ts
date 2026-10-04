import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, updateProject } from "@/api/services/admin";
import type { ProjectInput } from "@/api/types/admin/content";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

/** Creates when `id` is undefined, else updates. Every cached answer is refreshed (the site reads the same data). */
export const useSaveProject = (id: string | undefined) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: ProjectInput) =>
			id ? updateProject(id, input) : createProject(input),
		meta: { [config.companion.metaKey]: CompanionEvent.Saved },
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

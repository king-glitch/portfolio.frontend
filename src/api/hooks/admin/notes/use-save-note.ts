import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, updateNote } from "@/api/services/admin";
import type { NoteInput } from "@/api/types/admin/content";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

/** Creates when `id` is undefined, else updates. */
export const useSaveNote = (id: string | undefined) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: NoteInput) =>
			id ? updateNote(id, input) : createNote(input),
		meta: { [config.companion.metaKey]: CompanionEvent.Saved },
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

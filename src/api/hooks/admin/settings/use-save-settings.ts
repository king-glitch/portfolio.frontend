import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSettings } from "@/api/services/admin";
import { config } from "@/config";
import { CompanionEvent } from "@/types/ui";

export const useSaveSettings = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: saveSettings,
		meta: { [config.companion.metaKey]: CompanionEvent.Saved },
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

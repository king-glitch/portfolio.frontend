import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSettings } from "@/api/services/admin";

export const useSaveSettings = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: saveSettings,
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

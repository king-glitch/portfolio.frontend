import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUsername } from "@/api/services/admin";

/** The name shown in the top bar comes from `me`, so it is refetched. */
export const useChangeUsername = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: changeUsername,
		onSuccess: () => queryClient.invalidateQueries(),
	});
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/api/services/admin";

/** Clears the tokens (even when the server is unreachable) and every cached admin answer. */
export const useLogout = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: logout,
		onSettled: () => queryClient.clear(),
	});
};

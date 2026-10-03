import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword } from "@/api/services/admin";

export const useChangePassword = () =>
	useMutation({ mutationFn: changePassword });

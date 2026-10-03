import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/api/services/admin";

export const useLogin = () => useMutation({ mutationFn: login });

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recover } from "@/api/services/admin";

export const useRecover = () => useMutation({ mutationFn: recover });

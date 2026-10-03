import { useQuery } from "@tanstack/react-query";
import { adminProjectQuery } from "@/api/queries/admin";

/** `isNotFound(error)` means "unknown id". */
export const useAdminProject = (id: string) => useQuery(adminProjectQuery(id));

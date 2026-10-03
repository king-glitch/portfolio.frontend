import { useQuery } from "@tanstack/react-query";
import { adminNoteQuery } from "@/api/queries/admin";

/** `isNotFound(error)` means "unknown id". */
export const useAdminNote = (id: string) => useQuery(adminNoteQuery(id));

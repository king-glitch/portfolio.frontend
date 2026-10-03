import { useQuery } from "@tanstack/react-query";
import { adminNotesQuery } from "@/api/queries/admin";

export const useAdminNotes = () => useQuery(adminNotesQuery());

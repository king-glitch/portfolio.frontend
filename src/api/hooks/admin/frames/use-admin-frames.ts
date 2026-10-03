import { useInfiniteQuery } from "@tanstack/react-query";
import { adminFramesQuery } from "@/api/queries/admin";

export const useAdminFrames = () => useInfiniteQuery(adminFramesQuery());

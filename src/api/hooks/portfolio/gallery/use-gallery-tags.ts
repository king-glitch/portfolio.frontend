import { useQuery } from "@tanstack/react-query";
import { galleryTagsQuery } from "@/api/queries/portfolio";

export function useGalleryTags() {
	return useQuery(galleryTagsQuery());
}

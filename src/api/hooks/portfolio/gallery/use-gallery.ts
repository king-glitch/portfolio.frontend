import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { galleryQuery } from "@/api/queries/portfolio";

/** Frames of one tag (all when undefined), page by page. The previous list stays up while a new tag loads. */
export function useGallery(tag: string | undefined) {
	return useInfiniteQuery({
		...galleryQuery(tag),
		placeholderData: keepPreviousData,
	});
}

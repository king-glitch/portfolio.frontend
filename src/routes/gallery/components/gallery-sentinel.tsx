import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "@/hooks/physics/use-in-view";
import { config } from "@/config";

interface GallerySentinelProps {
	hasMore: boolean;
	loading: boolean;
	failed: boolean;
	onLoadMore: () => void;
}

/** End of the list: asks for the next page shortly before it scrolls into view. */
export const GallerySentinel: React.FC<GallerySentinelProps> = ({
	hasMore,
	loading,
	failed,
	onLoadMore,
}) => {
	const { t } = useTranslation();
	const ref = useRef<HTMLDivElement>(null);
	const near = useInView(
		ref,
		`0px 0px ${config.gallery.loadMoreMarginPx}px 0px`,
	);

	useEffect(() => {
		if (near && hasMore && !loading && !failed) onLoadMore();
	}, [near, hasMore, loading, failed, onLoadMore]);

	const renderBody = () => {
		if (failed) return <QueryErrorAlert onRetry={onLoadMore} />;
		if (loading)
			return (
				<Skeleton
					role="status"
					aria-label={t("gallery.loading.label")}
					className="h-3 w-40"
				/>
			);
		return hasMore ? null : (
			<span className="text-[13px] text-muted-foreground">
				{t("gallery.end")}
			</span>
		);
	};

	return (
		<div ref={ref} className="mt-10 flex min-h-12 justify-center">
			{renderBody()}
		</div>
	);
};

export default GallerySentinel;
